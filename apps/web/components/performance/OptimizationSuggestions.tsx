'use client';

import React, { useEffect, useState } from 'react';
import { performanceOptimizationService } from '../../lib/services/performance-optimization';

interface OptimizationSuggestion {
  ruleId: string;
  ruleName: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'critical' | 'important' | 'recommended';
  suggestion: string;
  codeExample?: string;
  docs?: string;
  metrics: Record<string, number>;
}

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'typescript' }) => (
  <pre className="relative rounded bg-gray-900 p-4 font-mono text-sm text-white">
    <div className="absolute right-2 top-2 flex space-x-2">
      <button
        onClick={() => navigator.clipboard.writeText(code)}
        className="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600"
        title="Code kopieren"
      >
        📋
      </button>
    </div>
    <code className={`language-${language}`}>{code}</code>
  </pre>
);

const PriorityBadge: React.FC<{ priority: OptimizationSuggestion['priority'] }> = ({
  priority,
}) => {
  const colors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
  };

  return (
    <span
      className={`${colors[priority]} rounded-full px-2 py-1 text-xs font-medium text-white`}
    >
      {priority}
    </span>
  );
};

const MetricsTable: React.FC<{ metrics: Record<string, number> }> = ({
  metrics,
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
          >
            Metrik
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
          >
            Wert
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {Object.entries(metrics).map(([key, value]) => (
          <tr key={key}>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
              {key}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {typeof value === 'number' ? value.toFixed(2) : value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const OptimizationSuggestions: React.FC<{
  metrics: Record<string, number>;
  context: {
    environment: 'development' | 'production';
    route: string;
    timestamp: string;
    componentName?: string;
    isErrorBoundary?: boolean;
  };
}> = ({ metrics, context }) => {
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );

  useEffect(() => {
    const analyzePerfomance = async () => {
      try {
        setLoading(true);
        const results = await performanceOptimizationService.analyzePerfomance(
          metrics as any,
          context
        );
        setSuggestions(results);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Fehler bei der Analyse'
        );
      } finally {
        setLoading(false);
      }
    };

    analyzePerfomance();
  }, [metrics, context]);

  const handleCreatePR = async (suggestion: OptimizationSuggestion) => {
    try {
      const prContent = await performanceOptimizationService.generateOptimizationPR(
        suggestion
      );
      // TODO: Integration mit GitHub API
      console.log('PR Content:', prContent);
    } catch (err) {
      console.error('Fehler beim Erstellen des PRs:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
        Keine Optimierungsvorschläge notwendig. Alle Metriken sind im grünen Bereich!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">
        Optimierungsvorschläge ({suggestions.length})
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.ruleId}
            className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="border-b p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">{suggestion.ruleName}</h3>
                <PriorityBadge priority={suggestion.priority} />
              </div>
              <p className="text-sm text-gray-600">{suggestion.description}</p>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <h4 className="mb-2 font-medium">Vorschlag</h4>
                <p className="text-sm text-gray-600">{suggestion.suggestion}</p>
              </div>

              {suggestion.codeExample && (
                <div className="mb-4">
                  <h4 className="mb-2 font-medium">Code-Beispiel</h4>
                  <CodeBlock code={suggestion.codeExample} />
                </div>
              )}

              <div className="mb-4">
                <h4 className="mb-2 font-medium">Relevante Metriken</h4>
                <MetricsTable metrics={suggestion.metrics} />
              </div>

              <div className="mt-4 flex space-x-2">
                {suggestion.docs && (
                  <a
                    href={suggestion.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    📚 Docs
                  </a>
                )}
                <button
                  onClick={() => handleCreatePR(suggestion)}
                  className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                >
                  🔄 PR erstellen
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
