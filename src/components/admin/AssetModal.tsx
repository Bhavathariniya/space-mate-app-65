import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'add' | 'manage' | 'schedule';
  asset?: any;
}

const AssetModal = ({ isOpen, onClose, type, asset }: AssetModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: asset?.name || '',
    type: asset?.type || '',
    location: asset?.location || '',
    status: asset?.status || 'active',
    description: asset?.description || '',
    capacity: asset?.capacity || '',
    maintenanceDate: asset?.maintenanceDate || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let message = '';
    switch (type) {
      case 'add':
        message = `New asset "${formData.name}" added successfully`;
        break;
      case 'manage':
        message = `Asset "${formData.name}" updated successfully`;
        break;
      case 'schedule':
        message = `Maintenance scheduled for "${formData.name}"`;
        break;
    }

    toast({
      title: "Success",
      description: message,
    });
    onClose();
  };

  const getTitle = () => {
    switch (type) {
      case 'add': return 'Add New Asset';
      case 'manage': return 'Manage Asset';
      case 'schedule': return 'Schedule Maintenance';
      default: return 'Asset Management';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {type === 'manage' ? 'Edit the details of this asset.' : type === 'add' ? 'Add a new asset to the system.' : 'Schedule Maintenance'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Asset Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Washing Machine #1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="room">Room</SelectItem>
                  <SelectItem value="appliance">Appliance</SelectItem>
                  <SelectItem value="facility">Facility</SelectItem>
                  <SelectItem value="utility">Utility</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Floor 2, Room 201"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                placeholder="e.g., 2 people, 8kg"
              />
            </div>
          </div>

          {type === 'schedule' && (
            <div className="space-y-2">
              <Label htmlFor="maintenanceDate">Maintenance Date</Label>
              <Input
                id="maintenanceDate"
                type="datetime-local"
                value={formData.maintenanceDate}
                onChange={(e) => setFormData(prev => ({ ...prev, maintenanceDate: e.target.value }))}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Additional details about the asset..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {type === 'add' ? 'Add Asset' : type === 'manage' ? 'Update Asset' : 'Schedule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssetModal;
