import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Calendar, TrendingUp } from "lucide-react";

const Reports = () => {
  const reportTypes = [
    {
      title: "Monthly Summary",
      description: "Comprehensive monthly trading performance report",
      icon: Calendar,
      available: false,
    },
    {
      title: "Tax Report",
      description: "Detailed report for tax purposes with all transactions",
      icon: FileText,
      available: false,
    },
    {
      title: "Performance Analysis",
      description: "In-depth analysis of trading patterns and metrics",
      icon: TrendingUp,
      available: false,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Generate and export detailed trading reports
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.title}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                </div>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  disabled={!report.available}
                  variant={report.available ? "default" : "secondary"}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {report.available ? "Generate Report" : "Coming Soon"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Reports</CardTitle>
          <CardDescription>
            Generate custom reports based on specific date ranges and criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Reports and analysis will be generated here</h3>
            <p className="text-muted-foreground mb-4">
              Once you have trading data, you'll be able to generate custom reports with filters for date ranges, symbols, and more.
            </p>
            <Button disabled>
              <Download className="h-4 w-4 mr-2" />
              Generate Custom Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;