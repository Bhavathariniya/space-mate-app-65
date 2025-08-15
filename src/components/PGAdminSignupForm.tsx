import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Building, User, FileCheck, Check, MapPin, Phone, IndianRupee, Users, Shield } from "lucide-react";

interface PGAdminSignupFormProps {
  onBack: () => void;
  onComplete: (formData: any) => void;
  isLoading: boolean;
}

const PGAdminSignupForm: React.FC<PGAdminSignupFormProps> = ({ onBack, onComplete, isLoading }) => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    mobile: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
    
    // PG Property Details
    pgName: "",
    pgType: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contactNumber: "",
    managerName: "",
    totalRooms: "",
    monthlyRent: "",
    securityDeposit: "",
    description: "",
    amenities: [] as string[],
    rules: [] as string[],
    
    // Additional Details
    established: "",
    rating: "4.5",
    
    // Terms
    agreeToTerms: false,
  });

  const availableAmenities = [
    "WiFi", "AC", "Food", "Laundry", "Security", "Parking", 
    "Gym", "Study Room", "Library", "Cafeteria", "Transport", 
    "CCTV", "Garden", "Recreation", "Water Purifier"
  ];

  const availableRules = [
    "No smoking", "No alcohol", "No pets", "Visitors till 9 PM",
    "No loud music", "Study hours 6-10 PM", "No cooking in rooms",
    "Maintain cleanliness", "Follow meal timings", "No unauthorized guests"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToTerms: checked }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleRuleToggle = (rule: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.includes(rule)
        ? prev.rules.filter(r => r !== rule)
        : [...prev.rules, rule]
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate personal information
      if (!formData.fullName || !formData.emailAddress || !formData.password || !formData.confirmPassword) {
        toast({
          title: "Missing Information",
          description: "Please fill out all required fields",
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
      // Validate PG property details
      if (!formData.pgName || !formData.address || !formData.city || !formData.state || !formData.pincode) {
        toast({
          title: "Missing Property Information",
          description: "Please fill out all required property fields",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 3) {
      // Validate additional details
      if (!formData.totalRooms || !formData.monthlyRent || !formData.securityDeposit) {
        toast({
          title: "Missing Details",
          description: "Please fill out all required details",
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

  return (
    <div className="w-full max-w-2xl space-y-4 animate-fade-in">
      <Card className="shadow-xl border-hostel-accent/30">
        <CardHeader className="bg-gradient-to-r from-hostel-primary to-hostel-secondary text-white rounded-t-lg p-4">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="text-white hover:text-hostel-accent">
              <ArrowLeft size={20} />
            </button>
            <div>
              <CardTitle className="text-lg font-bold">PG Admin Registration</CardTitle>
              <p className="text-sm text-hostel-accent">Step {step} of 4</p>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter your mobile number"
                    required
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
              </div>
            </div>
          )}

          {/* Step 2: PG Property Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Building className="h-5 w-5 text-hostel-primary" />
                <h2 className="text-lg font-medium">PG Property Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pgName">PG/Hostel Name *</Label>
                  <Input
                    id="pgName"
                    name="pgName"
                    value={formData.pgName}
                    onChange={handleInputChange}
                    placeholder="Enter your PG/Hostel name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pgType">PG Type *</Label>
                  <Select
                    value={formData.pgType}
                    onValueChange={(value) => handleSelectChange("pgType", value)}
                  >
                    <SelectTrigger id="pgType">
                      <SelectValue placeholder="Select PG type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Complete Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter complete address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="Enter pincode"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="Enter contact number"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="managerName">Manager Name *</Label>
                  <Input
                    id="managerName"
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleInputChange}
                    placeholder="Enter manager name"
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your PG/Hostel"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Details */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <IndianRupee className="h-5 w-5 text-hostel-primary" />
                <h2 className="text-lg font-medium">Additional Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalRooms">Total Rooms *</Label>
                  <Input
                    id="totalRooms"
                    name="totalRooms"
                    type="number"
                    value={formData.totalRooms}
                    onChange={handleInputChange}
                    placeholder="Enter total number of rooms"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthlyRent">Monthly Rent (₹) *</Label>
                  <Input
                    id="monthlyRent"
                    name="monthlyRent"
                    type="number"
                    value={formData.monthlyRent}
                    onChange={handleInputChange}
                    placeholder="Enter monthly rent"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="securityDeposit">Security Deposit (₹) *</Label>
                  <Input
                    id="securityDeposit"
                    name="securityDeposit"
                    type="number"
                    value={formData.securityDeposit}
                    onChange={handleInputChange}
                    placeholder="Enter security deposit"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="established">Established Year</Label>
                  <Input
                    id="established"
                    name="established"
                    value={formData.established}
                    onChange={handleInputChange}
                    placeholder="e.g., 2020"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Select
                    value={formData.rating}
                    onValueChange={(value) => handleSelectChange("rating", value)}
                  >
                    <SelectTrigger id="rating">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4.0">4.0</SelectItem>
                      <SelectItem value="4.1">4.1</SelectItem>
                      <SelectItem value="4.2">4.2</SelectItem>
                      <SelectItem value="4.3">4.3</SelectItem>
                      <SelectItem value="4.4">4.4</SelectItem>
                      <SelectItem value="4.5">4.5</SelectItem>
                      <SelectItem value="4.6">4.6</SelectItem>
                      <SelectItem value="4.7">4.7</SelectItem>
                      <SelectItem value="4.8">4.8</SelectItem>
                      <SelectItem value="4.9">4.9</SelectItem>
                      <SelectItem value="5.0">5.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Amenities Selection */}
              <div className="space-y-3">
                <Label>Amenities Available</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <label
                        htmlFor={`amenity-${amenity}`}
                        className="text-sm font-medium leading-none"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules Selection */}
              <div className="space-y-3">
                <Label>PG Rules</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availableRules.map((rule) => (
                    <div key={rule} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rule-${rule}`}
                        checked={formData.rules.includes(rule)}
                        onCheckedChange={() => handleRuleToggle(rule)}
                      />
                      <label
                        htmlFor={`rule-${rule}`}
                        className="text-sm font-medium leading-none"
                      >
                        {rule}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Terms and Conditions */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <FileCheck className="h-5 w-5 text-hostel-primary" />
                <h2 className="text-lg font-medium">Terms & Conditions</h2>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 max-h-40 overflow-y-auto">
                <p className="mb-2">By creating a PG Admin account, you agree to our Terms of Service and Privacy Policy. 
                You consent to the collection and processing of your personal information as described in our policies.</p>
                <p className="mb-2">You also confirm that all the information provided about your PG property is accurate and complete.</p>
                <p className="mb-2">You understand that you will be responsible for managing your PG property and all associated operations.</p>
                <p>You agree to maintain proper records and comply with all applicable regulations.</p>
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
            
            {step < 4 ? (
              <Button 
                type="button" 
                onClick={handleNext}
                className="ml-auto flex items-center bg-hostel-primary hover:bg-hostel-secondary text-white"
                disabled={isLoading}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit"
                disabled={!formData.agreeToTerms || isLoading}
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

export default PGAdminSignupForm; 