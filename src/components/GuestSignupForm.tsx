import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Building, Bed, Calendar, Phone, User, FileCheck, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useGenderBasedPGs } from "@/hooks/useGenderBasedPGs";

interface PGProperty {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  monthly_rent: number;
  security_deposit: number;
  total_rooms: number;
  occupied_rooms: number;
  rating: number;
  pgType?: 'co-living' | 'men-only' | 'women-only';
}

interface Room {
  id: string;
  room_number: string;
  type: string;
  capacity: number;
  price: number;
  is_available: boolean;
  amenities: string[];
}

interface GuestSignupFormProps {
  onBack: () => void;
  onComplete: (formData: any) => void;
  isLoading: boolean;
}

const GuestSignupForm: React.FC<GuestSignupFormProps> = ({ onBack, onComplete, isLoading }) => {
  const [step, setStep] = useState(1);
  const [pgProperties, setPgProperties] = useState<PGProperty[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    mobile: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
    gender: "" as 'male' | 'female' | 'other',
    
    // PG Property Details
    pgPropertyId: "",
    roomId: "",
    pgPreference: "" as 'co-living' | 'men-only' | 'women-only',
    
    // Guest Details
    joinDate: "",
    endDate: "",
    emergencyContact: "",
    idProofType: "",
    idProofNumber: "",
    
    // Terms
    agreeToTerms: false,
  });

  // Use the gender-based PG hook
  const { pgProperties: genderBasedPGs, loading: pgLoading, error: pgError } = useGenderBasedPGs(
    formData.gender || null,
    formData.pgPreference || null
  );

  // Update local pgProperties when gender-based PGs change
  useEffect(() => {
    setPgProperties(genderBasedPGs);
  }, [genderBasedPGs]);

  // Fetch Rooms when property is selected
  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedProperty) {
        setRooms([]);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('pg_property_id', selectedProperty)
          .eq('is_available', true);

        if (error) throw error;
        setRooms(data || []);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast({
          title: "Error",
          description: "Failed to load rooms. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [selectedProperty, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'pgPropertyId') {
      setSelectedProperty(value);
      setSelectedRoom(""); // Reset room selection
    } else if (name === 'roomId') {
      setSelectedRoom(value);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToTerms: checked }));
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate personal information
      if (!formData.fullName || !formData.emailAddress || !formData.password || !formData.confirmPassword || !formData.gender) {
        toast({
          title: "Missing Information",
          description: "Please fill out all required fields including gender",
          variant: "destructive",
        });
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 2) {
      // Validate PG preference selection
      if (!formData.pgPreference) {
        toast({
          title: "PG Preference Required",
          description: "Please select your PG preference",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 3) {
      // Validate PG property selection
      if (!formData.pgPropertyId) {
        toast({
          title: "PG Property Required",
          description: "Please select a PG property",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 4) {
      // Validate room selection
      if (!formData.roomId) {
        toast({
          title: "Room Required",
          description: "Please select a room",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 5) {
      // Validate guest details
      if (!formData.joinDate || !formData.endDate || !formData.emergencyContact) {
        toast({
          title: "Missing Information",
          description: "Please fill out all required fields",
          variant: "destructive",
        });
        return;
      }
    }

    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = () => {
    if (!formData.agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    onComplete(formData);
  };

  const selectedPropertyData = pgProperties.find(p => p.id === selectedProperty);
  const selectedRoomData = rooms.find(r => r.id === selectedRoom);

  return (
    <div className="w-full max-w-md space-y-4 animate-fade-in">
      <Card className="shadow-xl border-hostel-accent/30">
        <CardHeader className="bg-gradient-to-r from-hostel-primary to-hostel-secondary text-white rounded-t-lg p-4">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="text-white hover:text-hostel-accent">
              <ArrowLeft size={20} />
            </button>
            <div>
              <CardTitle className="text-lg font-bold">Guest Registration</CardTitle>
              <p className="text-sm text-hostel-accent">Step {step} of 6</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-hostel-primary" />
                <h2 className="text-lg font-medium">Personal Information</h2>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter your mobile number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address *</Label>
                  <Input
                    id="emailAddress"
                    name="emailAddress"
                    type="email"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: 'male' | 'female' | 'other') => 
                      setFormData(prev => ({ ...prev, gender: value }))
                    }
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: PG Preference Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Building className="h-5 w-5 text-hostel-primary" />
                <h2 className="text-lg font-medium">Select PG Preference</h2>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="pgPreference">PG Type Preference *</Label>
                  <Select
                    value={formData.pgPreference}
                    onValueChange={(value: 'co-living' | 'men-only' | 'women-only') => 
                      setFormData(prev => ({ ...prev, pgPreference: value }))
                    }
                  >
                    <SelectTrigger id="pgPreference">
                      <SelectValue placeholder="Select your PG preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="co-living">Co-living (Mixed Gender)</SelectItem>
                      <SelectItem value="men-only">Men Only</SelectItem>
                      <SelectItem value="women-only">Women Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="font-medium text-sm mb-2 text-blue-800">About PG Types</h3>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p><strong>Co-living:</strong> Mixed gender accommodation with shared spaces</p>
                    <p><strong>Men Only:</strong> Exclusive accommodation for male residents</p>
                    <p><strong>Women Only:</strong> Exclusive accommodation for female residents</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: PG Property Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Building className="h-5 w-5 text-hostel-primary" />
                <h2 className="text-lg font-medium">Select PG Property</h2>
              </div>
              
              <div className="space-y-3">
                {!formData.gender || !formData.pgPreference ? (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Please complete the previous steps to select your gender and PG preference first.
                    </p>
                  </div>
                ) : pgLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-hostel-primary"></div>
                    <span className="ml-2 text-sm text-gray-600">Loading available PGs...</span>
                  </div>
                ) : pgError ? (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm text-red-800">
                      Error loading PG properties: {pgError}
                    </p>
                  </div>
                ) : pgProperties.length === 0 ? (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm text-red-800">
                      No PG properties available for your selected preferences. 
                      Please try a different preference or contact support.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="pgPropertyId">PG Property *</Label>
                      <Select
                        value={formData.pgPropertyId}
                        onValueChange={(value) => handleSelectChange("pgPropertyId", value)}
                      >
                        <SelectTrigger id="pgPropertyId">
                          <SelectValue placeholder="Select a PG property" />
                        </SelectTrigger>
                        <SelectContent>
                          {pgProperties.map((property) => (
                            <SelectItem key={property.id} value={property.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{property.name}</span>
                                <span className="text-xs text-gray-500">
                                  {property.city}, {property.state} - ₹{property.monthly_rent}/month
                                </span>
                                 <span className="text-xs text-blue-600">
                                   Type: {property.pgType || 'co-living'}
                                 </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedPropertyData && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="font-medium text-sm mb-2">{selectedPropertyData.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{selectedPropertyData.address}</p>
                        <div className="flex justify-between text-xs">
                          <span>Monthly Rent: ₹{selectedPropertyData.monthly_rent}</span>
                          <span>Available Rooms: {selectedPropertyData.total_rooms - selectedPropertyData.occupied_rooms}</span>
                        </div>
                         <div className="text-xs text-blue-600 mt-1">
                           Type: {selectedPropertyData.pgType || 'co-living'}
                         </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Room Selection */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Bed className="h-5 w-5 text-hostel-primary" />
                <h2 className="text-lg font-medium">Select Room</h2>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="roomId">Available Room *</Label>
                  <Select
                    value={formData.roomId}
                    onValueChange={(value) => handleSelectChange("roomId", value)}
                  >
                    <SelectTrigger id="roomId">
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">Room {room.room_number}</span>
                            <span className="text-xs text-gray-500">
                              {room.type} - ₹{room.price}/month - Capacity: {room.capacity}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedRoomData && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="font-medium text-sm mb-2">Room {selectedRoomData.room_number}</h3>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Type: {selectedRoomData.type}</p>
                      <p>Capacity: {selectedRoomData.capacity} person(s)</p>
                      <p>Price: ₹{selectedRoomData.price}/month</p>
                      {selectedRoomData.amenities && selectedRoomData.amenities.length > 0 && (
                        <p>Amenities: {selectedRoomData.amenities.join(', ')}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Guest Details */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-5 w-5 text-hostel-primary" />
                <h2 className="text-lg font-medium">Guest Details</h2>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Join Date *</Label>
                  <Input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact *</Label>
                  <Input
                    id="emergencyContact"
                    name="emergencyContact"
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    placeholder="Emergency contact number"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="idProofType">ID Proof Type</Label>
                  <Select
                    value={formData.idProofType}
                    onValueChange={(value) => handleSelectChange("idProofType", value)}
                  >
                    <SelectTrigger id="idProofType">
                      <SelectValue placeholder="Select ID proof type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aadhar">Aadhar Card</SelectItem>
                      <SelectItem value="pan">PAN Card</SelectItem>
                      <SelectItem value="driving_license">Driving License</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="idProofNumber">ID Proof Number</Label>
                  <Input
                    id="idProofNumber"
                    name="idProofNumber"
                    value={formData.idProofNumber}
                    onChange={handleInputChange}
                    placeholder="Enter ID proof number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Terms and Conditions */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <FileCheck className="h-5 w-5 text-hostel-primary" />
                <h2 className="text-lg font-medium">Terms & Conditions</h2>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 max-h-40 overflow-y-auto">
                <p className="mb-2">By creating an account, you agree to our Terms of Service and Privacy Policy. 
                You consent to the collection and processing of your personal information as described in our policies.</p>
                <p className="mb-2">You also confirm that all the information provided is accurate and complete.</p>
                <p>You understand that room allocation is subject to availability and admin approval.</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={handleCheckboxChange}
                  required
                />
                <label
                  htmlFor="agreeToTerms"
                  className="text-sm font-medium leading-none"
                >
                  I agree to the terms and conditions
                </label>
              </div>
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePrev}
                className="flex items-center"
              >
                <ArrowLeft size={16} className="mr-1" /> Back
              </Button>
            )}
            
            {step < 6 ? (
              <Button 
                type="button" 
                onClick={handleNext}
                className="ml-auto flex items-center bg-hostel-primary hover:bg-hostel-secondary text-white"
                disabled={loading}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit"
                disabled={!formData.agreeToTerms || isLoading || loading || pgLoading}
                onClick={handleSubmit}
                className="ml-auto flex items-center bg-hostel-primary hover:bg-hostel-secondary text-white"
              >
                {isLoading ? "Creating Account..." : "Complete Registration"} <Check size={16} className="ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestSignupForm; 