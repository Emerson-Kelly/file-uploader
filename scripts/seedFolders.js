import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const TARGET_EMAIL = "emerson4945@gmail.com";
const NUM_FOLDERS = 5;
const NUM_SUBFOLDERS = 2;

async function seedFolders() {
  const user = await prisma.user.findUnique({
    where: { email: TARGET_EMAIL },
  });

  if (!user) {
    console.error(`❌ User not found: ${TARGET_EMAIL}`);
    process.exit(1);
  }

  for (let i = 0; i < NUM_FOLDERS; i++) {
    const folderName = faker.commerce.department() + " Files";

    const topLevelFolder = await prisma.folder.create({
      data: {
        name: folderName,
        userId: user.id,
        parentId: null,
      },
    });

    console.log(`📁 Created folder: ${folderName}`);

    // Add subfolders
    for (let j = 0; j < NUM_SUBFOLDERS; j++) {
      const subfolderName = faker.commerce.productName() + " Subfolder";
      await prisma.folder.create({
        data: {
          name: subfolderName,
          userId: user.id,
          parentId: topLevelFolder.id,
        },
      });

      console.log(`  📂 Created subfolder: ${subfolderName}`);
    }
  }

  await prisma.$disconnect();
}

seedFolders();
