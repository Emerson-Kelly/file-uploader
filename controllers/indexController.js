import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const indexGet = async (req, res) => {
  try {

    const folders = await prisma.folder.findMany({
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
      

    const files = await prisma.file.findMany({
      orderBy: { createdAt: "desc" },
      include: { folder: true },
    });

    res.render("pages/index", {
      title: "Home",
      files,
      folders,
      
    });
  } catch (err) {
    console.error("Error loading files:", err);
    res.status(500).send("Internal Server Error");
  }
};

  