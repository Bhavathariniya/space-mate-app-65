import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Ban, CheckCheck, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface JoinRequest {
  id: string;
  name: string;
  email: string;
  status: "pending" | "restricted" | "approved" | "rejected";
  date: string;
  remarks?: string;
}

const WardenRequests = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
  const [showRemarkDialog, setShowRemarkDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [remark, setRemark] = useState("");

  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([
    { id: "1", name: "John Doe", email: "john.doe@example.com", status: "pending", date: "2024-03-22" },
    { id: "2", name: "Jane Smith", email: "jane.smith@example.com", status: "restricted", date: "2024-03-21" },
    { id: "3", name: "Alice Johnson", email: "alice.j@example.com", status: "pending", date: "2024-03-20" },
    { id: "4", name: "Bob Williams", email: "bob.w@example.com", status: "restricted", date: "2024-03-19" },
    { id: "5", name: "Emma Brown", email: "emma.b@example.com", status: "approved", date: "2024-03-18", remarks: "Room 102 assigned" },
    { id: "6", name: "David Lee", email: "david.l@example.com", status: "rejected", date: "2024-03-17", remarks: "No rooms available" },
  ]);

  const openRemarkDialog = (request: JoinRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setRemark("");
    setShowRemarkDialog(true);
  };

  const handleRequestAction = async () => {
    if (!selectedRequest || !actionType) return;

    if (selectedRequest.status === "restricted") {
      toast({
        title: "Action Restricted",
        description: "This request requires Admin approval and cannot be acted upon by a Warden.",
        variant: "destructive",
        duration: 4000,
      });
      setShowRemarkDialog(false);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setJoinRequests(joinRequests.map(req => 
        req.id === selectedRequest.id 
          ? { ...req, status: actionType === "approve" ? "approved" : "rejected", remarks: remark || undefined } 
          : req
      ));

      toast({
        title: actionType === "approve" ? "Request Approved" : "Request Rejected",
        description: actionType === "approve" 
          ? "The join request has been approved." 
          : "The join request has been rejected.",
        variant: actionType === "approve" ? "default" : "destructive",
        duration: 3000,
      });

      setShowRemarkDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter for different request categories
  const pendingRequests = joinRequests.filter(req => req.status === "pending");
  const restrictedRequests = joinRequests.filter(req => req.status === "restricted");
  const approvedRejectedRequests = joinRequests.filter(req => 
    req.status === "approved" || req.status === "rejected"
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Join Requests</h1>
          <p className="text-gray-500">Review and manage new tenant requests to join your PG</p>
        </div>
      </div>

      {/* Pending Requests Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>
            These requests require your review and action. You can approve or reject them based on room availability.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No pending requests at this time</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell className="text-sm text-gray-500">{request.date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Pending</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openRemarkDialog(request, "approve")}
                            className="text-green-600 hover:bg-green-50"
                          >
                            <CheckCheck className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openRemarkDialog(request, "reject")}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Restricted Requests Card */}
      {restrictedRequests.length > 0 && (
        <Card className="shadow-sm border-l-4 border-yellow-500">
          <CardHeader>
            <CardTitle className="text-yellow-800">Restricted Requests</CardTitle>
            <CardDescription>
              These requests require Admin approval and cannot be acted upon by Wardens.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {restrictedRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell className="text-sm text-gray-500">{request.date}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">Restricted</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previous Approvals/Rejections */}
      {approvedRejectedRequests.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Past Requests</CardTitle>
            <CardDescription>
              Previously approved or rejected join requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedRejectedRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell className="text-sm text-gray-500">{request.date}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={request.status === "approved" ? "success" : "destructive"}
                        >
                          {request.status === "approved" ? "Approved" : "Rejected"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {request.remarks || "No remarks"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3 text-yellow-800">
        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium">Important Note:</h3>
          <p className="text-sm text-yellow-700">
            Requests marked as "Restricted" require approval from the PG Admin/Owner. You can only act on requests with a "Pending" status.
          </p>
        </div>
      </div>

      {/* Add Remark Dialog */}
      <Dialog open={showRemarkDialog} onOpenChange={setShowRemarkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Request" : "Reject Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" 
                ? "Add any notes or room assignment details before approving this request." 
                : "Please provide a reason for rejecting this request."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Request Details</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <p><span className="font-medium">Name:</span> {selectedRequest?.name}</p>
                <p><span className="font-medium">Email:</span> {selectedRequest?.email}</p>
                <p><span className="font-medium">Date:</span> {selectedRequest?.date}</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {actionType === "approve" ? "Notes (Optional)" : "Reason for Rejection"}
              </label>
              <Textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder={actionType === "approve" 
                  ? "e.g., Room 101 assigned, move-in date..." 
                  : "e.g., No rooms available, incomplete documentation..."
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowRemarkDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                variant={actionType === "approve" ? "default" : "destructive"}
                onClick={handleRequestAction}
                disabled={isLoading || (actionType === "reject" && !remark)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  actionType === "approve" ? "Approve Request" : "Reject Request"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WardenRequests; 