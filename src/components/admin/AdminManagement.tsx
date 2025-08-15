import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  Search,
  Filter,
  Building2,
  IndianRupee,
  RefreshCw,
  Eye,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  MapPin,
  ChevronDown,
  UserPlus,
  Edit,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PGAdmin, useUpdateSubscription, useExtendTrial } from "@/hooks/usePGAdmins";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AdminManagementProps {
  admins: PGAdmin[];
  isLoading?: boolean;
  onRefresh?: () => void;
  selectedAdmins?: string[];
  onSelectionChange?: (adminIds: string[]) => void;
  onAdminClick?: (admin: PGAdmin) => void;
}

const AdminManagement = ({
  admins,
  isLoading,
  onRefresh,
  selectedAdmins = [],
  onSelectionChange,
  onAdminClick
}: AdminManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isUpdateSubscriptionModalOpen, setIsUpdateSubscriptionModalOpen] = useState(false);
  const [selectedAdminToUpdate, setSelectedAdminToUpdate] = useState<PGAdmin | null>(null);
  const [newSubscriptionTier, setNewSubscriptionTier] = useState("");

  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const updateSubscriptionMutation = useUpdateSubscription();
  const extendTrialMutation = useExtendTrial();

  // Filter and sort admins
  const filteredAndSortedAdmins = admins
    .filter(admin => {
      const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           admin.commonId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || admin.subscriptionStatus === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortBy === "monthlyRevenue") {
        return sortOrder === "asc" ? a.monthlyRevenue - b.monthlyRevenue : b.monthlyRevenue - a.monthlyRevenue;
      } else if (sortBy === "subscriptionStatus") {
        return sortOrder === "asc" ? a.subscriptionStatus.localeCompare(b.subscriptionStatus) : b.subscriptionStatus.localeCompare(a.subscriptionStatus);
      }
      return 0;
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-medium">Active</Badge>;
      case "free":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs font-medium">Free Trial</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-700 border-red-200 text-xs font-medium">Expired</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs font-medium">Pending</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Unknown</Badge>;
    }
  };

  const handleUpdateSubscription = () => {
    if (!selectedAdminToUpdate || !newSubscriptionTier) return;

    updateSubscriptionMutation.mutate({ adminId: selectedAdminToUpdate.id, newTier: newSubscriptionTier }, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: `Subscription for ${selectedAdminToUpdate.name} updated to ${newSubscriptionTier} successfully`,
        });
        setIsUpdateSubscriptionModalOpen(false);
        setSelectedAdminToUpdate(null);
        setNewSubscriptionTier("");
        onRefresh?.(); // Refresh data after successful update
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to update subscription: ${error.message || 'Unknown error'}`,
          variant: "destructive",
        });
      }
    });
  };

  const handleExtendTrial = (adminId: string) => {
    extendTrialMutation.mutate(adminId, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Trial extended by 30 days successfully",
        });
        onRefresh?.();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to extend trial: ${error.message || 'Unknown error'}`,
          variant: "destructive",
        });
      }
    });
  };

  const handleAdminSelection = (adminId: string, checked: boolean) => {
    if (!onSelectionChange) return;
    
    if (checked) {
      onSelectionChange([...selectedAdmins, adminId]);
    } else {
      onSelectionChange(selectedAdmins.filter(id => id !== adminId));
    }
  };

  const handleCallAdmin = (email: string) => {
    toast({
      title: "Call Feature",
      description: `Calling ${email}... (Feature would integrate with VoIP service)`,
    });
  };

  const handleEmailAdmin = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 lg:p-8">
        <div className="animate-pulse">
          <div className="h-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="h-6 w-6 text-indigo-600" />
          PG Admin Management
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2 w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Badge variant="secondary" className="text-base px-4 py-2 w-full sm:w-auto text-center">
            {filteredAndSortedAdmins.length} Total Admins
          </Badge>
        </div>
      </div>

      {/* Search, Filter, Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative col-span-full lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full">
            <Filter className="h-4 w-4 text-gray-400 mr-2" />
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="free">Free Trial</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Sort by {sortBy === "name" ? "Name" : sortBy === "monthlyRevenue" ? "Revenue" : "Status"} ({sortOrder === "asc" ? "Asc" : "Desc"})
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setSortBy("name"); setSortOrder("asc"); }}>Name (A-Z)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("name"); setSortOrder("desc"); }}>Name (Z-A)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("monthlyRevenue"); setSortOrder("asc"); }}>Revenue (Low to High)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("monthlyRevenue"); setSortOrder("desc"); }}>Revenue (High to Low)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Admin List - Desktop Table */}
      {!isMobile && (
        <Card className="shadow-lg">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>PGs</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                      <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      No admins found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedAdmins.map((admin) => (
                    <TableRow key={admin.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedAdmins.includes(admin.id)}
                          onCheckedChange={(checked) => handleAdminSelection(admin.id, !!checked)}
                          className="flex-shrink-0"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.commonId}</TableCell>
                      <TableCell>{admin.totalPGs}</TableCell>
                      <TableCell>₹{admin.monthlyRevenue.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(admin.subscriptionStatus)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onAdminClick?.(admin)}>
                              <Eye className="mr-2 h-4 w-4" />View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEmailAdmin(admin.email)}>
                              <Mail className="mr-2 h-4 w-4" />Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCallAdmin(admin.email)}>
                              <Phone className="mr-2 h-4 w-4" />Call Admin
                            </DropdownMenuItem>
                            {admin.subscriptionStatus !== "active" && (
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedAdminToUpdate(admin);
                                  setNewSubscriptionTier("active");
                                  setIsUpdateSubscriptionModalOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />Update Subscription
                              </DropdownMenuItem>
                            )}
                            {admin.subscriptionStatus === "free" && (
                              <DropdownMenuItem onClick={() => handleExtendTrial(admin.id)}>
                                <Clock className="mr-2 h-4 w-4" />Extend Trial
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
          </CardContent>
        </Card>
      )}

      {/* Admin Cards - Mobile Optimized with Accordion */}
      {isMobile && (
        <div className="space-y-3">
          {filteredAndSortedAdmins.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              No admins found matching your criteria
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filteredAndSortedAdmins.map((admin) => (
                <AccordionItem key={admin.id} value={admin.id} className="border border-slate-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-md rounded-lg">
                  <div className="flex items-center gap-3 p-4">
                    <div className="flex-shrink-0">
                      <Checkbox
                        checked={selectedAdmins.includes(admin.id)}
                        onCheckedChange={(checked) => handleAdminSelection(admin.id, !!checked)}
                      />
                    </div>
                    <AccordionTrigger className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg flex-shrink-0">
                          {admin.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h3 className="font-semibold text-slate-900 text-base truncate">{admin.name}</h3>
                          <p className="text-slate-600 text-sm truncate">{admin.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{admin.commonId}</Badge>
                            {getStatusBadge(admin.subscriptionStatus)}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent className="p-4 bg-slate-50 border-t border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-indigo-500" />
                        <span>{admin.totalPGs} PGs Managed</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-emerald-600">
                        <IndianRupee className="h-4 w-4 text-emerald-500" />
                        <span>₹{admin.monthlyRevenue.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-purple-500" />
                        <span>{admin.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-500" />
                        <span>{admin.phoneNumber || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <span>Joined: {new Date(admin.joinDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span>Location: {admin.location || 'N/A'}</span>
                      </div>
                      {admin.subscriptionEndDate && (
                        <div className="flex items-center gap-2 col-span-full">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Subscription Ends: {new Date(admin.subscriptionEndDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => onAdminClick?.(admin)} className="gap-1">
                        <Eye className="h-4 w-4" /> View Full Profile
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEmailAdmin(admin.email)} className="gap-1">
                        <Mail className="h-4 w-4" /> Email
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleCallAdmin(admin.email)} className="gap-1">
                        <Phone className="h-4 w-4" /> Call
                      </Button>
                      {admin.subscriptionStatus === "free" && (
                        <Button size="sm" variant="outline" onClick={() => handleExtendTrial(admin.id)} className="gap-1">
                          <Clock className="h-4 w-4" /> Extend Trial
                        </Button>
                      )}
                      {admin.subscriptionStatus !== "active" && (
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedAdminToUpdate(admin);
                            setNewSubscriptionTier("active");
                            setIsUpdateSubscriptionModalOpen(true);
                          }}
                          className="gap-1"
                        >
                          <Edit className="h-4 w-4" /> Update Subscription
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      )}

      {/* Update Subscription Modal */}
      <Dialog open={isUpdateSubscriptionModalOpen} onOpenChange={setIsUpdateSubscriptionModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Subscription</DialogTitle>
            <DialogDescription>
              Update the subscription tier for {selectedAdminToUpdate?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tier" className="text-right">
                New Tier
              </Label>
              <Select value={newSubscriptionTier} onValueChange={setNewSubscriptionTier}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a new tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="free">Free Trial</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateSubscriptionModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateSubscription} disabled={updateSubscriptionMutation.isPending}>
              {updateSubscriptionMutation.isPending ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminManagement;
