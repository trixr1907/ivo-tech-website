import React from 'react';

const services = [
  {
    title: 'Webentwicklung',
    icon: '🌐',
    description:
      'Moderne Websites und Web-Apps mit React, Next.js und TypeScript',
    features: [
      'Responsive Design',
      'SEO-Optimiert',
      'Performance-Fokus',
      'Mobile-First',
    ],
    price: 'Ab 1.299€',
  },
  {
    title: 'Heimserver-Setup',
    icon: '🏠',
    description: 'Proxmox, Docker, Selfhosting-Lösungen für dein Zuhause',
    features: [
      'Proxmox Installation',
      'Docker Services',
      'Backup-Systeme',
      'Monitoring',
    ],
    price: 'Ab 399€',
  },
  {
    title: 'IT-Beratung',
    icon: '💡',
    description: 'Strategische Beratung für deine IT-Infrastruktur',
    features: [
      'System-Analyse',
      'Sicherheits-Audit',
      'Automatisierung',
      'Schulungen',
    ],
    price: '95€/h',
  },
  {
    title: 'Automatisierung',
    icon: '🤖',
    description: 'Scripts und Tools zur Prozess-Automatisierung',
    features: [
      'Python Scripts',
      'CI/CD Pipelines',
      'Task Scheduling',
      'API Integration',
    ],
    price: 'Ab 249€',
  },
];

export function ServicesSection() {
  return (
    <div id="services" className="text-center">
      <div className="mb-4 font-mono text-sm text-cyan-400">
        $ systemctl status services
      </div>
      <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">
        Meine{' '}
        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Services
        </span>
      </h2>
      <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-300">
        Von der Idee bis zur fertigen Lösung - ich unterstütze dich bei deinen
        IT-Projekten
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
        {services.map((service, index) => (
          <div
            key={index}
            className="group rounded-lg border border-gray-700 bg-gray-800/30 p-8 transition-all hover:border-blue-500 hover:bg-gray-800/50 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <div className="mb-6 text-5xl transition-transform group-hover:scale-110">
              {service.icon}
            </div>

            <h3 className="mb-4 text-2xl font-bold text-white">
              {service.title}
            </h3>
            <p className="mb-6 text-gray-300">{service.description}</p>

            <ul className="mb-6 space-y-2">
              {service.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center text-sm text-gray-400"
                >
                  <span className="mr-2 text-green-500">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <div className="mb-4 font-mono text-lg font-semibold text-purple-400">
                {service.price}
              </div>
              <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg">
                Anfrage stellen
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-12 rounded-lg bg-gray-800/20 p-6 font-mono text-sm text-gray-400">
        <div className="mb-2 text-blue-400">
          💡 Kostenlose Erstberatung (30 Min.)
        </div>
        <div className="mb-2 text-green-400">
          🔧 Wartung und Support verfügbar
        </div>
        <div className="text-purple-400">
          ⚡ Schnelle Umsetzung - meist innerhalb weniger Wochen
        </div>
      </div>
    </div>
  );
}
