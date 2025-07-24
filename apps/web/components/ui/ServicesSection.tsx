import React from 'react';
import { motion } from 'framer-motion';

interface Service {
  title: string;
  icon: string;
  description: string;
  features: string[];
  price: string;
  primaryColor: string;
  secondaryColor: string;
}

const services: Service[] = [
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
    primaryColor: 'blue',
    secondaryColor: 'purple',
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
    primaryColor: 'green',
    secondaryColor: 'teal',
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
    primaryColor: 'yellow',
    secondaryColor: 'orange',
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
    primaryColor: 'purple',
    secondaryColor: 'pink',
  },
];

export const ServicesSection: React.FC = () => {
  const [hoveredService, setHoveredService] = React.useState<string | null>(null);
  return (
    <section id="services" className="py-20 text-center bg-gray-900/50 backdrop-blur-sm">
      <motion.div 
        className="mb-4 font-mono text-sm text-cyan-400 inline-block"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        $ systemctl status services
      </motion.div>
      <motion.h2 
        className="mb-8 text-3xl font-bold text-white md:text-4xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Unsere{' '}
        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Services
        </span>
      </motion.h2>
      <motion.p 
        className="mx-auto mb-16 max-w-2xl text-lg text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        Von der Idee bis zur fertigen Lösung - wir unterstützen Sie bei Ihren
        IT-Projekten mit innovativen Lösungen und zukunftssicheren Technologien.
      </motion.p>

      <motion.div 
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            className={`group rounded-lg border p-8 transition-all relative overflow-hidden
              ${hoveredService === service.title
                ? `border-${service.primaryColor}-500 bg-${service.primaryColor}-500/10 shadow-lg shadow-${service.primaryColor}-500/20`
                : 'border-gray-700 bg-gray-800/30'}`
            }
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.5 }}
            onMouseEnter={() => setHoveredService(service.title)}
            onMouseLeave={() => setHoveredService(null)}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="mb-6 text-5xl relative z-10"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              {service.icon}
            </motion.div>

            <motion.h3 
              className="mb-4 text-2xl font-bold text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {service.title}
            </motion.h3>
            <motion.p 
              className="mb-6 text-gray-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {service.description}
            </motion.p>

            <motion.ul 
              className="mb-6 space-y-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {service.features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-center text-sm text-gray-400"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <span className={`mr-2 text-${service.primaryColor}-500`}>✓</span>
                  {feature}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div 
              className="mt-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className={`mb-4 font-mono text-lg font-semibold text-${service.primaryColor}-400`}>
                {service.price}
              </div>
              <motion.button 
                className={`w-full rounded-lg bg-gradient-to-r from-${service.primaryColor}-600 to-${service.secondaryColor}-600 
                  px-6 py-3 font-semibold transition-all hover:from-${service.primaryColor}-700 hover:to-${service.secondaryColor}-700 hover:shadow-lg`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Anfrage stellen
              </motion.button>
            </motion.div>
            
            {/* Decorative background */}
            <div 
              className={`absolute inset-0 opacity-10 transition-opacity duration-300 ${hoveredService === service.title ? 'opacity-20' : ''}`}
              style={{
                background: `radial-gradient(circle at 50% 50%, ${service.primaryColor}, transparent)`,
                filter: 'blur(40px)'
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Additional Info */}
      <motion.div 
        className="mt-16 rounded-lg bg-gray-800/20 p-6 font-mono text-sm text-gray-400 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      >
        <div className="mb-2 text-blue-400">
          💡 Kostenlose Erstberatung (30 Min.)
        </div>
        <div className="mb-2 text-green-400">
          🔧 Wartung und Support verfügbar
        </div>
        <div className="text-purple-400">
          ⚡ Schnelle Umsetzung - meist innerhalb weniger Wochen
        </div>
      </motion.div>
    </section>
  );
}
