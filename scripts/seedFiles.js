import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const NUM_FILES = 10;
const UPLOAD_DIR = path.resolve("public/uploads");
const TARGET_EMAIL = "emerson4945@gmail.com";
const EXTENSIONS = ["pdf", "png", "docx", "txt", "jpg"];

async function seedFakeFiles() {
  // Get the user with folders and subfolders
  const user = await prisma.user.findUnique({
    where: { email: TARGET_EMAIL },
    include: {
      folders: {
        include: {
          subfolders: true,
        },
      },
    },
  });

  if (!user) {
    console.error(`❌ User not found: ${TARGET_EMAIL}`);
    process.exit(1);
  }

  if (user.folders.length === 0) {
    console.error(`❌ No folders found for user ${TARGET_EMAIL}`);
    process.exit(1);
  }

  // Ensure upload dir exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  for (let i = 0; i < NUM_FILES; i++) {
    const name = faker.system.fileName().replace(/\.[^/.]+$/, "");
    const ext = faker.helpers.arrayElement(EXTENSIONS);
    const fileName = `${name}.${ext}`;
    const fakePath = path.join(UPLOAD_DIR, fileName);

    // Create dummy file content
    fs.writeFileSync(fakePath, faker.lorem.paragraphs(2));
    const size = fs.statSync(fakePath).size;

    const relativePath = `uploads/${fileName}`;
    const fakeUrl = `/uploads/${fileName}`;

    // Pick a random top-level folder
    const randomFolder = faker.helpers.arrayElement(user.folders);

    // Pick either the parent folder or a subfolder
    let targetFolderId = randomFolder.id;
    if (randomFolder.subfolders.length > 0 && Math.random() < 0.5) {
      const sub = faker.helpers.arrayElement(randomFolder.subfolders);
      targetFolderId = sub.id;
      console.log(`📂 Subfile -> ${sub.name}`);
    } else {
      console.log(`📁 Top-level file -> ${randomFolder.name}`);
    }

    await prisma.file.create({
      data: {
        name: fileName,
        size,
        path: relativePath,
        url: fakeUrl,
        userId: user.id,
        folderId: targetFolderId,
      },
    });

    console.log(`✅ Created ${fileName} in folder ID ${targetFolderId}`);
  }

  await prisma.$disconnect();
}

seedFakeFiles();
