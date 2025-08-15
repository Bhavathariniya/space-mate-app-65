import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Star, Users, Building2, Shield, ExternalLink } from "lucide-react";

const WardenAbout = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">About Space Mate</h1>
        <p className="text-muted-foreground">Learn more about our PG management platform.</p>
      </div>

      {/* Version Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-purple-600" />
            Version Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Version 1.0.0</Badge>
            <Badge variant="secondary">Latest Release</Badge>
          </div>
          <p className="text-sm text-gray-600">
            Released on: January 15, 2024
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-600" />
            Key Features
          </CardTitle>
          <CardDescription>Discover what makes Space Mate special</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold">Resident Management</h3>
            </div>
            <p className="text-sm text-gray-600">
              Efficiently manage resident profiles, requests, and communications.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold">Asset Tracking</h3>
            </div>
            <p className="text-sm text-gray-600">
              Keep track of all PG assets and maintenance requirements.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold">Security Management</h3>
            </div>
            <p className="text-sm text-gray-600">
              Ensure resident safety with advanced security features.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>System Requirements</CardTitle>
          <CardDescription>Recommended specifications for optimal performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Web Browser</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Chrome (latest version)</li>
                <li>• Firefox (latest version)</li>
                <li>• Safari (latest version)</li>
                <li>• Edge (latest version)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Mobile App</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• iOS 13 or later</li>
                <li>• Android 8.0 or later</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support & Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Support & Resources</CardTitle>
          <CardDescription>Additional help and documentation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full sm:w-auto gap-2">
            <ExternalLink className="h-4 w-4" />
            Documentation
          </Button>
          <Button variant="outline" className="w-full sm:w-auto gap-2">
            <ExternalLink className="h-4 w-4" />
            API Reference
          </Button>
          <Button variant="outline" className="w-full sm:w-auto gap-2">
            <ExternalLink className="h-4 w-4" />
            Community Forums
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WardenAbout; 