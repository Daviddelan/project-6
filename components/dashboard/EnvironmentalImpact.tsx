'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Droplet, Wind, Car } from 'lucide-react';
import type { EnvironmentalImpact as ImpactType } from '@/lib/types';
import { useCallback } from 'react';

interface EnvironmentalImpactProps {
  impact: ImpactType;
  onChangeAction?: (impact: ImpactType) => Promise<void>;
}

export function EnvironmentalImpact({ impact, onChangeAction }: EnvironmentalImpactProps) {
  const handleChange = useCallback(async (newImpact: ImpactType) => {
    if (onChangeAction) {
      await onChangeAction(newImpact);
    }
  }, [onChangeAction]);

  const metrics = [
    {
      label: 'Carbon Offset',
      value: `${impact.carbonOffset.toFixed(2)} kg`,
      icon: Leaf,
      description: 'CO₂ emissions prevented',
    },
    {
      label: 'Fuel Savings',
      value: `${impact.fuelSavings.toFixed(1)} L`,
      icon: Droplet,
      description: 'Fuel consumption reduced',
    },
    {
      label: 'Traffic Reduction',
      value: `${impact.trafficReduction.toFixed(1)}%`,
      icon: Car,
      description: 'Less congestion on roads',
    },
    {
      label: 'Carbon Emissions',
      value: `${impact.carbonEmissions.toFixed(2)} kg`,
      icon: Wind,
      description: 'Total CO₂ emissions',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environmental Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col items-center p-4 bg-muted/50 rounded-lg"
            >
              <metric.icon className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">{metric.label}</h3>
              <p className="text-2xl font-bold text-primary">{metric.value}</p>
              <p className="text-sm text-muted-foreground text-center">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}