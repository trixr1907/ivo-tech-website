import React from 'react';

export function CTASection() {
  const handleEmailClick = () => {
    if (typeof window !== 'undefined') {
      window.location.href =
        'mailto:info@ivo-tech.com?subject=Projektanfrage&body=Hallo,%0D%0A%0D%0AIch interessiere mich für Ihre Services und hätte gerne weitere Informationen.';
    }
  };

  const handleWhatsAppClick = () => {
    if (typeof window !== 'undefined') {
      window.open(
        'https://wa.me/4915123456789?text=Hallo,%20ich%20interessiere%20mich%20für%20Ihre%20IT-Services',
        '_blank'
      );
    }
  };

  return (
    <div id='contact' className='text-center'>
      <div className='mb-4 font-mono text-sm text-green-400'>$ contact --help</div>
      <h2 className='mb-8 text-3xl font-bold text-white md:text-4xl'>
        Bereit für dein{' '}
        <span className='bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'>
          nächstes Projekt
        </span>
        ?
      </h2>
      <p className='mx-auto mb-12 max-w-2xl text-lg text-gray-300'>
        Lass uns über deine Ideen sprechen! Kostenlose Erstberatung und individuelle Lösungen für deine
        IT-Herausforderungen.
      </p>

      {/* Contact Methods */}
      <div className='mb-12 grid grid-cols-1 gap-6 md:grid-cols-3'>
        {/* Email */}
        <div className='group rounded-lg border border-gray-700 bg-gray-800/30 p-6 transition-all hover:border-green-500 hover:bg-gray-800/50'>
          <div className='mb-4 text-3xl transition-transform group-hover:scale-110'>📧</div>
          <h3 className='mb-2 text-lg font-semibold text-white'>Email</h3>
          <p className='mb-4 font-mono text-sm text-gray-400'>info@ivo-tech.com</p>
          <button
            onClick={handleEmailClick}
            className='w-full rounded-lg bg-green-600 px-4 py-2 font-semibold transition-colors hover:bg-green-700'
          >
            Email schreiben
          </button>
        </div>

        {/* WhatsApp */}
        <div className='group rounded-lg border border-gray-700 bg-gray-800/30 p-6 transition-all hover:border-green-500 hover:bg-gray-800/50'>
          <div className='mb-4 text-3xl transition-transform group-hover:scale-110'>💬</div>
          <h3 className='mb-2 text-lg font-semibold text-white'>WhatsApp</h3>
          <p className='mb-4 font-mono text-sm text-gray-400'>Schnelle Antwort</p>
          <button
            onClick={handleWhatsAppClick}
            className='w-full rounded-lg bg-green-600 px-4 py-2 font-semibold transition-colors hover:bg-green-700'
          >
            WhatsApp öffnen
          </button>
        </div>

        {/* Terminbuchung */}
        <div className='group rounded-lg border border-gray-700 bg-gray-800/30 p-6 transition-all hover:border-blue-500 hover:bg-gray-800/50'>
          <div className='mb-4 text-3xl transition-transform group-hover:scale-110'>📅</div>
          <h3 className='mb-2 text-lg font-semibold text-white'>Beratungstermin</h3>
          <p className='mb-4 font-mono text-sm text-gray-400'>30 Min. kostenlos</p>
          <button className='w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold transition-colors hover:bg-blue-700'>
            Termin buchen
          </button>
        </div>
      </div>

      {/* Response Time Info */}
      <div className='mx-auto max-w-2xl rounded-lg bg-gray-800/20 p-6 font-mono text-sm text-gray-400'>
        <div className='mb-2 text-green-400'>⚡ Schnelle Antwortzeiten:</div>
        <div className='grid grid-cols-1 gap-2 md:grid-cols-3'>
          <div>📧 Email: &lt; 24h</div>
          <div>💬 WhatsApp: &lt; 2h</div>
          <div>🚨 Notfall: Sofort</div>
        </div>
      </div>
    </div>
  );
}
