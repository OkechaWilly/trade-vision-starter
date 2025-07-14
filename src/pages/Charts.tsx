import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp } from "lucide-react";
import { format } from "date-fns";

const Charts = () => {
  const { user } = useAuth();

  const { data: trades = [], isLoading } = useQuery({
    queryKey: ["trades", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trades")
        .select("pnl, date")
        .eq("user_id", user?.id)
        .order("date", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Calculate cumulative P&L
  const cumulativeData = trades.reduce((acc: any[], trade: any, index: number) => {
    const cumulative = index === 0 ? trade.pnl : acc[index - 1].cumulative + trade.pnl;
    acc.push({
      date: format(new Date(trade.date), "MMM dd"),
      pnl: cumulative,
      cumulative,
    });
    return acc;
  }, []);

  // Monthly P&L data
  const monthlyData = trades.reduce((acc: any, trade: any) => {
    const month = format(new Date(trade.date), "MMM yyyy");
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += trade.pnl;
    return acc;
  }, {});

  const monthlyChartData = Object.entries(monthlyData).map(([month, pnl]) => ({
    month,
    pnl,
  }));

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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-muted-foreground">Loading chart data...</p>
              </div>
            ) : cumulativeData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your performance chart will appear here</h3>
                <p className="text-muted-foreground">
                  Start adding trades to see your P&L progression over time
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={cumulativeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, "Cumulative P&L"]}
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
              {trades.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-muted-foreground text-center">
                    Win/Loss chart will be displayed here once you have trade data
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 h-40">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-green-600">
                      {trades.filter(t => t.pnl > 0).length}
                    </div>
                    <p className="text-sm text-muted-foreground">Winning Trades</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-red-600">
                      {trades.filter(t => t.pnl < 0).length}
                    </div>
                    <p className="text-sm text-muted-foreground">Losing Trades</p>
                  </div>
                </div>
              )}
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
              {monthlyChartData.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-muted-foreground text-center">
                    Monthly performance chart will appear here with trade data
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${Number(value).toFixed(2)}`, "Monthly P&L"]}
                    />
                    <Bar 
                      dataKey="pnl" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Charts;