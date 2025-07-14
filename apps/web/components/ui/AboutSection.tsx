import React from 'react';

export function AboutSection() {
  return (
    <div className='text-center'>
      <h2 className='mb-8 text-3xl font-bold text-white md:text-4xl'>Über mich</h2>
      <div className='mx-auto max-w-4xl'>
        <p className='mb-6 text-lg text-gray-300 md:text-xl'>
          Ich bin ein leidenschaftlicher Entwickler mit Fokus auf moderne Webtechnologien und innovative Lösungen. Mit
          jahrelanger Erfahrung in der Softwareentwicklung bringe ich Ideen zum Leben.
        </p>
        <div className='mt-12 grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='rounded-lg bg-gray-800/50 p-6'>
            <div className='mb-4 text-3xl'>🚀</div>
            <h3 className='mb-2 text-xl font-semibold text-white'>Innovation</h3>
            <p className='text-gray-400'>Immer auf der Suche nach neuen Technologien und kreativen Lösungen</p>
          </div>
          <div className='rounded-lg bg-gray-800/50 p-6'>
            <div className='mb-4 text-3xl'>💻</div>
            <h3 className='mb-2 text-xl font-semibold text-white'>Entwicklung</h3>
            <p className='text-gray-400'>Moderne Webanwendungen mit React, Next.js und TypeScript</p>
          </div>
          <div className='rounded-lg bg-gray-800/50 p-6'>
            <div className='mb-4 text-3xl'>🎯</div>
            <h3 className='mb-2 text-xl font-semibold text-white'>Qualität</h3>
            <p className='text-gray-400'>Hohe Standards in Code-Qualität und Benutzererfahrung</p>
          </div>
        </div>
      </div>
    </div>
  );
}
