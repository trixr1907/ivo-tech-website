import React from 'react';

export function Scene3D() {
  return (
    <div className='absolute inset-0 overflow-hidden'>
      <div className='absolute left-1/4 top-1/4 h-32 w-32 animate-pulse rounded-full bg-blue-500/10 blur-xl'></div>
      <div className='absolute right-1/4 top-1/3 h-24 w-24 animate-pulse rounded-full bg-purple-500/10 blur-xl delay-1000'></div>
      <div className='delay-2000 absolute bottom-1/4 left-1/3 h-40 w-40 animate-pulse rounded-full bg-cyan-500/10 blur-xl'></div>
      <div className='delay-3000 absolute bottom-1/3 right-1/3 h-28 w-28 animate-pulse rounded-full bg-pink-500/10 blur-xl'></div>
    </div>
  );
}
