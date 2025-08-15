
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { rooms } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

const BookingForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const room = rooms.find(r => r.id === id);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    duration: "1",
    moveInDate: "",
    specialRequests: ""
  });
  
  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-gray-500 mb-4">Room not found</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/public/rooms')}
        >
          Back to Rooms
        </Button>
      </div>
    );
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.moveInDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Proceed to payment
    navigate(`/public/payment/${id}`);
  };
  
  // Calculate the total amount based on duration
  const calculateTotal = () => {
    const months = parseInt(formData.duration);
    return room.price * months;
  };
  
  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} className="mr-1" /> Back
      </Button>
      
      <div className="bg-white rounded-lg shadow-sm p-4 border mb-6">
        <h2 className="font-semibold">Booking Details</h2>
        <div className="flex justify-between mt-2">
          <div>
            <p className="text-sm text-gray-500">Room Type</p>
            <p className="font-medium">{room.type}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Room Number</p>
            <p className="font-medium">{room.roomNumber}</p>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="font-medium">₹{room.price}/month</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Availability</p>
            <p className="font-medium text-green-600">Available Now</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="duration">Duration *</Label>
            <Select 
              value={formData.duration}
              onValueChange={(value) => handleSelectChange("duration", value)}
            >
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Month</SelectItem>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
                <SelectItem value="12">12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="moveInDate">Move-in Date *</Label>
            <Input
              id="moveInDate"
              name="moveInDate"
              type="date"
              value={formData.moveInDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              placeholder="Any specific requirements or requests"
              value={formData.specialRequests}
              onChange={handleChange}
              className="w-full h-24 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-hostel-primary"
            />
          </div>
        </div>
        
        {/* Summary */}
        <div className="bg-hostel-muted rounded-lg p-4 space-y-3">
          <h3 className="font-medium">Booking Summary</h3>
          
          <div className="flex justify-between text-sm">
            <span>Room Charges</span>
            <span>₹{room.price} x {formData.duration} {parseInt(formData.duration) === 1 ? 'month' : 'months'}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Security Deposit</span>
            <span>₹{room.price}</span>
          </div>
          
          <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
            <span>Total Amount</span>
            <span>₹{calculateTotal() + room.price}</span>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg pb-safe z-10">
          <Button 
            type="submit"
            className="w-full bg-hostel-primary hover:bg-hostel-secondary text-lg py-6"
          >
            Proceed to Payment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
