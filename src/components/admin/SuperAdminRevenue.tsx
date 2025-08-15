import { AdminStats } from "@/hooks/usePGAdmins";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RevenueChart from "./RevenueChart";
import GrowthChart from "./GrowthChart";
import { DollarSign, TrendingUp, BarChart2, Zap } from "lucide-react";

interface SuperAdminRevenueProps {
  stats: AdminStats;
  isLoading?: boolean;
}

const SuperAdminRevenue = ({ stats, isLoading }: SuperAdminRevenueProps) => {
  const revenueData = [
    { month: "Jan", revenue: 45000, subscriptions: 12 },
    { month: "Feb", revenue: 52000, subscriptions: 15 },
    { month: "Mar", revenue: 48000, subscriptions: 14 },
    { month: "Apr", revenue: 61000, subscriptions: 18 },
    { month: "May", revenue: 55000, subscriptions: 16 },
    { month: "Jun", revenue: stats.monthlyRevenue, subscriptions: stats.activeSubscriptions },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 lg:p-8">
        <div className="animate-pulse">
          <div className="h-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Revenue Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-white text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-green-100 text-xs mt-1">+12% from last period</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-white text-sm font-medium">Monthly Revenue</CardTitle>
            <BarChart2 className="h-5 w-5 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">₹{stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-blue-100 text-xs mt-1">Current month's earnings</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-white text-sm font-medium">Average Revenue</CardTitle>
            <TrendingUp className="h-5 w-5 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">₹{(stats.totalRevenue / 6).toFixed(0)}</div>
            <p className="text-purple-100 text-xs mt-1">Average per month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-yellow-600 text-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-white text-sm font-medium">Growth Rate</CardTitle>
            <Zap className="h-5 w-5 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.growthRate}%</div>
            <p className="text-orange-100 text-xs mt-1">Year over year growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueData} growthRate={stats.growthRate} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Subscription Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <GrowthChart data={revenueData} />
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Revenue Breakdown by Source</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Subscriptions */}
            <div className="flex flex-col items-center justify-center text-center rounded-2xl p-6 bg-blue-50/60 border border-blue-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <span className="text-2xl md:text-3xl font-extrabold text-blue-700">₹{(stats.monthlyRevenue * 0.7).toFixed(0)}</span>
              <p className="text-base md:text-lg font-medium text-blue-700 mt-1">Monthly Subscriptions</p>
            </div>
            {/* Annual Subscriptions */}
            <div className="flex flex-col items-center justify-center text-center rounded-2xl p-6 bg-green-50/60 border border-green-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <span className="text-2xl md:text-3xl font-extrabold text-green-700">₹{(stats.monthlyRevenue * 0.25).toFixed(0)}</span>
              <p className="text-base md:text-lg font-medium text-green-700 mt-1">Annual Subscriptions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminRevenue;
