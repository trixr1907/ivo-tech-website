'use client';

import React, { useState } from 'react';
import { NeonProvider, useNeonContext } from './NeonProvider';
import { NeonButton } from './NeonButton';
import { NeonCard } from './NeonCard';
import { NeonModal } from './NeonModal';
// import { NeonEnhanced3DScene } from '../../3d/NeonEnhanced3DScene';

function NeonUIDemoContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<'primary' | 'secondary' | 'accent' | 'ghost'>('primary');
  const { toggle4DMode, is4DMode } = useNeonContext();

  return (
    <div className='space-y-8'>
      <div className='mb-12 text-center'>
        <h1 className='mb-4 text-4xl font-bold text-white' style={{ textShadow: '0 0 20px #00ff00' }}>
          NeonUI Library Demo
        </h1>
        <p className='text-lg text-gray-300'>3D/4D Micro-Interactions mit CSS + React Three Fiber</p>
      </div>

      {/* Variant Selector */}
      <div className='mb-8 flex justify-center space-x-4'>
        {(['primary', 'secondary', 'accent', 'ghost'] as const).map(variant => (
          <button
            key={variant}
            onClick={() => setSelectedVariant(variant)}
            className={`rounded-lg border px-4 py-2 text-white transition-all ${
              selectedVariant === variant
                ? 'border-white bg-white bg-opacity-20'
                : 'border-gray-600 bg-transparent hover:border-gray-400'
            }`}
          >
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </button>
        ))}
      </div>

      {/* Buttons Demo */}
      <div className='space-y-8'>
        <h2 className='text-center text-2xl font-bold text-white'>NeonButton</h2>

        <div className='flex flex-wrap justify-center gap-6'>
          <NeonButton variant={selectedVariant} size='sm' onClick={() => console.log('Small button clicked')}>
            Small Button
          </NeonButton>

          <NeonButton
            variant={selectedVariant}
            size='md'
            sparkles={true}
            onClick={() => console.log('Medium button clicked')}
          >
            Medium with Sparkles
          </NeonButton>

          <NeonButton
            variant={selectedVariant}
            size='lg'
            tiltIntensity={15}
            {...{ '4d': true }}
            onClick={() => console.log('Large 4D button clicked')}
          >
            Large 4D Button
          </NeonButton>

          <NeonButton variant={selectedVariant} size='xl' disabled>
            Disabled Button
          </NeonButton>
        </div>
      </div>

      {/* Cards Demo */}
      <div className='space-y-8'>
        <h2 className='text-center text-2xl font-bold text-white'>NeonCard</h2>

        <div className='mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          <NeonCard
            variant={selectedVariant}
            title='Standard Card'
            subtitle='Basic interactive card with hover effects'
            elevation={1}
            interactive={true}
          >
            <p className='text-gray-300'>
              Dies ist eine Standard-Neon-Karte mit grundlegenden Hover-Effekten und Tiefenanimationen.
            </p>
          </NeonCard>

          <NeonCard
            variant={selectedVariant}
            title='4D Enhanced Card'
            subtitle='With layered 3D planes and audio reactivity'
            elevation={3}
            interactive={true}
            hoverOffset={25}
            {...{ '4d': true }}
          >
            <p className='mb-4 text-gray-300'>
              Diese Karte nutzt 3D-Ebenen und reagiert auf Audio-Eingaben im 4D-Modus.
            </p>
            <div className='space-y-2'>
              <div className='h-2 rounded bg-gray-700'>
                <div className='h-2 rounded bg-gradient-to-r from-green-400 to-blue-500' style={{ width: '70%' }}></div>
              </div>
              <div className='h-2 rounded bg-gray-700'>
                <div
                  className='h-2 rounded bg-gradient-to-r from-purple-400 to-pink-500'
                  style={{ width: '50%' }}
                ></div>
              </div>
            </div>
          </NeonCard>

          <NeonCard
            variant={selectedVariant}
            title='Non-Interactive'
            subtitle='Static display card'
            elevation={2}
            interactive={false}
          >
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Performance:</span>
                <span className='text-green-400'>98.5%</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Latency:</span>
                <span className='text-blue-400'>12ms</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Uptime:</span>
                <span className='text-purple-400'>99.9%</span>
              </div>
            </div>
          </NeonCard>
        </div>
      </div>

      {/* Modal Demo */}
      <div className='space-y-8'>
        <h2 className='text-center text-2xl font-bold text-white'>NeonModal</h2>

        <div className='flex justify-center space-x-6'>
          <NeonButton variant={selectedVariant} onClick={() => setIsModalOpen(true)}>
            Standard Modal öffnen
          </NeonButton>
        </div>
      </div>

      {/* Enhanced 3D Scene */}
      <div className='space-y-8'>
        <h2 className='text-center text-2xl font-bold text-white'>Enhanced 3D Scene</h2>
        <div className='mx-auto max-w-6xl'>
          <NeonCard
            title='3D/4D Interactive Environment'
            subtitle='NeonUI Components direkt im 3D-Raum'
            variant='primary'
            elevation={3}
            interactive={false}
            className='p-6'
          >
            <div className='flex h-64 items-center justify-center rounded-lg bg-gray-800'>
              <p className='text-gray-400'>3D Scene (Temporär deaktiviert)</p>
            </div>
          </NeonCard>
        </div>
      </div>

      {/* 4D Mode Toggle */}
      <div className='mt-12 flex justify-center'>
        <NeonButton
          variant={is4DMode ? 'primary' : 'accent'}
          size='lg'
          onClick={toggle4DMode}
          sparkles={is4DMode}
          {...{ '4d': is4DMode }}
        >
          {is4DMode ? '🎵 4D Audio Mode' : '👁️ 3D Visual Mode'}
        </NeonButton>
      </div>

      {/* Modal */}
      <NeonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='NeonUI Modal Demo'
        variant={selectedVariant}
        {...{ '4d': true }}
        backdropBlur={true}
      >
        <div className='space-y-6'>
          <p className='text-gray-300'>
            Dies ist ein vollständig funktionales Modal mit 3D-Layering und audio-reaktiven Effekten.
          </p>

          <div className='grid grid-cols-2 gap-4'>
            <div className='rounded-lg bg-gray-800 p-4'>
              <h4 className='mb-2 font-semibold text-white'>Features</h4>
              <ul className='space-y-1 text-sm text-gray-400'>
                <li>• 3D Layered Planes</li>
                <li>• Audio-Reaktivität</li>
                <li>• Animierte Gradienten</li>
                <li>• Framer Motion</li>
              </ul>
            </div>

            <div className='rounded-lg bg-gray-800 p-4'>
              <h4 className='mb-2 font-semibold text-white'>Technologien</h4>
              <ul className='space-y-1 text-sm text-gray-400'>
                <li>• React Three Fiber</li>
                <li>• CSS Houdini Paint API</li>
                <li>• Web Audio API</li>
                <li>• TypeScript</li>
              </ul>
            </div>
          </div>

          <div className='flex space-x-4'>
            <NeonButton variant='primary' size='sm' onClick={() => console.log('Modal action 1')}>
              Aktion 1
            </NeonButton>
            <NeonButton variant='secondary' size='sm' onClick={() => setIsModalOpen(false)}>
              Schließen
            </NeonButton>
          </div>
        </div>
      </NeonModal>
    </div>
  );
}

export function NeonUIDemo() {
  return (
    <NeonProvider enableAudio={true}>
      <NeonUIDemoContent />
    </NeonProvider>
  );
}
