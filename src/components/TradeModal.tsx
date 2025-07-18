import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { securityLogger } from "@/features/security/SecurityLogger";

const tradeSchema = z.object({
  date: z.string().min(1, "Date is required"),
  pair: z.string().min(1, "Trading pair is required").regex(/^[A-Z]{3}\/[A-Z]{3}$/, "Invalid pair format (e.g., EUR/USD)"),
  entry_price: z.string().min(1, "Entry price is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a positive number"),
  exit_price: z.string().min(1, "Exit price is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a positive number"),
  position_size: z.string().min(1, "Position size is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a positive number"),
  risk: z.string().min(1, "Risk is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a positive number"),
  reward: z.string().min(1, "Reward is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a positive number"),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

type TradeFormData = z.infer<typeof tradeSchema>;

interface TradeModalProps {
  trigger?: React.ReactNode;
}

export const TradeModal = ({ trigger }: TradeModalProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<TradeFormData>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      pair: "",
      entry_price: "",
      exit_price: "",
      position_size: "",
      risk: "",
      reward: "",
      notes: "",
    },
  });

  const addTradeMutation = useMutation({
    mutationFn: async (data: TradeFormData) => {
      const entryPrice = parseFloat(data.entry_price);
      const exitPrice = parseFloat(data.exit_price);
      const positionSize = parseFloat(data.position_size);
      const risk = parseFloat(data.risk);
      const reward = parseFloat(data.reward);
      
      const pnl = (exitPrice - entryPrice) * positionSize;
      const rr = Math.abs(reward / risk);

      const { error } = await supabase.from("trades").insert({
        user_id: user?.id,
        date: data.date,
        pair: data.pair,
        entry_price: entryPrice,
        exit_price: exitPrice,
        position_size: positionSize,
        risk: risk,
        reward: reward,
        pnl: pnl,
        rr: rr,
        notes: data.notes || null,
      });

      if (error) throw error;
      
      // Log security event
      await securityLogger.logTradeAction(user?.id!, 'created');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
      toast({
        title: "Trade added successfully",
        description: "Your trade has been saved to the journal.",
      });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error adding trade",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TradeFormData) => {
    addTradeMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Trade
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Trade</DialogTitle>
          <DialogDescription>
            Record your trading activity and track your performance.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pair"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trading Pair</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., EUR/USD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="entry_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="1.2345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="exit_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exit Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="1.2400" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="position_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position Size</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="risk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reward ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any notes about this trade..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addTradeMutation.isPending}>
                {addTradeMutation.isPending ? "Adding..." : "Add Trade"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};