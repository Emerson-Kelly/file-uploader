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
  // Get the user
  const user = await prisma.user.findUnique({
    where: { email: TARGET_EMAIL },
    include: { folders: true },
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

  // Create fake files in random folders
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

    const randomFolder = faker.helpers.arrayElement(user.folders);

    await prisma.file.create({
      data: {
        name: fileName,
        size,
        path: relativePath,
        url: fakeUrl,
        userId: user.id,
        folderId: randomFolder.id,
      },
    });

    console.log(`✅ Created ${fileName} in folder "${randomFolder.name}"`);
  }

  await prisma.$disconnect();
}

seedFakeFiles();
