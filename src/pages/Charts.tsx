import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const Charts = () => {
  // Placeholder data - will be replaced with actual trade data
  const chartData = [
    { date: "Jan", pnl: 0 },
    { date: "Feb", pnl: 0 },
    { date: "Mar", pnl: 0 },
    { date: "Apr", pnl: 0 },
    { date: "May", pnl: 0 },
    { date: "Jun", pnl: 0 },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Performance Charts</h1>
        <p className="text-muted-foreground">
          Visual analysis of your trading performance over time
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cumulative P&L</CardTitle>
            <CardDescription>
              Your profit and loss progression over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.every(d => d.pnl === 0) ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your performance chart will appear here</h3>
                <p className="text-muted-foreground">
                  Start adding trades to see your P&L progression over time
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, "P&L"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="pnl"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Win/Loss Distribution</CardTitle>
              <CardDescription>
                Breakdown of winning vs losing trades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground text-center">
                  Win/Loss chart will be displayed here once you have trade data
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>
                Month-over-month trading results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground text-center">
                  Monthly performance chart will appear here with trade data
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Charts;