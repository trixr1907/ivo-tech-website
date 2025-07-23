'use client';

export default function AgbPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-white">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Allgemeine Geschäftsbedingungen
            </span>
          </h1>
          <div className="font-mono text-sm text-blue-400">
            $ cat /legal/agb.md
          </div>
        </div>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              1. Einleitung
            </h2>
            <div className="rounded-lg bg-gray-800/30 p-6">
              <p className="text-sm">
                Diese allgemeinen Geschäftsbedingungen ("AGB") gelten für alle
                Verträge zwischen uns und unseren Kunden.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              2. Vertragsschluss
            </h2>
            <div className="rounded-lg bg-gray-800/30 p-6">
              <p className="text-sm">
                Die Darstellungen der Produkte und Dienstleistungen stellen kein
                rechtlich bindendes Angebot dar, sondern eine Aufforderung zur
                Bestellung.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              3. Preise und Zahlungsbedingungen
            </h2>
            <div className="rounded-lg bg-gray-800/30 p-6">
              <p className="text-sm">
                Alle angegebenen Preise verstehen sich zzgl. der jeweiligen
                gesetzlichen Mehrwertsteuer.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              4. Lieferung und Eigentumsvorbehalt
            </h2>
            <div className="rounded-lg bg-gray-800/30 p-6">
              <p className="text-sm">
                Die Lieferung erfolgt nur innerhalb Deutschlands. Die Ware
                bleibt bis zur vollständigen Zahlung unser Eigentum.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              5. Widerrufsrecht
            </h2>
            <div className="rounded-lg bg-gray-800/30 p-6">
              <p className="text-sm">
                Verbraucher haben ein 14-tägiges Widerrufsrecht.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              6. Haftung
            </h2>
            <div className="rounded-lg bg-gray-800/30 p-6">
              <p className="text-sm">
                Wir haften unbeschränkt für Vorsatz und grobe Fahrlässigkeit.
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
