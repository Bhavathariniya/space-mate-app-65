import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Star, Users, Building2, Shield, ExternalLink, Heart, Clock } from "lucide-react";

const GuestAbout = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">About Space Mate</h1>
        <p className="text-muted-foreground">Your home away from home</p>
      </div>

      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-purple-600" />
            Welcome to Space Mate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Space Mate is your comprehensive PG accommodation management platform, designed to make your stay comfortable and hassle-free. We're committed to providing the best living experience for our residents.
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Version 1.0.0</Badge>
            <Badge variant="secondary">Established 2024</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-600" />
            Our Features
          </CardTitle>
          <CardDescription>What makes Space Mate special</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold">Community Living</h3>
            </div>
            <p className="text-sm text-gray-600">
              Connect with fellow residents and build lasting friendships.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold">Safe & Secure</h3>
            </div>
            <p className="text-sm text-gray-600">
              24/7 security and controlled access for your peace of mind.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold">Timely Service</h3>
            </div>
            <p className="text-sm text-gray-600">
              Quick response to maintenance requests and queries.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold">Modern Facilities</h3>
            </div>
            <p className="text-sm text-gray-600">
              Well-maintained amenities and comfortable living spaces.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* House Rules */}
      <Card>
        <CardHeader>
          <CardTitle>House Rules</CardTitle>
          <CardDescription>Guidelines for harmonious living</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              Maintain silence during study hours (10 PM - 6 AM)
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              Keep common areas clean and tidy
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              Report maintenance issues promptly
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              Follow meal timings strictly
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              Guests allowed only in common areas
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Get in touch with us</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Main Office</h3>
              <p className="text-sm text-gray-600">
                123 PG Street<br />
                City, State 123456<br />
                India
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Support Hours</h3>
              <p className="text-sm text-gray-600">
                Monday - Friday: 9 AM - 6 PM<br />
                Saturday: 10 AM - 2 PM<br />
                24/7 Emergency Support
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Connect With Us</CardTitle>
          <CardDescription>Follow us on social media</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 sm:flex-none gap-2">
              <ExternalLink className="h-4 w-4" />
              Facebook
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none gap-2">
              <ExternalLink className="h-4 w-4" />
              Instagram
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none gap-2">
              <ExternalLink className="h-4 w-4" />
              Twitter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestAbout; 