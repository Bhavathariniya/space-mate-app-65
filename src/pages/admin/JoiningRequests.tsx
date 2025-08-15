import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Eye, 
  Shield, 
  X, 
  MoreVertical,
  UserPlus,
  Calendar,
  Phone,
  Mail
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
  DialogDescription,
  DialogFooter,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

// Mock data - replace with actual API data
const mockRequests = [
  {
    id: "JR001",
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    roomType: "Double Sharing",
    moveInDate: "2024-03-01",
    status: "pending",
    documents: ["Aadhar Card", "College ID"],
    notes: "Prefers ground floor room"
  },
  {
    id: "JR002",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+91 9876543211",
    roomType: "Single Sharing",
    moveInDate: "2024-03-05",
    status: "approved",
    documents: ["Aadhar Card", "College ID", "Income Proof"],
    notes: "Vegetarian"
  },
  {
    id: "JR003",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+91 9876543212",
    roomType: "Triple Sharing",
    moveInDate: "2024-03-10",
    status: "rejected",
    documents: ["Aadhar Card"],
    notes: "Looking for long-term stay"
  }
];

const JoiningRequests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleBack = () => {
    navigate("/pg-admin");
  };

  const handleRequestAction = (requestId: string, action: string) => {
    switch (action) {
      case "view":
        const request = mockRequests.find(r => r.id === requestId);
        setSelectedRequest(request);
        setShowDetailsDialog(true);
        break;
      case "approve":
        toast({
          title: "Request Approved",
          description: "The joining request has been approved successfully.",
        });
        break;
      case "reject":
        const requestToReject = mockRequests.find(r => r.id === requestId);
        setSelectedRequest(requestToReject);
        setShowRejectDialog(true);
        break;
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Request Rejected",
      description: "The joining request has been rejected.",
    });
    setShowRejectDialog(false);
    setRejectReason("");
  };

  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = 
      request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.phone.includes(searchQuery);
    
    const matchesStatus = activeTab === "all" || request.status === activeTab;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Joining Requests</h1>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="single">Single Sharing</SelectItem>
              <SelectItem value="double">Double Sharing</SelectItem>
              <SelectItem value="triple">Triple Sharing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Room Type</TableHead>
                    <TableHead>Move-in Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{request.phone}</div>
                          <div className="text-sm text-gray-500">{request.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{request.roomType}</TableCell>
                      <TableCell>{format(new Date(request.moveInDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRequestAction(request.id, "view")}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {request.status === "pending" && (
                              <>
                                <DropdownMenuItem onClick={() => handleRequestAction(request.id, "approve")}>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRequestAction(request.id, "reject")}>
                                  <X className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Request Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              View and manage joining request details
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Name</h4>
                  <p className="mt-1">{selectedRequest.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Room Type</h4>
                  <p className="mt-1">{selectedRequest.roomType}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact</h4>
                  <div className="mt-1 space-y-1">
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {selectedRequest.phone}
                    </p>
                    <p className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {selectedRequest.email}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Move-in Date</h4>
                  <p className="mt-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(selectedRequest.moveInDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Documents</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedRequest.documents.map((doc: string) => (
                    <Badge key={doc} variant="secondary">
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                <p className="mt-1 text-sm text-gray-600">{selectedRequest.notes}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedRequest?.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleRequestAction(selectedRequest.id, "reject");
                    setShowDetailsDialog(false);
                  }}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    handleRequestAction(selectedRequest.id, "approve");
                    setShowDetailsDialog(false);
                  }}
                >
                  Approve
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Request Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reason for Rejection</label>
              <Input
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JoiningRequests; 