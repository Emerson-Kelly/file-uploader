import { insertFolder, editFolderName } from "../lib/dataService.js";

export const createFolderPost = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const userId = req.user.id; // Adjust depending on how you get your session user

    await insertFolder ({ name, userId, parentId });
    //res.status(201).json(folder);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const editFolderPost = async (req, res) => {
    const folderId = req.params.id;
    const newName = req.body.name;
  
    if (!folderId) {
      console.error('Missing folder ID in route parameter');
      return res.status(400).send('Missing folder ID');
    }
  
    try {
      await editFolderName(folderId, newName);
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to rename folder');
    }
  };
  
