import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, Clock, CheckCircle, XCircle, AlertCircle, Download, ClipboardList, User, MoreVertical, Edit, Trash2, AlertTriangle, MessageSquare, Calendar, ArrowUpRight, Wrench, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/calendar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Mock data - replace with actual API data
const mockRequests = [
  {
    id: "SR001",
    type: "Maintenance",
    description: "AC not working properly",
    room: "101",
    status: "pending",
    priority: "high",
    createdAt: "2024-03-01",
    createdBy: "John Doe",
    assignedTo: null,
    notes: "Guest reported AC making unusual noise"
  },
  {
    id: "SR002",
    type: "Cleaning",
    description: "Room cleaning required",
    room: "102",
    status: "in-progress",
    priority: "medium",
    createdAt: "2024-03-02",
    createdBy: "Jane Smith",
    assignedTo: "John (Housekeeping)",
    notes: "Regular cleaning schedule"
  },
  {
    id: "SR003",
    type: "Plumbing",
    description: "Water leakage in bathroom",
    room: "103",
    status: "completed",
    priority: "high",
    createdAt: "2024-03-03",
    createdBy: "Michael Johnson",
    assignedTo: "Mike (Plumber)",
    notes: "Fixed the leakage, needs monitoring"
  },
  {
    id: "SR004",
    type: "Electrical",
    description: "Light bulb replacement needed",
    room: "201",
    status: "pending",
    priority: "low",
    createdAt: "2024-03-04",
    createdBy: "Sarah Williams",
    assignedTo: null,
    notes: "Two bulbs in the main room need replacement"
  },
  {
    id: "SR005",
    type: "Furniture",
    description: "Chair broken in room",
    room: "202",
    status: "pending",
    priority: "medium",
    createdAt: "2024-03-05",
    createdBy: "Robert Brown",
    assignedTo: null,
    notes: "Chair leg is broken and needs repair"
  }
];

const requestTypes = ["All", "Maintenance", "Cleaning", "Plumbing", "Electrical", "Furniture", "WiFi", "Other"];
const priorities = ["All", "High", "Medium", "Low"];
const staffMembers = ["John (Housekeeping)", "Mike (Plumber)", "Sarah (Electrician)", "David (Maintenance)"];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
};

const categories = [
  "All",
  "Maintenance",
  "Plumbing",
  "Electrical",
  "Housekeeping",
  "Security",
  "Others"
];

const ServiceRequests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [typeFilter, setTypeFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState(mockRequests);
  const [filterOpen, setFilterOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: "Maintenance",
    room: "",
    description: "",
    priority: "Medium",
    notes: "",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<number | null>(null);

  useEffect(() => {
    // Simulate API loading
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Analytics
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === "pending").length;
  const inProgressRequests = requests.filter(r => r.status === "in-progress").length;
  const completedRequests = requests.filter(r => r.status === "completed").length;

  // Filtering based on active tab
  const getFilteredRequests = () => {
    let filtered = requests;
    
    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(request => request.status === activeTab);
    }
    
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(request => 
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (request.createdBy && request.createdBy.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply type filter
    if (typeFilter !== "All") {
      filtered = filtered.filter(request => request.type === typeFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== "All") {
      filtered = filtered.filter(request => request.priority.toLowerCase() === priorityFilter.toLowerCase());
    }
    
    return filtered;
  };

  const filteredRequests = getFilteredRequests();

  // Bulk selection logic
  const toggleSelectRequest = (id: string) => {
    setSelectedRequests(selected =>
      selected.includes(id) ? selected.filter(rid => rid !== id) : [...selected, id]
    );
  };
  
  const selectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredRequests.map(r => r.id));
    }
  };

  // Export to CSV
  const exportCSV = () => {
    const header = ["ID", "Type", "Description", "Room", "Status", "Priority", "Created", "Assigned To", "Notes"];
    const rows = filteredRequests.map(r => [
      r.id, 
      r.type, 
      r.description, 
      r.room, 
      r.status, 
      r.priority, 
      r.createdAt, 
      r.assignedTo || "-", 
      r.notes
    ]);
    
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "service-requests.csv";
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: `Exported data for ${rows.length} service requests`,
    });
  };

  // New Request Dialog Logic
  const handleNewRequestChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNewRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newRequest.room || !newRequest.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const newRequestItem = {
      id: `SR${requests.length + 1}`.padStart(5, "0"),
        type: newRequest.type,
        description: newRequest.description,
        room: newRequest.room,
        status: "pending",
        priority: newRequest.priority.toLowerCase(),
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: "Admin",
        assignedTo: null,
        notes: newRequest.notes,
    };
    
    setRequests(prev => [newRequestItem, ...prev]);
    setShowNewRequest(false);
    
    toast({
      title: "Request Created",
      description: `Service request ${newRequestItem.id} has been created successfully`,
    });
    
    // Reset form
    setNewRequest({
      type: "Maintenance",
      room: "",
      description: "",
      priority: "Medium",
      notes: "",
    });
  };

  const handleRequestAction = (requestId: string, action: string, assignee?: string) => {
    // Implement request actions
    const updatedRequests = requests.map(req => {
      if (req.id === requestId) {
        switch(action) {
          case "complete":
            return { ...req, status: "completed" };
          case "in-progress":
            return { ...req, status: "in-progress" };
          case "pending":
            return { ...req, status: "pending" };
          case "assign":
            return { ...req, assignedTo: assignee || req.assignedTo };
          default:
            return req;
        }
      }
      return req;
    });
    
    setRequests(updatedRequests);
    
    toast({
      title: "Request Updated",
      description: `Service request ${requestId} has been updated`,
    });
    
    setShowRequestDetails(false);
  };

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };

  const handleBulkAction = (action: string) => {
    let updatedRequests = [...requests];
    
    switch(action) {
      case "complete":
        updatedRequests = updatedRequests.map(req => 
          selectedRequests.includes(req.id) ? { ...req, status: "completed" } : req
        );
        break;
      case "in-progress":
        updatedRequests = updatedRequests.map(req => 
          selectedRequests.includes(req.id) ? { ...req, status: "in-progress" } : req
        );
        break;
    }
    
    setRequests(updatedRequests);
    
    toast({
      title: `Bulk Action: ${action}`,
      description: `Applied ${action} to ${selectedRequests.length} selected requests`,
    });
    
    setSelectedRequests([]);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="outline" className="bg-red-100 text-red-800">High</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const handleDeleteRequest = (requestId: number) => {
    setRequestToDelete(requestId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteRequest = () => {
    toast({
      title: "Request Deleted",
      description: "The service request has been deleted successfully.",
    });
    setShowDeleteDialog(false);
    setRequestToDelete(null);
  };

  const handleStatusChange = (requestId: number, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Request status has been updated to ${newStatus}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Service Requests</h1>
          <p className="text-muted-foreground">
            Manage maintenance and service requests from residents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            className="h-9"
          >
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button onClick={() => setShowNewRequest(true)} size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1" /> New Request
          </Button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs text-muted-foreground">Total Requests</p>
              <p className="text-3xl font-bold">{totalRequests}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingRequests}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs text-muted-foreground">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{inProgressRequests}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedRequests}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, description, room or requester..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Request Type" />
          </SelectTrigger>
          <SelectContent>
            {requestTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {priorities.map(priority => (
              <SelectItem key={priority} value={priority}>{priority}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Tabs */}
      <Tabs 
        defaultValue="all" 
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-4 w-full md:w-fit">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Bulk Actions (visible when items selected) */}
      {selectedRequests.length > 0 && (
        <div className="flex items-center justify-between bg-muted p-2 rounded-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={selectedRequests.length === filteredRequests.length}
              onCheckedChange={selectAll}
            />
            <span className="text-sm font-medium">{selectedRequests.length} request{selectedRequests.length !== 1 ? 's' : ''} selected</span>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Bulk Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkAction("in-progress")}>
                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                  Mark In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("complete")}>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkAction("assign")}>
                  <User className="h-4 w-4 mr-2" />
                  Assign to Staff
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" onClick={() => setSelectedRequests([])}>
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={
                    filteredRequests.length > 0 && 
                    selectedRequests.length === filteredRequests.length
                  } 
                  onCheckedChange={selectAll}
                />
              </TableHead>
              <TableHead>Request</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5).fill(0).map((_, idx) => (
                <TableRow key={idx}>
                  {Array(7).fill(0).map((_, cellIdx) => (
                    <TableCell key={cellIdx} className="p-2">
                      <div className="h-6 bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ClipboardList className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No service requests found</p>
                    {searchQuery || typeFilter !== "All" || priorityFilter !== "All" ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSearchQuery("");
                          setTypeFilter("All");
                          setPriorityFilter("All");
                        }}
                      >
                        Clear Filters
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowNewRequest(true)}
                      >
                        Create New Request
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="p-3">
                    <Checkbox 
                      checked={selectedRequests.includes(request.id)} 
                      onCheckedChange={() => toggleSelectRequest(request.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell className="p-3" onClick={() => handleViewRequest(request)}>
                    <div>
                      <p className="font-medium text-sm">{request.id}: {request.type}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{request.description}</p>
                    </div>
                  </TableCell>
                  <TableCell onClick={() => handleViewRequest(request)}>
                    <p className="font-medium">Room {request.room}</p>
                  </TableCell>
                  <TableCell onClick={() => handleViewRequest(request)}>
                    {getStatusBadge(request.status)}
                  </TableCell>
                  <TableCell onClick={() => handleViewRequest(request)}>
                    {getPriorityBadge(request.priority)}
                  </TableCell>
                  <TableCell onClick={() => handleViewRequest(request)}>
                    {formatDate(request.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewRequest(request)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {request.status !== "completed" && (
                          <DropdownMenuItem onClick={() => handleRequestAction(request.id, "complete")}>
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" /> Mark as Completed
                          </DropdownMenuItem>
                        )}
                        {request.status !== "in-progress" && request.status !== "completed" && (
                          <DropdownMenuItem onClick={() => handleRequestAction(request.id, "in-progress")}>
                            <Clock className="h-4 w-4 mr-2 text-blue-600" /> Start Progress
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* New Request Dialog */}
      <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Service Request</DialogTitle>
            <DialogDescription>
              Fill in the details for the new service or maintenance request.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNewRequestSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Request Type
                </label>
                <Select
                  name="type"
                  value={newRequest.type}
                  onValueChange={(value) => setNewRequest(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {requestTypes.filter(t => t !== "All").map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="room" className="text-sm font-medium">
                  Room Number
                </label>
                <Input
                  id="room"
                  name="room"
                  value={newRequest.room}
                  onChange={handleNewRequestChange}
                  placeholder="e.g., 101"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={newRequest.description}
                onChange={handleNewRequestChange}
                placeholder="Describe the issue or service needed"
                required
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select
                  name="priority"
                  value={newRequest.priority}
                  onValueChange={(value) => setNewRequest(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.filter(p => p !== "All").map(priority => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Additional Notes
              </label>
              <Textarea
                id="notes"
                name="notes"
                value={newRequest.notes}
                onChange={handleNewRequestChange}
                placeholder="Any additional information or context"
                rows={2}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowNewRequest(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={showRequestDetails} onOpenChange={setShowRequestDetails}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Request Details - {selectedRequest.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p>{selectedRequest.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Room</p>
                  <p>Room {selectedRequest.room}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium">Priority</p>
                  <div className="mt-1">{getPriorityBadge(selectedRequest.priority)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium">Created On</p>
                  <p>{formatDate(selectedRequest.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Requested By</p>
                  <p>{selectedRequest.createdBy || "Not specified"}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="mt-1 p-2 bg-muted rounded-md">{selectedRequest.description}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Notes</p>
                <p className="mt-1 p-2 bg-muted rounded-md">{selectedRequest.notes || "No additional notes"}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Assigned To</p>
                <Select
                  value={selectedRequest.assignedTo || ""}
                  onValueChange={(value) => handleRequestAction(selectedRequest.id, "assign", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not assigned</SelectItem>
                    {staffMembers.map(staff => (
                      <SelectItem key={staff} value={staff}>{staff}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              {selectedRequest.status !== "completed" && (
                <Button 
                  variant="outline" 
                  className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:text-green-900"
                  onClick={() => handleRequestAction(selectedRequest.id, "complete")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" /> Mark as Completed
                </Button>
              )}
              {selectedRequest.status !== "in-progress" && selectedRequest.status !== "completed" && (
                <Button 
                  variant="outline"
                  className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 hover:text-blue-900"
                  onClick={() => handleRequestAction(selectedRequest.id, "in-progress")}
                >
                  <Clock className="h-4 w-4 mr-2" /> Start Progress
                </Button>
              )}
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRequest} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServiceRequests; 