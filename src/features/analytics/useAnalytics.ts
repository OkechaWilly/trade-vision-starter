import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

interface Trade {
  id: string;
  date: string;
  pair: string;
  entry_price: number;
  exit_price: number;
  position_size: number;
  pnl: number;
  rr: number;
  risk: number;
  reward: number;
  notes?: string;
  created_at: string;
}

interface AnalyticsData {
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  maxDrawdown: number;
  bestTrade: number;
  worstTrade: number;
  activeDays: number;
  averageRR: number;
  sharpeRatio: number;
  monthlyReturns: { month: string; pnl: number }[];
  tradingPairs: { pair: string; count: number; pnl: number }[];
}

export const useAnalytics = (dateRange?: { from: Date; to: Date }) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["analytics", user?.id, dateRange],
    queryFn: async (): Promise<AnalyticsData> => {
      let query = supabase
        .from("trades")
        .select("*")
        .eq("user_id", user?.id);

      if (dateRange) {
        query = query
          .gte("date", dateRange.from.toISOString())
          .lte("date", dateRange.to.toISOString());
      }

      const { data: trades, error } = await query;

      if (error) throw error;

      const typedTrades = trades as Trade[];

      // Basic metrics
      const totalTrades = typedTrades.length;
      const winningTrades = typedTrades.filter(t => t.pnl > 0);
      const losingTrades = typedTrades.filter(t => t.pnl < 0);
      
      const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
      const totalPnL = typedTrades.reduce((sum, t) => sum + t.pnl, 0);
      
      const averageWin = winningTrades.length > 0 
        ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length 
        : 0;
      
      const averageLoss = losingTrades.length > 0
        ? Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length)
        : 0;

      const totalWins = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
      const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
      
      const profitFactor = totalLosses > 0 ? totalWins / totalLosses : 
        (totalWins > 0 ? Infinity : 0);

      // Advanced metrics
      const bestTrade = typedTrades.length > 0 ? Math.max(...typedTrades.map(t => t.pnl)) : 0;
      const worstTrade = typedTrades.length > 0 ? Math.min(...typedTrades.map(t => t.pnl)) : 0;
      
      const activeDays = new Set(typedTrades.map(t => t.date.split('T')[0])).size;
      
      const averageRR = typedTrades.length > 0 
        ? typedTrades.reduce((sum, t) => sum + t.rr, 0) / typedTrades.length 
        : 0;

      // Calculate max drawdown
      let runningPnL = 0;
      let peak = 0;
      let maxDrawdown = 0;
      
      typedTrades
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .forEach(trade => {
          runningPnL += trade.pnl;
          if (runningPnL > peak) {
            peak = runningPnL;
          }
          const drawdown = peak - runningPnL;
          if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
          }
        });

      // Monthly returns
      const monthlyData = new Map<string, number>();
      typedTrades.forEach(trade => {
        const month = new Date(trade.date).toISOString().slice(0, 7);
        monthlyData.set(month, (monthlyData.get(month) || 0) + trade.pnl);
      });
      
      const monthlyReturns = Array.from(monthlyData.entries()).map(([month, pnl]) => ({
        month,
        pnl
      }));

      // Trading pairs analysis
      const pairData = new Map<string, { count: number; pnl: number }>();
      typedTrades.forEach(trade => {
        const current = pairData.get(trade.pair) || { count: 0, pnl: 0 };
        pairData.set(trade.pair, {
          count: current.count + 1,
          pnl: current.pnl + trade.pnl
        });
      });
      
      const tradingPairs = Array.from(pairData.entries()).map(([pair, data]) => ({
        pair,
        count: data.count,
        pnl: data.pnl
      }));

      // Simple Sharpe ratio approximation
      const returns = monthlyReturns.map(m => m.pnl);
      const avgReturn = returns.length > 0 ? returns.reduce((sum, r) => sum + r, 0) / returns.length : 0;
      const variance = returns.length > 1 
        ? returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (returns.length - 1)
        : 0;
      const stdDev = Math.sqrt(variance);
      const sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0;

      return {
        totalTrades,
        winRate,
        totalPnL,
        averageWin,
        averageLoss,
        profitFactor,
        maxDrawdown,
        bestTrade,
        worstTrade,
        activeDays,
        averageRR,
        sharpeRatio,
        monthlyReturns,
        tradingPairs
      };
    },
    enabled: !!user?.id,
  });
};