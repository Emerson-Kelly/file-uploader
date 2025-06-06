import { getTopLevelFolders, getFilesWithoutFolder } from "../lib/dataService.js";

export const indexGet = async (req, res) => {
    const userId = req.user.id;

  try {
    const allFolders = await getTopLevelFolders();
    const topLevelFiles = await getFilesWithoutFolder(userId);

    res.render("pages/index", {
        title: "Home",
        allFolders,
        topLevelFiles,
        parentId: null,
        user: req.user,
      });      
  } catch (err) {
    console.error("Error loading folders:", err);
    res.status(500).send("Internal Server Error");
  }
};
