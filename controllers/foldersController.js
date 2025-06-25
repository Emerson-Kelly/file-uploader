import { insertFolder, editFolderName, getBreadcrumbs, removeFolderFromDb, } from "../lib/dataService.js";

export const createFolderPost = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const userId = req.user.id;

    console.log("Raw form data:", req.body);
    console.log("Parsed parentId:", parentId);

    const cleanParentId = parentId && parentId !== "" ? parentId : null;

    console.log("✅ Cleaned parentId:", cleanParentId);

    await insertFolder({ name, userId, parentId: cleanParentId });

    if (parentId && parentId !== 'null') {
      res.redirect(`/folder/${parentId}`);
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).send("Error creating folder");
  }
};

export const editFolderPost = async (req, res) => {
  const folderId = req.params.id;
  const newName = req.body.name;
  const { parentId } = req.body;

  if (!folderId) {
    console.error("Missing folder ID in route parameter");
    return res.status(400).send("Missing folder ID");
  }

  try {

    await editFolderName(folderId, newName);
    if (parentId) {
      res.redirect(`/folder/${parentId}`);
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to rename folder");
  }
};

export const folderGet = async (req, res) => {
    const folderId = req.params.id;
    const userId = req.user.id;
  
    try {
      const { currentFolder, subfolders } = await getFolderDetails(folderId, userId);
  
      if (!currentFolder) {
        return res.status(404).send("Folder not found");
      }
  
      res.render("pages/folder", {
        title: currentFolder.name,
        currentFolder,
        subfolders,
        parentId: currentFolder.id,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };
   

export const deleteFolder = async (req, res) => {
    
    const folderId = req.params.id;
    const parentId = req.body.parentId === "null" ? null : req.body.parentId;
    console.log(folderId);
    console.log(parentId);
    try {
      await removeFolderFromDb(folderId);
  
      const redirectUrl = parentId ? `/folder/${parentId}` : "/";
      res.redirect(redirectUrl);
    } catch (err) {
      console.error("Error deleting folder:", err);
      res.status(500).send("Folder deletion failed");
    }
  };
  