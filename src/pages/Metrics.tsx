import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, BarChart3 } from "lucide-react";

const Metrics = () => {
  // Placeholder data - will be replaced with Supabase aggregated data
  const metrics = {
    totalTrades: 0,
    winRate: 0,
    totalPnL: 0,
    averageWin: 0,
    averageLoss: 0,
    profitFactor: 0,
    maxDrawdown: 0,
    activeDays: 0,
  };

  const metricCards = [
    {
      title: "Total Trades",
      value: metrics.totalTrades.toString(),
      description: "All time",
      icon: BarChart3,
      change: null,
    },
    {
      title: "Win Rate",
      value: `${metrics.winRate}%`,
      description: "Success percentage",
      icon: Target,
      change: null,
    },
    {
      title: "Total P&L",
      value: `$${metrics.totalPnL.toFixed(2)}`,
      description: "Net profit/loss",
      icon: DollarSign,
      change: metrics.totalPnL >= 0 ? "positive" : "negative",
    },
    {
      title: "Average Win",
      value: `$${metrics.averageWin.toFixed(2)}`,
      description: "Per winning trade",
      icon: TrendingUp,
      change: "positive",
    },
    {
      title: "Average Loss",
      value: `$${metrics.averageLoss.toFixed(2)}`,
      description: "Per losing trade",
      icon: TrendingDown,
      change: "negative",
    },
    {
      title: "Active Days",
      value: metrics.activeDays.toString(),
      description: "Days with trades",
      icon: Calendar,
      change: null,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Trading Metrics</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of your trading performance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
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
                <span>{metrics.winRate}%</span>
              </div>
              <Progress value={metrics.winRate} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Profit Factor</span>
                <span>{metrics.profitFactor.toFixed(2)}</span>
              </div>
              <Progress value={Math.min(metrics.profitFactor * 50, 100)} className="h-2" />
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
                  ${metrics.maxDrawdown.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Profit Factor</span>
                <span className="text-sm">
                  {metrics.profitFactor.toFixed(2)}
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