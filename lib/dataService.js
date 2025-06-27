import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export const getTopLevelFolders = async (userId) => {
  return await prisma.folder.findMany({
    where: {
      parentId: null,
      userId,
    },
    orderBy: { name: "asc" },
  });
};

export async function getFilesWithoutFolder(userId) {
  return await prisma.file.findMany({
    where: {
      folderId: null,
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export const getAllFiles = async () => {
  return await prisma.file.findMany({
    orderBy: { createdAt: "desc" },
    include: { folder: true },
  });
};

export const getAllFolders = async (userId) => {
  return await prisma.folder.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      subfolders: {
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          files: true,
        },
      },
      files: true,
    },
  });
};

export const getFolderDetails = async (folderId, userId) => {
  const currentFolder = await prisma.folder.findFirst({
    where: { id: folderId, userId },
    include: {
      files: true,
      parent: true,
    },
  });

  const subfolders = await prisma.folder.findMany({
    where: { parentId: folderId, userId },
    orderBy: { createdAt: "desc" },
    include: {
      files: true,
      subfolders: true,
    },
  });

  return { currentFolder, subfolders };
};

export async function getBreadcrumbs(folderId) {
  const breadcrumbs = [];

  let currentId = folderId;

  while (currentId) {
    const folder = await prisma.folder.findUnique({
      where: { id: currentId },
      select: { id: true, name: true, parentId: true },
    });

    if (!folder) break;

    breadcrumbs.unshift({ id: folder.id, name: folder.name });
    currentId = folder.parentId;
  }

  return breadcrumbs;
}

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

export const insertFile = async ({
  name,
  userId,
  folderId,
  url,
  path,
  size,
}) => {
  console.log("Inserting folder:", { name, userId, folderId, url, path, size });

  return await prisma.file.create({
    data: {
      name,
      userId,
      folderId,
      url,
      path,
      size,
    },
  });
};

export const editFolderName = async (id, name) => {
  return await prisma.folder.update({
    where: { id },
    data: { name: name.trim() },
  });
};

export const removeFolderFromDb = async (folderId) => {
  console.log("Deleting folder:", folderId);

  // Make sure folder exists
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { parentId: true },
  });

  if (!folder) {
    throw new Error("Folder not found");
  }

  // Delete all files in this folder
  await prisma.file.deleteMany({
    where: { folderId },
  });

  // Get all direct subfolders
  const subfolders = await prisma.folder.findMany({
    where: { parentId: folderId },
    select: { id: true },
  });

  console.log(
    "📁 Subfolders found:",
    subfolders.map((s) => s.id)
  );

  // Recursively delete each subfolder
  for (const subfolder of subfolders) {
    await removeFolderFromDb(subfolder.id);
  }

  // Delete the folder itself
  await prisma.folder.delete({
    where: { id: folderId },
  });

  console.log("Deleted folder:", folderId);
};

export const removeFileFromDb = async (id) => {
  return await prisma.file.delete({
    where: { id },
  });
};

export const getFileByUrl = async (filePath) => {
  return await prisma.file.findFirst({
    where: { url: filePath },
  });
};

export const getFileById = async (fileId) => {
  return await prisma.file.findFirst({
    where: { id: fileId },
  });
};
