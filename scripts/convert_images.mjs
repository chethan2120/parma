/*
 * Done by Daksh Sharma: Script to convert PNG/JPG images to WebP format.
 * Why: To optimize image loading times and reduce overall page size.
 * Original files are preserved as requested.
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const TARGET_DIRS = [
  'public/Blogs Images',
  'public/images/blogs',
  'public/real brand images',
  'public/Ui Grphics_Webnxt'
];

async function convertDir(dir) {
  const absoluteDir = path.resolve(dir);
  if (!fs.existsSync(absoluteDir)) {
    console.warn(`Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(absoluteDir);
  for (const file of files) {
    const filePath = path.join(absoluteDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await convertDir(filePath);
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      const baseName = path.basename(file, ext);
      const webpPath = path.join(absoluteDir, `${baseName}.webp`);

      if (fs.existsSync(webpPath)) {
        console.log(`WebP already exists for: ${file}`);
        continue;
      }

      console.log(`Converting: ${filePath} -> ${webpPath}`);
      try {
        await sharp(filePath)
          .webp({ quality: 80 })
          .toFile(webpPath);
        console.log(`Successfully converted ${file} to WebP`);
      } catch (err) {
        console.error(`Failed to convert ${file}:`, err);
      }
    }
  }
}

async function main() {
  for (const dir of TARGET_DIRS) {
    console.log(`Processing directory: ${dir}`);
    await convertDir(dir);
  }
  console.log('Image conversion completed.');
}

main();
