import React from 'react';

export function Footer() {
  return (
    <footer className='border-t border-gray-800 bg-gray-900 py-12'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          <div className='md:col-span-2'>
            <div className='mb-4 text-2xl font-bold text-white'>
              <span className='text-blue-400'>Ivo</span>Tech
            </div>
            <p className='mb-4 text-gray-400'>
              Innovative Technologielösungen für die Zukunft. Wir entwickeln moderne Webanwendungen und digitale
              Lösungen, die Ihr Unternehmen voranbringen.
            </p>
          </div>

          <div>
            <h3 className='mb-4 text-lg font-semibold text-white'>Links</h3>
            <ul className='space-y-2'>
              <li>
                <a href='#home' className='text-gray-400 transition-colors hover:text-white'>
                  Home
                </a>
              </li>
              <li>
                <a href='#about' className='text-gray-400 transition-colors hover:text-white'>
                  Über uns
                </a>
              </li>
              <li>
                <a href='#projects' className='text-gray-400 transition-colors hover:text-white'>
                  Projekte
                </a>
              </li>
              <li>
                <a href='#contact' className='text-gray-400 transition-colors hover:text-white'>
                  Kontakt
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 text-lg font-semibold text-white'>Kontakt</h3>
            <ul className='space-y-2'>
              <li className='text-gray-400'>info@ivo-tech.com</li>
              <li className='text-gray-400'>+49 123 456 789</li>
              <li className='text-gray-400'>Berlin, Deutschland</li>
            </ul>
          </div>
        </div>

        <div className='mt-8 border-t border-gray-800 pt-8 text-center'>
          <p className='text-gray-400'>© 2024 IvoTech. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
