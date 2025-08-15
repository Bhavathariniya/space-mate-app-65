import { useState } from "react";
import { usePGAdmins, useAdminStats } from "@/hooks/usePGAdmins";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Home, Users, TrendingUp, Settings, Bell, RefreshCw, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ErrorBoundary from "@/components/admin/ErrorBoundary";
import SuperAdminHeader from "@/components/admin/SuperAdminHeader";
import SuperAdminOverview from "@/components/admin/SuperAdminOverview";
import SuperAdminSubscriptions from "@/components/admin/SuperAdminSubscriptions";
import SuperAdminRevenue from "@/components/admin/SuperAdminRevenue";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import AdminManagement from "@/components/admin/AdminManagement";
import LiveActivityFeed from "@/components/admin/LiveActivityFeed";
import AdminDetailModal from "@/components/admin/AdminDetailModal";
import { PGAdmin } from "@/hooks/usePGAdmins";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import SuperAdminBulkOperations from "@/components/admin/SuperAdminBulkOperations";

const SuperAdmin = () => {
  const { data: pgAdmins = [], isLoading, error, refetch } = usePGAdmins();
  const stats = useAdminStats(pgAdmins);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [selectedAdminForDetail, setSelectedAdminForDetail] = useState<PGAdmin | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Dashboard Refreshed",
        description: "All data has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-8 flex items-center justify-center">
        <Card className="border-red-200 bg-red-50/80 backdrop-blur-sm max-w-2xl mx-auto shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5 animate-pulse" />
              Failed to Load Super Admin Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">
              There was an error loading the dashboard data. Please check your connection and try again.
            </p>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                "Retry"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pb-20 animate-fade-in">
        <SuperAdminHeader 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 lg:py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="mt-0 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <Card className="hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-blue-800">Manage Subscriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-600 mb-2">
                      Manage all subscription plans, view payments, and track subscriptions for PG admins.
                    </p>
                    <Button 
                      onClick={() => setActiveTab("subscriptions")} 
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      Go to Subscription Management
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <SuperAdminOverview 
                stats={stats} 
                isLoading={isLoading} 
                onTabChange={setActiveTab}
              />
            </TabsContent>

            <TabsContent value="subscriptions" className="mt-0 animate-slide-up">
              <SuperAdminSubscriptions admins={pgAdmins} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="revenue" className="mt-0 animate-slide-up">
              <SuperAdminRevenue stats={stats} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0 animate-slide-up">
              <AnalyticsDashboard stats={stats} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="admins" className="mt-0 animate-slide-up">
              <AdminManagement 
                admins={pgAdmins} 
                isLoading={isLoading} 
                onRefresh={refetch}
                selectedAdmins={selectedAdmins}
                onSelectionChange={setSelectedAdmins}
                onAdminClick={setSelectedAdminForDetail}
              />
            </TabsContent>

            <TabsContent value="bulk-ops" className="mt-0 animate-slide-up">
              <SuperAdminBulkOperations />
            </TabsContent>

            <TabsContent value="activity" className="mt-0 animate-slide-up">
              <div className="max-w-4xl mx-auto">
                <LiveActivityFeed />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Enhanced Bottom Navigation with Badges */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200/50 shadow-2xl z-30 md:hidden">
          <div className="grid grid-cols-6 h-16">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                activeTab === "overview"
                  ? "text-indigo-600 bg-gradient-to-t from-indigo-50 to-transparent scale-105"
                  : "text-gray-500 hover:text-indigo-500 hover:bg-gray-50/50 hover:scale-105"
              }`}
            >
              <Home className={`h-5 w-5 transition-all duration-300 ${
                activeTab === "overview" ? "animate-bounce-subtle" : ""
              }`} />
              <span className="text-xs font-medium">Home</span>
              {activeTab === "overview" && (
                <div className="absolute -top-1 w-8 h-1 bg-indigo-600 rounded-full animate-scale-in" />
              )}
            </button>
            
            <button
              onClick={() => setActiveTab("admins")}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                activeTab === "admins"
                  ? "text-indigo-600 bg-gradient-to-t from-indigo-50 to-transparent scale-105"
                  : "text-gray-500 hover:text-indigo-500 hover:bg-gray-50/50 hover:scale-105"
              }`}
            >
              <Users className={`h-5 w-5 transition-all duration-300 ${
                activeTab === "admins" ? "animate-bounce-subtle" : ""
              }`} />
              <span className="text-xs font-medium">PG</span>
              {activeTab === "admins" && (
                <div className="absolute -top-1 w-8 h-1 bg-indigo-600 rounded-full animate-scale-in" />
              )}
            </button>
            
            <button
              onClick={() => setActiveTab("revenue")}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                activeTab === "revenue"
                  ? "text-indigo-600 bg-gradient-to-t from-indigo-50 to-transparent scale-105"
                  : "text-gray-500 hover:text-indigo-500 hover:bg-gray-50/50 hover:scale-105"
              }`}
            >
              <TrendingUp className={`h-5 w-5 transition-all duration-300 ${
                activeTab === "revenue" ? "animate-bounce-subtle" : ""
              }`} />
              <span className="text-xs font-medium">Revenue</span>
              {activeTab === "revenue" && (
                <div className="absolute -top-1 w-8 h-1 bg-indigo-600 rounded-full animate-scale-in" />
              )}
            </button>
            
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                activeTab === "analytics"
                  ? "text-indigo-600 bg-gradient-to-t from-indigo-50 to-transparent scale-105"
                  : "text-gray-500 hover:text-indigo-500 hover:bg-gray-50/50 hover:scale-105"
              }`}
            >
              <BarChart className={`h-5 w-5 transition-all duration-300 ${
                activeTab === "analytics" ? "animate-bounce-subtle" : ""
              }`} />
              <span className="text-xs font-medium">Analytics</span>
              {activeTab === "analytics" && (
                <div className="absolute -top-1 w-8 h-1 bg-indigo-600 rounded-full animate-scale-in" />
              )}
            </button>
            
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                activeTab === "activity"
                  ? "text-indigo-600 bg-gradient-to-t from-indigo-50 to-transparent scale-105"
                  : "text-gray-500 hover:text-indigo-500 hover:bg-gray-50/50 hover:scale-105"
              }`}
            >
              <div className="relative">
                <Bell className={`h-5 w-5 transition-all duration-300 ${
                  activeTab === "activity" ? "animate-bounce-subtle" : ""
                }`} />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </div>
              <span className="text-xs font-medium">Activity</span>
              {activeTab === "activity" && (
                <div className="absolute -top-1 w-8 h-1 bg-indigo-600 rounded-full animate-scale-in" />
              )}
            </button>
            
            <button
              onClick={() => setActiveTab("bulk-ops")}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                activeTab === "bulk-ops"
                  ? "text-indigo-600 bg-gradient-to-t from-indigo-50 to-transparent scale-105"
                  : "text-gray-500 hover:text-indigo-500 hover:bg-gray-50/50 hover:scale-105"
              }`}
            >
              <Settings className={`h-5 w-5 transition-all duration-300 ${
                activeTab === "bulk-ops" ? "animate-bounce-subtle" : ""
              }`} />
              <span className="text-xs font-medium">Admin</span>
              {activeTab === "bulk-ops" && (
                <div className="absolute -top-1 w-8 h-1 bg-indigo-600 rounded-full animate-scale-in" />
              )}
            </button>
          </div>
        </div>

        <AdminDetailModal
          admin={selectedAdminForDetail}
          isOpen={!!selectedAdminForDetail}
          onClose={() => setSelectedAdminForDetail(null)}
        />
      </div>
    </ErrorBoundary>
  );
};

export default SuperAdmin;
