import { useAuth } from "@/context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";
import { TrendingUp, BarChart3, PieChart, Target, Shield, Zap } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">JournalIQ</span>
          </div>
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-16 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Track Your Trading Journey
            <span className="block text-primary">With Intelligence</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            JournalIQ helps traders analyze patterns, improve strategies, and build consistent profitability through intelligent trade journaling.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Features */}
          <div className="space-y-8">
            <div className="grid gap-6">
              <div className="flex items-start space-x-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Advanced Analytics</h3>
                  <p className="text-muted-foreground">
                    Get deep insights into your trading performance with comprehensive metrics and visualizations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Pattern Recognition</h3>
                  <p className="text-muted-foreground">
                    Identify winning patterns and avoid costly mistakes with AI-powered trade analysis.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <PieChart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Portfolio Tracking</h3>
                  <p className="text-muted-foreground">
                    Monitor your portfolio performance and risk metrics in real-time.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure & Private</h3>
                  <p className="text-muted-foreground">
                    Your trading data is encrypted and protected with enterprise-grade security.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div className="flex justify-center">
            <AuthForm />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Trades Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Active Traders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="font-semibold">JournalIQ</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} JournalIQ. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
