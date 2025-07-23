import { performanceTestRunner } from './test-runner';

describe('ErrorBoundary Performance Tests', () => {
  beforeAll(async () => {
    await performanceTestRunner.initialize();
  });

  afterAll(async () => {
    await performanceTestRunner.cleanup();
    await performanceTestRunner.generateReport();
  });

  it('sollte Fehler effizient behandeln und sich schnell erholen', async () => {
    await performanceTestRunner.runTest(
      'ErrorBoundary Fehlerbehandlung',
      'http://localhost:3000/test/error-boundary'
    );
  });

  it('sollte unter Last stabil bleiben', async () => {
    // Wiederhole den Test mehrmals für Stabilitätsprüfung
    for (let i = 0; i < 5; i++) {
      await performanceTestRunner.runTest(
        `ErrorBoundary Stabilitätstest #${i + 1}`,
        'http://localhost:3000/test/error-boundary'
      );
    }
  });

  it('sollte Speicherlecks vermeiden', async () => {
    const testCount = 10;
    const results: number[] = [];

    for (let i = 0; i < testCount; i++) {
      await performanceTestRunner.runTest(
        `ErrorBoundary Speichertest #${i + 1}`,
        'http://localhost:3000/test/error-boundary'
      );
    }
  });
});
