import React from 'react';

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-white">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Datenschutzerklärung
            </span>
          </h1>
          <div className="font-mono text-sm text-blue-400">
            $ cat /legal/datenschutz.md
          </div>
        </div>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              1. Allgemeine Hinweise
            </h2>
            <div className="rounded-lg bg-gray-800/30 p-6">
              <p className="text-sm">
                Die folgenden Hinweise geben einen einfachen Überblick darüber,
                was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
                Website besuchen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              2. Verantwortliche Stelle
            </h2>
            <div className="rounded-lg bg-gray-800/30 p-6">
              <p className="mb-4 text-sm">
                Die Datenverarbeitung auf dieser Website erfolgt durch den
                Websitebetreiber:
              </p>
              <div className="font-mono text-sm text-green-400">
                <p>IVO-TECH</p>
                <p>Ivo Mustermann</p>
                <p>E-Mail: kontakt@ivo-tech.com</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              3. Datenerfassung
            </h2>
            <div className="rounded-lg bg-gray-800/30 p-6">
              <p className="mb-4 text-sm">
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
                mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie
                in ein Kontaktformular eingeben.
              </p>
              <p className="text-sm">
                Andere Daten werden automatisch beim Besuch der Website durch
                unsere IT-Systeme erfasst. Das sind vor allem technische Daten
                (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des
                Seitenaufrufs).
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              4. Verwendung der Daten
            </h2>
            <div className="rounded-lg bg-gray-800/30 p-6">
              <p className="mb-4 text-sm">
                Ein Teil der Daten wird erhoben, um eine fehlerfreie
                Bereitstellung der Website zu gewährleisten. Andere Daten können
                zur Analyse Ihres Nutzerverhaltens verwendet werden.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-400">•</span>
                  Bereitstellung und Optimierung der Website
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-400">•</span>
                  Bearbeitung von Kontaktanfragen
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-400">•</span>
                  Analyse des Nutzerverhaltens (anonymisiert)
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              5. Ihre Rechte
            </h2>
            <div className="rounded-lg bg-gray-800/30 p-6">
              <p className="mb-4 text-sm">Sie haben jederzeit das Recht:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-green-400">•</span>
                  Auskunft über Ihre gespeicherten Daten zu erhalten
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-400">•</span>
                  Berichtigung unrichtiger Daten zu verlangen
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-400">•</span>
                  Löschung Ihrer Daten zu beantragen
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-400">•</span>
                  Der Verarbeitung zu widersprechen
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              6. Cookies und Tracking
            </h2>
            <div className="rounded-lg bg-gray-800/30 p-6">
              <p className="text-sm">
                Diese Website verwendet keine Cookies für Tracking oder
                Werbezwecke. Technisch notwendige Cookies können verwendet
                werden, um die Funktionalität der Website zu gewährleisten.
              </p>
            </div>
          </section>

          <section className="mt-12 text-center">
            <div className="font-mono text-sm text-gray-400">
              Stand: Januar 2024
            </div>
            <div className="mt-4">
              <a
                href="/"
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700"
              >
                ← Zurück zur Startseite
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
