
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, Users, Phone, Calendar } from "lucide-react";
import { PGProperty } from "@/types";

interface PGSelectorProps {
  onPGSelect: (pgId: string) => void;
  onBack: () => void;
  userRole: string;
}

// Mock PG data - in real app this would come from API
const mockPGProperties: PGProperty[] = [
  {
    id: "pg-001",
    name: "Space Mate Central",
    address: "123 Main Street, MG Road",
    city: "Bangalore",
    state: "Karnataka", 
    pincode: "560001",
    description: "Premium PG accommodation in the heart of the city with modern amenities and 24/7 security.",
    amenities: ["WiFi", "AC", "Food", "Laundry", "Security", "Parking"],
    rules: ["No smoking", "No alcohol", "Visitors till 9 PM"],
    images: ["/placeholder.svg"],
    logo: "/placeholder.svg",
    rating: 4.5,
    totalRooms: 50,
    occupiedRooms: 42,
    monthlyRent: 15000,
    securityDeposit: 30000,
    contactNumber: "+91 9876543210",
    managerName: "Rajesh Kumar",
    established: "2020"
  },
  {
    id: "pg-002", 
    name: "Space Mate Tech Park",
    address: "456 Tech Avenue, Electronic City",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560100", 
    description: "Modern PG facility near tech parks with excellent connectivity and premium facilities.",
    amenities: ["WiFi", "AC", "Food", "Gym", "Recreation", "Transport"],
    rules: ["No smoking", "No pets", "Visitors till 8 PM"],
    images: ["/placeholder.svg"],
    logo: "/placeholder.svg", 
    rating: 4.2,
    totalRooms: 75,
    occupiedRooms: 68,
    monthlyRent: 18000,
    securityDeposit: 36000,
    contactNumber: "+91 9876543211", 
    managerName: "Priya Sharma",
    established: "2019"
  },
  {
    id: "pg-003",
    name: "Space Mate University",
    address: "789 College Road, Koramangala", 
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560034",
    description: "Student-friendly PG near universities with affordable rates and study-conducive environment.",
    amenities: ["WiFi", "Food", "Study Room", "Library", "Security"],
    rules: ["No smoking", "No loud music", "Study hours 6-10 PM"],
    images: ["/placeholder.svg"],
    logo: "/placeholder.svg",
    rating: 4.0,
    totalRooms: 30,
    occupiedRooms: 25, 
    monthlyRent: 12000,
    securityDeposit: 24000,
    contactNumber: "+91 9876543212",
    managerName: "Suresh Reddy", 
    established: "2021"
  }
];

const PGSelector = ({ onPGSelect, onBack, userRole }: PGSelectorProps) => {
  const [selectedPG, setSelectedPG] = useState<PGProperty | null>(null);

  const handlePGClick = (pg: PGProperty) => {
    setSelectedPG(pg);
  };

  const handleConfirmSelection = () => {
    if (selectedPG) {
      onPGSelect(selectedPG.id);
    }
  };

  const getAvailabilityColor = (occupied: number, total: number) => {
    const percentage = (occupied / total) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-orange-600"; 
    return "text-green-600";
  };

  if (selectedPG) {
    return (
      <div className="w-full max-w-md space-y-4 animate-fade-in">
        <Card className="shadow-xl border-hostel-accent/30">
          <CardHeader className="bg-gradient-to-r from-hostel-primary to-hostel-secondary text-white rounded-t-lg p-4">
            <div className="flex items-center space-x-3">
              <button onClick={() => setSelectedPG(null)} className="text-white hover:text-hostel-accent">
                <ArrowLeft size={20} />
              </button>
              <div>
                <CardTitle className="text-lg font-bold">{selectedPG.name}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-hostel-accent">{selectedPG.rating}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-hostel-primary mt-1 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <p>{selectedPG.address}</p>
                  <p>{selectedPG.city}, {selectedPG.state} - {selectedPG.pincode}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-hostel-primary" />
                <span className="text-sm text-gray-700">
                  {selectedPG.occupiedRooms}/{selectedPG.totalRooms} rooms occupied
                </span>
                <span className={`text-xs font-medium ${getAvailabilityColor(selectedPG.occupiedRooms, selectedPG.totalRooms)}`}>
                  ({Math.round(((selectedPG.totalRooms - selectedPG.occupiedRooms) / selectedPG.totalRooms) * 100)}% available)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-hostel-primary" />
                <span className="text-sm text-gray-700">{selectedPG.contactNumber}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-hostel-primary" />
                <span className="text-sm text-gray-700">Established {selectedPG.established}</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">{selectedPG.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-1">
                {selectedPG.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-hostel-light rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-800">Monthly Rent</span>
                <span className="text-lg font-bold text-hostel-primary">₹{selectedPG.monthlyRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Security Deposit</span>
                <span className="text-sm text-gray-800">₹{selectedPG.securityDeposit.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={handleConfirmSelection}
                className="w-full bg-hostel-primary hover:bg-hostel-secondary h-11"
              >
                Continue with {selectedPG.name}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedPG(null)}
                className="w-full h-11"
              >
                Choose Different PG
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4 animate-fade-in">
      <Card className="shadow-xl border-hostel-accent/30">
        <CardHeader className="bg-gradient-to-r from-hostel-primary to-hostel-secondary text-white rounded-t-lg p-4">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="text-white hover:text-hostel-accent">
              <ArrowLeft size={20} />
            </button>
            <div>
              <CardTitle className="text-lg font-bold">Select Your PG</CardTitle>
              <p className="text-sm text-hostel-accent">Choose your property to continue</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="space-y-3">
            {mockPGProperties.map((pg) => (
              <div
                key={pg.id}
                onClick={() => handlePGClick(pg)}
                className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:border-hostel-primary active:scale-95"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-hostel-accent flex items-center justify-center flex-shrink-0">
                    <img src={pg.logo} alt={pg.name} className="w-8 h-8 rounded" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-800 text-sm truncate">{pg.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">{pg.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{pg.address}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-medium text-hostel-primary">₹{pg.monthlyRent.toLocaleString()}/month</span>
                      <span className={`text-xs ${getAvailabilityColor(pg.occupiedRooms, pg.totalRooms)}`}>
                        {pg.totalRooms - pg.occupiedRooms} rooms available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PGSelector;
