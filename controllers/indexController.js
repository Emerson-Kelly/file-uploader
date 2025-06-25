import {
  getTopLevelFolders,
  getFilesWithoutFolder,
  getFolderDetails,
} from "../lib/dataService.js";

export const indexGet = async (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  const userId = req.user.id;
  const folderId = req.params.id;

  try {
    const allFolders = await getTopLevelFolders(userId);
    const topLevelFiles = await getFilesWithoutFolder(userId);

    let subfolders = [];
    let parentId = null;

    if (folderId) {
      const folderDetails = await getFolderDetails(folderId);
      subfolders = folderDetails.subfolders;
      parentId = folderDetails.parent?.id || null;
    } else {
      // If no folderId, show top-level folders for this user
      subfolders = allFolders;
    }

    res.render("pages/index", {
      title: "Home",
      allFolders,
      subfolders,
      topLevelFiles,
      parentId,
      user: req.user,
    });
  } catch (err) {
    console.error("Error loading folders:", err);
    res.status(500).send("Internal Server Error");
  }
};
