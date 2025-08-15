import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  ShieldCheck, 
  Key, 
  Users, 
  Bell, 
  Camera, 
  Fingerprint,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const Security = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    biometricAccess: false,
    cctv: true,
    nightSecurity: true,
    visitorLog: true,
    emergencyAlerts: true,
    autoLock: false,
    securityNotifications: true
  });

  const [securityLogs] = useState([
    { id: 1, event: "Visitor Entry", location: "Main Gate", time: "2 mins ago", type: "info" },
    { id: 2, event: "CCTV Motion Alert", location: "Parking Area", time: "15 mins ago", type: "warning" },
    { id: 3, event: "Access Card Used", location: "Building Entry", time: "1 hour ago", type: "info" },
    { id: 4, event: "Emergency Exit Opened", location: "Floor 2", time: "2 hours ago", type: "alert" },
    { id: 5, event: "Night Guard Check-in", location: "All Floors", time: "3 hours ago", type: "info" }
  ]);

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    toast({
      title: "Security Setting Updated",
      description: `${setting} has been ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Management</h1>
          <p className="text-muted-foreground">Manage your PG's security settings and monitoring</p>
        </div>
        <Button variant="destructive" size="sm" className="shrink-0">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Emergency Contacts
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Security Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-600" />
              Security Features
            </CardTitle>
            <CardDescription>Configure security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Additional login security</p>
                </div>
                <Switch 
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Biometric Access</Label>
                  <p className="text-sm text-muted-foreground">Fingerprint entry system</p>
                </div>
                <Switch 
                  checked={settings.biometricAccess}
                  onCheckedChange={(checked) => handleSettingChange('biometricAccess', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>CCTV Monitoring</Label>
                  <p className="text-sm text-muted-foreground">24/7 video surveillance</p>
                </div>
                <Switch 
                  checked={settings.cctv}
                  onCheckedChange={(checked) => handleSettingChange('cctv', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Night Security</Label>
                  <p className="text-sm text-muted-foreground">Guard patrol system</p>
                </div>
                <Switch 
                  checked={settings.nightSecurity}
                  onCheckedChange={(checked) => handleSettingChange('nightSecurity', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-purple-600" />
              Access Control
            </CardTitle>
            <CardDescription>Manage entry and access settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Visitor Logging</Label>
                  <p className="text-sm text-muted-foreground">Track all visitors</p>
                </div>
                <Switch 
                  checked={settings.visitorLog}
                  onCheckedChange={(checked) => handleSettingChange('visitorLog', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Lock System</Label>
                  <p className="text-sm text-muted-foreground">Automatic door locking</p>
                </div>
                <Switch 
                  checked={settings.autoLock}
                  onCheckedChange={(checked) => handleSettingChange('autoLock', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Security Notifications</Label>
                  <p className="text-sm text-muted-foreground">Alert notifications</p>
                </div>
                <Switch 
                  checked={settings.securityNotifications}
                  onCheckedChange={(checked) => handleSettingChange('securityNotifications', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              Emergency Contacts
            </CardTitle>
            <CardDescription>Important contact numbers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Security Guard</Label>
                <Input value="+91 98765 43210" readOnly className="bg-gray-50" />
              </div>
              <div>
                <Label>Local Police</Label>
                <Input value="100" readOnly className="bg-gray-50" />
              </div>
              <div>
                <Label>Fire Department</Label>
                <Input value="101" readOnly className="bg-gray-50" />
              </div>
              <div>
                <Label>Ambulance</Label>
                <Input value="102" readOnly className="bg-gray-50" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Recent Security Logs
          </CardTitle>
          <CardDescription>Latest security events and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {securityLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Badge 
                      variant="outline" 
                      className={
                        log.type === "warning" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                        log.type === "alert" ? "bg-red-100 text-red-800 border-red-200" :
                        "bg-blue-100 text-blue-800 border-blue-200"
                      }
                    >
                      {log.type}
                    </Badge>
                    <div>
                      <p className="font-medium">{log.event}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.location} • {log.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security; 