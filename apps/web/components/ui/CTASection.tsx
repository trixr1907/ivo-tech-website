import React from 'react';

export function CTASection() {
  return (
    <div className='text-center'>
      <h2 className='mb-8 text-3xl font-bold text-white md:text-4xl'>Interessiert an unserem Service?</h2>
      <p className='mx-auto mb-12 max-w-2xl text-lg text-gray-300'>
        Kontaktieren Sie uns für eine kostenlose Beratung und erfahren Sie, wie wir Ihnen helfen können, Ihre Ziele zu
        erreichen.
      </p>
      <button className='rounded-lg bg-blue-600 px-8 py-3 font-semibold transition-colors hover:bg-blue-700'>
        Kontakt aufnehmen
      </button>
    </div>
  );
}
