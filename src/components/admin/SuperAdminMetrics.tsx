import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, 
  DollarSign, 
  Crown, 
  BarChart3,
  TrendingUp,
  CheckCircle,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Bell
} from "lucide-react";
import { AdminStats } from "@/hooks/usePGAdmins";
import { useEffect, useState } from "react";

interface SuperAdminMetricsProps {
  stats: AdminStats;
  isLoading?: boolean;
}

const SuperAdminMetrics = ({ stats, isLoading }: SuperAdminMetricsProps) => {
  // Welcome banner state (persisted in sessionStorage)
  const [showWelcome, setShowWelcome] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('superAdminWelcomeShown');
    }
    return true;
  });
  useEffect(() => {
    if (!showWelcome) return;
    const timer = setTimeout(() => {
      setShowWelcome(false);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('superAdminWelcomeShown', 'true');
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, [showWelcome]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse border-0 shadow-xl bg-gradient-to-br from-gray-100 to-gray-200">
            <CardContent className="p-6">
              <div className="h-24 bg-gray-300 rounded-lg animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Properties",
      value: stats.totalPGs,
      subtitle: `${stats.activePGs} Active`,
      icon: Building2,
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      change: "+12%",
      isPositive: true
    },
    {
      title: "Monthly Revenue",
      value: `₹${(stats.monthlyRevenue / 1000).toFixed(0)}K`,
      subtitle: `+${stats.growthRate}% vs last month`,
      icon: DollarSign,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200",
      change: `+${stats.growthRate}%`,
      isPositive: true
    },
    {
      title: "Active Subscriptions",
      value: stats.activeSubscriptions,
      subtitle: `${stats.conversionRate}% conversion rate`,
      icon: Crown,
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      change: "+8%",
      isPositive: true
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      subtitle: stats.pendingRequests > 0 ? "Requires attention" : "No pending requests",
      icon: AlertTriangle,
      color: "amber",
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
      change: stats.pendingRequests > 0 ? `+${stats.pendingRequests}` : "+0",
      isPositive: stats.pendingRequests === 0
    }
  ];

  return (
    <>
      {/* Welcome Banner */}
      {showWelcome && (
        <div className="relative flex items-center justify-between px-4 py-3 mb-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg animate-fade-in-up transition-opacity duration-700" style={{opacity: showWelcome ? 1 : 0}}>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3zm0 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm0 0v2m0 4h.01" /></svg>
            </span>
            <div>
              <div className="text-lg font-bold text-white drop-shadow">Welcome back, <span className="underline decoration-pink-200">Super Admin</span>! 🚀</div>
              <div className="text-sm text-white/80">Wishing you a productive day managing your platform.</div>
            </div>
          </div>
        </div>
      )}
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {metrics.map((metric, index) => (
          <Card 
            key={metric.title} 
            className={
              `relative flex flex-col justify-between overflow-hidden border-0 rounded-2xl px-4 py-3
              shadow-md transition-transform duration-300 bg-white
              before:absolute before:top-0 before:left-0 before:bottom-0 before:w-1.5 before:rounded-l-2xl before:content-['']
              ${
                metric.color === 'blue' ? 'before:bg-gradient-to-b before:from-blue-400 before:to-cyan-400 bg-blue-50/30' :
                metric.color === 'emerald' ? 'before:bg-gradient-to-b before:from-emerald-400 before:to-teal-400 bg-emerald-50/30' :
                metric.color === 'purple' ? 'before:bg-gradient-to-b before:from-purple-400 before:to-pink-400 bg-purple-50/30' :
                metric.color === 'amber' ? 'before:bg-gradient-to-b before:from-amber-400 before:to-orange-400 bg-amber-50/30' :
                'before:bg-gray-300 bg-gray-50/30'
              }
              md:before:w-0 md:border-t-4 md:pt-2 md:pb-4 md:px-6 md:rounded-2xl
              md:${metric.color === 'blue' ? 'border-t-blue-400' :
                  metric.color === 'emerald' ? 'border-t-emerald-400' :
                  metric.color === 'purple' ? 'border-t-purple-400' :
                  metric.color === 'amber' ? 'border-t-amber-400' :
                  'border-t-gray-300'}
              hover:shadow-xl hover:scale-[1.03] group animate-fade-in`
            }
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="flex flex-col h-full p-0">
              <div className="flex items-start justify-between w-full">
                <div className="flex flex-col items-start gap-1 pt-1">
                  <span className="text-xs font-semibold text-gray-600 tracking-wide uppercase">{metric.title}</span>
                  <span className={`text-3xl font-extrabold text-gray-900 tracking-tight`}>{metric.value}</span>
                </div>
                <div className={`flex items-center justify-center mt-1 ml-2 md:ml-0 md:mt-0`}> 
                  <div className={`rounded-full p-2 bg-white shadow-sm border border-gray-100`}> 
                    <metric.icon className={`h-7 w-7 ${
                      metric.color === 'blue' ? 'text-blue-500' :
                      metric.color === 'emerald' ? 'text-emerald-500' :
                      metric.color === 'purple' ? 'text-purple-500' :
                      metric.color === 'amber' ? 'text-amber-500' :
                      'text-gray-400'} transition-transform duration-300 group-hover:scale-110`} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-1 mt-2">
                <span className={`text-xs font-medium ${
                  metric.color === 'blue' ? 'text-blue-700' :
                  metric.color === 'emerald' ? 'text-emerald-700' :
                  metric.color === 'purple' ? 'text-purple-700' :
                  metric.color === 'amber' ? 'text-amber-700' :
                  'text-gray-400'}
                `}>{metric.subtitle}</span>
                <span className={`text-xs font-semibold ${
                  metric.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>{metric.change}</span>
              </div>
              {/* Animated Progress Bar */}
              <div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    metric.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
                    metric.color === 'emerald' ? 'bg-gradient-to-r from-emerald-400 to-teal-400' :
                    metric.color === 'purple' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                    metric.color === 'amber' ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
                    'bg-gray-300'}
                  `}
                  style={{ 
                    width: metric.title === "Customer Satisfaction" ? `${stats.customerSatisfaction}%` : '75%',
                    animationDelay: `${index * 200}ms`
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default SuperAdminMetrics;
