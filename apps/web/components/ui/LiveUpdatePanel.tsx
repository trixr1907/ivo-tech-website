'use client';

import React, { useState, useEffect } from 'react';

export function LiveUpdatePanel() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='rounded-lg border border-gray-700 bg-gray-900/80 p-4 text-sm backdrop-blur-sm'>
      <div className='mb-2 flex items-center space-x-2'>
        <div className='h-2 w-2 animate-pulse rounded-full bg-green-500'></div>
        <span className='font-mono text-green-400'>LIVE</span>
      </div>
      <div className='font-mono text-gray-300'>{time.toLocaleTimeString('de-DE')}</div>
      <div className='mt-1 text-xs text-gray-500'>System Status: Online</div>
    </div>
  );
}
