import React from 'react';

export default function ImpressumPage(): React.ReactElement {
  return (
    <div className='min-h-screen bg-gray-900 py-16'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='mb-4 text-4xl font-bold text-white'>
            <span className='bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
              Impressum
            </span>
          </h1>
          <div className='font-mono text-sm text-blue-400'>$ cat /legal/impressum.md</div>
        </div>

        <div className='space-y-8 text-gray-300'>
          <section>
            <h2 className='mb-4 text-2xl font-semibold text-white'>Angaben nach § 5 TMG</h2>
            <div className='rounded-lg bg-gray-800/30 p-6'>
              <p className='mb-2'>
                <strong className='text-white'>IVO-TECH</strong>
              </p>
              <p className='mb-2'>Ivo Mustermann</p>
              <p className='mb-2'>Musterstraße 123</p>
              <p className='mb-2'>80331 München</p>
              <p className='mb-4'>Deutschland</p>

              <p className='mb-2'>
                <strong className='text-white'>E-Mail:</strong>{' '}
                <a href='mailto:kontakt@ivo-tech.com' className='text-blue-400 hover:text-blue-300'>
                  kontakt@ivo-tech.com
                </a>
              </p>
              <p className='mb-2'>
                <strong className='text-white'>Telefon:</strong>{' '}
                <a href='tel:+4917612345678' className='text-blue-400 hover:text-blue-300'>
                  +49 176 12345678
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className='mb-4 text-2xl font-semibold text-white'>Umsatzsteuer</h2>
            <div className='rounded-lg bg-gray-800/30 p-6'>
              <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:</p>
              <p className='mt-2 font-mono text-green-400'>DE123456789</p>
              <p className='mt-4 text-sm text-gray-400'>
                * Als Kleinunternehmer im Sinne von § 19 Abs. 1 UStG wird Umsatzsteuer nicht ausgewiesen.
              </p>
            </div>
          </section>

          <section>
            <h2 className='mb-4 text-2xl font-semibold text-white'>
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <div className='rounded-lg bg-gray-800/30 p-6'>
              <p>Ivo Mustermann</p>
              <p>Musterstraße 123</p>
              <p>80331 München</p>
              <p>Deutschland</p>
            </div>
          </section>

          <section>
            <h2 className='mb-4 text-2xl font-semibold text-white'>Haftungsausschluss</h2>
            <div className='space-y-4 rounded-lg bg-gray-800/30 p-6'>
              <div>
                <h3 className='mb-2 text-lg font-semibold text-white'>Haftung für Inhalte</h3>
                <p className='text-sm'>
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
                  allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
                  unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach
                  Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>
              </div>

              <div>
                <h3 className='mb-2 text-lg font-semibold text-white'>Haftung für Links</h3>
                <p className='text-sm'>
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
                  Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
                  verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className='mb-4 text-2xl font-semibold text-white'>Urheberrecht</h2>
            <div className='rounded-lg bg-gray-800/30 p-6'>
              <p className='text-sm'>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
                Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
                Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </div>
          </section>

          <section className='mt-12 text-center'>
            <div className='font-mono text-sm text-gray-400'>Stand: Januar 2024</div>
            <div className='mt-4'>
              <a
                href='/'
                className='inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700'
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
