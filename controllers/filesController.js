import {
  getFolderDetails,
  getTopLevelFolders,
  getBreadcrumbs,
  insertFile,
  removeFileFromDb,
  getFileByUrl,
} from "../lib/dataService.js";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "url";
import fs from "node:fs";

const uploads = multer({ dest: "uploads/" });

export const filesGet = async (req, res) => {
  const folderId = req.params.id;

  try {
    const { currentFolder, subfolders } = await getFolderDetails(folderId);
    const breadcrumbs = await getBreadcrumbs(folderId);

    if (!currentFolder) {
      return res.status(404).send("Folder not found");
    }

    /*
    // Ensure folder id and subfolder id match
    console.log(currentFolder.id);
    console.log(subfolders);
    */

    res.render("pages/files", {
      title: currentFolder.name,
      currentFolder,
      folder: subfolders,
      files: currentFolder.files,
      parentId: folderId,
      breadcrumbs,
    });
  } catch (error) {
    console.error("Error loading folder contents:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const fileUploadMiddleware = uploads.single("uploadedFile");

export const filesPost = async (req, res) => {
  const file = req.file;
  const folderId = req.body.parentId === "null" ? null : req.body.parentId;
  const userId = req.user.id;

  if (!file) {
    return res.status(400).send("No file uploaded");
  }

  console.log("Uploaded file info:", file);
  console.log("Folder ID:", folderId);

  try {
    const name = file.originalname;

    // Save file metadata to database
    await insertFile({
      name,
      path: file.path,
      url: `/uploads/${file.filename}`,
      size: file.size,
      folderId,
      userId,
    });

    const redirectUrl =
      folderId && folderId !== "null" ? `/folder/${folderId}` : `/`;
    return res.json({ success: true, redirect: redirectUrl });
  } catch (err) {
    console.error("Error handling uploaded file:", err);
    res.status(500).send("Upload failed");
  }
};

export const deleteFile = async (req, res) => {
  const fileId = req.params.id;
  const parentId = req.body.parentId === "null" ? null : req.body.parentId;

  try {
    await removeFileFromDb(fileId);

    const redirectUrl =
      parentId && parentId !== "null" ? `/folder/${parentId}` : `/`;

    return res.redirect(redirectUrl);
  } catch (err) {
    console.error("Error handling file removal:", err);
    res.status(500).send("File removal failed");
  }
};

export const downloadFile = async (req, res) => {
  const fileUrl = req.params.url;
  const filePath = path.join("uploads", fileUrl);

  try {
    const file = await getFileByUrl(`/uploads/${fileUrl}`);

    if (!file) {
      return res.status(404).send("File not found");
    }

    if (!fs.existsSync(filePath)) {
      console.error("File does not exist:", filePath);
      return res.status(404).send("File not found");
    }

    // Set content type
    res.setHeader("Content-Type", "application/octet-stream");

    res.download(filePath, file.name, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        return res.status(500).send("File download failed.");
      }
    });
  } catch (err) {
    console.error("Error handling file download:", err);
    res.status(500).send("File download failed.");
  }
};
