import React from 'react';

export function AboutSection() {
  return (
    <div className="text-center">
      <div className="mb-4 font-mono text-sm text-blue-400">$ whoami</div>
      <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">
        Hi, ich bin{' '}
        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Ivo
        </span>
      </h2>
      <div className="mx-auto max-w-4xl">
        <p className="mb-6 text-lg text-gray-300 md:text-xl">
          Fullstack-Entwickler, Selfhosting-Enthusiast und IT-Berater aus
          München. Mit über 6 Jahren Erfahrung in der Webentwicklung und
          Systemadministration verwandle ich komplexe technische
          Herausforderungen in einfache, elegante Lösungen. Spezialist für
          moderne React/Next.js-Anwendungen und professionelle
          Heimserver-Infrastrukturen mit Proxmox und Docker.
        </p>

        <div className="mb-8 font-mono text-sm text-purple-400">
          → Spezialist für Heimserver-Umgebungen & moderne Webentwicklung
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="group rounded-lg border border-gray-700 bg-gray-800/30 p-6 transition-all hover:border-blue-500 hover:bg-gray-800/50">
            <div className="mb-4 text-4xl transition-transform group-hover:scale-110">
              🏠
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Heimserver-Experte
            </h3>
            <p className="text-gray-400">
              Proxmox, Docker, Selfhosting - dein digitales Zuhause,
              professionell eingerichtet
            </p>
          </div>

          <div className="group rounded-lg border border-gray-700 bg-gray-800/30 p-6 transition-all hover:border-purple-500 hover:bg-gray-800/50">
            <div className="mb-4 text-4xl transition-transform group-hover:scale-110">
              🌐
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Web-Entwickler
            </h3>
            <p className="text-gray-400">
              Moderne, schnelle Websites mit React, Next.js und TypeScript
            </p>
          </div>

          <div className="group rounded-lg border border-gray-700 bg-gray-800/30 p-6 transition-all hover:border-green-500 hover:bg-gray-800/50">
            <div className="mb-4 text-4xl transition-transform group-hover:scale-110">
              ⚙️
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Automatisierung
            </h3>
            <p className="text-gray-400">
              Scripts, CI/CD, Monitoring - Effizienz durch intelligente
              Automatisierung
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-8 rounded-lg bg-gray-800/20 p-8 font-mono text-sm md:grid-cols-4">
          <div>
            <div className="text-2xl font-bold text-blue-400">6+</div>
            <div className="text-gray-400">Jahre Erfahrung</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">75+</div>
            <div className="text-gray-400">Projekte umgesetzt</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">15+</div>
            <div className="text-gray-400">Heimserver installiert</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">100%</div>
            <div className="text-gray-400">Kundenzufriedenheit</div>
          </div>
        </div>
      </div>
    </div>
  );
}
