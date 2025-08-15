import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Download, 
  Mail, 
  Phone, 
  Filter,
  ChevronDown, 
  ChevronUp,
  CheckCircle,
  XCircle,
  Building2,
  CalendarIcon,
  IndianRupee,
  ArrowUpRight,
  Clock,
  AlertCircle,
  FileText,
  MessageSquare,
  Eye,
  Users
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogClose,
  DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

// Mock data - replace with actual API call
const mockGuests = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    room: "101",
    roomType: "Double Sharing",
    moveInDate: "2023-12-15",
    moveOutDate: "2024-12-15",
    rentAmount: 8000,
    status: "active", // active, inactive, notice
    paymentStatus: "paid", // paid, pending, due
    profileImage: "",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+91 9876543211",
    room: "102",
    roomType: "Single Sharing",
    moveInDate: "2024-01-05",
    moveOutDate: "2024-12-05", 
    rentAmount: 12000,
    status: "active",
    paymentStatus: "due",
    profileImage: "",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael@example.com",
    phone: "+91 8765432101",
    room: "103",
    roomType: "Double Sharing",
    moveInDate: "2023-10-20",
    moveOutDate: "2024-10-20",
    rentAmount: 8000,
    status: "notice",
    paymentStatus: "paid",
    profileImage: "",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "+91 9871234560",
    room: "201",
    roomType: "Single Sharing",
    moveInDate: "2024-02-01",
    moveOutDate: "2025-02-01",
    rentAmount: 12000,
    status: "active",
    paymentStatus: "pending",
    profileImage: "",
  },
  {
    id: 5,
    name: "Robert Brown",
    email: "robert@example.com",
    phone: "+91 8890123456",
    room: "202",
    roomType: "Triple Sharing",
    moveInDate: "2023-11-10",
    moveOutDate: "2024-11-10",
    rentAmount: 6000,
    status: "inactive",
    paymentStatus: "paid",
    profileImage: "",
  },
];

// Room types for filter
const roomTypes = [
  "All",
  "Single Sharing",
  "Double Sharing",
  "Triple Sharing",
  "Quad Sharing"
];

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  notice: "bg-amber-100 text-amber-800",
  paid: "bg-green-100 text-green-800",
  pending: "bg-blue-100 text-blue-800",
  due: "bg-red-100 text-red-800",
};

const GuestsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roomTypeFilter, setRoomTypeFilter] = useState("All");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [selectedGuests, setSelectedGuests] = useState<number[]>([]);
  const [showGuestDetails, setShowGuestDetails] = useState(false);
  const [currentGuest, setCurrentGuest] = useState<any>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Analytics summary
  const totalGuests = mockGuests.length;
  const activeGuests = mockGuests.filter(g => g.status === "active").length;
  const inactiveGuests = mockGuests.filter(g => g.status !== "active").length;
  const newGuests = mockGuests.filter(g => new Date(g.moveInDate) > new Date(new Date().setDate(new Date().getDate() - 30))).length;

  // Filtering logic
  const getFilteredGuests = () => {
    let filtered = mockGuests;
    
    if (activeTab !== "all") {
      filtered = filtered.filter(guest => guest.status === activeTab);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(guest => 
        guest.name.toLowerCase().includes(query) ||
        guest.email.toLowerCase().includes(query) ||
        guest.room.includes(query) ||
        guest.phone.includes(query)
      );
    }
    
    if (roomTypeFilter !== "All") {
      filtered = filtered.filter(guest => guest.roomType === roomTypeFilter);
    }
    
    if (dateRange.from) {
      filtered = filtered.filter(guest => new Date(guest.moveInDate) >= dateRange.from!);
    }
    
    if (dateRange.to) {
      filtered = filtered.filter(guest => new Date(guest.moveInDate) <= dateRange.to!);
    }
    
    return filtered;
  };

  const filteredGuests = getFilteredGuests();

  // Selection handlers
  const toggleSelectGuest = (id: number) => {
    setSelectedGuests(selected =>
      selected.includes(id) ? selected.filter(gid => gid !== id) : [...selected, id]
    );
  };
  
  const selectAll = () => {
    setSelectedGuests(
      selectedGuests.length === filteredGuests.length 
        ? [] 
        : filteredGuests.map(g => g.id)
    );
  };

  // Export functionality
  const exportCSV = () => {
    const header = ["Name", "Room", "Room Type", "Phone", "Email", "Status", "Payment", "Move-in Date"];
    const rows = filteredGuests.map(g => [
      g.name, 
      g.room, 
      g.roomType, 
      g.phone, 
      g.email, 
      g.status, 
      g.paymentStatus,
      g.moveInDate
    ]);
    
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "residents.csv";
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: `Exported data for ${rows.length} residents`,
    });
  };

  // Action handlers
  const handleAddGuest = () => navigate("/pg-admin/residents/add");
  const handleEditGuest = (guestId: number) => navigate(`/pg-admin/residents/${guestId}/edit`);
  
  const handleViewGuest = (guest: any) => {
    setCurrentGuest(guest);
    setShowGuestDetails(true);
  };

  const handleDeleteGuest = (guestId: number) => {
    setGuestToDelete(guestId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteGuest = () => {
    toast({
      title: "Resident Removed",
      description: `${mockGuests.find(g => g.id === guestToDelete)?.name} has been removed`,
    });
    setShowDeleteDialog(false);
    setGuestToDelete(null);
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: `Bulk Action: ${action}`,
      description: `Applied ${action} to ${selectedGuests.length} selected residents`,
    });
    setSelectedGuests([]);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Residents Management</h1>
          <p className="text-muted-foreground">
            Manage all your PG residents in one place
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
          <Button onClick={handleAddGuest} size="sm" className="h-9">
            <UserPlus className="h-4 w-4 mr-1" /> Add Resident
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-indigo-100 p-2 rounded-full mb-2">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-xs text-muted-foreground">Total Residents</p>
              <p className="text-3xl font-bold">{totalGuests}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-green-100 p-2 rounded-full mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-3xl font-bold text-green-600">{activeGuests}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-amber-100 p-2 rounded-full mb-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-xs text-muted-foreground">Inactive/Notice</p>
              <p className="text-3xl font-bold text-amber-600">{inactiveGuests}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-blue-100 p-2 rounded-full mb-2">
                <ArrowUpRight className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xs text-muted-foreground">New (30 days)</p>
              <p className="text-3xl font-bold text-blue-600">{newGuests}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone or room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Room Type" />
          </SelectTrigger>
          <SelectContent>
            {roomTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Advanced Filters</span>
              </div>
              {(dateRange.from || dateRange.to) && (
                <Badge variant="secondary" className="ml-2">Active</Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Residents</DialogTitle>
              <DialogDescription>
                Set advanced filters to refine the residents list
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Move-in Date Range</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">From</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? format(dateRange.from, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => 
                            setDateRange(prev => ({ ...prev, from: date }))
                          }
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">To</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.to ? format(dateRange.to, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => 
                            setDateRange(prev => ({ ...prev, to: date }))
                          }
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDateRange({ from: null, to: null });
                  setFilterOpen(false);
                }}
              >
                Reset
              </Button>
              <Button onClick={() => setFilterOpen(false)}>
                Apply Filters
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="all" className="flex-1 sm:flex-none">
            All
          </TabsTrigger>
          <TabsTrigger value="active" className="flex-1 sm:flex-none">
            Active
          </TabsTrigger>
          <TabsTrigger value="notice" className="flex-1 sm:flex-none">
            Notice Period
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex-1 sm:flex-none">
            Inactive
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Residents List
              </CardTitle>
              {selectedGuests.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("message")}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" /> Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("export")}
                  >
                    <FileText className="h-4 w-4 mr-1" /> Export
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            filteredGuests.length > 0 &&
                            selectedGuests.length === filteredGuests.length
                          }
                          onCheckedChange={selectAll}
                        />
                      </TableHead>
                      <TableHead>Resident</TableHead>
                      <TableHead className="hidden md:table-cell">Room</TableHead>
                      <TableHead className="hidden lg:table-cell">Contact</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGuests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedGuests.includes(guest.id)}
                            onCheckedChange={() => toggleSelectGuest(guest.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={guest.profileImage} />
                              <AvatarFallback>
                                {guest.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{guest.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {guest.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div>
                            <p className="font-medium">Room {guest.room}</p>
                            <p className="text-sm text-muted-foreground">
                              {guest.roomType}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div>
                            <p className="text-sm">{guest.phone}</p>
                            <p className="text-sm text-muted-foreground">
                              Move in: {formatDate(guest.moveInDate)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex flex-col gap-1">
                            <Badge variant="secondary" className={cn(
                              statusColors[guest.status as keyof typeof statusColors]
                            )}>
                              {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
                            </Badge>
                            <Badge variant="outline" className={cn(
                              statusColors[guest.paymentStatus as keyof typeof statusColors]
                            )}>
                              {guest.paymentStatus.charAt(0).toUpperCase() + guest.paymentStatus.slice(1)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewGuest(guest)}>
                                <Eye className="h-4 w-4 mr-2" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditGuest(guest.id)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteGuest(guest.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Guest Details Dialog */}
      <Dialog open={showGuestDetails} onOpenChange={setShowGuestDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Resident Details</DialogTitle>
          </DialogHeader>
          {currentGuest && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={currentGuest.profileImage} />
                  <AvatarFallback className="text-lg">
                    {currentGuest.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{currentGuest.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentGuest.email}</p>
                  <p className="text-sm text-muted-foreground">{currentGuest.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Room Details</p>
                  <p className="font-medium">Room {currentGuest.room}</p>
                  <p className="text-sm">{currentGuest.roomType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Rent</p>
                  <p className="font-medium">₹ {currentGuest.rentAmount}</p>
                  <Badge variant="outline" className={cn(
                    statusColors[currentGuest.paymentStatus as keyof typeof statusColors]
                  )}>
                    {currentGuest.paymentStatus}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Move-in Date</p>
                  <p className="font-medium">{formatDate(currentGuest.moveInDate)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Move-out Date</p>
                  <p className="font-medium">{formatDate(currentGuest.moveOutDate)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className={cn(
                    statusColors[currentGuest.status as keyof typeof statusColors]
                  )}>
                    {currentGuest.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGuestDetails(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowGuestDetails(false);
              handleEditGuest(currentGuest.id);
            }}>
              Edit Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Resident</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this resident? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGuest} className="bg-red-600">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GuestsList; 