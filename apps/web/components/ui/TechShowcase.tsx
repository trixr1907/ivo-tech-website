import React from 'react';
import { motion } from 'framer-motion';

interface Technology {
  name: string;
  icon: string;
  description: string;
  category: 'frontend' | 'backend' | '3d' | 'tools' | 'languages';
}

const technologies: Technology[] = [
  {
    name: 'React & Next.js',
    icon: '⚛️',
    description: 'Moderne UI-Entwicklung mit Server Components',
    category: 'frontend'
  },
  {
    name: 'Three.js',
    icon: '🎮',
    description: '3D-Grafik und WebGL-Implementierungen',
    category: '3d'
  },
  {
    name: 'TypeScript',
    icon: '📘',
    description: 'Type-safe JavaScript-Entwicklung',
    category: 'languages'
  },
  {
    name: 'Node.js',
    icon: '🟢',
    description: 'Server-side JavaScript und APIs',
    category: 'backend'
  },
  {
    name: 'TailwindCSS',
    icon: '🎨',
    description: 'Utility-first CSS Framework',
    category: 'frontend'
  },
  {
    name: 'WebGL',
    icon: '🌐',
    description: 'Hardware-beschleunigte Grafik',
    category: '3d'
  },
  {
    name: 'Docker',
    icon: '🐳',
    description: 'Container-Virtualisierung',
    category: 'tools'
  },
  {
    name: 'Git',
    icon: '📦',
    description: 'Versionskontrolle',
    category: 'tools'
  },
  {
    name: 'Python',
    icon: '🐍',
    description: 'Backend & Data Science',
    category: 'languages'
  }
];

export const TechShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<Technology['category'] | 'all'>('all');
  const [hoveredTech, setHoveredTech] = React.useState<string | null>(null);

  const filteredTechnologies = React.useMemo(() => {
    if (selectedCategory === 'all') return technologies;
    return technologies.filter(tech => tech.category === selectedCategory);
  }, [selectedCategory]);

  const categories = [
    { id: 'all', name: 'Alle', icon: '🔍' },
    { id: 'frontend', name: 'Frontend', icon: '🎨' },
    { id: 'backend', name: 'Backend', icon: '⚙️' },
    { id: '3d', name: '3D & WebGL', icon: '🎮' },
    { id: 'tools', name: 'Tools', icon: '🛠️' },
    { id: 'languages', name: 'Sprachen', icon: '📝' }
  ];
  return (
    <section className="py-16 px-4 bg-gray-900/50 backdrop-blur-sm text-center">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Unsere Technologien
        </motion.h2>

        <motion.p 
          className="mx-auto mb-12 max-w-2xl text-lg text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Wir arbeiten mit modernen Technologien und Tools, um innovative und
          skalierbare Anwendungen zu entwickeln.
        </motion.p>

        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map(category => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as Technology['category'] | 'all')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Tech Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredTechnologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              className={`relative p-6 rounded-xl backdrop-blur-sm transition-all ${
                hoveredTech === tech.name
                  ? 'bg-blue-500/10 border-blue-500/50'
                  : 'bg-gray-800/50 border-gray-700/50'
              } border`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredTech(tech.name)}
              onMouseLeave={() => setHoveredTech(null)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-4xl mb-4 transition-transform duration-300 transform group-hover:scale-110">
                {tech.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{tech.name}</h3>
              <p className="text-gray-400 text-sm">{tech.description}</p>
              
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-8 h-8">
                <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${
                  hoveredTech === tech.name ? 'bg-blue-500' : 'bg-gray-600'
                } transition-colors`} />
                <div className={`absolute top-0 right-2 w-6 h-0.5 ${
                  hoveredTech === tech.name ? 'bg-blue-500' : 'bg-gray-600'
                } transition-colors`} />
                <div className={`absolute top-2 right-0 w-0.5 h-6 ${
                  hoveredTech === tech.name ? 'bg-blue-500' : 'bg-gray-600'
                } transition-colors`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
