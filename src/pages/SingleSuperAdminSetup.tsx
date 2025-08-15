import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  setupSingleSuperAdmin, 
  getSuperAdminCredentials, 
  checkSuperAdminStatus 
} from '@/utils/setupSingleSuperAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Shield, CheckCircle, AlertCircle, Copy, Eye, EyeOff, RefreshCw, Trash2, Database, User, Key } from 'lucide-react';

const SingleSuperAdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [superAdminStatus, setSuperAdminStatus] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState(getSuperAdminCredentials());
  const [customEmail, setCustomEmail] = useState('superadmin@spacemate.com');
  const [customPassword, setCustomPassword] = useState('SuperAdmin2024!');
  const [useCustomCredentials, setUseCustomCredentials] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const status = await checkSuperAdminStatus();
    setSuperAdminStatus(status);
  };

  const handleSetupSuperAdmin = async () => {
    setIsLoading(true);
    try {
      // Use custom credentials if specified
      const finalEmail = useCustomCredentials ? customEmail : credentials.email;
      const finalPassword = useCustomCredentials ? customPassword : credentials.password;

      const result = await setupSingleSuperAdmin(finalEmail, finalPassword);
      
      if (result.error) {
        toast({
          title: "Setup Failed",
          description: result.error.message || "Failed to setup super admin",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Setup Successful",
          description: result.message || "Super admin setup completed",
        });
        setCredentials({
          email: finalEmail,
          password: finalPassword
        });
      }
      
      // Refresh status
      await checkStatus();
    } catch (error) {
      console.error('Error setting up super admin:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceCleanup = async () => {
    if (!confirm('⚠️ This will delete ALL super admin users from the database. Are you sure?')) {
      return;
    }

    setIsLoading(true);
    try {
      // Delete all super admin users
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('role', 'super_admin');

      if (deleteError) {
        console.error('Error deleting user roles:', deleteError);
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('role', 'super_admin');

      if (profileError) {
        console.error('Error deleting profiles:', profileError);
      }

      // Note: We can't directly delete from auth.users due to RLS, but the profiles deletion should cascade
      
      toast({
        title: "Cleanup Complete",
        description: "All super admin users have been removed",
      });

      await checkStatus();
    } catch (error) {
      console.error('Error during cleanup:', error);
      toast({
        title: "Cleanup Error",
        description: "An error occurred during cleanup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setIsLoading(true);
    try {
      const finalEmail = useCustomCredentials ? customEmail : credentials.email;
      const finalPassword = useCustomCredentials ? customPassword : credentials.password;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: finalEmail,
        password: finalPassword,
      });

      if (error) {
        toast({
          title: "Login Test Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Test Successful",
          description: `Successfully logged in as ${data.user?.email}`,
        });
        
        // Sign out immediately after test
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Login test error:', error);
      toast({
        title: "Login Test Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Credentials copied to clipboard",
    });
  };

  const getStatusBadge = () => {
    if (!superAdminStatus) return <Badge variant="secondary">Checking...</Badge>;
    
    if (superAdminStatus.error) return <Badge variant="destructive">Error</Badge>;
    
    if (superAdminStatus.hasSingleSuperAdmin) {
      return <Badge variant="default" className="bg-green-600">✅ Single Super Admin</Badge>;
    }
    
    if (superAdminStatus.count === 0) {
      return <Badge variant="secondary">No Super Admin</Badge>;
    }
    
    return <Badge variant="destructive">Multiple Super Admins ({superAdminStatus.count})</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-blue-600 mr-3" />
              <div>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Single Super Admin Setup
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Configure the system with exactly one super administrator
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              {getStatusBadge()}
            </div>
          </CardHeader>
        </Card>

        {/* Setup Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Setup Super Administrator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Important Notes:</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Only one super admin can exist in the system</li>
                <li>• The super admin has full access to all features</li>
                <li>• This setup will remove any existing super admin users</li>
                <li>• Use these credentials to access the super admin dashboard</li>
              </ul>
            </div>

            {/* Custom Credentials Option */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  id="useCustomCredentials"
                  checked={useCustomCredentials}
                  onChange={(e) => setUseCustomCredentials(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="useCustomCredentials" className="font-medium">
                  Use Custom Credentials
                </Label>
              </div>
              
              {useCustomCredentials && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customEmail">Custom Email</Label>
                    <Input
                      id="customEmail"
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="superadmin@spacemate.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customPassword">Custom Password</Label>
                    <Input
                      id="customPassword"
                      type="password"
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      placeholder="SuperAdmin2024!"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={handleSetupSuperAdmin}
                disabled={isLoading || (superAdminStatus?.hasSingleSuperAdmin)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Setting up..." : "Setup Super Admin"}
              </Button>
              
              <Button
                onClick={handleTestLogin}
                disabled={isLoading}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Test Login
              </Button>
              
              <Button
                onClick={checkStatus}
                variant="outline"
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
              
              <Button
                onClick={handleForceCleanup}
                disabled={isLoading}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Force Cleanup
              </Button>
            </div>

            {superAdminStatus?.hasSingleSuperAdmin && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Super Admin is properly configured!</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Credentials Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Super Admin Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </Label>
                <div className="flex">
                  <Input
                    id="email"
                    type="text"
                    value={credentials.email}
                    readOnly
                    className="flex-1 rounded-r-none"
                  />
                  <Button
                    onClick={() => copyToClipboard(credentials.email)}
                    variant="outline"
                    className="rounded-l-none border-l-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </Label>
                <div className="flex">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    readOnly
                    className="flex-1 rounded-r-none"
                  />
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    variant="outline"
                    className="rounded-l-none border-l-0"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(credentials.password)}
                    variant="outline"
                    className="rounded-l-none border-l-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Login Instructions:</h4>
              <ol className="text-yellow-800 text-sm space-y-1 list-decimal list-inside">
                <li>Go to the <code className="bg-yellow-100 px-1 rounded">/login</code> page</li>
                <li>Enter the email and password above</li>
                <li>Click "Sign In" to access the super admin dashboard</li>
                <li>You will be redirected to <code className="bg-yellow-100 px-1 rounded">/super-admin</code></li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        {superAdminStatus && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Current Super Admin Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Super Admins:</span>
                  <Badge variant={superAdminStatus.hasSingleSuperAdmin ? "default" : "destructive"}>
                    {superAdminStatus.count}
                  </Badge>
                </div>

                {superAdminStatus.users && superAdminStatus.users.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Existing Super Admin Users:</h4>
                    <div className="space-y-2">
                      {superAdminStatus.users.map((user: any) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{user.full_name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                            <div className="text-xs text-gray-500">ID: {user.id}</div>
                          </div>
                          <Badge variant="outline">
                            {user.id === '00000000-0000-0000-0000-000000000000' ? 'Primary' : 'Secondary'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {superAdminStatus.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-semibold">Error checking status:</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">{superAdminStatus.error.message}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => window.location.href = '/login'}
                variant="outline"
                className="w-full"
              >
                Go to Login Page
              </Button>
              <Button
                onClick={() => window.location.href = '/super-admin'}
                variant="outline"
                className="w-full"
                disabled={!superAdminStatus?.hasSingleSuperAdmin}
              >
                Access Super Admin Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SingleSuperAdminSetup;
