import React from 'react';

export function NavigationHeader() {
  return (
    <nav className='fixed left-0 right-0 top-0 z-50 border-b border-gray-800 bg-black/80 backdrop-blur-sm'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center'>
            <div className='text-2xl font-bold text-white'>
              <span className='text-blue-400'>Ivo</span>Tech
            </div>
          </div>

          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-8'>
              <a href='#home' className='text-gray-300 transition-colors hover:text-white'>
                Home
              </a>
              <a href='#about' className='text-gray-300 transition-colors hover:text-white'>
                Über mich
              </a>
              <a href='#projects' className='text-gray-300 transition-colors hover:text-white'>
                Projekte
              </a>
              <a href='#contact' className='text-gray-300 transition-colors hover:text-white'>
                Kontakt
              </a>
            </div>
          </div>

          <div className='md:hidden'>
            <button className='text-gray-300 hover:text-white'>
              <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
