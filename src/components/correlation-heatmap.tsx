
"use client";

import * as React from 'react';
import Heatmap from 'react-heatmap-grid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';

type CorrelationHeatmapProps = {
  data: number[][];
  labels: string[];
  isLoading: boolean;
};

export function CorrelationHeatmap({ data, labels, isLoading }: CorrelationHeatmapProps) {
  const cellStyle = (background: string, value: number, min: number, max: number, data: any, x: number, y: number) => ({
    background: `rgba(63, 143, 255, ${1 - (max - value) / (max - min)})`,
    fontSize: '11px',
    color: '#fff',
    border: '1px solid #eee',
    borderRadius: '4px',
    margin: '1px',
  });

  const cellRender = (value: number) => {
    return value ? <div className="text-xs">{value}</div> : null;
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
          <div className="text-xs text-muted-foreground overflow-x-auto">
            <Heatmap
              xLabels={labels}
              yLabels={labels}
              data={data}
              xLabelWidth={40}
              yLabelWidth={40}
              cellStyle={cellStyle}
              cellRender={cellRender}
              height={30}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
