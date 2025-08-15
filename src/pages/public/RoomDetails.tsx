
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { rooms, hostel } from "@/data/mockData";
import { Bed, Users, Check, MapPin, ArrowLeft } from "lucide-react";

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const room = rooms.find(r => r.id === id);
  
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
  
  const handleBookNow = () => {
    navigate(`/public/booking/${id}`);
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
      
      {/* Image Gallery */}
      <div className="relative">
        <div className="h-72 overflow-hidden rounded-lg">
          <img 
            src={room.images[activeImageIndex]} 
            alt={`Room ${room.roomNumber}`}
            className="w-full h-full object-cover"
          />
        </div>
        
        {room.images.length > 1 && (
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
            {room.images.map((image, index) => (
              <div
                key={index}
                className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                  index === activeImageIndex ? "border-hostel-primary" : "border-transparent"
                } cursor-pointer`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img 
                  src={image} 
                  alt={`Room ${room.roomNumber} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Room Details */}
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{room.type}</h1>
            <p className="text-gray-500">Room {room.roomNumber}</p>
          </div>
          <p className="text-xl font-bold text-hostel-primary">₹{room.price}<span className="text-sm font-normal text-gray-500">/month</span></p>
        </div>
        
        <div className="flex items-center mt-4 space-x-4">
          <div className="flex items-center text-gray-600">
            <Bed size={18} className="mr-1" />
            <span>Capacity: {room.capacity}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users size={18} className="mr-1" />
            <span>Currently: {room.occupied}/{room.capacity}</span>
          </div>
        </div>
        
        <Card className="mt-6 border-hostel-accent">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">Room Amenities</h2>
            <div className="grid grid-cols-2 gap-y-2">
              {room.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center text-sm">
                  <Check size={16} className="mr-2 text-hostel-primary" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Hostel Information */}
      <div>
        <h2 className="font-semibold mb-3">About the Hostel</h2>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start">
              <img 
                src={hostel.logo} 
                alt={hostel.name}
                className="w-12 h-12 rounded-md mr-3"
              />
              <div>
                <h3 className="font-medium">{hostel.name}</h3>
                <p className="text-sm flex items-center text-gray-500 mt-1">
                  <MapPin size={14} className="mr-1" />
                  {hostel.address}, {hostel.city}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">{hostel.description}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Rules */}
      <div>
        <h2 className="font-semibold mb-3">Hostel Rules</h2>
        <Card>
          <CardContent className="p-4">
            <ul className="space-y-2">
              {hostel.rules.map((rule, index) => (
                <li key={index} className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 bg-hostel-primary rounded-full mr-2"></div>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Book Now Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg pb-safe z-10">
        <Button 
          className="w-full bg-hostel-primary hover:bg-hostel-secondary text-lg py-6"
          onClick={handleBookNow}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default RoomDetails;
