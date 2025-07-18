import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, BarChart3, RefreshCw } from "lucide-react";
import { useAnalytics } from "@/features/analytics/useAnalytics";
import { AnalyticsCard } from "@/features/analytics/AnalyticsCard";
import { DateRange } from "react-day-picker";

interface Trade {
  pnl: number;
  rr: number;
  date: string;
}

const Metrics = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const dateRangeFilter = dateRange?.from && dateRange?.to 
    ? { from: dateRange.from, to: dateRange.to }
    : undefined;

  const { data: analytics, isLoading, refetch } = useAnalytics(dateRangeFilter);

  if (!analytics) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      title: "Total Trades",
      value: analytics.totalTrades,
      description: dateRange ? "In selected period" : "All time",
      icon: BarChart3,
      format: "number" as const,
    },
    {
      title: "Win Rate",
      value: analytics.winRate,
      description: "Success percentage",
      icon: Target,
      format: "percentage" as const,
    },
    {
      title: "Total P&L",
      value: analytics.totalPnL,
      description: "Net profit/loss",
      icon: DollarSign,
      format: "currency" as const,
    },
    {
      title: "Best Trade",
      value: analytics.bestTrade,
      description: "Highest single trade",
      icon: TrendingUp,
      format: "currency" as const,
    },
    {
      title: "Worst Trade",
      value: analytics.worstTrade,
      description: "Lowest single trade",
      icon: TrendingDown,
      format: "currency" as const,
    },
    {
      title: "Sharpe Ratio",
      value: analytics.sharpeRatio.toFixed(2),
      description: "Risk-adjusted return",
      icon: BarChart3,
      format: "number" as const,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Advanced Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive analysis of your trading performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DatePickerWithRange
              date={dateRange}
              onDateChange={setDateRange}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {metricCards.map((metric) => (
          <AnalyticsCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            format={metric.format}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              Key performance indicators at a glance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Win Rate</span>
                <span>{analytics.winRate.toFixed(1)}%</span>
              </div>
              <Progress value={analytics.winRate} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Profit Factor</span>
                <span>{analytics.profitFactor.toFixed(2)}</span>
              </div>
              <Progress value={Math.min(analytics.profitFactor * 50, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Metrics</CardTitle>
            <CardDescription>
              Risk management and drawdown analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Max Drawdown</span>
                <span className="text-sm text-destructive">
                  ${analytics.maxDrawdown.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Average RR</span>
                <span className="text-sm">
                  {analytics.averageRR.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Days</span>
                <span className="text-sm">
                  {analytics.activeDays}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Metrics;