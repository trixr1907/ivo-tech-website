import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 text-2xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                IVO-TECH
              </span>
            </div>
            <p className="mb-4 text-gray-400">
              Dein Partner für moderne IT-Lösungen. Von Heimserver-Setups bis
              zur professionellen Webentwicklung - wir bringen deine digitalen
              Projekte zum Leben.
            </p>
            <div className="font-mono text-xs text-green-400">
              🚀 Immer erreichbar, immer innovativ
            </div>

            {/* Social Media Links */}
            <div className="mt-6 flex space-x-4">
              <a
                href="https://github.com/ivotech"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-gray-700 hover:text-white hover:shadow-lg"
                aria-label="GitHub"
              >
                <svg
                  className="h-5 w-5 transition-transform group-hover:scale-110"
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
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-blue-600 hover:text-white hover:shadow-lg"
                aria-label="LinkedIn"
              >
                <svg
                  className="h-5 w-5 transition-transform group-hover:scale-110"
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
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-blue-400 hover:text-white hover:shadow-lg"
                aria-label="Twitter / X"
              >
                <svg
                  className="h-5 w-5 transition-transform group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://instagram.com/ivotech_official"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:shadow-lg"
                aria-label="Instagram"
              >
                <svg
                  className="h-5 w-5 transition-transform group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.084 5.52.199 5.012.333c-.526.148-.91.312-1.31.712-.4.4-.564.784-.712 1.31-.134.508-.249 1.082-.285 2.03C2.671 7.007 2.658 7.414 2.658 11.035s.013 4.028.048 4.976c.036.948.151 1.522.285 2.03.148.526.312.91.712 1.31.4.4.784.564 1.31.712.508.134 1.082.249 2.03.285.948.035 1.355.048 4.976.048s4.028-.013 4.976-.048c.948-.036 1.522-.151 2.03-.285.526-.148.91-.312 1.31-.712.4-.4.564-.784.712-1.31.134-.508.249-1.082.285-2.03.035-.948.048-1.355.048-4.976s-.013-4.028-.048-4.976c-.036-.948-.151-1.522-.285-2.03-.148-.526-.312-.91-.712-1.31-.4-.4-.784-.564-1.31-.712-.508-.134-1.082-.249-2.03-.285C16.045.013 15.638 0 12.017 0zm0 2.158c3.556 0 3.98.018 5.386.092.824.037 1.272.171 1.571.284.394.153.676.337.973.633.296.297.48.578.633.973.113.299.247.747.284 1.571.074 1.406.092 1.83.092 5.386s-.018 3.98-.092 5.386c-.037.824-.171 1.272-.284 1.571-.153.394-.337.676-.633.973-.297.296-.578.48-.973.633-.299.113-.747.247-1.571.284-1.406.074-1.83.092-5.386.092s-3.98-.018-5.386-.092c-.824-.037-1.272-.171-1.571-.284-.394-.153-.676-.337-.973-.633-.296-.297-.48-.578-.633-.973-.113-.299-.247-.747-.284-1.571-.074-1.406-.092-1.83-.092-5.386s.018-3.98.092-5.386c.037-.824.171-1.272.284-1.571.153-.394.337-.676.633-.973.297-.296.578-.48.973-.633.299-.113.747-.247 1.571-.284 1.406-.074 1.83-.092 5.386-.092z" />
                  <path d="M12.017 5.838a5.197 5.197 0 1 0 0 10.394 5.197 5.197 0 0 0 0-10.394zM12.017 15.47a3.313 3.313 0 1 1 0-6.626 3.313 3.313 0 0 1 0 6.626z" />
                  <circle cx="18.407" cy="5.593" r="1.217" />
                </svg>
              </a>

              <a
                href="https://youtube.com/@ivotech"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-red-600 hover:text-white hover:shadow-lg"
                aria-label="YouTube"
              >
                <svg
                  className="h-5 w-5 transition-transform group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#services"
                  className="text-gray-400 transition-colors hover:text-blue-400"
                >
                  🌐 Webentwicklung
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 transition-colors hover:text-blue-400"
                >
                  🏠 Heimserver-Setup
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 transition-colors hover:text-blue-400"
                >
                  💡 IT-Beratung
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 transition-colors hover:text-blue-400"
                >
                  🤖 Automatisierung
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Kontakt</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-gray-400">
                <span className="mr-2">📧</span>
                <a
                  href="mailto:kontakt@ivo-tech.com"
                  className="transition-colors hover:text-green-400"
                >
                  kontakt@ivo-tech.com
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <span className="mr-2">📱</span>
                <a
                  href="tel:+4917612345678"
                  className="transition-colors hover:text-green-400"
                >
                  +49 176 12345678
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <span className="mr-2">💬</span>
                <a
                  href="https://wa.me/4917612345678"
                  className="transition-colors hover:text-green-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Support
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <span className="mr-2">🌍</span>
                <span>München, Deutschland</span>
              </li>
              <li className="flex items-center text-gray-400">
                <span className="mr-2">⏰</span>
                <span>Mo-Fr: 9:00-18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="font-mono text-xs text-gray-400">
              © 2024 IVO-TECH. Made with ❤️ and ☕ in Germany
            </div>
            <div className="flex space-x-6 text-xs text-gray-400">
              <a
                href="/impressum"
                className="transition-colors hover:text-white"
              >
                Impressum
              </a>
              <a
                href="/datenschutz"
                className="transition-colors hover:text-white"
              >
                Datenschutz
              </a>
              <a href="/agb" className="transition-colors hover:text-white">
                AGB
              </a>
            </div>
          </div>

          {/* Tech Stack Info */}
          <div className="mt-4 text-center font-mono text-xs text-gray-500">
            Built with Next.js • TypeScript • Tailwind CSS • Hosted on Vercel
          </div>
        </div>
      </div>
    </footer>
  );
}
