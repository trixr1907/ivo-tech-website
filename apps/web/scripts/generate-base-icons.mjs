import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

// Create a simple icon with text
async function generateBaseIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#000"/>
      <text x="50%" y="50%" font-family="Arial" font-size="${size/4}" fill="#fff" text-anchor="middle" dy=".3em">IVO</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(path.join(publicDir, 'icons', `icon-${size}x${size}.png`));
}

// Generate base icons
await generateBaseIcon(192);
await generateBaseIcon(512);

console.log('Base icons generated successfully!');
