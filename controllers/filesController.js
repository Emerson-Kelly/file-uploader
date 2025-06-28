import {
  getFolderDetails,
  getTopLevelFolders,
  getBreadcrumbs,
  insertFile,
  removeFileFromDb,
  getFileByUrl,
  getFileById,
} from "../lib/dataService.js";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "url";
import supabase from "../lib/supabaseClient.js";
import fs from "node:fs";
import axios from "axios";

const uploads = multer({ storage: multer.memoryStorage() });

export const filesGet = async (req, res) => {
  const folderId = req.params.id;

  try {
    const { currentFolder, subfolders } = await getFolderDetails(folderId);
    const breadcrumbs = await getBreadcrumbs(folderId);

    if (!currentFolder) {
      return res.status(404).send("Folder not found");
    }

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
  const originalName = file.originalname.replace(/[^\w.\-]/g, "_");
  const safeName = `${Date.now()}_${originalName}`;

  if (!file) return res.status(400).send("No file uploaded");

  try {
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(safeName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
        allowedMimeTypes:
          ".jpg,.jpeg,.png,.gif,.webp,.bmp,.pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.csv,.ppt,.pptx,.zip,.rar,.7z,.tar,.gz,.mp3,.wav,.ogg,.mp4,.mov,.avi,.webm",
      });

    if (error) throw error;

    const publicUrl = supabase.storage.from("uploads").getPublicUrl(data.path)
      .data.publicUrl;

    await insertFile({
      name: file.originalname,
      url: publicUrl,
      size: file.size,
      path: data.path,
      folderId,
      userId,
    });

    return res.json({
      success: true,
      redirect: folderId ? `/folder/${folderId}` : `/`,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return res.status(500).send("Upload failed");
  }
};

export const deleteFile = async (req, res) => {
  const fileId = req.params.id;
  const parentId = req.body.parentId === "null" ? null : req.body.parentId;

  try {
    const file = await getFileById(fileId);

    if (!file) {
      return res.status(404).send("File not found");
    }

    const { error } = await supabase.storage
      .from("uploads")
      .remove([file.path]);

    if (error) {
      console.error("Failed to delete file from storage:", error);
    }

    await removeFileFromDb(fileId);

    const redirectUrl = parentId ? `/folder/${parentId}` : `/`;
    return res.redirect(redirectUrl);
  } catch (err) {
    console.error("Error handling file removal:", err);
    res.status(500).send("File removal failed");
  }
};

export const downloadFile = async (req, res) => {
  const fileId = req.params.id;
  try {
    const file = await getFileById(fileId);

    if (!file) return res.status(404).send("File not found");

    const { data, error } = await supabase.storage
      .from("uploads")
      .createSignedUrl(file.path, 60);

    if (error || !data?.signedUrl) {
      return res.status(500).send("Failed to get signed URL");
    }

    const response = await axios.get(data.signedUrl, {
      responseType: "stream",
    });

    res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);

    response.data.pipe(res);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).send("Download failed");
  }
};
