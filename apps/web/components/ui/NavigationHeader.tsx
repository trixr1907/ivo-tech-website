'use client';

import React from 'react';

interface NavigationHeaderProps {
  onLoginClick: () => void;
}

export function NavigationHeader({ onLoginClick }: NavigationHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (typeof window !== 'undefined') {
      const element = document.getElementById(sectionId.replace('#', ''));
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Sticky Email Banner */}
      <div className="fixed right-4 top-4 z-[100] animate-bounce">
        <a
          href="mailto:info@ivo-tech.com"
          className="group flex items-center space-x-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
        >
          <svg
            className="h-4 w-4 transition-transform group-hover:scale-110"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span className="hidden sm:inline">info@ivo-tech.com</span>
          <span className="sm:hidden">Email</span>
        </a>
      </div>

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-800/50 bg-gray-900/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="group cursor-pointer text-xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent transition-all group-hover:from-cyan-400 group-hover:to-blue-400">
                  IVO-TECH
                </span>
                <div className="mt-[-2px] h-0.5 w-0 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center space-x-6 md:flex">
              {[
                { name: 'Home', id: 'hero', isLink: false },
                { name: '🚀 3D', id: 'epic-3d', isLink: false },
                { name: '🎮 Game', id: 'game-zone', isLink: false },
                { name: '💰 Crypto', id: 'crypto', isLink: false },
                { name: 'Services', id: 'services', isLink: false },
                { name: '📁 Portfolio', id: '/portfolio', isLink: true },
                { name: 'About', id: 'about', isLink: false },
                { name: 'Contact', id: 'contact', isLink: false },
              ].map(item => {
                if (item.isLink) {
                  return (
                    <a
                      key={item.name}
                      href={item.id}
                      className="group relative text-sm font-medium text-gray-300 transition-colors hover:text-white"
                    >
                      {item.name}
                      <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
                    </a>
                  );
                }
                return (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.id)}
                    className="group relative text-sm font-medium text-gray-300 transition-colors hover:text-white"
                  >
                    {item.name}
                    <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
                  </button>
                );
              })}

              {/* Social Media Icons */}
              <div className="flex items-center space-x-3 border-l border-gray-700 pl-4">
                <a
                  href="https://github.com/ivotech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                  aria-label="GitHub"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>

                <a
                  href="https://linkedin.com/company/ivotech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-blue-400"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>

                <a
                  href="https://twitter.com/ivotech_de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-blue-300"
                  aria-label="Twitter / X"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>

              {/* Login Button */}
              <button
                onClick={onLoginClick}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-10"></div>
                <span className="relative flex items-center space-x-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Login</span>
                </span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white md:hidden"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="bg-gray-900/98 border-t border-gray-800 backdrop-blur-xl md:hidden">
            <div className="space-y-2 px-4 py-4">
              {[
                { name: 'Home', id: 'hero', isLink: false },
                { name: '🚀 Epic 3D', id: 'epic-3d', isLink: false },
                { name: '🎮 Game Zone', id: 'game-zone', isLink: false },
                { name: '💰 Live Crypto', id: 'crypto', isLink: false },
                { name: 'Services', id: 'services', isLink: false },
                { name: '📁 Portfolio', id: '/portfolio', isLink: true },
                { name: 'About', id: 'about', isLink: false },
                { name: 'Contact', id: 'contact', isLink: false },
              ].map(item => {
                if (item.isLink) {
                  return (
                    <a
                      key={item.name}
                      href={item.id}
                      className="block w-full py-2 text-left font-medium text-gray-300 transition-colors hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  );
                }
                return (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full py-2 text-left font-medium text-gray-300 transition-colors hover:text-white"
                  >
                    {item.name}
                  </button>
                );
              })}
              <button
                onClick={() => {
                  onLoginClick();
                  setIsMenuOpen(false);
                }}
                className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-center font-medium text-white"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
