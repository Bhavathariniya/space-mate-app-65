
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { payments } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Save, LogOut } from "lucide-react";

const GuestProfile = () => {
  const { currentUser, logout, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    password: ""
  });
  
  // Filter payments for the current user
  const userPayments = payments.filter(payment => payment.userId === currentUser?.id);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update the user context
    if (updateUser && currentUser) {
      updateUser({
        ...currentUser,
        name: profileData.name,
        email: profileData.email
      });
    }
    
    setEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Personal Information</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-1"
            >
              {editing ? (
                <>
                  <Save className="h-4 w-4" /> Done
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" /> Edit
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-hostel-accent text-hostel-primary flex items-center justify-center text-2xl">
              {currentUser?.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-lg">{currentUser?.name}</h2>
              <p className="text-gray-500">{currentUser?.email}</p>
              <p className="text-sm mt-1">Room {currentUser?.roomNumber}</p>
            </div>
          </div>
          
          <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={profileData.name}
                onChange={handleInputChange}
                disabled={!editing}
                className={editing ? "" : "bg-gray-50"}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!editing}
                className={editing ? "" : "bg-gray-50"}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                placeholder="Your phone number"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!editing}
                className={editing ? "" : "bg-gray-50"}
              />
            </div>
            
            {editing && (
              <div className="space-y-2">
                <Label htmlFor="password">Change Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="New password"
                  value={profileData.password}
                  onChange={handleInputChange}
                />
              </div>
            )}
            
            {editing && (
              <Button 
                type="submit" 
                className="bg-hostel-primary hover:bg-hostel-secondary w-full"
              >
                Save Changes
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Stay Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Room Number:</span>
              <span>{currentUser?.roomNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Join Date:</span>
              <span>{currentUser?.joinDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">End Date:</span>
              <span>{currentUser?.endDate}</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-4 hover-scale"
            onClick={() => toast({
              title: "Request Sent",
              description: "Your extension request has been sent to the admin.",
            })}
          >
            Request Stay Extension
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userPayments.map(payment => (
              <div key={payment.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors">
                <div>
                  <p className="font-medium">{payment.description}</p>
                  <p className="text-sm text-gray-500">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{payment.amount}</p>
                  <p className={`text-xs ${payment.status === 'completed' ? 'text-green-500' : 'text-amber-500'}`}>
                    {payment.status.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
            
            {userPayments.length === 0 && (
              <p className="text-gray-500 text-center">No payment history available.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Button
        variant="outline"
        className="w-full border-red-300 text-red-500 hover:bg-red-50 flex items-center justify-center gap-2"
        onClick={logout}
      >
        <LogOut size={16} /> Log Out
      </Button>
    </div>
  );
};

export default GuestProfile;
