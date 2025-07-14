import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { TradeModal } from "@/components/TradeModal";
import { format } from "date-fns";

interface Trade {
  id: string;
  date: string;
  pair: string;
  entry_price: number;
  exit_price: number;
  position_size: number;
  pnl: number;
  rr: number;
  notes?: string;
}

const Trades = () => {
  const { user } = useAuth();

  const { data: trades = [], isLoading } = useQuery({
    queryKey: ["trades", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("user_id", user?.id)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Trade[];
    },
    enabled: !!user?.id,
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Trades</h1>
          <p className="text-muted-foreground">
            Manage and track your trading activity
          </p>
        </div>
        <TradeModal />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Trades</CardTitle>
          <CardDescription>
            A complete list of your trading transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading trades...</p>
            </div>
          ) : trades.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No trades yet</h3>
              <p className="text-muted-foreground mb-4">
                Start tracking your trades by adding your first transaction
              </p>
              <TradeModal trigger={
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  Add Your First Trade
                </button>
              } />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Pair</TableHead>
                  <TableHead>Entry</TableHead>
                  <TableHead>Exit</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>P&L</TableHead>
                  <TableHead>R:R</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>{format(new Date(trade.date), "MMM dd, yyyy")}</TableCell>
                    <TableCell className="font-medium">{trade.pair}</TableCell>
                    <TableCell>{trade.entry_price.toFixed(4)}</TableCell>
                    <TableCell>{trade.exit_price.toFixed(4)}</TableCell>
                    <TableCell>{trade.position_size.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={trade.pnl >= 0 ? "default" : "destructive"}>
                        ${trade.pnl.toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell>{trade.rr.toFixed(2)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {trade.notes || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Trades;