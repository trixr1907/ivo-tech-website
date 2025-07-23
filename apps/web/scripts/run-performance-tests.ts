import { spawn } from 'child_process';
import path from 'path';
import { performance } from 'perf_hooks';

async function runPerformanceTests() {
  console.log('🚀 Starte Performance-Tests...');
  const startTime = performance.now();

  try {
    // Starte den Entwicklungsserver
    console.log('📡 Starte Entwicklungsserver...');
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
    });

    // Warte, bis der Server bereit ist
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Führe Performance-Tests aus
    console.log('🔍 Führe Performance-Tests aus...');
    const testProcess = spawn(
      'npx',
      ['jest', '--config', 'jest.performance.config.js'],
      {
        stdio: 'inherit',
        shell: true,
      }
    );

    // Warte auf Testabschluss
    await new Promise((resolve, reject) => {
      testProcess.on('exit', (code) => {
        if (code === 0) {
          resolve(null);
        } else {
          reject(new Error(`Tests fehlgeschlagen mit Code ${code}`));
        }
      });
    });

    // Beende den Server
    server.kill();

    const duration = ((performance.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Performance-Tests abgeschlossen in ${duration}s`);

    // Öffne den letzten Bericht
    const reportDir = path.join(process.cwd(), 'performance/reports');
    const reports = await fs.readdir(reportDir);
    const latestReport = reports
      .filter((f) => f.endsWith('.json'))
      .sort()
      .pop();

    if (latestReport) {
      const reportContent = await fs.readFile(
        path.join(reportDir, latestReport),
        'utf-8'
      );
      const report = JSON.parse(reportContent);

      console.log('\n📊 Performance-Bericht Zusammenfassung:');
      console.log('----------------------------------------');
      console.log(`Gesamttests: ${report.summary.totalTests}`);
      console.log(`Erfolgreiche Tests: ${report.summary.passedTests}`);
      console.log('\nDurchschnittliche Metriken:');
      Object.entries(report.summary.averageMetrics).forEach(([key, value]) => {
        console.log(`${key}: ${value.toFixed(2)}`);
      });
    }
  } catch (error) {
    console.error('❌ Fehler beim Ausführen der Performance-Tests:', error);
    process.exit(1);
  }
}

runPerformanceTests();
