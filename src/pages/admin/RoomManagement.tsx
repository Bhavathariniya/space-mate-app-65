import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Plus, 
  Search, 
  Settings, 
  Wrench, 
  Calendar,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  MoreVertical,
  Users,
  IndianRupee,
  Wifi,
  Tv,
  Wind,
  Bath,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from "lucide-react";
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
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Mock data - replace with actual API data
const mockRooms = [
  {
    id: "101",
    type: "Double Sharing",
    capacity: 2,
    occupied: 1,
    status: "available",
    price: 8000,
    amenities: ["AC", "Attached Bathroom", "Wifi"],
    maintenance: {
      lastCheck: "2024-02-15",
      nextCheck: "2024-03-15",
      issues: []
    },
    residents: [
      { id: 1, name: "John Doe", joinDate: "2024-01-15" }
    ]
  },
  {
    id: "102",
    type: "Single Sharing",
    capacity: 1,
    occupied: 1,
    status: "occupied",
    price: 12000,
    amenities: ["AC", "Attached Bathroom", "Wifi", "TV"],
    maintenance: {
      lastCheck: "2024-02-10",
      nextCheck: "2024-03-10",
      issues: ["AC service required"]
    },
    residents: [
      { id: 2, name: "Jane Smith", joinDate: "2024-02-01" }
    ]
  },
  {
    id: "103",
    type: "Triple Sharing",
    capacity: 3,
    occupied: 2,
    status: "available",
    price: 6000,
    amenities: ["Attached Bathroom", "Wifi"],
    maintenance: {
      lastCheck: "2024-02-20",
      nextCheck: "2024-03-20",
      issues: []
    },
    residents: [
      { id: 3, name: "Mike Johnson", joinDate: "2024-01-20" },
      { id: 4, name: "Sarah Williams", joinDate: "2024-02-05" }
    ]
  }
];

const roomStatuses = ["all", "available", "occupied", "maintenance"];
const allAmenities = ["AC", "Attached Bathroom", "Wifi", "TV"];

const getAmenityIcon = (amenity: string) => {
  switch (amenity.toLowerCase()) {
    case "ac":
      return <Wind className="h-4 w-4" />;
    case "wifi":
      return <Wifi className="h-4 w-4" />;
    case "tv":
      return <Tv className="h-4 w-4" />;
    case "attached bathroom":
      return <Bath className="h-4 w-4" />;
    default:
      return null;
  }
};

const RoomManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("rooms");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [amenityFilter, setAmenityFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState(mockRooms);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  // Add Room Dialog State
  const [newRoom, setNewRoom] = useState({
    id: "",
    type: "single",
    capacity: 1,
    occupied: 0,
    status: "available",
    price: 0,
    amenities: [] as string[],
    maintenance: { lastCheck: "", nextCheck: "", issues: [] as string[] },
  });
  const addRoomFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Analytics
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === "available").length;
  const occupiedRooms = rooms.filter(r => r.status === "occupied").length;
  const maintenanceRooms = rooms.filter(r => r.maintenance.issues.length > 0).length;

  // Filtering
  const filteredRooms = rooms.filter(room =>
    (statusFilter === "all" || room.status === statusFilter || (statusFilter === "maintenance" && room.maintenance.issues.length > 0)) &&
    (typeFilter === "all" || room.type.toLowerCase().includes(typeFilter)) &&
    (room.price >= priceRange[0] && room.price <= priceRange[1]) &&
    (amenityFilter.length === 0 || amenityFilter.every(a => room.amenities.includes(a))) &&
    (room.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Bulk selection
  const toggleSelectRoom = (id: string) => {
    setSelectedRooms(selected =>
      selected.includes(id) ? selected.filter(rid => rid !== id) : [...selected, id]
    );
  };
  const selectAll = () => setSelectedRooms(filteredRooms.map(r => r.id));
  const clearSelection = () => setSelectedRooms([]);

  // Export to CSV
  const exportCSV = () => {
    const header = ["Room No", "Type", "Capacity", "Occupied", "Status", "Price", "Amenities"];
    const rows = filteredRooms.map(r => [r.id, r.type, r.capacity, r.occupied, r.status, r.price, r.amenities.join(";")]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rooms.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Responsive: show cards on mobile
  const isMobile = window.innerWidth < 640;

  // Room card expansion
  const handleExpand = (id: string) => setExpandedRoom(expandedRoom === id ? null : id);

  // Add Room Logic
  const handleAddRoomOpen = () => {
    setNewRoom({
      id: "",
      type: "single",
      capacity: 1,
      occupied: 0,
      status: "available",
      price: 0,
      amenities: [],
      maintenance: { lastCheck: "", nextCheck: "", issues: [] },
    });
    setShowAddRoom(true);
  };
  const handleAddRoomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNewRoom(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };
  const handleAmenityToggle = (amenity: string) => {
    setNewRoom(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };
  const handleAddRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRooms(prev => [
      ...prev,
      {
        ...newRoom,
        maintenance: { lastCheck: "-", nextCheck: "-", issues: [] },
        residents: [],
      },
    ]);
    setShowAddRoom(false);
  };

  // Delete Room Logic
  const handleDeleteRoom = (id: string) => {
    setRoomToDelete(id);
    setShowDeleteDialog(true);
  };
  const confirmDeleteRoom = () => {
    setRooms(prev => prev.filter(r => r.id !== roomToDelete));
    setShowDeleteDialog(false);
    setRoomToDelete(null);
  };

  // Toggle Room Status
  const toggleRoomStatus = (id: string, status: string) => {
    setRooms(prev => prev.map(r =>
      r.id === id ? { ...r, status } : r
    ));
  };

  const handleBack = () => {
    navigate("/pg-admin");
  };

  const handleRoomAction = (roomId: string, action: string) => {
    // TODO: Implement room actions
    console.log(`Room ${roomId} - Action: ${action}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Room Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all rooms in your PG
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
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1" /> Add Room
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-blue-100 p-2 rounded-full mb-2">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xs text-muted-foreground">Total Rooms</p>
              <p className="text-3xl font-bold">{totalRooms}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-green-100 p-2 rounded-full mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground">Available</p>
              <p className="text-3xl font-bold text-green-600">
                {availableRooms}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-purple-100 p-2 rounded-full mb-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-xs text-muted-foreground">Occupied</p>
              <p className="text-3xl font-bold text-purple-600">
                {occupiedRooms}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-amber-100 p-2 rounded-full mb-2">
                <Wrench className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-xs text-muted-foreground">Maintenance</p>
              <p className="text-3xl font-bold text-amber-600">
                {maintenanceRooms}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Room Status" />
          </SelectTrigger>
          <SelectContent>
            {roomStatuses.map(status => (
              <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Room Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="single">Single Sharing</SelectItem>
            <SelectItem value="double">Double Sharing</SelectItem>
            <SelectItem value="triple">Triple Sharing</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={showAddRoom} onOpenChange={setShowAddRoom}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" /> More Filters
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Rooms</DialogTitle>
              <DialogDescription>
                Set additional filters to refine the room list
              </DialogDescription>
            </DialogHeader>
            {/* Add more filter options here */}
          </DialogContent>
        </Dialog>
      </div>

      {/* Room Status Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="all" className="flex-1 sm:flex-none">
            All Rooms
          </TabsTrigger>
          <TabsTrigger value="available" className="flex-1 sm:flex-none">
            Available
          </TabsTrigger>
          <TabsTrigger value="occupied" className="flex-1 sm:flex-none">
            Occupied
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex-1 sm:flex-none">
            Maintenance
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Room {room.id}</CardTitle>
                      <CardDescription>{room.type}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleExpand(room.id)}>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" /> Edit Room
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete Room
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge variant={room.status === "available" ? "default" : "secondary"}>
                        {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                      </Badge>
                      <span className="text-lg font-semibold">₹{room.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Capacity</span>
                        <span>{room.occupied}/{room.capacity} occupied</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            {getAmenityIcon(amenity)}
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {room.maintenance.issues.length > 0 && (
                      <div className="mt-2">
                        <Badge variant="destructive" className="w-full justify-center">
                          {room.maintenance.issues.length} Maintenance {room.maintenance.issues.length === 1 ? 'Issue' : 'Issues'}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Room Details Dialog */}
      <Dialog open={selectedRoom !== null} onOpenChange={() => setSelectedRoom(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Room Details</DialogTitle>
          </DialogHeader>
          {selectedRoom && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Room {selectedRoom.id}</h3>
                <p className="text-muted-foreground">{selectedRoom.type}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={selectedRoom.status === "available" ? "default" : "secondary"}>
                    {selectedRoom.status.charAt(0).toUpperCase() + selectedRoom.status.slice(1)}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">₹{selectedRoom.price.toLocaleString()}/month</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Occupancy</p>
                  <p className="font-medium">{selectedRoom.occupied}/{selectedRoom.capacity}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Maintenance</p>
                  <p className="font-medium">{format(new Date(selectedRoom.maintenance.lastCheck), "dd MMM yyyy")}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.amenities.map((amenity: string, index: number) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedRoom.residents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Current Residents</p>
                  <div className="space-y-2">
                    {selectedRoom.residents.map((resident: any) => (
                      <div key={resident.id} className="flex justify-between items-center">
                        <span>{resident.name}</span>
                        <span className="text-sm text-muted-foreground">
                          Since {format(new Date(resident.joinDate), "dd MMM yyyy")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRoom.maintenance.issues.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Maintenance Issues</p>
                  <div className="space-y-1">
                    {selectedRoom.maintenance.issues.map((issue: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRoom(null)}>
              Close
            </Button>
            <Button>Edit Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Room Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete Room {roomToDelete}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRoom} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoomManagement; 