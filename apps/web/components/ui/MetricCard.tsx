import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from '@heroicons/react/solid';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: 'positive' | 'negative' | 'stable' | string;
  description?: string;
  footer?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  trend,
  description,
  footer,
  className = '',
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend?.toLowerCase()) {
      case 'positive':
      case 'improving':
        return (
          <TrendingUpIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
        );
      case 'negative':
      case 'degrading':
        return (
          <TrendingDownIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
        );
      default:
        return <MinusIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />;
    }
  };

  const getTrendColor = () => {
    switch (trend?.toLowerCase()) {
      case 'positive':
      case 'improving':
        return 'bg-green-100 text-green-800';
      case 'negative':
      case 'degrading':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          {trend && (
            <Badge className={getTrendColor()}>
              <div className="flex items-center space-x-1">
                {getTrendIcon()}
                <span>{trend}</span>
              </div>
            </Badge>
          )}
        </div>
        <div className="mt-3">
          <p className="text-3xl font-semibold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
      {footer && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm text-gray-500">{footer}</div>
        </div>
      )}
    </Card>
  );
}
