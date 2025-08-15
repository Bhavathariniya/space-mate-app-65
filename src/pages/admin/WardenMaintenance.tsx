import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { 
  Wrench, Plus, CheckCircle, Clock, AlertTriangle, Search, ArrowUpDown, 
  CalendarIcon, Loader2, CheckCheck, X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MaintenanceIssue {
  id: string;
  title: string;
  description: string;
  location: string;
  reportedBy: string;
  reportedAt: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  category: 'plumbing' | 'electrical' | 'furniture' | 'cleaning' | 'other';
  assignedTo?: string;
  estimatedCompletion?: string;
  completedAt?: string;
  remarks?: string;
}

const WardenMaintenance = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showNewIssueDialog, setShowNewIssueDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<MaintenanceIssue | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState<string>('reportedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    location: '',
    priority: 'medium',
    category: 'other'
  });

  const [maintenanceIssues, setMaintenanceIssues] = useState<MaintenanceIssue[]>([
    {
      id: '1',
      title: 'Water Leakage',
      description: 'Water leaking from bathroom ceiling in Room 101',
      location: 'Room 101',
      reportedBy: 'John Doe',
      reportedAt: '2024-03-20 09:30 AM',
      status: 'in-progress',
      priority: 'high',
      category: 'plumbing',
      assignedTo: 'Maintenance Team',
      estimatedCompletion: '2024-03-22'
    },
    {
      id: '2',
      title: 'Broken Window',
      description: 'Window glass is cracked and needs replacement',
      location: 'Room 203',
      reportedBy: 'Jane Smith',
      reportedAt: '2024-03-19 02:15 PM',
      status: 'pending',
      priority: 'medium',
      category: 'other'
    },
    {
      id: '3',
      title: 'Electrical Socket Issue',
      description: 'Socket near bed not working',
      location: 'Room 105',
      reportedBy: 'Alex Johnson',
      reportedAt: '2024-03-18 11:45 AM',
      status: 'completed',
      priority: 'medium',
      category: 'electrical',
      completedAt: '2024-03-19 10:30 AM',
      assignedTo: 'Electrician',
      remarks: 'Socket replaced with new one'
    },
    {
      id: '4',
      title: 'Bed Repair',
      description: 'Bed frame is loose and making noise',
      location: 'Room 302',
      reportedBy: 'Sam Wilson',
      reportedAt: '2024-03-17 04:20 PM',
      status: 'completed',
      priority: 'low',
      category: 'furniture',
      completedAt: '2024-03-18 03:00 PM',
      assignedTo: 'Carpenter',
      remarks: 'Frame tightened and reinforced'
    },
    {
      id: '5',
      title: 'AC Not Cooling',
      description: 'Air conditioner not cooling properly',
      location: 'Common Area',
      reportedBy: 'Admin',
      reportedAt: '2024-03-21 10:00 AM',
      status: 'pending',
      priority: 'high',
      category: 'electrical'
    }
  ]);

  // Filter and sort issues
  const filteredIssues = maintenanceIssues
    .filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            issue.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === 'all' || issue.priority === filterPriority;
      const matchesTab = (activeTab === 'active' && (issue.status === 'pending' || issue.status === 'in-progress')) ||
                         (activeTab === 'completed' && issue.status === 'completed') ||
                         activeTab === 'all';
      
      return matchesSearch && matchesPriority && matchesTab;
    })
    .sort((a, b) => {
      if (sortField === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aVal = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        const bVal = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
      }
      
      if (sortField === 'reportedAt') {
        const aDate = new Date(a.reportedAt).getTime();
        const bDate = new Date(b.reportedAt).getTime();
        return sortDirection === 'desc' ? bDate - aDate : aDate - bDate;
      }
      
      return 0;
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleAddNewIssue = async () => {
    if (!newIssue.title || !newIssue.description || !newIssue.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMaintenanceIssue: MaintenanceIssue = {
        id: Date.now().toString(),
        ...newIssue,
        priority: newIssue.priority as "low" | "medium" | "high",
        category: newIssue.category as "plumbing" | "electrical" | "furniture" | "cleaning" | "other",
        reportedBy: currentUser?.name || 'Warden',
        reportedAt: new Date().toLocaleString(),
        status: 'pending'
      };

      setMaintenanceIssues(prev => [newMaintenanceIssue, ...prev]);
      setShowNewIssueDialog(false);
      setNewIssue({
        title: '',
        description: '',
        location: '',
        priority: 'medium',
        category: 'other'
      });

      toast({
        title: "Success",
        description: "Maintenance issue has been reported successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report maintenance issue",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'in-progress' | 'completed' | 'cancelled') => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMaintenanceIssues(prev => prev.map(issue => {
        if (issue.id === id) {
          const updates: Partial<MaintenanceIssue> = { 
            status: newStatus,
            ...(newStatus === 'completed' ? { completedAt: new Date().toLocaleString() } : {}),
            ...(newStatus === 'in-progress' ? { assignedTo: 'Maintenance Team' } : {})
          };
          return { ...issue, ...updates };
        }
        return issue;
      }));

      toast({
        title: "Status Updated",
        description: `Maintenance issue has been marked as ${newStatus.replace('-', ' ')}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setShowDetailsDialog(false);
    }
  };

  const activeIssuesCount = maintenanceIssues.filter(i => i.status === 'pending' || i.status === 'in-progress').length;
  const highPriorityCount = maintenanceIssues.filter(i => 
    (i.status === 'pending' || i.status === 'in-progress') && i.priority === 'high'
  ).length;
  const completedCount = maintenanceIssues.filter(i => i.status === 'completed').length;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Management</h1>
          <p className="text-gray-500">Track and manage maintenance issues across your property</p>
        </div>
        <Dialog open={showNewIssueDialog} onOpenChange={setShowNewIssueDialog}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Report New Issue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Maintenance Issue</DialogTitle>
              <DialogDescription>Fill in the details to report a new maintenance issue</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Issue Title</label>
                <Input
                  value={newIssue.title}
                  onChange={(e) => setNewIssue(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a descriptive title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={newIssue.location}
                  onChange={(e) => setNewIssue(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Room number or area (e.g., Room 101, Common Area)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select 
                    value={newIssue.priority} 
                    onValueChange={(value) => setNewIssue(prev => ({ ...prev, priority: value }))}
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select 
                    value={newIssue.category} 
                    onValueChange={(value) => setNewIssue(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newIssue.description}
                  onChange={(e) => setNewIssue(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed description of the issue"
                  rows={4}
                />
              </div>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                onClick={handleAddNewIssue}
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
            <Wrench className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIssuesCount}</div>
            <p className="text-xs text-gray-500">Issues requiring attention</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityCount}</div>
            <p className="text-xs text-gray-500">Issues needing immediate attention</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-gray-500">Issues resolved successfully</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Maintenance Issues</CardTitle>
              <CardDescription>View and manage all maintenance requests</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full sm:w-[200px]"
                />
              </div>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="active" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active Issues</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All Issues</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center p-0 h-auto font-semibold"
                          onClick={() => handleSort('reportedAt')}
                        >
                          Date Reported
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center p-0 h-auto font-semibold"
                          onClick={() => handleSort('priority')}
                        >
                          Priority
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIssues.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                          No maintenance issues found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredIssues.map((issue) => (
                        <TableRow key={issue.id} className="hover:bg-gray-50">
                          <TableCell className="whitespace-nowrap text-gray-500 text-sm">
                            {issue.reportedAt}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{issue.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-[200px]">
                              {issue.description}
                            </div>
                          </TableCell>
                          <TableCell>{issue.location}</TableCell>
                          <TableCell>
                            <Badge variant={
                              issue.priority === 'high' ? 'destructive' :
                              issue.priority === 'medium' ? 'warning' : 'secondary'
                            }>
                              {issue.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              issue.status === 'pending' ? 'secondary' :
                              issue.status === 'in-progress' ? 'warning' :
                              issue.status === 'completed' ? 'success' : 'destructive'
                            }>
                              {issue.status.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedIssue(issue);
                                  setShowDetailsDialog(true);
                                }}
                              >
                                View Details
                              </Button>
                              {issue.status === 'pending' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusChange(issue.id, 'in-progress')}
                                  disabled={isLoading}
                                  className="text-blue-600"
                                >
                                  Start Work
                                </Button>
                              )}
                              {issue.status === 'in-progress' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusChange(issue.id, 'completed')}
                                  disabled={isLoading}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Complete
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Issue Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Maintenance Issue Details</DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{selectedIssue.title}</h3>
                  <Badge variant={
                    selectedIssue.priority === 'high' ? 'destructive' :
                    selectedIssue.priority === 'medium' ? 'warning' : 'secondary'
                  }>
                    {selectedIssue.priority} priority
                  </Badge>
                </div>
                <Badge variant={
                  selectedIssue.status === 'pending' ? 'secondary' :
                  selectedIssue.status === 'in-progress' ? 'warning' :
                  selectedIssue.status === 'completed' ? 'success' : 'destructive'
                }>
                  {selectedIssue.status.replace('-', ' ')}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium">{selectedIssue.location}</p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium capitalize">{selectedIssue.category}</p>
                </div>
                <div>
                  <p className="text-gray-500">Reported By</p>
                  <p className="font-medium">{selectedIssue.reportedBy}</p>
                </div>
                <div>
                  <p className="text-gray-500">Reported At</p>
                  <p className="font-medium">{selectedIssue.reportedAt}</p>
                </div>
                {selectedIssue.assignedTo && (
                  <div>
                    <p className="text-gray-500">Assigned To</p>
                    <p className="font-medium">{selectedIssue.assignedTo}</p>
                  </div>
                )}
                {selectedIssue.completedAt && (
                  <div>
                    <p className="text-gray-500">Completed At</p>
                    <p className="font-medium">{selectedIssue.completedAt}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-gray-500">Description</p>
                <p className="mt-1 text-gray-800">{selectedIssue.description}</p>
              </div>

              {selectedIssue.remarks && (
                <div>
                  <p className="text-gray-500">Remarks</p>
                  <p className="mt-1 text-gray-800">{selectedIssue.remarks}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                {selectedIssue.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange(selectedIssue.id, 'in-progress')}
                      disabled={isLoading}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Start Work
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600"
                      onClick={() => handleStatusChange(selectedIssue.id, 'cancelled')}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel Issue
                    </Button>
                  </>
                )}
                {selectedIssue.status === 'in-progress' && (
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusChange(selectedIssue.id, 'completed')}
                    disabled={isLoading}
                  >
                    <CheckCheck className="h-4 w-4 mr-1" />
                    Mark as Complete
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WardenMaintenance;