import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Users, 
  Building2, 
  IndianRupee, 
  Eye,
  MoreVertical,
  Menu,
  X,
  Home,
  Bell,
  LogOut,
  Building,
  ClipboardList,
  ArrowUpRight,
  Plus,
  Shield,
  MessageSquare,
  Settings,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  ChevronRight,
  TrendingUp,
  BellRing,
  CalendarRange,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Utensils,
  Wrench
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRealTimePGProperties, useRealTimeRooms, useRealTimePayments, useRealTimeMaintenance, useRealTimeNotifications } from "@/hooks/useRealTimeData";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const PGManager = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPGAvailable, setIsPGAvailable] = useState(true);
  const [pgProperty, setPgProperty] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);

  // Real-time data hooks
  const { properties: pgProperties } = useRealTimePGProperties();
  const { rooms } = useRealTimeRooms(pgProperty?.id);
  const { payments } = useRealTimePayments();
  const { maintenance } = useRealTimeMaintenance(pgProperty?.id);
  const { notifications } = useRealTimeNotifications();

  // Fetch PG property for current admin
  useEffect(() => {
    const fetchPGProperty = async () => {
      if (!currentUser?.id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('pg_properties')
          .select('*')
          .eq('created_by', currentUser.id)
          .eq('is_active', true)
          .single();

        if (error) throw error;
        setPgProperty(data);
        setIsPGAvailable(data.is_active);
      } catch (error) {
        console.error('Error fetching PG property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPGProperty();
  }, [currentUser?.id]);

  // Calculate occupancy percentage
  const occupancyPercent = pgProperty ? Math.round(
    ((pgProperty.total_rooms - (pgProperty.total_rooms - pgProperty.occupied_rooms)) / pgProperty.total_rooms) * 100
  ) : 0;

  // Calculate real-time statistics
  const totalResidents = pgProperty?.occupied_rooms || 0;
  const availableRooms = rooms?.filter((room: any) => room.is_available).length || 0;
  const occupiedRooms = rooms?.filter((room: any) => !room.is_available).length || 0;
  const pendingRequests = maintenance?.filter((req: any) => req.status === "pending").length || 0;
  const urgentRequests = maintenance?.filter((req: any) => req.priority === "high" && req.status === "pending").length || 0;
  const totalRevenue = payments?.reduce((sum: number, payment: any) => {
    return payment.status === 'completed' ? sum + payment.amount : sum;
  }, 0) || 0;

  // Core navigation items based on PG Admin responsibilities
  const navigationItems = [
    {
      tab: "overview",
      label: "Dashboard",
      icon: Home,
      path: "/pg-admin"
    },
    {
      tab: "guests",
      label: "Guests",
      icon: Users,
      path: "/pg-admin/guests"
    },
    {
      tab: "rooms",
      label: "Rooms",
      icon: Building,
      path: "/pg-admin/rooms"
    },
    {
      tab: "requests",
      label: "Requests",
      icon: ClipboardList,
      path: "/pg-admin/requests"
    },
    {
      tab: "financial",
      label: "Financial",
      icon: IndianRupee,
      path: "/pg-admin/financial"
    },
    {
      tab: "notifications",
      label: "Notifications",
      icon: Bell,
      path: "/pg-admin/notifications"
    }
  ];

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/role-selection");
  };

  const handleNavigation = (path: string) => {
    const tab = path.split("/").pop() || "overview";
    setActiveTab(tab);
    navigate(path);
    setIsDrawerOpen(false);
  };

  const handlePGAvailability = async (checked: boolean) => {
    if (!pgProperty?.id) return;
    
    try {
      const { error } = await supabase
        .from('pg_properties')
        .update({ is_active: checked })
        .eq('id', pgProperty.id);

      if (error) throw error;
      
      setIsPGAvailable(checked);
      toast({
        title: checked ? "PG is now available" : "PG is now marked as unavailable",
        description: checked ? "New bookings can be accepted" : "No new bookings will be accepted",
      });
    } catch (error) {
      console.error('Error updating PG availability:', error);
      toast({
        title: "Error",
        description: "Failed to update PG availability",
        variant: "destructive",
      });
    }
  };

  const handleRequestAction = async (id: string, action: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_issues')
        .update({ 
          status: action === "approve" ? "in-progress" : "completed",
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: action === "approve" ? "Request Approved" : "Request Rejected",
        description: `Request #${id} has been ${action === "approve" ? "approved" : "rejected"}.`,
      });
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    }
  };

  // Navigation functions with correct routes
  const goToGuests = () => navigate("/pg-admin/residents");
  const goToJoiningRequests = () => navigate("/pg-admin/residents/requests");
  const goToRooms = () => navigate("/pg-admin/rooms");
  const goToServiceRequests = () => navigate("/pg-admin/requests");
  const goToPayments = () => navigate("/pg-admin/payments");
  const goToReports = () => navigate("/pg-admin/reports");
  const goToNotifications = () => navigate("/pg-admin/notifications");
  const goToFoodManagement = () => navigate("/pg-admin/food");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "in-progress":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!pgProperty) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No PG property found for your account.</p>
              <Button onClick={() => navigate("/role-selection")}>
                Back to Role Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pgProperty.name} Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser?.name}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">PG Status:</span>
            <Switch
              checked={isPGAvailable}
              onCheckedChange={handlePGAvailability}
            />
            <span className={cn(
              "text-sm",
              isPGAvailable ? "text-green-600" : "text-gray-500"
            )}>
              {isPGAvailable ? "Available" : "Not Available"}
            </span>
          </div>
          <Button onClick={() => navigate("/pg-admin/residents/requests")} size="sm">
            <Plus className="h-4 w-4 mr-1" /> New Request
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Residents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalResidents}</div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {availableRooms} rooms available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{occupancyPercent}%</div>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${occupancyPercent}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-green-600 mt-2">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{pendingRequests}</div>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-amber-600 mt-2">
              {urgentRequests} urgent requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Service Requests</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/pg-admin/requests")}>
                View All
              </Button>
            </div>
            <CardDescription>Recent maintenance and service requests</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {maintenance?.slice(0, 5).map((request: any) => (
                  <div key={request.id} className="flex items-start justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "mt-1 h-2 w-2 rounded-full",
                        request.priority === "high" ? "bg-red-500" :
                        request.priority === "medium" ? "bg-amber-500" :
                        "bg-green-500"
                      )} />
                      <div>
                        <p className="font-medium">{request.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.location} • {format(new Date(request.reported_at), "MMM dd, HH:mm")}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn(
                      request.status === "pending" ? "bg-amber-100 text-amber-800" :
                      request.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                      "bg-green-100 text-green-800"
                    )}>
                      {request.status}
                    </Badge>
                  </div>
                ))}
                {(!maintenance || maintenance.length === 0) && (
                  <p className="text-center text-muted-foreground py-4">No service requests</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Payments</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/pg-admin/payments")}>
                View All
              </Button>
            </div>
            <CardDescription>Recent payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {payments?.slice(0, 5).map((payment: any) => (
                  <div key={payment.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">₹{payment.amount}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.type} • {format(new Date(payment.created_at), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn(
                      payment.status === "completed" ? "bg-green-100 text-green-800" :
                      payment.status === "pending" ? "bg-amber-100 text-amber-800" :
                      "bg-red-100 text-red-800"
                    )}>
                      {payment.status}
                    </Badge>
                  </div>
                ))}
                {(!payments || payments.length === 0) && (
                  <p className="text-center text-muted-foreground py-4">No recent payments</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Additional Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Room Status</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/pg-admin/rooms")}>
                Manage
              </Button>
            </div>
            <CardDescription>Current room availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold">{rooms?.filter((room: any) => room.is_available).length || 0}</div>
              <div className="text-sm text-muted-foreground">
                Available rooms out of {rooms?.length || 0} total
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Available</span>
                <span className="font-medium">{rooms?.filter((room: any) => room.is_available).length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Occupied</span>
                <span className="font-medium">{rooms?.filter((room: any) => !room.is_available).length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Latest system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px]">
              <div className="space-y-4">
                {notifications?.slice(0, 5).map((notification: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex flex-col items-center justify-center bg-blue-100 text-blue-600 rounded-lg p-2 w-12">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(notification.created_at), "MMM dd, HH:mm")}
                      </p>
                    </div>
                  </div>
                ))}
                {(!notifications || notifications.length === 0) && (
                  <p className="text-center text-muted-foreground py-4">No recent notifications</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/pg-admin/residents")}
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Residents
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/pg-admin/rooms")}
              >
                <Building className="h-4 w-4 mr-2" />
                Manage Rooms
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/pg-admin/requests")}
              >
                <Wrench className="h-4 w-4 mr-2" />
                Service Requests
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/pg-admin/payments")}
              >
                <IndianRupee className="h-4 w-4 mr-2" />
                Payment Management
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PGManager;
