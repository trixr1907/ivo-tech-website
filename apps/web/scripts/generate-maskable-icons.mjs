import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

async function generateMaskableIcon(size) {
  const padding = Math.floor(size * 0.1); // 10% padding for safe area
  const canvas = size + (padding * 2);
  
  await sharp(path.join(publicDir, 'icons', `icon-${size}x${size}.png`))
    .resize(size, size)
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    })
    .resize(size, size)
    .toFile(path.join(publicDir, 'icons', `maskable-icon-${size}x${size}.png`));
}

// Generate maskable icons for both sizes
await generateMaskableIcon(192);
await generateMaskableIcon(512);

console.log('Maskable icons generated successfully!');
