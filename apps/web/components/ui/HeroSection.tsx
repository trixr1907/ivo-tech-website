'use client';

import React from 'react';

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center text-center">
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-8">
          Willkommen bei ivo-tech
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12">
          Innovative Softwarelösungen & Fortschrittliche Webtechnologien
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <a
            href="#services"
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Unsere Services
          </a>
          <a
            href="#contact"
            className="px-8 py-4 bg-gray-800 rounded-lg text-white font-semibold hover:bg-gray-700 transition-all"
          >
            Kontakt
          </a>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]"></div>
      </div>
    </div>
  );
};

export default HeroSection;
