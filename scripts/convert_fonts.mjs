/*
 * Done by Daksh Sharma: Script to convert OTF fonts to WOFF2 format.
 * Why: To optimize font load sizes and improve page rendering speed.
 * Original files are preserved as requested.
 */
import fs from 'fs';
import path from 'path';
import wawoff2 from 'wawoff2';

const FONT_DIR = 'public/fonts/lufga';

async function main() {
  const absoluteDir = path.resolve(FONT_DIR);
  if (!fs.existsSync(absoluteDir)) {
    console.warn(`Font directory not found: ${FONT_DIR}`);
    return;
  }

  const files = fs.readdirSync(absoluteDir);
  for (const file of files) {
    if (path.extname(file).toLowerCase() === '.otf') {
      const inputPath = path.join(absoluteDir, file);
      const baseName = path.basename(file, '.otf');
      const outputPath = path.join(absoluteDir, `${baseName}.woff2`);

      if (fs.existsSync(outputPath)) {
        console.log(`WOFF2 already exists for: ${file}`);
        continue;
      }

      console.log(`Converting font: ${inputPath} -> ${outputPath}`);
      try {
        const inputBuffer = fs.readFileSync(inputPath);
        const outputBuffer = await wawoff2.compress(inputBuffer);
        fs.writeFileSync(outputPath, outputBuffer);
        console.log(`Successfully converted ${file} to WOFF2`);
      } catch (err) {
        console.error(`Failed to convert ${file}:`, err);
      }
    }
  }
  console.log('Font conversion completed.');
}

main();
