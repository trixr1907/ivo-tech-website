import React from 'react';

const technologies = [
  { name: 'React', icon: '⚛️', description: 'Moderne UI-Bibliothek' },
  { name: 'Next.js', icon: '▲', description: 'React Framework' },
  { name: 'TypeScript', icon: '📘', description: 'Typisiertes JavaScript' },
  { name: 'Tailwind CSS', icon: '🎨', description: 'Utility-First CSS' },
  { name: 'Node.js', icon: '🟢', description: 'Server-side JavaScript' },
  { name: 'Python', icon: '🐍', description: 'Vielseitige Programmiersprache' },
];

export function TechShowcase() {
  return (
    <div className="text-center">
      <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">
        Technologien
      </h2>
      <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-300">
        Ich arbeite mit modernen Technologien und Tools, um leistungsstarke und
        skalierbare Anwendungen zu entwickeln.
      </p>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
        {technologies.map((tech, index) => (
          <div
            key={index}
            className="group rounded-lg border border-gray-700 bg-gray-800/30 p-6 transition-colors hover:border-blue-500"
          >
            <div className="mb-4 text-4xl transition-transform group-hover:scale-110">
              {tech.icon}
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              {tech.name}
            </h3>
            <p className="text-sm text-gray-400">{tech.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
