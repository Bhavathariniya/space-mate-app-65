import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Clock, AlertTriangle, User } from "lucide-react";

interface ServiceRequest {
  id: string;
  asset: string;
  issue: string;
  requests: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'acknowledged' | 'in-progress' | 'completed';
  submittedBy: string[];
  description: string;
  submittedAt: string;
}

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ServiceRequest | null;
  onUpdateStatus: (id: string, status: string, notes?: string) => void;
}

const ServiceRequestModal = ({ isOpen, onClose, request, onUpdateStatus }: ServiceRequestModalProps) => {
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [selectedAction, setSelectedAction] = useState<string>("");

  if (!request) return null;

  const handleActionConfirm = () => {
    if (!selectedAction) return;
    
    onUpdateStatus(request.id, selectedAction, notes);
    setNotes("");
    setSelectedAction("");
    onClose();
    
    const actionMessages = {
      acknowledged: "Service request acknowledged",
      'in-progress': "Service request marked as in progress", 
      completed: "Service request completed",
      rejected: "Service request rejected"
    };
    
    toast({
      title: "Status Updated",
      description: actionMessages[selectedAction as keyof typeof actionMessages],
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'acknowledged': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'in-progress': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Service Request Details
            {getStatusIcon(request.status)}
          </DialogTitle>
          <DialogDescription>
            View and manage service request details and status.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Request Overview */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">{request.asset}</h3>
              <Badge className={getPriorityColor(request.priority)}>
                {request.priority} Priority
              </Badge>
            </div>
            <p className="text-gray-700">{request.issue}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {request.requests} residents affected
              </span>
              <span>Submitted: {request.submittedAt}</span>
            </div>
          </div>

          {/* Affected Residents */}
          <div>
            <h4 className="font-medium mb-2">Affected Residents:</h4>
            <div className="flex flex-wrap gap-2">
              {request.submittedBy.map((resident, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50">
                  {resident}
                </Badge>
              ))}
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <h4 className="font-medium mb-2">Description:</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">{request.description}</p>
          </div>

          {/* Action Selection */}
          <div className="space-y-3">
            <h4 className="font-medium">Update Status:</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedAction === 'acknowledged' ? 'default' : 'outline'}
                onClick={() => setSelectedAction('acknowledged')}
                className="justify-start"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Acknowledge
              </Button>
              <Button
                variant={selectedAction === 'in-progress' ? 'default' : 'outline'}
                onClick={() => setSelectedAction('in-progress')}
                className="justify-start"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Start Work
              </Button>
              <Button
                variant={selectedAction === 'completed' ? 'default' : 'outline'}
                onClick={() => setSelectedAction('completed')}
                className="justify-start"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete
              </Button>
              <Button
                variant={selectedAction === 'rejected' ? 'destructive' : 'outline'}
                onClick={() => setSelectedAction('rejected')}
                className="justify-start"
              >
                Not Feasible
              </Button>
            </div>
          </div>

          {/* Notes */}
          {selectedAction && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Resolution Notes:</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about the resolution, parts used, time taken, etc..."
                rows={3}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {selectedAction && (
              <Button onClick={handleActionConfirm}>
                Confirm {selectedAction.replace('-', ' ')}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceRequestModal;
