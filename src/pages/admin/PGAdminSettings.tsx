import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  AlertCircle, 
  Bell, 
  Building, 
  ChevronLeft, 
  CreditCard, 
  Key, 
  MoonStar, 
  Save, 
  Shield, 
  SunMedium, 
  User, 
  X,
  Wifi 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PGAdminSettings = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile form states
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "PG Admin",
    email: currentUser?.email || "admin@spacemate.com",
    phone: currentUser?.phone || "+91 9876543210",
    profileImage: currentUser?.profileImage || "",
    pgName: "Sunshine PG",
    address: "123 Main Street, Bangalore",
    landmark: "Near City Park",
    pincode: "560001"
  });

  // Security form states
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    inAppNotifications: true,
    newGuestAlerts: true,
    maintenanceAlerts: true,
    paymentReminders: true,
    occupancyAlerts: true,
    foodMenuNotifications: true,
  });

  // App settings
  const [appSettings, setAppSettings] = useState({
    theme: "light",
    language: "english",
    autoSaveEnabled: true,
    dataBackupEnabled: true,
    showOccupancyStatus: true,
    defaultCurrency: "INR",
  });

  // PG settings
  const [pgSettings, setPgSettings] = useState({
    allowGuestBookings: true,
    enableFoodManagement: true,
    requireSecurityDeposit: true,
    onlinePaymentsEnabled: true,
    allowRoomChanges: true,
    maintenanceRequestsEnabled: true,
  });

  const handleProfileFormChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecurityFormChange = (e) => {
    const { name, value } = e.target;
    setSecurityForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationSettingChange = (setting, value) => {
    setNotificationSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleAppSettingChange = (setting, value) => {
    setAppSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handlePGSettingChange = (setting, value) => {
    setPgSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
      setIsLoading(false);
    }, 1000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      setIsLoading(false);
      setSecurityForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        twoFactorEnabled: securityForm.twoFactorEnabled,
      });
    }, 1000);
  };

  const handleResetSettings = (settingType) => {
    switch (settingType) {
      case "notifications":
        setNotificationSettings({
          emailNotifications: true,
          smsNotifications: true,
          inAppNotifications: true,
          newGuestAlerts: true,
          maintenanceAlerts: true,
          paymentReminders: true,
          occupancyAlerts: true,
          foodMenuNotifications: true,
        });
        break;
      case "app":
        setAppSettings({
          theme: "light",
          language: "english",
          autoSaveEnabled: true,
          dataBackupEnabled: true,
          showOccupancyStatus: true,
          defaultCurrency: "INR",
        });
        break;
      case "pg":
        setPgSettings({
          allowGuestBookings: true,
          enableFoodManagement: true,
          requireSecurityDeposit: true,
          onlinePaymentsEnabled: true,
          allowRoomChanges: true,
          maintenanceRequestsEnabled: true,
        });
        break;
      default:
        break;
    }
    
    toast({
      title: "Settings Reset",
      description: `${settingType.charAt(0).toUpperCase() + settingType.slice(1)} settings have been reset to defaults.`,
    });
  };

  const saveSettings = (settingType) => {
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      toast({
        title: "Settings Saved",
        description: `Your ${settingType} settings have been saved successfully.`,
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 p-2 sm:p-4 lg:p-8">
      <Card className="max-w-5xl mx-auto shadow-lg border-0">
        <CardHeader className="bg-white rounded-t-lg border-b p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2" 
                onClick={() => navigate("/pg-admin")}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold">Settings</CardTitle>
                <CardDescription className="text-sm hidden sm:block">Manage your account and PG preferences</CardDescription>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="ml-auto"
              onClick={() => navigate("/pg-admin")}
            >
              <X className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Close</span>
            </Button>
          </div>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-4">
            {/* Mobile Tabs - Horizontal scrollable */}
            <div className="md:hidden p-3 overflow-x-auto">
              <TabsList className="inline-flex w-auto h-9 p-1">
                <TabsTrigger value="profile" className="h-8 px-3">
                  <User className="h-4 w-4 mr-1 sm:mr-2" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="h-8 px-3">
                  <Shield className="h-4 w-4 mr-1 sm:mr-2" />
                  <span>Security</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="h-8 px-3">
                  <Bell className="h-4 w-4 mr-1 sm:mr-2" />
                  <span>Notif.</span>
                </TabsTrigger>
                <TabsTrigger value="app" className="h-8 px-3">
                  <MoonStar className="h-4 w-4 mr-1 sm:mr-2" />
                  <span>App</span>
                </TabsTrigger>
                <TabsTrigger value="pg" className="h-8 px-3">
                  <Building className="h-4 w-4 mr-1 sm:mr-2" />
                  <span>PG</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Desktop Sidebar Tabs - Vertical */}
            <div className="hidden md:block bg-slate-50 p-4 space-y-1 border-r border-b md:border-b-0">
              <TabsList className="flex flex-col w-full bg-transparent h-auto p-0 space-y-1">
                <TabsTrigger 
                  value="profile" 
                  className="justify-start w-full px-3 py-2 text-left h-auto data-[state=active]:bg-white data-[state=active]:shadow-none rounded-md"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="justify-start w-full px-3 py-2 text-left h-auto data-[state=active]:bg-white data-[state=active]:shadow-none rounded-md"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="justify-start w-full px-3 py-2 text-left h-auto data-[state=active]:bg-white data-[state=active]:shadow-none rounded-md"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="app" 
                  className="justify-start w-full px-3 py-2 text-left h-auto data-[state=active]:bg-white data-[state=active]:shadow-none rounded-md"
                >
                  <MoonStar className="h-4 w-4 mr-2" />
                  App Settings
                </TabsTrigger>
                <TabsTrigger 
                  value="pg" 
                  className="justify-start w-full px-3 py-2 text-left h-auto data-[state=active]:bg-white data-[state=active]:shadow-none rounded-md"
                >
                  <Building className="h-4 w-4 mr-2" />
                  PG Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="col-span-1 md:col-span-3 p-3 sm:p-4 md:p-6">
              <TabsContent value="profile" className="mt-0 space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={profileForm.profileImage} />
                    <AvatarFallback className="bg-purple-600 text-white text-xl">
                      {profileForm.name?.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <h2 className="text-xl font-bold">{profileForm.name}</h2>
                    <p className="text-gray-500">{profileForm.email}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Change Photo
                    </Button>
                  </div>
                </div>
                
                <form onSubmit={handleProfileSubmit}>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileFormChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileFormChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileFormChange}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <h3 className="text-lg font-semibold mb-4">PG Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="pgName">PG Name</Label>
                      <Input 
                        id="pgName"
                        name="pgName"
                        value={profileForm.pgName}
                        onChange={handleProfileFormChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address"
                        name="address"
                        value={profileForm.address}
                        onChange={handleProfileFormChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landmark">Landmark</Label>
                      <Input 
                        id="landmark"
                        name="landmark"
                        value={profileForm.landmark}
                        onChange={handleProfileFormChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input 
                        id="pincode"
                        name="pincode"
                        value={profileForm.pincode}
                        onChange={handleProfileFormChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        setProfileForm({
                          name: currentUser?.name || "PG Admin",
                          email: currentUser?.email || "admin@spacemate.com",
                          phone: currentUser?.phone || "+91 9876543210",
                          profileImage: currentUser?.profileImage || "",
                          pgName: "Sunshine PG",
                          address: "123 Main Street, Bangalore",
                          landmark: "Near City Park",
                          pincode: "560001"
                        });
                      }}
                    >
                      Reset
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="security" className="mt-0 space-y-6">
                <form onSubmit={handlePasswordSubmit}>
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  <div className="space-y-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={securityForm.currentPassword}
                        onChange={handleSecurityFormChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={securityForm.newPassword}
                        onChange={handleSecurityFormChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={securityForm.confirmPassword}
                        onChange={handleSecurityFormChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch 
                      checked={securityForm.twoFactorEnabled}
                      onCheckedChange={(checked) => {
                        setSecurityForm((prev) => ({ ...prev, twoFactorEnabled: checked }));
                        toast({
                          title: checked ? "2FA Enabled" : "2FA Disabled",
                          description: checked 
                            ? "Two-factor authentication has been enabled." 
                            : "Two-factor authentication has been disabled.",
                        });
                      }}
                    />
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Login Sessions</h3>
                  <Alert variant="default" className="bg-white">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Active Sessions</AlertTitle>
                    <AlertDescription>
                      You are currently logged in on 1 device.
                    </AlertDescription>
                  </Alert>
                  <Button variant="outline" className="mt-4">
                    Sign Out From All Devices
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationSettingChange("emailNotifications", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates via SMS</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => handleNotificationSettingChange("smsNotifications", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">In-App Notifications</p>
                      <p className="text-sm text-gray-500">Receive notifications within the app</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.inAppNotifications}
                      onCheckedChange={(checked) => handleNotificationSettingChange("inAppNotifications", checked)}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <h4 className="font-medium mb-3">Notification Types</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Guest Alerts</p>
                      <p className="text-sm text-gray-500">When new guests register or apply</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.newGuestAlerts}
                      onCheckedChange={(checked) => handleNotificationSettingChange("newGuestAlerts", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Maintenance Alerts</p>
                      <p className="text-sm text-gray-500">When maintenance requests are submitted</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.maintenanceAlerts}
                      onCheckedChange={(checked) => handleNotificationSettingChange("maintenanceAlerts", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Reminders</p>
                      <p className="text-sm text-gray-500">For upcoming and overdue payments</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.paymentReminders}
                      onCheckedChange={(checked) => handleNotificationSettingChange("paymentReminders", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Occupancy Alerts</p>
                      <p className="text-sm text-gray-500">When room occupancy changes</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.occupancyAlerts}
                      onCheckedChange={(checked) => handleNotificationSettingChange("occupancyAlerts", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Food Menu Notifications</p>
                      <p className="text-sm text-gray-500">For meal schedule updates</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.foodMenuNotifications}
                      onCheckedChange={(checked) => handleNotificationSettingChange("foodMenuNotifications", checked)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleResetSettings("notifications")}
                  >
                    Reset to Default
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => saveSettings("notification")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="app" className="mt-0">
                <h3 className="text-lg font-semibold mb-4">Application Settings</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select 
                        value={appSettings.theme} 
                        onValueChange={(value) => handleAppSettingChange("theme", value)}
                      >
                        <SelectTrigger id="theme">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">
                            <div className="flex items-center">
                              <SunMedium className="h-4 w-4 mr-2" />
                              Light
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center">
                              <MoonStar className="h-4 w-4 mr-2" />
                              Dark
                            </div>
                          </SelectItem>
                          <SelectItem value="system">System Default</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select 
                        value={appSettings.language} 
                        onValueChange={(value) => handleAppSettingChange("language", value)}
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="kannada">Kannada</SelectItem>
                          <SelectItem value="tamil">Tamil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="defaultCurrency">Default Currency</Label>
                      <Select 
                        value={appSettings.defaultCurrency} 
                        onValueChange={(value) => handleAppSettingChange("defaultCurrency", value)}
                      >
                        <SelectTrigger id="defaultCurrency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                          <SelectItem value="USD">US Dollar ($)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                          <SelectItem value="GBP">British Pound (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-Save</p>
                        <p className="text-sm text-gray-500">Automatically save changes as you work</p>
                      </div>
                      <Switch 
                        checked={appSettings.autoSaveEnabled}
                        onCheckedChange={(checked) => handleAppSettingChange("autoSaveEnabled", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Data Backup</p>
                        <p className="text-sm text-gray-500">Enable automatic data backups</p>
                      </div>
                      <Switch 
                        checked={appSettings.dataBackupEnabled}
                        onCheckedChange={(checked) => handleAppSettingChange("dataBackupEnabled", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Occupancy Status</p>
                        <p className="text-sm text-gray-500">Display room occupancy status on dashboard</p>
                      </div>
                      <Switch 
                        checked={appSettings.showOccupancyStatus}
                        onCheckedChange={(checked) => handleAppSettingChange("showOccupancyStatus", checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleResetSettings("app")}
                  >
                    Reset to Default
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => saveSettings("app")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="pg" className="mt-0">
                <h3 className="text-lg font-semibold mb-4">PG Feature Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Allow Guest Bookings</p>
                      <p className="text-sm text-gray-500">Enable guests to book rooms online</p>
                    </div>
                    <Switch 
                      checked={pgSettings.allowGuestBookings}
                      onCheckedChange={(checked) => handlePGSettingChange("allowGuestBookings", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Food Management</p>
                      <p className="text-sm text-gray-500">Enable food management system</p>
                    </div>
                    <Switch 
                      checked={pgSettings.enableFoodManagement}
                      onCheckedChange={(checked) => handlePGSettingChange("enableFoodManagement", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Security Deposit</p>
                      <p className="text-sm text-gray-500">Require security deposit from new residents</p>
                    </div>
                    <Switch 
                      checked={pgSettings.requireSecurityDeposit}
                      onCheckedChange={(checked) => handlePGSettingChange("requireSecurityDeposit", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Online Payments</p>
                      <p className="text-sm text-gray-500">Enable online payment collection</p>
                    </div>
                    <Switch 
                      checked={pgSettings.onlinePaymentsEnabled}
                      onCheckedChange={(checked) => handlePGSettingChange("onlinePaymentsEnabled", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Room Changes</p>
                      <p className="text-sm text-gray-500">Allow residents to request room changes</p>
                    </div>
                    <Switch 
                      checked={pgSettings.allowRoomChanges}
                      onCheckedChange={(checked) => handlePGSettingChange("allowRoomChanges", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Maintenance Requests</p>
                      <p className="text-sm text-gray-500">Enable maintenance request system</p>
                    </div>
                    <Switch 
                      checked={pgSettings.maintenanceRequestsEnabled}
                      onCheckedChange={(checked) => handlePGSettingChange("maintenanceRequestsEnabled", checked)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleResetSettings("pg")}
                  >
                    Reset to Default
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => saveSettings("pg")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default PGAdminSettings; 