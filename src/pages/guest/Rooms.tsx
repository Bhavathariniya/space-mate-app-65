import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { rooms } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Bell, Utensils, Bed, Wifi, Coffee, ShieldCheck, Loader2 } from "lucide-react";
import RoomServiceCard, { RoomService } from "@/components/guest/RoomServiceCard";

const GuestRooms = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [isRequestProcessing, setIsRequestProcessing] = useState(false);
  const [complaint, setComplaint] = useState("");

  // Find the guest's room
  const myRoom = rooms.find(room => room.roomNumber === currentUser?.roomNumber);
  
  // Mock room services data
  const [roomServices, setRoomServices] = useState<RoomService[]>([
    {
      id: "service-1",
      name: "Room Cleaning",
      description: "Full room cleaning service and bed making",
      price: null,
      status: "available",
      icon: <Bed className="h-4 w-4" />
    },
    {
      id: "service-2",
      name: "Laundry Service",
      description: "Wash, dry and fold clothes",
      price: 100,
      status: "processing",
      eta: "2 hours",
      icon: <Bell className="h-4 w-4" />
    },
    {
      id: "service-3",
      name: "WiFi Support",
      description: "Technical assistance with internet connection",
      price: null,
      status: "available",
      icon: <Wifi className="h-4 w-4" />
    },
    {
      id: "service-4",
      name: "Breakfast in Room",
      description: "Get your breakfast delivered to your room",
      price: 50,
      status: "available",
      icon: <Coffee className="h-4 w-4" />
    },
    {
      id: "service-5",
      name: "Room Maintenance",
      description: "Fix issues with plumbing, electricity, etc.",
      price: null,
      status: "completed",
      icon: <ShieldCheck className="h-4 w-4" />
    }
  ]);

  // Handle service request
  const handleServiceRequest = (serviceId: string) => {
    setIsRequestProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update the service status
      setRoomServices(prev => 
        prev.map(service => 
          service.id === serviceId 
            ? { ...service, status: "processing", eta: "2 hours" } 
            : service
        )
      );
      
      setIsRequestProcessing(false);
      
      toast({
        title: "Service Requested",
        description: "Your service request has been submitted successfully.",
      });
    }, 1500);
  };

  // Handle complaint submission
  const handleSubmitComplaint = () => {
    if (!complaint.trim()) {
      toast({
        title: "Empty Complaint",
        description: "Please enter your complaint before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Complaint Submitted",
      description: "Your complaint has been recorded. We'll address it soon.",
    });
    
    setComplaint("");
    setIsComplaintOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">My Room</h1>
      
      {myRoom ? (
        <Card className="overflow-hidden">
          <div className="relative h-40 bg-gray-200">
            <img 
              src={myRoom.images[0]} 
              alt={`Room ${myRoom.roomNumber}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
              Room {myRoom.roomNumber}
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{myRoom.type}</h2>
              <span className="text-lg font-medium text-hostel-primary">₹{myRoom.price}/month</span>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Room Features</h3>
              <div className="flex flex-wrap gap-2">
                {myRoom.amenities.map((amenity, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={() => setIsComplaintOpen(true)}
              >
                Report Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p>No room information available.</p>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="services">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="services" className="text-sm">Room Services</TabsTrigger>
          <TabsTrigger value="rules" className="text-sm">Room Rules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg flex items-center">
              <Bell className="h-5 w-5 mr-2 text-hostel-primary" />
              Available Services
            </h2>
            {isRequestProcessing && (
              <div className="flex items-center text-sm text-gray-500">
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Processing...
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {roomServices.map(service => (
              <RoomServiceCard 
                key={service.id}
                service={service}
                onRequest={handleServiceRequest}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-hostel-primary" />
                Room & Hostel Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">General Rules</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  <li>Maintain cleanliness in your room and common areas</li>
                  <li>Quiet hours from 10:00 PM to 6:00 AM</li>
                  <li>No smoking inside the building</li>
                  <li>No alcohol consumption on premises</li>
                  <li>Visitors allowed only in common areas until 8:00 PM</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Room Maintenance</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  <li>Regular room cleaning provided once a week</li>
                  <li>Report any damages or maintenance issues promptly</li>
                  <li>No modifications to room structure or walls allowed</li>
                  <li>Conserve electricity and water</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Report Issue Dialog */}
      <Dialog open={isComplaintOpen} onOpenChange={setIsComplaintOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Report Room Issue</DialogTitle>
            <DialogDescription>
              Describe the issue you're experiencing with your room. 
              Our maintenance team will address it as soon as possible.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <textarea 
              className="w-full border rounded-md p-3 min-h-[120px]"
              placeholder="Describe your issue in detail..."
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
            ></textarea>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsComplaintOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-hostel-primary hover:bg-hostel-secondary"
                onClick={handleSubmitComplaint}
              >
                Submit Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuestRooms;
