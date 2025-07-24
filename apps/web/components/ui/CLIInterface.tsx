'use client';

import type { FC } from 'react';
import React from 'react';

interface CLIInterfaceProps {}

export const CLIInterface: FC = () => {
  const [commandHistory, setCommandHistory] = React.useState([
    '$ welcome to ivo-tech.com',
    '> Initializing system...',
    '> Loading components... ✓',
    '> System ready.',
  ]);

  React.useEffect(() => {
    const commands = [
      '$ npm run dev',
      '> Starting development server...',
      '> Server running on port 3000 ✓',
      '$ git status',
      '> On branch main',
      '> Your branch is up to date.',
      '$ whoami',
      '> ivo-tech-developer',
    ];

    const interval = setInterval(() => {
      if (commandHistory.length < commands.length + 4) {
        const nextIndex = commandHistory.length - 4;
        if (nextIndex < commands.length) {
          setCommandHistory(prev => [...prev, commands[nextIndex]]);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [commandHistory]);

  return (
    <div className="text-center">
      <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">
        Entwickler-Terminal
      </h2>
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-left">
          <div className="mb-4 flex items-center">
            <div className="flex space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <div className="ml-4 text-sm text-gray-400">Terminal</div>
          </div>

          <div className="space-y-2 font-mono text-sm">
            {commandHistory.map((line, index) => (
              <div
                key={index}
                className={
                  line.startsWith('$') ? 'text-green-400' : 'text-gray-300'
                }
              >
                {line}
                {index === commandHistory.length - 1 && (
                  <span className="animate-pulse">|</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-gray-400">
          Echte Entwicklungsumgebung - Live-Updates und moderne Tools
        </p>
      </div>
    </div>
  );
}
