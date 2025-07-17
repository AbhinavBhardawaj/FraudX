
"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';

type CorrelationHeatmapProps = {
  data: number[][];
  labels: string[];
  isLoading: boolean;
};

export function CorrelationHeatmap({ data, labels, isLoading }: CorrelationHeatmapProps) {
  const getColor = (value: number) => {
    const alpha = Math.max(0, Math.min(1, value));
    return `rgba(97, 175, 239, ${alpha})`; // --primary blue with varying opacity
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Correlation Heatmap</CardTitle>
        <CardDescription>
          Shows the correlation between different transaction features.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2 pr-6">
        {isLoading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : (
          <div className="flex items-center text-xs text-muted-foreground">
            <div className="flex flex-col-reverse">
              {labels.map((label) => (
                <div key={label} className="flex h-8 items-center justify-end pr-2 font-mono text-xs">
                  {label}
                </div>
              ))}
            </div>
            <div className="flex-1">
              {data.map((row, y) => (
                <div key={`row-${y}`} className="flex">
                  {row.map((value, x) => (
                    <div
                      key={`cell-${y}-${x}`}
                      className="flex h-8 w-full items-center justify-center rounded-sm border border-transparent"
                      style={{ backgroundColor: getColor(value) }}
                      title={`${labels[y]} / ${labels[x]}: ${value.toFixed(2)}`}
                    >
                      <span className="text-white mix-blend-difference">
                        {value.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
               <div className="flex pt-1">
                {labels.map((label) => (
                  <div key={label} className="flex w-full items-center justify-center font-mono text-xs">
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
