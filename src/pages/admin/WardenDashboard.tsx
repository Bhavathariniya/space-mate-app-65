import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, Users, AlertCircle, 
  DoorOpen, BellRing, LayoutDashboard,
  Plus, FileText, Wrench, Calendar,
  TrendingUp, TrendingDown, Clock,
  CheckCircle, XCircle, Loader2
} from "lucide-react";

interface Asset {
  id: string;
  name: string;
  quantity: number;
  type: "room" | "bed" | "facility";
  lastUpdated: string;
}

interface JoinRequest {
  id: string;
  name: string;
  email: string;
  status: "pending" | "restricted" | "approved" | "rejected";
  date: string;
  remarks?: string;
}

interface RecentActivity {
  id: string;
  type: "request" | "maintenance" | "asset" | "notification";
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  priority?: "low" | "medium" | "high";
}

interface MaintenanceIssue {
  id: string;
  title: string;
  description: string;
  room: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  reportedBy: string;
  reportedAt: string;
  assignedTo?: string;
  completedAt?: string;
}

const WardenDashboard = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [newRequestType, setNewRequestType] = useState<string>("");
  const [newRequestDescription, setNewRequestDescription] = useState("");
  const [maintenanceForm, setMaintenanceForm] = useState({
    title: "",
    description: "",
    room: "",
    priority: "medium"
  });

  const [assets, setAssets] = useState<Asset[]>([
    { id: "1", name: "Rooms", quantity: 10, type: "room", lastUpdated: "2024-03-20" },
    { id: "2", name: "Beds/Cots", quantity: 50, type: "bed", lastUpdated: "2024-03-20" },
    { id: "3", name: "Chairs", quantity: 30, type: "facility", lastUpdated: "2024-03-20" },
    { id: "4", name: "Wardrobes", quantity: 20, type: "facility", lastUpdated: "2024-03-21" },
    { id: "5", name: "Tables", quantity: 25, type: "facility", lastUpdated: "2024-03-21" },
  ]);

  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([
    { id: "1", name: "John Doe", email: "john.doe@example.com", status: "pending", date: "2024-03-22" },
    { id: "2", name: "Jane Smith", email: "jane.smith@example.com", status: "restricted", date: "2024-03-21" },
    { id: "3", name: "Alice Johnson", email: "alice.j@example.com", status: "pending", date: "2024-03-20" },
    { id: "4", name: "Bob Williams", email: "bob.w@example.com", status: "restricted", date: "2024-03-19" },
  ]);

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "request",
      title: "New Join Request",
      description: "John Doe submitted a join request",
      timestamp: "2 hours ago",
      status: "pending",
      priority: "medium"
    },
    {
      id: "2",
      type: "maintenance",
      title: "Maintenance Issue",
      description: "Water leakage reported in Room 101",
      timestamp: "4 hours ago",
      status: "in-progress",
      priority: "high"
    },
    {
      id: "3",
      type: "asset",
      title: "Asset Update",
      description: "New furniture added to Room 203",
      timestamp: "1 day ago",
      priority: "low"
    }
  ]);

  const [maintenanceIssues, setMaintenanceIssues] = useState<MaintenanceIssue[]>([
    {
      id: "1",
      title: "Water Leakage",
      description: "Water leaking from ceiling in Room 101",
      room: "101",
      status: "in-progress",
      priority: "high",
      reportedBy: "John Doe",
      reportedAt: "2024-03-22 10:30 AM",
      assignedTo: "Maintenance Team"
    },
    {
      id: "2",
      title: "AC Not Working",
      description: "AC not cooling properly in Room 203",
      room: "203",
      status: "pending",
      priority: "medium",
      reportedBy: "Alice Johnson",
      reportedAt: "2024-03-22 09:15 AM"
    }
  ]);

  const [occupancy, setOccupancy] = useState(45);
  const totalCapacity = assets.find(asset => asset.id === "2")?.quantity || 0;
  const occupancyPercentage = (occupancy / totalCapacity) * 100;

  const pendingRequestsCount = joinRequests.filter(req => req.status === "pending").length;
  const totalRooms = assets.find(asset => asset.type === "room")?.quantity || 0;
  const activeMaintenanceIssues = maintenanceIssues.filter(issue => issue.status !== "completed").length;
  const completedToday = maintenanceIssues.filter(issue => 
    issue.status === "completed" && 
    new Date(issue.completedAt || "").toDateString() === new Date().toDateString()
  ).length;
  const monthlyRevenue = 150000;
  const revenueChange = 12.5;

  // Handlers
  const handleNewRequest = async () => {
    if (!newRequestType || !newRequestDescription) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newActivity: RecentActivity = {
        id: Date.now().toString(),
        type: newRequestType as "request" | "maintenance" | "asset" | "notification",
        title: `New ${newRequestType} Request`,
        description: newRequestDescription,
        timestamp: "Just now",
        status: "pending",
        priority: "medium"
      };

      setRecentActivities(prev => [newActivity, ...prev]);
      setShowNewRequestDialog(false);
      setNewRequestType("");
      setNewRequestDescription("");

      toast({
        title: "Success",
        description: "New request has been submitted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaintenanceReport = async () => {
    if (!maintenanceForm.title || !maintenanceForm.description || !maintenanceForm.room) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newIssue: MaintenanceIssue = {
        id: Date.now().toString(),
        ...maintenanceForm,
        priority: maintenanceForm.priority as "low" | "medium" | "high",
        status: "pending",
        reportedBy: currentUser?.name || "Anonymous",
        reportedAt: new Date().toLocaleString()
      };

      setMaintenanceIssues(prev => [newIssue, ...prev]);
      setShowMaintenanceDialog(false);
      setMaintenanceForm({
        title: "",
        description: "",
        room: "",
        priority: "medium"
      });

      // Add to recent activities
      const newActivity: RecentActivity = {
        id: Date.now().toString(),
        type: "maintenance",
        title: "New Maintenance Issue",
        description: `${maintenanceForm.title} in Room ${maintenanceForm.room}`,
        timestamp: "Just now",
        status: "pending",
        priority: maintenanceForm.priority as "low" | "medium" | "high"
      };

      setRecentActivities(prev => [newActivity, ...prev]);

      toast({
        title: "Success",
        description: "Maintenance issue has been reported",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report maintenance issue. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivityAction = async (activityId: string, action: "approve" | "reject" | "complete") => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRecentActivities(prev => prev.map(activity => {
        if (activity.id === activityId) {
          return {
            ...activity,
            status: action === "approve" ? "approved" : 
                   action === "reject" ? "rejected" : "completed"
          };
        }
        return activity;
      }));

      toast({
        title: "Success",
        description: `Activity has been ${action}d`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process action. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaintenanceAction = async (issueId: string, action: "start" | "complete") => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMaintenanceIssues(prev => prev.map(issue => {
        if (issue.id === issueId) {
          return {
            ...issue,
            status: action === "start" ? "in-progress" : "completed",
            ...(action === "complete" ? { completedAt: new Date().toLocaleString() } : {})
          };
        }
        return issue;
      }));

      toast({
        title: "Success",
        description: `Maintenance issue has been ${action === "start" ? "started" : "completed"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process action. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            <LayoutDashboard className="h-7 w-7" />
            <span>Warden Dashboard</span>
          </h1>
          <p className="text-white/80">Welcome back, {currentUser?.name || "Warden"}</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Request Type</label>
                  <Select value={newRequestType} onValueChange={setNewRequestType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="request">Join Request</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="asset">Asset Update</SelectItem>
                      <SelectItem value="notification">Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newRequestDescription}
                    onChange={(e) => setNewRequestDescription(e.target.value)}
                    placeholder="Enter request details..."
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleNewRequest}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <DoorOpen className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRooms}</div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>2 new rooms added this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Users className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancy} / {totalCapacity}</div>
            <div className="mt-2">
              <Progress value={occupancyPercentage} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{occupancyPercentage.toFixed(1)}% occupied</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <BellRing className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingRequestsCount}</div>
            <p className="text-xs text-gray-500 mt-1">Requires your attention</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{monthlyRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>{revenueChange}% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Activities</CardTitle>
              <Button variant="ghost" size="sm" className="text-sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 border">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'request' ? 'bg-blue-100' :
                    activity.type === 'maintenance' ? 'bg-yellow-100' :
                    activity.type === 'asset' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {activity.type === 'request' && <FileText className="h-5 w-5 text-blue-600" />}
                    {activity.type === 'maintenance' && <Wrench className="h-5 w-5 text-yellow-600" />}
                    {activity.type === 'asset' && <Building2 className="h-5 w-5 text-green-600" />}
                    {activity.type === 'notification' && <BellRing className="h-5 w-5 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{activity.title}</h3>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {activity.status && (
                        <Badge variant={
                          activity.status === 'pending' ? 'secondary' :
                          activity.status === 'in-progress' ? 'warning' : 'success'
                        }>
                          {activity.status}
                        </Badge>
                      )}
                      {activity.priority && (
                        <Badge variant={
                          activity.priority === 'high' ? 'destructive' :
                          activity.priority === 'medium' ? 'warning' : 'secondary'
                        }>
                          {activity.priority}
                        </Badge>
                      )}
                    </div>
                    {activity.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                          disabled={isLoading}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          disabled={isLoading}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Maintenance */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Dialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-auto py-3 flex flex-col items-center">
                      <Wrench className="h-5 w-5 mb-2" />
                      <span className="text-sm">Report Issue</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report Maintenance Issue</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Issue Title</label>
                        <Input
                          value={maintenanceForm.title}
                          onChange={(e) => setMaintenanceForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter issue title"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Room Number</label>
                        <Input
                          value={maintenanceForm.room}
                          onChange={(e) => setMaintenanceForm(prev => ({ ...prev, room: e.target.value }))}
                          placeholder="Enter room number"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={maintenanceForm.description}
                          onChange={(e) => setMaintenanceForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe the issue in detail"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Priority</label>
                        <Select
                          value={maintenanceForm.priority}
                          onValueChange={(value) => setMaintenanceForm(prev => ({ ...prev, priority: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={handleMaintenanceReport}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Report"
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="h-auto py-3 flex flex-col items-center">
                  <Calendar className="h-5 w-5 mb-2" />
                  <span className="text-sm">Schedule</span>
                </Button>

                <Button variant="outline" className="h-auto py-3 flex flex-col items-center">
                  <Users className="h-5 w-5 mb-2" />
                  <span className="text-sm">Residents</span>
                </Button>

                <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-auto py-3 flex flex-col items-center">
                      <FileText className="h-5 w-5 mb-2" />
                      <span className="text-sm">New Request</span>
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Maintenance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Issues</span>
                  <Badge variant="warning">{activeMaintenanceIssues}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed Today</span>
                  <Badge variant="success">{completedToday}</Badge>
                </div>
                <div className="space-y-3 mt-4">
                  {maintenanceIssues.slice(0, 2).map((issue) => (
                    <div key={issue.id} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{issue.title}</h4>
                        <Badge variant={
                          issue.priority === 'high' ? 'destructive' :
                          issue.priority === 'medium' ? 'warning' : 'secondary'
                        }>
                          {issue.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">Room {issue.room}</span>
                        {issue.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMaintenanceAction(issue.id, "start")}
                            disabled={isLoading}
                          >
                            Start Work
                          </Button>
                        )}
                        {issue.status === 'in-progress' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600"
                            onClick={() => handleMaintenanceAction(issue.id, "complete")}
                            disabled={isLoading}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-2">
                  View All Issues
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WardenDashboard; 