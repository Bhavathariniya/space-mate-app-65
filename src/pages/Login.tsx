import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Shield, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Users, 
  UserCheck,
  ChevronRight, 
  Building, 
  Calendar, 
  Phone,
  FileCheck,
  Home,
  BedDouble,
  CreditCard,
  Check,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useAuthNavigation } from "@/hooks/useAuthNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { UserRole, AdminSubRole } from "@/types";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminSubRoleSelection from "@/components/AdminSubRoleSelection";
import GuestSignupForm from "@/components/GuestSignupForm";
import PGAdminSignupForm from "@/components/PGAdminSignupForm";
import WardenSignupForm from "@/components/WardenSignupForm";

const Login = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [selectedAdminSubRole, setSelectedAdminSubRole] = useState<AdminSubRole | null>(null);
  
  // Registration form state
  const [registrationStep, setRegistrationStep] = useState(1);
  const [signupRole, setSignupRole] = useState<UserRole | null>(null);
  const [showGuestSignup, setShowGuestSignup] = useState(false);
  const [showPGAdminSignup, setShowPGAdminSignup] = useState(false);
  const [showWardenSignup, setShowWardenSignup] = useState(false);
  const [signupForm, setSignupForm] = useState({
    // Personal & Authentication
    fullName: "",
    mobile: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
    profilePicture: null as File | null,
    
    // PG/Hostel Details (Admin only)
    pgName: "",
    pgType: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    mapLocation: "",
    numberOfBranches: "1",
    joinDate: "",
    endDate: "",
    emergencyPhone: "",
    
    // Government and Legal Documents (Admin only)
    idProofType: "",
    idProofFile: null as File | null,
    propertyProofType: "",
    propertyProofFile: null as File | null,
    gstin: "",
    
    // Initial PG Setup (Admin only)
    roomCount: "",
    bedCapacity: "",
    hasAC: false,
    facilities: [] as string[],
    monthlyRent: "",
    securityDeposit: "",
    hasMeals: false,
    
    // Subscription Plan (Admin only)
    planType: "monthly",
    pgCount: "1",
    
    // Staff Details (Admin only)
    wardenName: "",
    wardenContact: "",
    emergencyContact: "",
    
    // Asset Inventory (Admin only)
    assetBeds: "",
    assetFans: "",
    enableServiceRequests: true,
    
    // Guest Details (Guest only)
    guestRoomNumber: "",
    guestJoinDate: "",
    guestEndDate: "",
    guestPgName: "",
    guestIdProof: "",
    guestEmergencyContact: "",
    
    // Terms and Conditions
    agreeToTerms: false,
  });
  
  const navigate = useNavigate();
  const { login, userRole } = useAuth();
  const { signIn, signUp, isLoading: authLoading } = useSupabaseAuth();
  const { toast } = useToast();
  
  // Handle automatic navigation after auth
  useAuthNavigation();

  const adminSubRoles = [
    {
      id: AdminSubRole.SUPER_ADMIN,
      title: "Super Admin",
      description: "Application owner with monetization access",
      icon: Shield,
    },
    {
      id: AdminSubRole.PG_ADMIN,
      title: "PG Admin", 
      description: "Full PG management control",
      icon: Users,
    },
    {
      id: AdminSubRole.WARDEN,
      title: "Warden",
      description: "Limited access for maintenance tasks",
      icon: UserCheck,
    }
  ];

  // Ensure Super Admin always uses login tab
  useEffect(() => {
    if (userRole === UserRole.ADMIN && selectedAdminSubRole === AdminSubRole.SUPER_ADMIN && activeTab === "signup") {
      setActiveTab("login");
    }
  }, [userRole, selectedAdminSubRole, activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      // Save credentials if remember password is checked
      if (rememberPassword) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      // Navigation will be handled by the auth context
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSubRoleSelect = (subRole: AdminSubRole) => {
    setSelectedAdminSubRole(subRole);
    
    // If warden is selected, show the warden signup form
    if (subRole === AdminSubRole.WARDEN) {
      setShowWardenSignup(true);
      setShowPGAdminSignup(false);
    }
  };

  const handleBackToRoleSelection = () => {
    setSelectedAdminSubRole(null);
  };
  
  // Registration form handlers
  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setSignupForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setSignupForm(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleFacilityToggle = (facility: string) => {
    setSignupForm(prev => {
      const facilities = [...prev.facilities];
      if (facilities.includes(facility)) {
        return { ...prev, facilities: facilities.filter(f => f !== facility) };
      } else {
        return { ...prev, facilities: [...facilities, facility] };
      }
    });
  };

  const handleRoleSelect = (role: UserRole) => {
    setSignupRole(role);
    if (role === UserRole.PG_GUEST) {
      setShowGuestSignup(true);
    } else if (role === UserRole.ADMIN) {
      setShowPGAdminSignup(true);
    } else {
      setRegistrationStep(2); // Move to next step after selecting role
    }
  };
  
  const handleNextStep = () => {
    // Validate current step before proceeding
    if (registrationStep === 1) {
      // Role selection validation is handled in handleRoleSelect
      return;
    }
    
    if (registrationStep === 2) {
      // Validate personal information
      if (!signupForm.fullName || !signupForm.emailAddress || !signupForm.password || !signupForm.confirmPassword) {
        toast({
          title: "Missing Information",
          description: "Please fill out all required fields",
          variant: "destructive",
        });
        return;
      }
      
      if (signupForm.password !== signupForm.confirmPassword) {
        toast({
          title: "Password Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }
    }

    if (registrationStep === 3 && signupRole === UserRole.ADMIN) {
      // Validate admin sub-role selection
      if (!selectedAdminSubRole) {
        toast({
          title: "Admin Role Required",
          description: "Please select an admin role",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Increment step
    setRegistrationStep(prevStep => prevStep + 1);
  };
  
  const handlePrevStep = () => {
    if (registrationStep === 2 && signupRole) {
      // Go back to role selection
      setSignupRole(null);
    }
    
    setRegistrationStep(prevStep => Math.max(1, prevStep - 1));
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!signupForm.fullName || !signupForm.emailAddress || !signupForm.password || !signupForm.confirmPassword) {
        toast({
          title: "Missing Information",
          description: "Please fill out all required fields",
          variant: "destructive",
        });
        return;
      }
      
      if (signupForm.password !== signupForm.confirmPassword) {
        toast({
          title: "Password Error", 
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }

      if (!signupRole) {
        toast({
          title: "Role Required",
          description: "Please select a user role",
          variant: "destructive",
        });
        return;
      }

      // Map frontend roles to database roles
      let role = 'guest';
      let adminSubRole = undefined;

      if (signupRole === UserRole.ADMIN) {
        if (selectedAdminSubRole === AdminSubRole.SUPER_ADMIN) {
          role = 'super_admin';
        } else if (selectedAdminSubRole === AdminSubRole.PG_ADMIN) {
          role = 'pg_admin';
        } else if (selectedAdminSubRole === AdminSubRole.WARDEN) {
          role = 'warden';
        }
        adminSubRole = selectedAdminSubRole;
      } else if (signupRole === UserRole.PG_GUEST) {
        role = 'guest';
      }

      const { error } = await signUp(signupForm.emailAddress, signupForm.password, {
        full_name: signupForm.fullName,
        role: role,
        admin_sub_role: adminSubRole,
      });

      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account, then you can login.",
      });
      
      // Reset form and go to login tab
      setRegistrationStep(1);
      setSignupRole(null);
      setShowGuestSignup(false);
      setSignupForm({
        fullName: "",
        mobile: "",
        emailAddress: "",
        password: "",
        confirmPassword: "",
        profilePicture: null,
        pgName: "",
        pgType: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        mapLocation: "",
        numberOfBranches: "1",
        joinDate: "",
        endDate: "",
        emergencyPhone: "",
        idProofType: "",
        idProofFile: null,
        propertyProofType: "",
        propertyProofFile: null,
        gstin: "",
        roomCount: "",
        bedCapacity: "",
        hasAC: false,
        facilities: [],
        monthlyRent: "",
        securityDeposit: "",
        hasMeals: false,
        planType: "monthly",
        pgCount: "1",
        wardenName: "",
        wardenContact: "",
        emergencyContact: "",
        assetBeds: "",
        assetFans: "",
        enableServiceRequests: true,
        guestRoomNumber: "",
        guestJoinDate: "",
        guestEndDate: "",
        guestPgName: "",
        guestIdProof: "",
        guestEmergencyContact: "",
        agreeToTerms: false,
      });
      setActiveTab("login");
      
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSignupComplete = async (guestFormData: any) => {
    setIsLoading(true);
    
    try {
      // Create user account
      const { error: signupError } = await signUp(guestFormData.emailAddress, guestFormData.password, {
        full_name: guestFormData.fullName,
        role: 'guest',
        admin_sub_role: undefined,
        gender: guestFormData.gender,
      });

      if (signupError) {
        toast({
          title: "Signup Failed",
          description: signupError.message,
          variant: "destructive",
        });
        return;
      }

      // Get the user ID from the current session
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get room details to set proper rent and deposit
        const { data: roomData, error: roomFetchError } = await supabase
          .from('rooms')
          .select('price, pg_property_id')
          .eq('id', guestFormData.roomId)
          .single();

        if (roomFetchError) {
          console.error('Error fetching room details:', roomFetchError);
          toast({
            title: "Room Not Found",
            description: "The selected room is no longer available. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Get property details for security deposit
        const { data: propertyData, error: propertyFetchError } = await supabase
          .from('pg_properties')
          .select('security_deposit')
          .eq('id', guestFormData.pgPropertyId)
          .single();

        if (propertyFetchError) {
          console.error('Error fetching property details:', propertyFetchError);
          toast({
            title: "Property Not Found",
            description: "The selected property is no longer available. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Create or update profile with additional guest information
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            full_name: guestFormData.fullName,
            role: 'guest',
            phone: guestFormData.mobile,
            pg_property_id: guestFormData.pgPropertyId,
            gender: guestFormData.gender,
          });

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }

        // Create room assignment with proper rent and deposit
        const { error: roomAssignmentError } = await supabase
          .from('room_assignments')
          .insert({
            user_id: user.id,
            pg_property_id: guestFormData.pgPropertyId,
            room_id: guestFormData.roomId,
            start_date: guestFormData.joinDate,
            end_date: guestFormData.endDate,
            monthly_rent: roomData?.price || 0,
            security_deposit: propertyData?.security_deposit || 0,
            is_active: true,
          });

        if (roomAssignmentError) {
          console.error('Error creating room assignment:', roomAssignmentError);
          toast({
            title: "Room Assignment Failed",
            description: "Failed to assign room. Please try again or contact support.",
            variant: "destructive",
          });
          return;
        }

        // Update room availability
        const { error: roomUpdateError } = await supabase
          .from('rooms')
          .update({
            is_available: false,
            occupied: 1, // Increment occupied count
          })
          .eq('id', guestFormData.roomId);

        if (roomUpdateError) {
          console.error('Error updating room availability:', roomUpdateError);
        }

        // Update property occupied rooms count
        const { error: propertyUpdateError } = await supabase
          .from('pg_properties')
          .update({
            occupied_rooms: 1
          })
          .eq('id', guestFormData.pgPropertyId);

        if (propertyUpdateError) {
          console.error('Error updating property occupancy:', propertyUpdateError);
        }

        // Create initial payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            user_id: user.id,
            pg_property_id: guestFormData.pgPropertyId,
            type: 'deposit',
            amount: propertyData?.security_deposit || 0,
            status: 'pending',
            description: 'Security deposit payment',
            due_date: new Date().toISOString().split('T')[0],
            currency: 'INR',
            payment_method: null,
            transaction_id: null,
          });

        if (paymentError) {
          console.error('Error creating payment record:', paymentError);
        }
      }

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account, then you can login.",
      });
      
      // Reset form and go to login tab
      setShowGuestSignup(false);
      setShowPGAdminSignup(false);
      setSignupRole(null);
      setActiveTab("login");
      
    } catch (error) {
      console.error("Guest signup error:", error);
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    };

  const handleWardenSignupComplete = async (warderFormData: any) => {
    try {
      toast({
        title: "Warden Account Created",
        description: "Your warden account has been created successfully. Please check your email to verify your account.",
      });
      
      // Reset form states
      setShowWardenSignup(false);
      setSelectedAdminSubRole(null);
      setSignupRole(null);
      setActiveTab("login");
      
      // Reload page to ensure proper session state
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Error handling warden signup completion:', error);
      toast({
        title: "Error",
        description: "An error occurred while completing the signup process.",
        variant: "destructive",
      });
    }
  };

  const handlePGAdminSignupComplete = async (pgAdminFormData: any) => {
    setIsLoading(true);
    
    try {
      // Create user account
      const { error: signupError } = await signUp(pgAdminFormData.emailAddress, pgAdminFormData.password, {
        full_name: pgAdminFormData.fullName,
        role: 'pg_admin',
        admin_sub_role: 'pg_admin',
      });

      if (signupError) {
        toast({
          title: "Signup Failed",
          description: signupError.message,
          variant: "destructive",
        });
        return;
      }

      // Ensure we have a session before performing DB inserts
      let { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const { error: signInError } = await signIn(pgAdminFormData.emailAddress, pgAdminFormData.password);
        if (signInError) {
          toast({
            title: "Verify your email",
            description: "Please verify your email and log in to complete PG setup.",
            variant: "destructive",
          });
          return;
        }
        const _res = await supabase.auth.getUser();
        user = _res.data.user;
      }

      if (user) {
        // Wait for profile to be created by the database trigger
        let profileExists = false;
        let retryCount = 0;
        const maxRetries = 10;
        
        while (!profileExists && retryCount < maxRetries) {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();
          
          if (existingProfile) {
            profileExists = true;
          } else {
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
            retryCount++;
          }
        }

        // Also wait for role to be assigned
        let roleExists = false;
        retryCount = 0;
        
        while (!roleExists && retryCount < maxRetries) {
          const { data: userRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'pg_admin')
            .single();
          
          if (userRole) {
            roleExists = true;
          } else {
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
            retryCount++;
          }
        }

        console.log('Profile and role verification complete');

        if (!profileExists) {
          toast({
            title: "Profile Creation Failed",
            description: "Profile was not created. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Create PG property with proper data validation
        const propertyData = {
          name: pgAdminFormData.pgName?.trim() || '',
          address: pgAdminFormData.address?.trim() || '',
          city: pgAdminFormData.city?.trim() || '',
          state: pgAdminFormData.state?.trim() || '',
          pincode: pgAdminFormData.pincode?.trim() || '',
          contact_number: pgAdminFormData.contactNumber?.trim() || '',
          manager_name: pgAdminFormData.managerName?.trim() || '',
          total_rooms: Math.max(0, Number.parseInt(pgAdminFormData.totalRooms) || 0),
          occupied_rooms: 0,
          monthly_rent: Math.max(0, Number.parseFloat(pgAdminFormData.monthlyRent) || 0),
          security_deposit: Math.max(0, Number.parseFloat(pgAdminFormData.securityDeposit) || 0),
          description: pgAdminFormData.description?.trim() || '',
          amenities: Array.isArray(pgAdminFormData.amenities) ? pgAdminFormData.amenities : [],
          rules: Array.isArray(pgAdminFormData.rules) ? pgAdminFormData.rules : [],
          rating: pgAdminFormData.rating ? Math.max(0, Math.min(5, Number.parseFloat(pgAdminFormData.rating))) : null,
          established: pgAdminFormData.established ? `${pgAdminFormData.established}-01-01` : null, // Convert year to full date
          is_active: true,
          created_by: user.id,
        };

        console.log('Creating PG property with data:', propertyData);

        const { data: pgProperty, error: pgPropertyError } = await supabase
          .from('pg_properties')
          .insert(propertyData)
          .select()
          .single();

        if (pgPropertyError) {
          console.error('Error creating PG property:', pgPropertyError);
          toast({
            title: "Error",
            description: `Failed to create PG property: ${pgPropertyError.message}`,
            variant: "destructive",
          });
          return;
        }

        console.log('PG Property created successfully:', pgProperty);

        // Update profile with PG property ID and phone
        console.log('Updating profile with property ID:', pgProperty.id);
        
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            phone: pgAdminFormData.mobile,
            pg_property_id: pgProperty.id,
          })
          .eq('id', user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          toast({
            title: "Profile Update Failed",
            description: `Failed to link PG property to your profile: ${profileError.message}`,
            variant: "destructive",
          });
          return;
        }

        console.log('Profile update successful, verifying...');

        // Verify profile update was successful
        const { data: updatedProfile, error: verifyError } = await supabase
          .from('profiles')
          .select('pg_property_id, phone')
          .eq('id', user.id)
          .single();

        if (verifyError || !updatedProfile?.pg_property_id) {
          console.error('Profile verification failed:', verifyError);
          
          // Try one more time to update the profile
          console.log('Retrying profile update...');
          const { error: retryError } = await supabase
            .from('profiles')
            .update({
              phone: pgAdminFormData.mobile,
              pg_property_id: pgProperty.id,
            })
            .eq('id', user.id);

          if (retryError) {
            console.error('Retry failed:', retryError);
            toast({
              title: "Profile Linking Failed",
              description: "Failed to link PG property to your profile after retry. Please contact support.",
              variant: "destructive",
            });
            return;
          }

          // Verify the retry
          const { data: finalProfile } = await supabase
            .from('profiles')
            .select('pg_property_id, phone')
            .eq('id', user.id)
            .single();

          if (!finalProfile?.pg_property_id) {
            toast({
              title: "Profile Linking Failed",
              description: "Unable to link PG property to your profile. Please contact support.",
              variant: "destructive",
            });
            return;
          }
          
          console.log('Profile updated successfully after retry:', finalProfile);
        } else {
          console.log('Profile updated successfully:', updatedProfile);
        }

        // Create initial rooms for the property
        const totalRooms = Number.parseInt(pgAdminFormData.totalRooms) || 0;
        const roomTypes = ['single', 'double', 'triple'];
        const baseRent = Number.parseFloat(pgAdminFormData.monthlyRent) || 0;
        const roomPrices = [baseRent, baseRent * 0.8, baseRent * 0.6];

        for (let i = 1; i <= totalRooms; i++) {
          const roomType = roomTypes[i % 3];
          const roomPrice = roomPrices[i % 3];
          const capacity = roomType === 'single' ? 1 : roomType === 'double' ? 2 : 3;
          
          const { error: roomError } = await supabase
            .from('rooms')
            .insert({
              pg_property_id: pgProperty.id,
              room_number: i.toString().padStart(3, '0'),
              type: roomType,
              capacity: capacity,
              occupied: 0,
              price: roomPrice,
              floor_number: Math.ceil(i / 10),
              is_available: true,
              amenities: roomType === 'single' ? ['AC', 'Attached Bathroom'] : ['Fan', 'Common Bathroom'],
            });

          if (roomError) {
            console.error(`Error creating room ${i}:`, roomError);
          }
        }

        // Create initial meals
        const mealTypes = ['breakfast', 'lunch', 'dinner'];
        const mealMenus = [
          'Bread, Butter, Jam, Tea, Fruits',
          'Rice, Dal, Mixed Vegetables, Roti, Curd',
          'Chapati, Dal, Sabzi, Pickle'
        ];

        for (let i = 0; i < mealTypes.length; i++) {
          const { error: mealError } = await supabase
            .from('meals')
            .insert({
              pg_property_id: pgProperty.id,
              date: new Date().toISOString().split('T')[0],
              meal_type: mealTypes[i],
              menu: mealMenus[i],
              is_active: true,
            });

          if (mealError) {
            console.error(`Error creating meal ${mealTypes[i]}:`, mealError);
          }
        }

        // Create initial notification
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            pg_property_id: pgProperty.id,
            title: 'Welcome to Space Mate!',
            message: `Your PG property "${pgAdminFormData.pgName}" has been successfully registered.`,
            type: 'general',
            requires_action: false,
          });

        if (notificationError) {
          console.error('Error creating notification:', notificationError);
        }
      }

      toast({
        title: "Account created successfully!",
        description: `Your PG property "${pgAdminFormData.pgName}" has been registered and linked to your account. Please check your email to verify your account.`,
      });
      
      // Reset form and go to login tab
      setShowPGAdminSignup(false);
      setSignupRole(null);
      setActiveTab("login");
      
      // Refresh the page to ensure proper session state
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error("PG Admin signup error:", error);
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render based on the admin sub-role selection state
  if (userRole === UserRole.ADMIN && !selectedAdminSubRole) {
    return (
      <AdminSubRoleSelection
        onSubRoleSelect={handleAdminSubRoleSelect}
        onBack={() => navigate("/role-selection")}
      />
    );
  }

  // Render guest signup form
  if (showGuestSignup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <GuestSignupForm
          onBack={() => {
            setShowGuestSignup(false);
            setSignupRole(null);
          }}
          onComplete={handleGuestSignupComplete}
          isLoading={isLoading}
        />
      </div>
    );
  }

  // Render PG Admin signup form
  if (showPGAdminSignup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <PGAdminSignupForm
          onBack={() => {
            setShowPGAdminSignup(false);
            setSignupRole(null);
          }}
          onComplete={handlePGAdminSignupComplete}
          isLoading={isLoading}
        />
      </div>
    );
  }

  // Render Warden signup form
  if (showWardenSignup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <WardenSignupForm
          onBack={() => {
            setShowWardenSignup(false);
            setSignupRole(null);
            setSelectedAdminSubRole(null);
          }}
          onComplete={handleWardenSignupComplete}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md animate-fade-in shadow-xl border-hostel-accent/30">
        <CardContent className="p-4">
          <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")} className="w-full">
            <TabsList className={`grid ${userRole === UserRole.ADMIN && selectedAdminSubRole === AdminSubRole.SUPER_ADMIN ? 'grid-cols-1' : 'grid-cols-2'} mb-4`}>
              <TabsTrigger value="login">Login</TabsTrigger>
              {/* Hide signup option for Super Admin */}
              {!(userRole === UserRole.ADMIN && selectedAdminSubRole === AdminSubRole.SUPER_ADMIN) && (
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-500" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 bg-white text-sm h-11"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyRound size={16} className="text-gray-500" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9 pr-9 bg-white text-sm h-11"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-2 focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff size={16} className="text-gray-500" />
                          ) : (
                            <Eye size={16} className="text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remember password checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberPassword"
                    checked={rememberPassword}
                    onCheckedChange={(checked) => 
                      setRememberPassword(checked === true)
                    }
                  />
                  <label
                    htmlFor="rememberPassword"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember password
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-hostel-primary hover:bg-hostel-secondary text-white"
                  disabled={isLoading || authLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/role-selection')}
                    className="text-sm text-hostel-primary hover:text-hostel-secondary flex items-center mx-auto"
                  >
                    <ArrowLeft size={14} className="mr-1" /> Change User Role
                  </button>
                </div>
                
                {userRole === UserRole.ADMIN && selectedAdminSubRole && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleBackToRoleSelection}
                      className="text-sm text-hostel-primary hover:text-hostel-secondary"
                    >
                      Change Admin Role
                    </button>
                  </div>
                )}
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Step 1 - Select account type */}
                {registrationStep === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <User className="h-5 w-5 text-hostel-primary" />
                      <h2 className="text-lg font-medium">Select Account Type</h2>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Admin Role */}
                      <div 
                        className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex items-center"
                        onClick={() => handleRoleSelect(UserRole.ADMIN)}
                      >
                        <div className="w-10 h-10 rounded-full bg-hostel-accent flex items-center justify-center mr-3">
                          <Shield className="text-hostel-primary w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Admin</h3>
                          <p className="text-sm text-gray-600">Register as a PG/Hostel administrator</p>
                        </div>
                      </div>
                      
                      {/* PG Guest Role */}
                      <div 
                        className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex items-center"
                        onClick={() => handleRoleSelect(UserRole.PG_GUEST)}
                      >
                        <div className="w-10 h-10 rounded-full bg-hostel-accent flex items-center justify-center mr-3">
                          <Home className="text-hostel-primary w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">PG Guest</h3>
                          <p className="text-sm text-gray-600">Register as a PG/Hostel resident</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 - Personal Info (Common for all roles) */}
                {registrationStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <User className="h-5 w-5 text-hostel-primary" />
                      <h2 className="text-lg font-medium">Personal Information</h2>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={signupForm.fullName}
                          onChange={handleSignupInputChange}
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
                          value={signupForm.mobile}
                          onChange={handleSignupInputChange}
                          placeholder="Enter your mobile number"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="emailAddress">Email Address</Label>
                        <Input
                          id="emailAddress"
                          name="emailAddress"
                          type="email"
                          value={signupForm.emailAddress}
                          onChange={handleSignupInputChange}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={signupForm.password}
                          onChange={handleSignupInputChange}
                          placeholder="Create a password"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={signupForm.confirmPassword}
                          onChange={handleSignupInputChange}
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 - Admin Sub-role Selection */}
                {registrationStep === 3 && signupRole === UserRole.ADMIN && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Shield className="h-5 w-5 text-hostel-primary" />
                      <h2 className="text-lg font-medium">Select Admin Role</h2>
                    </div>
                    
                    <div className="space-y-3">
                      {adminSubRoles.map((role) => {
                        const Icon = role.icon;
                        return (
                          <div 
                            key={role.id}
                            className={`bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex items-center ${
                              selectedAdminSubRole === role.id ? 'border-hostel-primary bg-hostel-accent/10' : 'border-gray-100'
                            }`}
                            onClick={() => setSelectedAdminSubRole(role.id)}
                          >
                            <div className="w-10 h-10 rounded-full bg-hostel-accent flex items-center justify-center mr-3">
                              <Icon className="text-hostel-primary w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{role.title}</h3>
                              <p className="text-sm text-gray-600">{role.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 4 - PG/Hostel Details (Admin only) */}
                {registrationStep === 4 && signupRole === UserRole.ADMIN && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Building className="h-5 w-5 text-hostel-primary" />
                      <h2 className="text-lg font-medium">PG/Hostel Details</h2>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="pgName">PG/Hostel Name</Label>
                        <Input
                          id="pgName"
                          name="pgName"
                          value={signupForm.pgName}
                          onChange={handleSignupInputChange}
                          placeholder="Enter your PG/Hostel name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pgType">PG Type</Label>
                        <Select
                          value={signupForm.pgType}
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={signupForm.address}
                          onChange={handleSignupInputChange}
                          placeholder="Enter your PG/Hostel address"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            value={signupForm.city}
                            onChange={handleSignupInputChange}
                            placeholder="City"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            value={signupForm.state}
                            onChange={handleSignupInputChange}
                            placeholder="State"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={signupForm.pincode}
                          onChange={handleSignupInputChange}
                          placeholder="Pincode"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {registrationStep === 3 && signupRole === UserRole.PG_GUEST && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <BedDouble className="h-5 w-5 text-hostel-primary" />
                      <h2 className="text-lg font-medium">Guest Details</h2>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="guestPgName">PG/Hostel Name</Label>
                        <Input
                          id="guestPgName"
                          name="guestPgName"
                          value={signupForm.guestPgName}
                          onChange={handleSignupInputChange}
                          placeholder="Enter your PG/Hostel name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="guestRoomNumber">Room Number</Label>
                        <Input
                          id="guestRoomNumber"
                          name="guestRoomNumber"
                          value={signupForm.guestRoomNumber}
                          onChange={handleSignupInputChange}
                          placeholder="Your room number"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="guestJoinDate">Join Date</Label>
                          <Input
                            id="guestJoinDate"
                            name="guestJoinDate"
                            type="date"
                            value={signupForm.guestJoinDate}
                            onChange={handleSignupInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="guestEndDate">End Date</Label>
                          <Input
                            id="guestEndDate"
                            name="guestEndDate"
                            type="date"
                            value={signupForm.guestEndDate}
                            onChange={handleSignupInputChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="guestEmergencyContact">Emergency Contact</Label>
                        <Input
                          id="guestEmergencyContact"
                          name="guestEmergencyContact"
                          value={signupForm.guestEmergencyContact}
                          onChange={handleSignupInputChange}
                          placeholder="Emergency contact number"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Final step - Terms and Conditions (Common) */}
                {registrationStep === 4 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <FileCheck className="h-5 w-5 text-hostel-primary" />
                      <h2 className="text-lg font-medium">Terms & Conditions</h2>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 max-h-40 overflow-y-auto">
                      <p className="mb-2">By creating an account, you agree to our Terms of Service and Privacy Policy. 
                      You consent to the collection and processing of your personal information as described in our policies.</p>
                      <p>You also confirm that all the information provided is accurate and complete.</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={signupForm.agreeToTerms}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("agreeToTerms", checked === true)
                        }
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
                  {registrationStep > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handlePrevStep}
                      className="flex items-center"
                    >
                      <ArrowLeft size={16} className="mr-1" /> Back
                    </Button>
                  )}
                  
                  {registrationStep < 4 ? (
                    <Button 
                      type="button" 
                      onClick={handleNextStep}
                      className="ml-auto flex items-center bg-hostel-primary hover:bg-hostel-secondary text-white"
                    >
                      Next <ChevronRight size={16} className="ml-1" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit"
                      disabled={!signupForm.agreeToTerms || isLoading || authLoading}
                      className="ml-auto flex items-center bg-hostel-primary hover:bg-hostel-secondary text-white"
                    >
                      {isLoading || authLoading ? "Creating Account..." : "Complete Registration"} <Check size={16} className="ml-1" />
                    </Button>
                  )}
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
