import { getFolderDetails, getTopLevelFolders, getBreadcrumbs } from "../lib/dataService.js";

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
      parentId: folderId.id,
      breadcrumbs,
    });
  } catch (error) {
    console.error("Error loading folder contents:", error);
    res.status(500).send("Internal Server Error");
  }
};
