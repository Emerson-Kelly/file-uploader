import { getTopLevelFolders } from "../lib/dataService.js";

export const indexGet = async (req, res) => {
  try {
    const allFolders = await getTopLevelFolders();

    res.render("pages/index", {
        title: "Home",
        allFolders,
        parentId: null,
      });      
  } catch (err) {
    console.error("Error loading folders:", err);
    res.status(500).send("Internal Server Error");
  }
};
