
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getTopLevelFolders = async () => {
  return await prisma.folder.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
  });
};

export const getAllFiles = async () => {
  return await prisma.file.findMany({
    orderBy: { createdAt: "desc" },
    include: { folder: true },
  });
};

export const getAllFolders = async () => {
  return await prisma.folder.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      subfolders: {
        orderBy: { createdAt: "desc" },
        include: {
          files: true,
        },
      },
      files: true,
    },
  });
};

export const getFolderDetails = async (folderId) => {
  const currentFolder = await prisma.folder.findUnique({
    where: { id: folderId },
    include: {
      files: true,
      parent: true,
    },
  });

  const subfolders = await prisma.folder.findMany({
    where: { parentId: folderId },
    orderBy: { createdAt: "desc" },
    include: {
      files: true,
      subfolders: true,
    },
  });

  return { currentFolder, subfolders };
};
