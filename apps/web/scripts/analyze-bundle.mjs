import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

console.log('🔍 Starte Bundle-Analyse...');

// Setze Umgebungsvariablen
process.env.ANALYZE = 'true';
process.env.NODE_ENV = 'production';

try {
  // Führe Production Build mit Analyzer aus
  execSync('pnpm build:analyze', {
    stdio: 'inherit',
    cwd: projectRoot
  });

  console.log('✅ Bundle-Analyse erfolgreich abgeschlossen!');
  console.log('📊 Öffne den generierten Report im Browser...');
} catch (error) {
  console.error('❌ Fehler bei der Bundle-Analyse:', error);
  process.exit(1);
}
