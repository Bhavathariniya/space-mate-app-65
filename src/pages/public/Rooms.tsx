
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { rooms } from "@/data/mockData";
import { Room } from "@/types";
import { Search, ArrowLeft, Filter, Bed, Check } from "lucide-react";

const PublicRooms = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter available rooms
  const availableRooms = rooms.filter(room => room.available);
  
  // Apply filters
  const filteredRooms = availableRooms.filter(room => {
    // Apply search query filter
    const matchesSearch = searchQuery === "" || 
      room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomNumber.includes(searchQuery);
    
    // Apply price filter
    let matchesPrice = true;
    if (priceFilter === "low") {
      matchesPrice = room.price < 8000;
    } else if (priceFilter === "mid") {
      matchesPrice = room.price >= 8000 && room.price <= 9000;
    } else if (priceFilter === "high") {
      matchesPrice = room.price > 9000;
    }
    
    // Apply type filter
    let matchesType = true;
    if (typeFilter !== "all") {
      matchesType = room.type.toLowerCase().includes(typeFilter.toLowerCase());
    }
    
    return matchesSearch && matchesPrice && matchesType;
  });

  const navigateToRoomDetails = (roomId: string) => {
    navigate(`/public/rooms/${roomId}`);
  };
  
  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Back Button */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} className="mr-1" /> Filters
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold">Available Rooms</h1>
      
      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search for rooms..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Filters */}
      {showFilters && (
        <Card className="animate-slide-up">
          <CardContent className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Price Range</label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Budget (Below ₹8,000)</SelectItem>
                  <SelectItem value="mid">Standard (₹8,000 - ₹9,000)</SelectItem>
                  <SelectItem value="high">Premium (Above ₹9,000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2">Room Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="triple">Triple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Room List */}
      <div className="space-y-4">
        {filteredRooms.length > 0 ? (
          filteredRooms.map(room => (
            <RoomCard 
              key={room.id} 
              room={room} 
              onClick={() => navigateToRoomDetails(room.id)} 
            />
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-gray-500 mb-4">No rooms matching your search criteria.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setPriceFilter("all");
                  setTypeFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Room Card Component
const RoomCard = ({ room, onClick }: { room: Room; onClick: () => void }) => (
  <Card className="overflow-hidden card-hover">
    <div onClick={onClick}>
      <div className="h-48 relative">
        <img 
          src={room.images[0]} 
          alt={`Room ${room.roomNumber}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-0.5 rounded text-xs font-medium text-hostel-primary">
          Room {room.roomNumber}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{room.type}</h3>
          <p className="font-bold text-hostel-primary">₹{room.price}<span className="text-xs font-normal text-gray-500">/month</span></p>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Bed size={16} className="mr-1" />
          <span>Capacity: {room.capacity} {room.capacity > 1 ? 'persons' : 'person'}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {room.amenities.slice(0, 3).map((amenity, idx) => (
            <div 
              key={idx} 
              className="flex items-center text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded"
            >
              <Check size={10} className="mr-1 text-hostel-primary" />
              {amenity}
            </div>
          ))}
          {room.amenities.length > 3 && (
            <span className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>
        
        <Button 
          className="w-full bg-hostel-primary hover:bg-hostel-secondary"
        >
          View Details
        </Button>
      </CardContent>
    </div>
  </Card>
);

export default PublicRooms;
