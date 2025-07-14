import React from 'react';

export function HeroSection() {
  return (
    <div className='text-center'>
      <h1 className='mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-4xl font-bold text-transparent md:text-6xl'>
        Willkommen bei Ivo Tech
      </h1>
      <p className='mb-8 text-xl text-gray-300 md:text-2xl'>Innovative Technologielösungen für die Zukunft</p>
      <div className='flex flex-col justify-center gap-4 sm:flex-row'>
        <button className='rounded-lg bg-blue-600 px-8 py-3 font-semibold transition-colors hover:bg-blue-700'>
          Projekte entdecken
        </button>
        <button className='rounded-lg border border-gray-600 px-8 py-3 font-semibold transition-colors hover:border-gray-400'>
          Über mich
        </button>
      </div>
    </div>
  );
}
