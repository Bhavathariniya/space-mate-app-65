import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { AlertCircle, Bell, ChevronLeft, CreditCard, Key, Shield, Save, User, UserCog, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const SuperAdminSettings = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile form states
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "Super Admin",
    email: currentUser?.email || "superadmin@spacemate.com",
    phone: currentUser?.phone || "+91 9876543210",
    profileImage: currentUser?.profileImage || "",
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
    subscriptionAlerts: true,
    paymentReminders: true,
    systemUpdates: true,
    newAdminSignups: true,
    criticalAlerts: true,
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    fontSize: "medium",
    colorScheme: "blue",
    reducedMotion: false,
    highContrast: false,
  });

  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    defaultCurrency: "INR",
    autoRenewal: true,
    paymentGateway: "razorpay",
    invoicePrefix: "SM-INV",
    sendReceiptEmails: true,
  });

  // API settings
  const [apiSettings, setApiSettings] = useState({
    apiKey: "sk_test_******************************",
    webhookUrl: "https://api.spacemate.com/webhooks/incoming",
    apiEnabled: true,
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

  const handleAppearanceSettingChange = (setting, value) => {
    setAppearanceSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handlePaymentSettingChange = (setting, value) => {
    setPaymentSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleApiSettingChange = (setting, value) => {
    setApiSettings((prev) => ({ ...prev, [setting]: value }));
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
          subscriptionAlerts: true,
          paymentReminders: true,
          systemUpdates: true,
          newAdminSignups: true,
          criticalAlerts: true,
        });
        break;
      case "appearance":
        setAppearanceSettings({
          theme: "light",
          fontSize: "medium",
          colorScheme: "blue",
          reducedMotion: false,
          highContrast: false,
        });
        break;
      case "payment":
        setPaymentSettings({
          defaultCurrency: "INR",
          autoRenewal: true,
          paymentGateway: "razorpay",
          invoicePrefix: "SM-INV",
          sendReceiptEmails: true,
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

  const generateNewApiKey = () => {
    setIsLoading(true);
    
    // Simulate API key generation
    setTimeout(() => {
      setApiSettings({
        ...apiSettings,
        apiKey: `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      });
      
      toast({
        title: "New API Key Generated",
        description: "Your new API key has been generated. Make sure to save it securely.",
      });
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-8">
      <Card className="max-w-5xl mx-auto shadow-lg border-0">
        <CardHeader className="bg-white rounded-t-lg border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2" 
                onClick={() => navigate("/super-admin")}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <CardTitle className="text-2xl font-bold">Settings</CardTitle>
                <CardDescription>Manage your account and system preferences</CardDescription>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={() => navigate("/super-admin")}
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="bg-slate-50 p-4 space-y-1 border-r border-b md:border-b-0">
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
                    value="appearance" 
                    className="justify-start w-full px-3 py-2 text-left h-auto data-[state=active]:bg-white data-[state=active]:shadow-none rounded-md"
                  >
                    <UserCog className="h-4 w-4 mr-2" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger 
                    value="payment" 
                    className="justify-start w-full px-3 py-2 text-left h-auto data-[state=active]:bg-white data-[state=active]:shadow-none rounded-md"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment
                  </TabsTrigger>
                  <TabsTrigger 
                    value="api" 
                    className="justify-start w-full px-3 py-2 text-left h-auto data-[state=active]:bg-white data-[state=active]:shadow-none rounded-md"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    API Settings
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="col-span-1 md:col-span-3 p-6">
                <TabsContent value="profile" className="m-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Profile Information</h3>
                      <p className="text-sm text-gray-500">Update your profile details and contact information</p>
                    </div>
                    
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="flex flex-col items-center space-y-2">
                          <Avatar className="w-24 h-24">
                            <AvatarImage src={profileForm.profileImage} />
                            <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-700">
                              {profileForm.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <Button type="button" variant="outline" size="sm">
                            Change Photo
                          </Button>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input 
                                id="name"
                                name="name"
                                value={profileForm.name}
                                onChange={handleProfileFormChange}
                                placeholder="Your full name"
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
                                placeholder="your.email@example.com"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input 
                                id="phone"
                                name="phone"
                                value={profileForm.phone}
                                onChange={handleProfileFormChange}
                                placeholder="+91 9876543210"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => navigate("/super-admin")}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </TabsContent>
                
                <TabsContent value="security" className="m-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Security Settings</h3>
                      <p className="text-sm text-gray-500">Manage your password and account security</p>
                    </div>
                    
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input 
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={securityForm.currentPassword}
                            onChange={handleSecurityFormChange}
                            placeholder="Enter your current password"
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
                            placeholder="Enter new password"
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
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-2">
                        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                          {isLoading ? "Updating..." : "Update Password"}
                        </Button>
                      </div>
                    </form>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-base font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Two-Factor Authentication</div>
                          <div className="text-sm text-gray-500">
                            {securityForm.twoFactorEnabled 
                              ? "Your account is protected with 2FA"
                              : "Enable 2FA for enhanced security"
                            }
                          </div>
                        </div>
                        <Switch
                          checked={securityForm.twoFactorEnabled}
                          onCheckedChange={(checked) => 
                            setSecurityForm(prev => ({ ...prev, twoFactorEnabled: checked }))
                          }
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-base font-medium">Session Management</h4>
                        <p className="text-sm text-gray-500">Manage your active sessions and devices</p>
                      </div>
                      
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Currently signed in from 1 device</AlertTitle>
                        <AlertDescription>
                          You can sign out from all other devices if you suspect unauthorized access.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex justify-end">
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                          Sign Out from All Other Devices
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notifications" className="m-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Notification Preferences</h3>
                      <p className="text-sm text-gray-500">Control how you receive notifications and alerts</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Email Notifications</Label>
                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                          </div>
                          <Switch
                            checked={notificationSettings.emailNotifications}
                            onCheckedChange={(checked) => 
                              handleNotificationSettingChange("emailNotifications", checked)
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">SMS Notifications</Label>
                            <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                          </div>
                          <Switch
                            checked={notificationSettings.smsNotifications}
                            onCheckedChange={(checked) => 
                              handleNotificationSettingChange("smsNotifications", checked)
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">In-App Notifications</Label>
                            <p className="text-sm text-gray-500">Receive notifications within the app</p>
                          </div>
                          <Switch
                            checked={notificationSettings.inAppNotifications}
                            onCheckedChange={(checked) => 
                              handleNotificationSettingChange("inAppNotifications", checked)
                            }
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-4">Notification Types</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">Subscription Alerts</Label>
                              <p className="text-sm text-gray-500">Get notified about subscription changes</p>
                            </div>
                            <Switch
                              checked={notificationSettings.subscriptionAlerts}
                              onCheckedChange={(checked) => 
                                handleNotificationSettingChange("subscriptionAlerts", checked)
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">Payment Reminders</Label>
                              <p className="text-sm text-gray-500">Get payment due and receipt notifications</p>
                            </div>
                            <Switch
                              checked={notificationSettings.paymentReminders}
                              onCheckedChange={(checked) => 
                                handleNotificationSettingChange("paymentReminders", checked)
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">System Updates</Label>
                              <p className="text-sm text-gray-500">Get notified about system changes</p>
                            </div>
                            <Switch
                              checked={notificationSettings.systemUpdates}
                              onCheckedChange={(checked) => 
                                handleNotificationSettingChange("systemUpdates", checked)
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">New Admin Signups</Label>
                              <p className="text-sm text-gray-500">Get notified when new PG admins register</p>
                            </div>
                            <Switch
                              checked={notificationSettings.newAdminSignups}
                              onCheckedChange={(checked) => 
                                handleNotificationSettingChange("newAdminSignups", checked)
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">Critical Alerts</Label>
                              <p className="text-sm text-gray-500">Always receive critical system alerts</p>
                            </div>
                            <Switch
                              checked={notificationSettings.criticalAlerts}
                              onCheckedChange={(checked) => 
                                handleNotificationSettingChange("criticalAlerts", checked)
                              }
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-4">
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
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? "Saving..." : "Save Preferences"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="appearance" className="m-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Appearance Settings</h3>
                      <p className="text-sm text-gray-500">Customize how the application looks and behaves</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="theme">Theme</Label>
                          <Select 
                            value={appearanceSettings.theme} 
                            onValueChange={(value) => handleAppearanceSettingChange("theme", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="fontSize">Font Size</Label>
                          <Select 
                            value={appearanceSettings.fontSize} 
                            onValueChange={(value) => handleAppearanceSettingChange("fontSize", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select font size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="colorScheme">Color Scheme</Label>
                          <Select 
                            value={appearanceSettings.colorScheme} 
                            onValueChange={(value) => handleAppearanceSettingChange("colorScheme", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select color scheme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="blue">Blue (Default)</SelectItem>
                              <SelectItem value="purple">Purple</SelectItem>
                              <SelectItem value="green">Green</SelectItem>
                              <SelectItem value="orange">Orange</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Accessibility</h4>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Reduced Motion</Label>
                            <p className="text-sm text-gray-500">Reduce animation effects</p>
                          </div>
                          <Switch
                            checked={appearanceSettings.reducedMotion}
                            onCheckedChange={(checked) => 
                              handleAppearanceSettingChange("reducedMotion", checked)
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">High Contrast</Label>
                            <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
                          </div>
                          <Switch
                            checked={appearanceSettings.highContrast}
                            onCheckedChange={(checked) => 
                              handleAppearanceSettingChange("highContrast", checked)
                            }
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-4">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => handleResetSettings("appearance")}
                        >
                          Reset to Default
                        </Button>
                        <Button 
                          type="button" 
                          onClick={() => saveSettings("appearance")}
                          disabled={isLoading}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? "Saving..." : "Save Settings"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="payment" className="m-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Payment Settings</h3>
                      <p className="text-sm text-gray-500">Configure payment options and gateways</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="defaultCurrency">Default Currency</Label>
                          <Select 
                            value={paymentSettings.defaultCurrency} 
                            onValueChange={(value) => handlePaymentSettingChange("defaultCurrency", value)}
                          >
                            <SelectTrigger>
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
                        
                        <div className="space-y-2">
                          <Label htmlFor="paymentGateway">Payment Gateway</Label>
                          <Select 
                            value={paymentSettings.paymentGateway} 
                            onValueChange={(value) => handlePaymentSettingChange("paymentGateway", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment gateway" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="razorpay">Razorpay</SelectItem>
                              <SelectItem value="stripe">Stripe</SelectItem>
                              <SelectItem value="paypal">PayPal</SelectItem>
                              <SelectItem value="paytm">Paytm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                          <Input 
                            id="invoicePrefix"
                            value={paymentSettings.invoicePrefix}
                            onChange={(e) => handlePaymentSettingChange("invoicePrefix", e.target.value)}
                            placeholder="SM-INV"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <Label className="font-medium">Auto-Renewal</Label>
                            <p className="text-sm text-gray-500">Automatically renew subscriptions</p>
                          </div>
                          <Switch
                            checked={paymentSettings.autoRenewal}
                            onCheckedChange={(checked) => 
                              handlePaymentSettingChange("autoRenewal", checked)
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Send Receipt Emails</Label>
                            <p className="text-sm text-gray-500">Email receipts after successful payments</p>
                          </div>
                          <Switch
                            checked={paymentSettings.sendReceiptEmails}
                            onCheckedChange={(checked) => 
                              handlePaymentSettingChange("sendReceiptEmails", checked)
                            }
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-4">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => handleResetSettings("payment")}
                        >
                          Reset to Default
                        </Button>
                        <Button 
                          type="button" 
                          onClick={() => saveSettings("payment")}
                          disabled={isLoading}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? "Saving..." : "Save Settings"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="api" className="m-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">API Settings</h3>
                      <p className="text-sm text-gray-500">Manage API keys and webhook configurations</p>
                    </div>
                    
                    <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>API Keys are sensitive</AlertTitle>
                      <AlertDescription>
                        Keep your API keys secure and never share them publicly. Rotate them regularly for enhanced security.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="apiKey">API Key</Label>
                          <div className="flex">
                            <Input 
                              id="apiKey"
                              value={apiSettings.apiKey}
                              readOnly
                              className="rounded-r-none"
                              type="password"
                            />
                            <Button 
                              type="button" 
                              className="rounded-l-none"
                              onClick={generateNewApiKey}
                              disabled={isLoading}
                            >
                              {isLoading ? "Generating..." : "Generate New Key"}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="webhookUrl">Webhook URL</Label>
                          <Input 
                            id="webhookUrl"
                            value={apiSettings.webhookUrl}
                            onChange={(e) => handleApiSettingChange("webhookUrl", e.target.value)}
                            placeholder="https://your-domain.com/webhook"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <Label className="font-medium">API Access</Label>
                            <p className="text-sm text-gray-500">Enable/disable API access</p>
                          </div>
                          <Switch
                            checked={apiSettings.apiEnabled}
                            onCheckedChange={(checked) => 
                              handleApiSettingChange("apiEnabled", checked)
                            }
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button 
                          type="button" 
                          onClick={() => saveSettings("API")}
                          disabled={isLoading}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? "Saving..." : "Save API Settings"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between bg-slate-50 border-t">
          <Button 
            variant="outline" 
            onClick={() => navigate("/super-admin")}
          >
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuperAdminSettings; 
