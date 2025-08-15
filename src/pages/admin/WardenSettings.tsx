import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Lock, Moon, Sun, Smartphone, Volume2 } from "lucide-react";
import { useState } from "react";

const WardenSettings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sound, setSound] = useState(true);
  const [mobileAlerts, setMobileAlerts] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      
      <Separator />

      <div className="grid gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex flex-col gap-1">
                <span>Push Notifications</span>
                <span className="text-sm text-gray-500">Receive notifications about important updates</span>
              </Label>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound" className="flex flex-col gap-1">
                <span>Sound</span>
                <span className="text-sm text-gray-500">Play sound for notifications</span>
              </Label>
              <Switch
                id="sound"
                checked={sound}
                onCheckedChange={setSound}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="mobile-alerts" className="flex flex-col gap-1">
                <span>Mobile Alerts</span>
                <span className="text-sm text-gray-500">Receive alerts on your mobile device</span>
              </Label>
              <Switch
                id="mobile-alerts"
                checked={mobileAlerts}
                onCheckedChange={setMobileAlerts}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {darkMode ? <Moon className="h-5 w-5 text-purple-600" /> : <Sun className="h-5 w-5 text-purple-600" />}
              Appearance
            </CardTitle>
            <CardDescription>Customize your interface preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex flex-col gap-1">
                <span>Dark Mode</span>
                <span className="text-sm text-gray-500">Switch between light and dark themes</span>
              </Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-600" />
              Security
            </CardTitle>
            <CardDescription>Manage your security preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full sm:w-auto">
              Change Password
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              Two-Factor Authentication
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WardenSettings; 