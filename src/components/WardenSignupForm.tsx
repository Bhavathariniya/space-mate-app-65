import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, User, Mail, Phone, Building, MapPin } from "lucide-react";

interface WardenSignupFormProps {
  onBack: () => void;
  onComplete: (formData: any) => void;
}

interface PGProperty {
  id: string;
  name: string;
  address: string;
  city: string;
}

const WardenSignupForm = ({ onBack, onComplete }: WardenSignupFormProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    pgPropertyId: "",
    emergencyContact: "",
  });

  const [pgProperties, setPgProperties] = useState<PGProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const { toast } = useToast();

  // Load available PG properties
  React.useEffect(() => {
    const loadPGProperties = async () => {
      setIsLoadingProperties(true);
      try {
        const { data, error } = await supabase
          .from('pg_properties')
          .select('id, name, address, city')
          .eq('is_active', true);

        if (error) {
          console.error('Error loading PG properties:', error);
          toast({
            title: "Error",
            description: "Failed to load PG properties. Please try again.",
            variant: "destructive",
          });
        } else {
          setPgProperties(data || []);
        }
      } catch (error) {
        console.error('Error loading PG properties:', error);
      } finally {
        setIsLoadingProperties(false);
      }
    };

    loadPGProperties();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.emailAddress || !formData.mobile || 
        !formData.password || !formData.confirmPassword || !formData.pgPropertyId) {
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

    if (formData.password.length < 6) {
      toast({
        title: "Password Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create the user account
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email: formData.emailAddress,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'warden',
            admin_sub_role: 'warden',
          }
        }
      });

      if (signupError) {
        toast({
          title: "Signup Failed",
          description: signupError.message,
          variant: "destructive",
        });
        return;
      }

      if (authData.user) {
        // Wait for profile to be created by the database trigger
        let profileExists = false;
        let retryCount = 0;
        const maxRetries = 10;
        
        while (!profileExists && retryCount < maxRetries) {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', authData.user.id)
            .single();
          
          if (existingProfile) {
            profileExists = true;
          } else {
            await new Promise(resolve => setTimeout(resolve, 500));
            retryCount++;
          }
        }

        // Wait for role to be assigned
        let roleExists = false;
        retryCount = 0;
        
        while (!roleExists && retryCount < maxRetries) {
          const { data: userRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', authData.user.id)
            .eq('role', 'warden')
            .single();
          
          if (userRole) {
            roleExists = true;
          } else {
            await new Promise(resolve => setTimeout(resolve, 500));
            retryCount++;
          }
        }

        if (!profileExists) {
          toast({
            title: "Profile Creation Failed",
            description: "Profile was not created. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Update profile with phone and PG property ID
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            phone: formData.mobile,
            pg_property_id: formData.pgPropertyId,
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          toast({
            title: "Profile Update Failed",
            description: `Failed to link PG property to your profile: ${profileError.message}`,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account, then you can login.",
        });

        // Call the completion handler
        onComplete({
          ...formData,
          userId: authData.user.id,
        });
      }
    } catch (error) {
      console.error('Warden signup error:', error);
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md animate-fade-in shadow-xl border-hostel-accent/30">
        <CardHeader className="space-y-1 text-center bg-gradient-to-r from-hostel-primary to-hostel-secondary text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Warden Signup</CardTitle>
          <p className="text-hostel-accent text-sm">
            Create your warden account to manage PG operations
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="emailAddress" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="emailAddress"
                name="emailAddress"
                type="email"
                placeholder="Enter your email address"
                value={formData.emailAddress}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <Label htmlFor="mobile" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Mobile Number *
              </Label>
              <Input
                id="mobile"
                name="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* PG Property Selection */}
            <div className="space-y-2">
              <Label htmlFor="pgPropertyId" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Select PG Property *
              </Label>
              <Select
                value={formData.pgPropertyId}
                onValueChange={(value) => handleSelectChange('pgPropertyId', value)}
                disabled={isLoadingProperties}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingProperties ? "Loading properties..." : "Select a PG property"} />
                </SelectTrigger>
                <SelectContent>
                  {pgProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{property.name}</span>
                        <span className="text-xs text-gray-500">
                          {property.address}, {property.city}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {pgProperties.length === 0 && !isLoadingProperties && (
                <p className="text-sm text-red-500">
                  No active PG properties found. Please contact an administrator.
                </p>
              )}
            </div>

            {/* Emergency Contact */}
            <div className="space-y-2">
              <Label htmlFor="emergencyContact" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Emergency Contact
              </Label>
              <Input
                id="emergencyContact"
                name="emergencyContact"
                type="tel"
                placeholder="Enter emergency contact number"
                value={formData.emergencyContact}
                onChange={handleInputChange}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                minLength={6}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-hostel-primary hover:bg-hostel-secondary"
              disabled={isLoading || isLoadingProperties || pgProperties.length === 0}
            >
              {isLoading ? "Creating Account..." : "Create Warden Account"}
            </Button>

            {/* Back Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onBack}
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Role Selection
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WardenSignupForm;
