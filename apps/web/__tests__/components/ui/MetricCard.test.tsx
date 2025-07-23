import React from 'react';
import { render, screen } from '@testing-library/react';
import { MetricCard } from '../../../components/ui/MetricCard';

// Mock der Heroicons
jest.mock('@heroicons/react/solid', () => ({
  TrendingUpIcon: () => <div data-testid="trending-up-icon" />,
  TrendingDownIcon: () => <div data-testid="trending-down-icon" />,
  MinusIcon: () => <div data-testid="minus-icon" />,
}));

describe('MetricCard', () => {
  it('should render basic metric information', () => {
    render(
      <MetricCard
        title="Test Metric"
        value="100ms"
      />
    );

    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('100ms')).toBeInTheDocument();
  });

  it('should render positive trend correctly', () => {
    render(
      <MetricCard
        title="Test Metric"
        value="100ms"
        trend="positive"
      />
    );

    expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument();
    expect(screen.getByText('positive')).toBeInTheDocument();
  });

  it('should render negative trend correctly', () => {
    render(
      <MetricCard
        title="Test Metric"
        value="100ms"
        trend="negative"
      />
    );

    expect(screen.getByTestId('trending-down-icon')).toBeInTheDocument();
    expect(screen.getByText('negative')).toBeInTheDocument();
  });

  it('should render stable trend correctly', () => {
    render(
      <MetricCard
        title="Test Metric"
        value="100ms"
        trend="stable"
      />
    );

    expect(screen.getByTestId('minus-icon')).toBeInTheDocument();
    expect(screen.getByText('stable')).toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(
      <MetricCard
        title="Test Metric"
        value="100ms"
        description="Test Description"
      />
    );

    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render footer when provided', () => {
    render(
      <MetricCard
        title="Test Metric"
        value="100ms"
        footer="Test Footer"
      />
    );

    expect(screen.getByText('Test Footer')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MetricCard
        title="Test Metric"
        value="100ms"
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
