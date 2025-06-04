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

/**
 * Create a folder in the database.
 * @param {Object} options
 * @param {string} options.name - Folder name
 * @param {string} options.userId - ID of the user who owns the folder
 * @param {string} [options.parentId] - Optional parent folder ID for subfolders
 * @returns {Promise<Object>} - The created folder
 */
export const insertFolder = async ({ name, userId, parentId }) => {
  // Normalize falsy or empty string parentId to null
  if (!parentId || parentId === "" || parentId === "null") {
    parentId = null;
  }

  console.log("Inserting folder:", { name, userId, parentId });

  return await prisma.folder.create({
    data: {
      name,
      userId,
      parentId: parentId,
    },
  });

};

export const editFolderName = async (id, name) => {
  return await prisma.folder.update({
    where: { id },
    data: { name: name.trim() },
  });
};
