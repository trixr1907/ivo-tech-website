'use client';

import React from 'react';
import AnimatedLogo4D from '../3d/AnimatedLogo4D';

const HeroSection: React.FC = () => {
  const handleGetStarted = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="text-center">
      <div data-testid="hero-content" className="animate-fadeIn">
        <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
          Innovative Technologielösungen
        </h1>
        <p className="mb-8 text-xl text-gray-300">
          Wir entwickeln zukunftsweisende Software mit modernsten Technologien
        </p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={handleGetStarted}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </div>
      <AnimatedLogo4D />
    </div>
  );
};

export default HeroSection;
