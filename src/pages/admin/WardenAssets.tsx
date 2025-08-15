import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  SquarePen, Plus, Search, Filter, 
  Building2, BedDouble, Sofa, 
  Table as TableIcon, Trash2, 
  AlertCircle, Loader2, History,
  Wrench
} from "lucide-react";

interface Asset {
  id: string;
  name: string;
  quantity: number;
  type: "room" | "bed" | "facility";
  lastUpdated: string;
  status: "active" | "maintenance" | "unavailable";
  condition: "good" | "fair" | "poor";
  location?: string;
  notes?: string;
  history?: AssetHistory[];
}

interface AssetHistory {
  id: string;
  action: "added" | "updated" | "maintenance" | "removed";
  quantity: number;
  timestamp: string;
  performedBy: string;
  notes?: string;
}

const WardenAssets = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [showAddAssetDialog, setShowAddAssetDialog] = useState(false);
  const [showAssetHistoryDialog, setShowAssetHistoryDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "facility",
    quantity: 1,
    status: "active",
    condition: "good",
    location: "",
    notes: ""
  });

  const [assets, setAssets] = useState<Asset[]>([
    { 
      id: "1", 
      name: "Rooms", 
      quantity: 10, 
      type: "room", 
      lastUpdated: "2024-03-20",
      status: "active",
      condition: "good",
      location: "Main Building",
      history: [
        {
          id: "h1",
          action: "added",
          quantity: 10,
          timestamp: "2024-03-20",
          performedBy: "Admin",
          notes: "Initial setup"
        }
      ]
    },
    { 
      id: "2", 
      name: "Beds/Cots", 
      quantity: 50, 
      type: "bed", 
      lastUpdated: "2024-03-20",
      status: "active",
      condition: "good",
      location: "All Rooms",
      history: [
        {
          id: "h2",
          action: "added",
          quantity: 50,
          timestamp: "2024-03-20",
          performedBy: "Admin",
          notes: "Initial setup"
        }
      ]
    },
    { 
      id: "3", 
      name: "Chairs", 
      quantity: 30, 
      type: "facility", 
      lastUpdated: "2024-03-20",
      status: "active",
      condition: "good",
      location: "Common Area",
      history: [
        {
          id: "h3",
          action: "added",
          quantity: 30,
          timestamp: "2024-03-20",
          performedBy: "Admin",
          notes: "Initial setup"
        }
      ]
    },
    { 
      id: "4", 
      name: "Wardrobes", 
      quantity: 20, 
      type: "facility", 
      lastUpdated: "2024-03-21",
      status: "maintenance",
      condition: "fair",
      location: "Rooms 101-120",
      history: [
        {
          id: "h4",
          action: "added",
          quantity: 20,
          timestamp: "2024-03-21",
          performedBy: "Admin",
          notes: "Initial setup"
        },
        {
          id: "h5",
          action: "maintenance",
          quantity: 20,
          timestamp: "2024-03-22",
          performedBy: "Warden",
          notes: "Regular maintenance check"
        }
      ]
    },
    { 
      id: "5", 
      name: "Tables", 
      quantity: 25, 
      type: "facility", 
      lastUpdated: "2024-03-21",
      status: "active",
      condition: "good",
      location: "Study Room",
      history: [
        {
          id: "h6",
          action: "added",
          quantity: 25,
          timestamp: "2024-03-21",
          performedBy: "Admin",
          notes: "Initial setup"
        }
      ]
    },
  ]);

  // Filtered assets
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || asset.type === filterType;
    const matchesStatus = filterStatus === "all" || asset.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Asset statistics
  const totalAssets = assets.reduce((sum, asset) => sum + asset.quantity, 0);
  const assetsByType = {
    room: assets.filter(a => a.type === "room").reduce((sum, a) => sum + a.quantity, 0),
    bed: assets.filter(a => a.type === "bed").reduce((sum, a) => sum + a.quantity, 0),
    facility: assets.filter(a => a.type === "facility").reduce((sum, a) => sum + a.quantity, 0),
  };
  const maintenanceNeeded = assets.filter(a => a.status === "maintenance").length;

  // Handlers
  const handleAssetUpdate = async (id: string, updates: Partial<Asset>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAssets(prev => prev.map(asset => {
        if (asset.id === id) {
          const updatedAsset = { ...asset, ...updates, lastUpdated: new Date().toISOString().split('T')[0] };
          
          // Add to history
          const historyEntry: AssetHistory = {
            id: Date.now().toString(),
            action: "updated",
            quantity: updatedAsset.quantity,
            timestamp: new Date().toISOString(),
            performedBy: currentUser?.name || "Warden",
            notes: "Asset updated"
          };
          
          return {
            ...updatedAsset,
            history: [...(asset.history || []), historyEntry]
          };
        }
        return asset;
      }));

      toast({
        title: "Asset Updated",
        description: "The asset has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update asset. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAsset = async () => {
    if (!newAsset.name || !newAsset.type) {
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
      
      const newAssetEntry: Asset = {
        id: Date.now().toString(),
        ...newAsset,
        type: newAsset.type as "room" | "bed" | "facility",
        status: newAsset.status as "active" | "maintenance" | "unavailable",
        condition: newAsset.condition as "good" | "fair" | "poor",
        lastUpdated: new Date().toISOString().split('T')[0],
        history: [{
          id: Date.now().toString(),
          action: "added",
          quantity: newAsset.quantity,
          timestamp: new Date().toISOString(),
          performedBy: currentUser?.name || "Warden",
          notes: "New asset added"
        }]
      };

      setAssets(prev => [...prev, newAssetEntry]);
      setShowAddAssetDialog(false);
      setNewAsset({
        name: "",
        type: "facility",
        quantity: 1,
        status: "active",
        condition: "good",
        location: "",
        notes: ""
      });

      toast({
        title: "Success",
        description: "New asset has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add asset. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAssets(prev => prev.filter(asset => asset.id !== id));

      toast({
        title: "Success",
        description: "Asset has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove asset. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Management</h1>
          <p className="text-gray-500">Manage and track all PG assets</p>
        </div>
        <Dialog open={showAddAssetDialog} onOpenChange={setShowAddAssetDialog}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
              <DialogDescription>Fill in the details to add a new asset to your inventory.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Asset Name</label>
                <Input
                  value={newAsset.name}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter asset name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Asset Type</label>
                <Select
                  value={newAsset.type}
                  onValueChange={(value) => setNewAsset(prev => ({ ...prev, type: value as "room" | "bed" | "facility" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room">Room</SelectItem>
                    <SelectItem value="bed">Bed/Cot</SelectItem>
                    <SelectItem value="facility">Facility</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  value={newAsset.quantity}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={newAsset.location}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter location"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={newAsset.status}
                  onValueChange={(value) => setNewAsset(prev => ({ ...prev, status: value as "active" | "maintenance" | "unavailable" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Condition</label>
                <Select
                  value={newAsset.condition}
                  onValueChange={(value) => setNewAsset(prev => ({ ...prev, condition: value as "good" | "fair" | "poor" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                onClick={handleAddAsset}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Asset"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Building2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
            <p className="text-xs text-gray-500">Total items in inventory</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rooms & Beds</CardTitle>
            <BedDouble className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetsByType.room} / {assetsByType.bed}</div>
            <p className="text-xs text-gray-500">Rooms / Beds available</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facilities</CardTitle>
            <Sofa className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetsByType.facility}</div>
            <p className="text-xs text-gray-500">Total facility items</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceNeeded}</div>
            <p className="text-xs text-gray-500">Items needing attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Asset Inventory</CardTitle>
              <CardDescription>Manage and track all your PG assets</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full sm:w-[200px]"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="room">Rooms</SelectItem>
                  <SelectItem value="bed">Beds</SelectItem>
                  <SelectItem value="facility">Facilities</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                      No assets found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset) => (
                    <TableRow key={asset.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {asset.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          className="w-20"
                          value={asset.quantity}
                          onChange={(e) => handleAssetUpdate(asset.id, { quantity: parseInt(e.target.value) })}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          asset.status === "active" ? "success" :
                          asset.status === "maintenance" ? "warning" : "destructive"
                        }>
                          {asset.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          asset.condition === "good" ? "success" :
                          asset.condition === "fair" ? "warning" : "destructive"
                        }>
                          {asset.condition}
                        </Badge>
                      </TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell>{asset.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAsset(asset);
                              setShowAssetHistoryDialog(true);
                            }}
                            title="View History"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteAsset(asset.id)}
                            disabled={isLoading}
                            title="Delete Asset"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Asset History Dialog */}
      <Dialog open={showAssetHistoryDialog} onOpenChange={setShowAssetHistoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asset History - {selectedAsset?.name}</DialogTitle>
            <DialogDescription>View the complete history of this asset.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {selectedAsset?.history?.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No history available for this asset</p>
            ) : (
              selectedAsset?.history?.map((entry) => (
                <div key={entry.id} className="flex items-start space-x-4 p-3 rounded-lg border">
                  <div className={`p-2 rounded-full ${
                    entry.action === "added" ? "bg-green-100" :
                    entry.action === "updated" ? "bg-blue-100" :
                    entry.action === "maintenance" ? "bg-yellow-100" : "bg-red-100"
                  }`}>
                    {entry.action === "added" && <Plus className="h-4 w-4 text-green-600" />}
                    {entry.action === "updated" && <SquarePen className="h-4 w-4 text-blue-600" />}
                    {entry.action === "maintenance" && <Wrench className="h-4 w-4 text-yellow-600" />}
                    {entry.action === "removed" && <Trash2 className="h-4 w-4 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium capitalize">{entry.action}</h4>
                      <span className="text-sm text-gray-500">{entry.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600">Quantity: {entry.quantity}</p>
                    <p className="text-sm text-gray-500">By: {entry.performedBy}</p>
                    {entry.notes && (
                      <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WardenAssets; 