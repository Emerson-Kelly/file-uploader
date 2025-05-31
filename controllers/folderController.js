import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export const folderGet = async (req, res) => {
  const folderId = req.params.id;

  try {
    const currentFolder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        files: true,
        parent: true,
      },
    });

    if (!currentFolder) {
      return res.status(404).send("Folder not found");
    }

    const subfolders = await prisma.folder.findMany({
      where: { parentId: folderId },
      orderBy: { createdAt: "desc" },
      include: {
        files: true,
        subfolders: true,
      },
    });

    res.render("pages/index", {
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
