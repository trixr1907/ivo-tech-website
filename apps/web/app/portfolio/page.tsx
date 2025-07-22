'use client';

import React, { useState } from 'react';
import { NavigationHeader } from '../../components/ui/NavigationHeader';
import { Footer } from '../../components/ui/Footer';
import { LoginModal } from '../../components/ui/LoginModal';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  imageUrl?: string;
  demoUrl?: string;
  codeUrl?: string;
  completed: string;
  client?: string;
}

const portfolioData: PortfolioItem[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description:
      'Vollständige E-Commerce-Lösung mit Next.js, TypeScript und Stripe-Integration. Moderne UI/UX mit responsivem Design.',
    category: 'Web Development',
    technologies: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Stripe',
      'PostgreSQL',
    ],
    demoUrl: 'https://demo-ecommerce.ivo-tech.com',
    codeUrl: 'https://github.com/ivotech/ecommerce-platform',
    completed: 'Q4 2024',
    client: 'TechStore GmbH',
  },
  {
    id: 2,
    title: 'Heimserver Dashboard',
    description:
      'Monitoring-Dashboard für Heimserver mit Docker-Container-Management, System-Metriken und automatisierten Backups.',
    category: 'DevOps',
    technologies: ['React', 'Docker', 'Grafana', 'Prometheus', 'Node.js'],
    demoUrl: 'https://homelab.ivo-tech.com',
    completed: 'Q3 2024',
    client: 'Private Kunden',
  },
  {
    id: 3,
    title: '3D-Druck Konfigurator',
    description:
      'Interaktive Web-Anwendung für 3D-Druck-Aufträge mit Live-Kostenkalkulation und STL-File-Viewer.',
    category: '3D Printing',
    technologies: ['Three.js', 'React', 'WebGL', 'Node.js', 'Express'],
    demoUrl: 'https://3d-config.ivo-tech.com',
    completed: 'Q2 2024',
    client: 'MakerSpace Munich',
  },
  {
    id: 4,
    title: 'API Gateway',
    description:
      'Mikroservice-basierte API-Gateway-Lösung mit Authentifizierung, Rate Limiting und umfangreicher Dokumentation.',
    category: 'Backend',
    technologies: ['Node.js', 'Express', 'Redis', 'JWT', 'OpenAPI'],
    codeUrl: 'https://github.com/ivotech/api-gateway',
    completed: 'Q1 2024',
    client: 'StartUp AG',
  },
  {
    id: 5,
    title: 'Crypto Portfolio Tracker',
    description:
      'Real-time Kryptowährungs-Portfolio-Tracker mit Live-Preisen, P&L-Tracking und Portfolio-Analyse.',
    category: 'FinTech',
    technologies: ['React', 'Chart.js', 'WebSocket', 'CoinGecko API'],
    demoUrl: 'https://crypto-tracker.ivo-tech.com',
    completed: 'Q4 2023',
    client: 'CryptoInvest Ltd.',
  },
  {
    id: 6,
    title: 'IoT Sensor Dashboard',
    description:
      'IoT-Dashboard für Sensor-Datenvisualisierung mit MQTT-Integration und historischer Datenanalyse.',
    category: 'IoT',
    technologies: ['Vue.js', 'MQTT', 'InfluxDB', 'Grafana', 'Raspberry Pi'],
    completed: 'Q3 2023',
    client: 'SmartHome Solutions',
  },
];

const categories = [
  'Alle',
  'Web Development',
  'DevOps',
  '3D Printing',
  'Backend',
  'FinTech',
  'IoT',
];

export default function Portfolio() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Alle');

  const filteredProjects =
    activeCategory === 'Alle'
      ? portfolioData
      : portfolioData.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavigationHeader onLoginClick={() => setIsLoginOpen(true)} />

      <main className="pb-12 pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-5xl font-bold text-transparent">
              Portfolio & Referenzen
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-300">
              Entdecken Sie unsere erfolgreich realisierten Projekte - von
              modernen Webanwendungen bis hin zu innovativen IoT-Lösungen und
              3D-Druck-Anwendungen.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-300">
                50+ Projekte
              </span>
              <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-medium text-green-300">
                100% Kundenzufriedenheit
              </span>
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm font-medium text-purple-300">
                Seit 2020
              </span>
            </div>
          </div>
        </section>

        {/* Filter Buttons */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-6 py-2 font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map(project => (
                <div
                  key={project.id}
                  className="group rounded-xl border border-gray-700/50 bg-gray-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:transform hover:border-blue-500/50 hover:shadow-2xl"
                >
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="inline-block rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
                      {project.category}
                    </span>
                  </div>

                  {/* Project Title */}
                  <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-blue-300">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 line-clamp-3 text-sm text-gray-400">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map(tech => (
                        <span
                          key={tech}
                          className="rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="rounded-md bg-gray-600 px-2 py-1 text-xs font-medium text-gray-400">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="mb-4 space-y-1 text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>Abgeschlossen:</span>
                      <span className="text-gray-400">{project.completed}</span>
                    </div>
                    {project.client && (
                      <div className="flex justify-between">
                        <span>Kunde:</span>
                        <span className="text-gray-400">{project.client}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 border-t border-gray-700/50 pt-4">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:from-blue-600 hover:to-blue-700"
                      >
                        <span className="flex items-center justify-center gap-1">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Demo
                        </span>
                      </a>
                    )}
                    {project.codeUrl && (
                      <a
                        href={project.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-lg bg-gray-700 px-3 py-2 text-center text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
                      >
                        <span className="flex items-center justify-center gap-1">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.316 3.051a1 1 0 01.633 1.265L11.096 9.5h2.654a1 1 0 01.78 1.625l-6 7.5a1 1 0 01-1.78-.625L8.654 11.5H6a1 1 0 01-.78-1.625l6-7.5a1 1 0 011.096-.324z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Code
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Ihr Projekt ist der nächste Erfolg
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-300">
              Lassen Sie uns gemeinsam Ihre Vision verwirklichen. Von der
              Konzeption bis zur Umsetzung - wir sind Ihr Partner für innovative
              Technologielösungen.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:kontakt@ivo-tech.com"
                className="transform rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-blue-600 hover:to-purple-600"
              >
                Projekt besprechen
              </a>
              <a
                href="#contact"
                className="rounded-lg border-2 border-gray-600 px-8 py-4 font-semibold text-gray-300 transition-all hover:border-blue-500 hover:text-white"
              >
                Kostenlos beraten lassen
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
