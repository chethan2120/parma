/*
 * Done by Daksh Sharma: Script to programmatically split monolithic App.css into section CSS files.
 * Why: To reduce initial paint load times and allow code-splitting of styles.
 */
import fs from 'fs';
import path from 'path';

const CSS_FILE = 'src/App.css';
const OUTPUT_DIR = 'src/components/Home';

const SECTIONS = [
  {
    name: 'ServicesSection',
    startMarker: '/* ══════════════════════════════════════════════════════════════\n   OUR SERVICES',
    endMarker: '  color: rgba(55, 49, 45, 0.6);\n}'
  },
  {
    name: 'OurWorkSection',
    startMarker: '/* ══════════════════════════════════════════════════════════════\n   CASE STUDIES / SERVICES SHOWCASE',
    endMarker: '  color: rgba(255, 255, 255, 0.55);\n}'
  },
  {
    name: 'WhyChooseSection',
    startMarker: '/* ══════════════════════════════════════════════════════════════\n   OUR PROCESS',
    endMarker: '  line-height: 1;\n}'
  }
];

function main() {
  const cssPath = path.resolve(CSS_FILE);
  if (!fs.existsSync(cssPath)) {
    console.error(`CSS file not found: ${CSS_FILE}`);
    return;
  }

  let cssContent = fs.readFileSync(cssPath, 'utf8');
  // Normalize CRLF to LF for robust matching
  cssContent = cssContent.replace(/\r\n/g, '\n');

  for (const section of SECTIONS) {
    const startIndex = cssContent.indexOf(section.startMarker);
    if (startIndex === -1) {
      console.warn(`Could not find start marker for ${section.name}`);
      continue;
    }

    const endSearchIndex = cssContent.indexOf(section.endMarker, startIndex);
    if (endSearchIndex === -1) {
      console.warn(`Could not find end marker for ${section.name}`);
      continue;
    }

    const endIndex = endSearchIndex + section.endMarker.length;
    const sectionContent = cssContent.substring(startIndex, endIndex);

    const outputPath = path.join(path.resolve(OUTPUT_DIR), `${section.name}.css`);
    console.log(`Writing: ${outputPath} (${sectionContent.length} chars)`);
    fs.writeFileSync(outputPath, sectionContent);

    // Replace in main CSS file with a tracking comment
    const placeholder = `/* Done by Daksh Sharma: Extracted ${section.name} CSS styles to ${section.name}.css for route performance */`;
    cssContent = cssContent.substring(0, startIndex) + placeholder + cssContent.substring(endIndex);
  }

  // Write back (using Git-friendly LF line endings)
  fs.writeFileSync(cssPath, cssContent);
  console.log('CSS splitting completed successfully.');
}

main();
