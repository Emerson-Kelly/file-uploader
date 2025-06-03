import { getFolderDetails, getTopLevelFolders } from "../lib/dataService.js";

export const filesGet = async (req, res) => {
  const folderId = req.params.id;

  try {
    const { currentFolder, subfolders } = await getFolderDetails(folderId);

    if (!currentFolder) {
      return res.status(404).send("Folder not found");
    }

    res.render("pages/files", {
      title: currentFolder.name,
      currentFolder,
      folders: subfolders,
      files: currentFolder.files,
    });
  } catch (error) {
    console.error("Error loading folder contents:", error);
    res.status(500).send("Internal Server Error");
  }
};
