import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock, Shield, Fingerprint, AlertTriangle, Key, Smartphone } from "lucide-react";
import { useState } from "react";

const WardenSecurity = () => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Settings</h1>
        <p className="text-muted-foreground">Manage your account security and authentication methods.</p>
      </div>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-600" />
            Password
          </CardTitle>
          <CardDescription>Update your password and security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="current">Current Password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new">New Password</Label>
              <Input id="new" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input id="confirm" type="password" />
            </div>
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="2fa" className="flex flex-col gap-1">
              <span>Enable Two-Factor Authentication</span>
              <span className="text-sm text-gray-500">Secure your account with 2FA</span>
            </Label>
            <Switch
              id="2fa"
              checked={twoFactor}
              onCheckedChange={setTwoFactor}
            />
          </div>
          {twoFactor && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Verification Method</Label>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start">
                    <Smartphone className="mr-2 h-4 w-4" />
                    Authenticator App
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Key className="mr-2 h-4 w-4" />
                    SMS Verification
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Biometric Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-purple-600" />
            Biometric Authentication
          </CardTitle>
          <CardDescription>Use biometric authentication for faster access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="biometric" className="flex flex-col gap-1">
              <span>Enable Biometric Login</span>
              <span className="text-sm text-gray-500">Use fingerprint or face recognition</span>
            </Label>
            <Switch
              id="biometric"
              checked={biometric}
              onCheckedChange={setBiometric}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-purple-600" />
            Security Alerts
          </CardTitle>
          <CardDescription>Manage your security notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-alerts" className="flex flex-col gap-1">
              <span>Login Alerts</span>
              <span className="text-sm text-gray-500">Get notified of new login attempts</span>
            </Label>
            <Switch
              id="login-alerts"
              checked={loginAlerts}
              onCheckedChange={setLoginAlerts}
            />
          </div>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Security Tip</AlertTitle>
            <AlertDescription>
              Enable two-factor authentication for enhanced account security.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Activity</CardTitle>
          <CardDescription>Review recent security events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-start pb-4 border-b">
              <div>
                <h4 className="font-medium">Successful Login</h4>
                <p className="text-sm text-gray-500">From Windows PC - Chrome Browser</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex justify-between items-start pb-4 border-b">
              <div>
                <h4 className="font-medium">Password Changed</h4>
                <p className="text-sm text-gray-500">Security settings updated</p>
              </div>
              <span className="text-sm text-gray-500">Yesterday</span>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">New Device Login</h4>
                <p className="text-sm text-gray-500">From iPhone 13 - Safari Browser</p>
              </div>
              <span className="text-sm text-gray-500">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WardenSecurity; 