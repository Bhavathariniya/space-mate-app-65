import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserCheck, LogOut, AlertCircle, CheckCircle } from 'lucide-react';

const AuthTest = () => {
  const [email, setEmail] = useState('admin@spacemate.com');
  const [password, setPassword] = useState('admin123456');
  const [isLoading, setIsLoading] = useState(false);
  const [loginResult, setLoginResult] = useState<any>(null);
  const { toast } = useToast();
  const { user, profile, isAuthenticated, signIn, signOut } = useSupabaseAuth();

  const handleTestLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);

      if (error) {
        setLoginResult({ success: false, error: error.message });
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setLoginResult({ success: true, message: 'Login successful' });
        toast({
          title: "Login Successful",
          description: `Welcome ${email}`,
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
      await signOut();
      setLoginResult(null);
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Authentication Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="testEmail">Email</Label>
              <Input
                id="testEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@spacemate.com"
              />
            </div>
            <div>
              <Label htmlFor="testPassword">Password</Label>
              <Input
                id="testPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              disabled={!isAuthenticated}
            >
              <LogOut className="h-4 w-4 mr-1" />
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
                {loginResult.success ? loginResult.message : loginResult.error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Auth Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Authentication Status:</span>
              <Badge variant={isAuthenticated ? "default" : "secondary"}>
                {isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </Badge>
            </div>
            
            {user && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>User ID:</span>
                  <span className="text-sm font-mono">{user.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email:</span>
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>
            )}
            
            {profile && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Full Name:</span>
                  <span className="text-sm">{profile.full_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Role:</span>
                  <Badge variant="outline">{profile.role}</Badge>
                </div>
                {profile.admin_sub_role && (
                  <div className="flex items-center justify-between">
                    <span>Admin Sub-Role:</span>
                    <Badge variant="outline">{profile.admin_sub_role}</Badge>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Phone:</span>
                  <span className="text-sm">{profile.phone || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Test Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTest; 