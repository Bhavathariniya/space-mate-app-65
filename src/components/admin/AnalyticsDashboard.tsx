import { useState } from "react";
import { AdminStats } from "@/hooks/usePGAdmins";
import AnalyticsHeader from "./AnalyticsHeader";
import RevenueChart from "./RevenueChart";
import SubscriptionChart from "./SubscriptionChart";
import ActivityChart from "./ActivityChart";
import GrowthChart from "./GrowthChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface AnalyticsDashboardProps {
  stats: AdminStats;
  isLoading?: boolean;
}

const AnalyticsDashboard = ({ stats, isLoading }: AnalyticsDashboardProps) => {
  const [timeRange, setTimeRange] = useState("6m");
  const [filter, setFilter] = useState({}); // For future advanced filters

  // Mock data for charts - in production this would come from the API
  const allRevenueData = [
    { month: "Jan", revenue: 45000, subscriptions: 12 },
    { month: "Feb", revenue: 52000, subscriptions: 15 },
    { month: "Mar", revenue: 48000, subscriptions: 14 },
    { month: "Apr", revenue: 61000, subscriptions: 18 },
    { month: "May", revenue: 55000, subscriptions: 16 },
    { month: "Jun", revenue: stats.monthlyRevenue, subscriptions: stats.activeSubscriptions },
  ];
  // Filter data based on timeRange
  const revenueData = timeRange === "3m" ? allRevenueData.slice(-3) : timeRange === "1y" ? allRevenueData : timeRange === "all" ? allRevenueData : allRevenueData.slice(-6);

  const subscriptionTierData = [
    { name: "Monthly", value: 45, color: "#3B82F6" },
    { name: "6-Month", value: 30, color: "#8B5CF6" },
    { name: "Yearly", value: 25, color: "#10B981" },
  ];

  const activityData = [
    { day: "Mon", logins: 23, registrations: 5 },
    { day: "Tue", logins: 31, registrations: 8 },
    { day: "Wed", logins: 28, registrations: 6 },
    { day: "Thu", logins: 35, registrations: 12 },
    { day: "Fri", logins: 29, registrations: 7 },
    { day: "Sat", logins: 18, registrations: 3 },
    { day: "Sun", logins: 15, registrations: 2 },
  ];

  const handleExportData = (type: string, range: string) => {
    // Export logic here (mocked)
    alert(`Exporting ${type} data for ${range}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 lg:p-8">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Analytics Header with Time Range and Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Platform Analytics</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExportData("all", timeRange)} className="gap-2">
            <Download className="h-4 w-4" /> Export All Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueData} growthRate={stats.growthRate} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Subscription Tier Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionChart data={subscriptionTierData} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>User Activity (Logins & Registrations)</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityChart data={activityData} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <GrowthChart data={revenueData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
