import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const TARGET_EMAIL = "emerson4945@gmail.com";
const NUM_FOLDERS = 5;

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

    await prisma.folder.create({
      data: {
        name: folderName,
        userId: user.id,
      },
    });

    console.log(`📁 Created folder: ${folderName}`);
  }

  await prisma.$disconnect();
}

seedFolders();
