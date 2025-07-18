"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';

type RiskScoreCardProps = {
  score: number | null;
  isLoading: boolean;
};

export function RiskScoreCard({ score, isLoading }: RiskScoreCardProps) {
  const percentageScore = score !== null ? score * 100 : 0;
  const displayScore = percentageScore.toFixed(2);
  const sliderValue = Math.round(percentageScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Score</CardTitle>
        <CardDescription>
          Probability of the transaction being fraudulent.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-6 flex flex-col items-center pt-2">
            <div className="w-full">
              <Slider
                value={[0]}
                max={100}
                step={1}
                disabled
                className="[&>span:first-child]:bg-transparent"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
            <Skeleton className="h-10 w-20" />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 pt-2">
            <div className="w-full">
              <Slider
                value={[sliderValue]}
                max={100}
                step={1}
                disabled
                className="[&>span:first-child]:bg-transparent"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
            {score !== null ? (
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-foreground">{displayScore}</span>
                  <span className="text-xl font-medium text-muted-foreground">%</span>
                </div>
            ) : (
                <span className="text-4xl font-bold text-muted-foreground">--</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}