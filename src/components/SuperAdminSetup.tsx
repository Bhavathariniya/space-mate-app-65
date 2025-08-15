import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { createSuperAdmin, createTestUsers, checkExistingUsers } from '@/utils/createSuperAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Users, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';

const SuperAdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [existingUsers, setExistingUsers] = useState<any[]>([]);
  const [testEmail, setTestEmail] = useState('admin@spacemate.com');
  const [testPassword, setTestPassword] = useState('admin123456');
  const [loginResult, setLoginResult] = useState<any>(null);
  const { toast } = useToast();

  const handleCreateSuperAdmin = async () => {
    setIsLoading(true);
    try {
      const result = await createSuperAdmin();
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message || "Failed to create super admin",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Super admin created successfully",
        });
      }
      
      // Refresh existing users
      await checkExistingUsersList();
    } catch (error) {
      console.error('Error creating super admin:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTestUsers = async () => {
    setIsLoading(true);
    try {
      const results = await createTestUsers();
      
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => r.error).length;
      
      toast({
        title: "Test Users Created",
        description: `${successCount} users created successfully, ${errorCount} errors`,
      });
      
      // Refresh existing users
      await checkExistingUsersList();
    } catch (error) {
      console.error('Error creating test users:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkExistingUsersList = async () => {
    try {
      const result = await checkExistingUsers();
      if (result.profiles) {
        setExistingUsers(result.profiles);
      }
    } catch (error) {
      console.error('Error checking existing users:', error);
    }
  };

  const handleTestLogin = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (error) {
        setLoginResult({ success: false, error: error.message });
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setLoginResult({ success: true, user: data.user });
        toast({
          title: "Login Successful",
          description: `Welcome ${data.user?.email}`,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginResult({ success: false, error: 'An unexpected error occurred' });
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setLoginResult(null);
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check existing users on component mount
  React.useEffect(() => {
    checkExistingUsersList();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Super Admin Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={handleCreateSuperAdmin} 
              disabled={isLoading}
              className="w-full"
            >
              Create Super Admin
            </Button>
            <Button 
              onClick={handleCreateTestUsers} 
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              Create Test Users
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Existing Admin Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {existingUsers.length > 0 ? (
              existingUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium">{user.email}</div>
                    <div className="text-sm text-muted-foreground">
                      Role: {user.role} {user.admin_sub_role && `(${user.admin_sub_role})`}
                    </div>
                  </div>
                  <Badge variant="outline">
                    {user.role === 'super_admin' ? 'Super Admin' : 
                     user.role === 'pg_admin' ? 'PG Admin' : 
                     user.role === 'warden' ? 'Warden' : user.role}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No admin users found</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Test Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="testEmail">Email</Label>
              <Input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="admin@spacemate.com"
              />
            </div>
            <div>
              <Label htmlFor="testPassword">Password</Label>
              <Input
                id="testPassword"
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="admin123456"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleTestLogin} 
              disabled={isLoading}
              className="flex-1"
            >
              Test Login
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline"
              disabled={!loginResult?.success}
            >
              Logout
            </Button>
          </div>

          {loginResult && (
            <div className={`p-4 rounded-lg border ${
              loginResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {loginResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="font-medium">
                  {loginResult.success ? 'Login Successful' : 'Login Failed'}
                </span>
              </div>
              <p className="text-sm mt-1">
                {loginResult.success 
                  ? `Logged in as: ${loginResult.user?.email}`
                  : loginResult.error
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border rounded">
                <div className="font-medium">Super Admin</div>
                <div>Email: admin@spacemate.com</div>
                <div>Password: admin123456</div>
              </div>
              <div className="p-3 border rounded">
                <div className="font-medium">PG Admin</div>
                <div>Email: pgadmin@test.com</div>
                <div>Password: password123</div>
              </div>
              <div className="p-3 border rounded">
                <div className="font-medium">Guest</div>
                <div>Email: guest@test.com</div>
                <div>Password: password123</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminSetup; 