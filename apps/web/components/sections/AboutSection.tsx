'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { OptimizedImage } from '../../lib/image/OptimizedImage';

interface AboutSectionProps {
  title?: string;
  content?: string;
  imageSrc?: string;
  stats?: Array<{
    label: string;
    value: string;
    description?: string;
    icon?: React.ReactNode;
  }>;
  team?: Array<{
    name: string;
    role: string;
    description?: string;
    image: string;
  }>;
}

export function AboutSection({
  title = 'Technologie neu gedacht',
  content = 'Bei IVO-TECH verbinden wir innovative Technologien mit kreativen Lösungen. Als dynamisches Tech-Unternehmen entwickeln wir zukunftsweisende Softwarelösungen, die unseren Kunden echten Mehrwert bieten.',
  imageSrc = '/images/about-tech.jpg',
  stats = [
    {
      label: 'Erfolgreich abgeschlossene Projekte',
      value: '50+',
      description: 'Von Web-Apps bis KI-Lösungen',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
      ),
    },
    {
      label: 'Zufriedene Kunden',
      value: '30+',
      description: 'Vom Startup bis zum Konzern',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
    },
    {
      label: 'Technologien & Tools',
      value: '20+',
      description: 'Modernste Tech-Stack',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
  ],
  team = [
    {
      name: 'Ivo R.',
      role: 'Gründer & Technischer Leiter',
      description: 'Experte für KI, Web3 und innovative Technologien',
      image: '/images/team/ivo.jpg',
    },
    // Weitere Team-Mitglieder hier...
  ],
}: AboutSectionProps) {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gray-900 py-20 text-white"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-gray-900 to-purple-900/40 mix-blend-multiply" />

      <div className="container relative mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">{content}</p>
        </motion.div>

        {/* Stats */}
        <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative overflow-hidden rounded-2xl bg-gray-800/50 p-6 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-3 text-white">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </div>
                {stat.description && (
                  <div className="mt-2 text-sm text-gray-400 transition-opacity duration-300 group-hover:text-gray-300">
                    {stat.description}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Team */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative overflow-hidden rounded-2xl bg-gray-800/50 p-6 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <OptimizedImage
                  src={member.image}
                  alt={member.name}
                  width={300}
                  height={300}
                  className="mx-auto mb-4 rounded-full"
                  priority={index === 0}
                />
                <h3 className="text-center text-xl font-semibold text-white">
                  {member.name}
                </h3>
                <p className="text-center text-sm text-gray-400">
                  {member.role}
                </p>
                {member.description && (
                  <p className="mt-3 text-center text-sm text-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {member.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
