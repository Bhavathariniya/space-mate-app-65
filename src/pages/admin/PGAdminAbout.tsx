import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  X, 
  Github, 
  Globe, 
  Heart, 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin, 
  CheckCircle2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PGAdminAbout = () => {
  const navigate = useNavigate();
  
  // Features list
  const features = [
    "Comprehensive PG & Hostel Management",
    "Resident Database & Profiles",
    "Room Allocation & Management",
    "Food Service Management",
    "Payment Processing & Tracking",
    "Maintenance Request Handling",
    "Reports & Analytics",
    "Notification System",
    "Mobile Responsive Design",
    "Multi-language Support",
    "Real-time Updates",
    "Secure Authentication"
  ];
  
  // Team members
  const team = [
    {
      name: "Arun Kumar",
      role: "Founder & CEO",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "10+ years of experience in PropTech and hospitality management systems."
    },
    {
      name: "Priya Sharma",
      role: "Product Manager",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "Former hostel manager with deep understanding of PG operations."
    },
    {
      name: "Rahul Singh",
      role: "Lead Developer",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      bio: "Full-stack developer specializing in React and mobile applications."
    },
    {
      name: "Ananya Patel",
      role: "UX Designer",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
      bio: "Passionate about creating intuitive interfaces for complex systems."
    }
  ];

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
                <CardTitle className="text-xl sm:text-2xl font-bold">About Space Mate</CardTitle>
                <CardDescription className="text-sm hidden sm:block">Learn more about our platform and team</CardDescription>
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
        
        <CardContent className="p-3 sm:p-4 md:p-6">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-6">
              <TabsTrigger value="about" className="text-xs sm:text-sm py-2">About</TabsTrigger>
              <TabsTrigger value="team" className="text-xs sm:text-sm py-2">Our Team</TabsTrigger>
              <TabsTrigger value="legal" className="text-xs sm:text-sm py-2">Legal</TabsTrigger>
              <TabsTrigger value="updates" className="text-xs sm:text-sm py-2">Updates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-0 space-y-4 sm:space-y-6">
              {/* App Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 bg-white rounded-lg p-4 sm:p-6">
                <div className="shrink-0">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-md">
                    SM
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Space Mate</h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    Space Mate is a comprehensive PG and hostel management platform designed to streamline operations 
                    for property managers. Our mission is to simplify the day-to-day management of residential facilities, 
                    improving the experience for both administrators and residents.
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                    <Badge variant="secondary">Version 1.0.0</Badge>
                    <Badge variant="outline">Released: June 2023</Badge>
                    <Badge className="bg-purple-600">Current Release</Badge>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <Button size="sm" variant="outline" className="gap-2 text-xs sm:text-sm">
                      <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                      Website
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2 text-xs sm:text-sm">
                      <Github className="h-3 w-3 sm:h-4 sm:w-4" />
                      GitHub
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2 text-xs sm:text-sm">
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                      Support Us
                    </Button>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm sm:text-base">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Mission */}
              <div className="bg-purple-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Our Mission</h3>
                <p className="text-sm sm:text-base text-gray-700">
                  At Space Mate, we're committed to revolutionizing the way PGs and hostels are managed. 
                  We believe that technology should make operations simpler, not more complex. 
                  Our platform is built with the needs of both property managers and residents in mind, 
                  creating a harmonious ecosystem that benefits everyone involved. 
                  We're dedicated to continuous improvement and innovation, always striving to provide 
                  the best tools for our users.
                </p>
              </div>
              
              {/* Social Links */}
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
                  <Facebook className="h-4 w-4 text-blue-600" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
                  <Twitter className="h-4 w-4 text-blue-400" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
                  <Instagram className="h-4 w-4 text-pink-600" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
                  <Linkedin className="h-4 w-4 text-blue-700" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="team" className="mt-0 space-y-4 sm:space-y-6">
              <div className="bg-white rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Meet Our Team</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {team.map((member, index) => (
                    <div key={index} className="flex gap-3 sm:gap-4 bg-slate-50 p-3 sm:p-4 rounded-lg">
                      <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-white shadow">
                        <AvatarImage src={member.image} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base">{member.name}</h4>
                        <p className="text-xs sm:text-sm text-purple-600 font-medium mb-1">{member.role}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{member.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4 sm:my-6" />
                
                <div className="text-center">
                  <h3 className="text-base sm:text-lg font-bold mb-2">Join Our Team</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    We're always looking for talented individuals to join our mission of revolutionizing PG management.
                  </p>
                  <Button variant="outline" className="text-sm">View Open Positions</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="legal" className="mt-0 space-y-4 sm:space-y-6">
              <div className="bg-white rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Terms of Service</h3>
                <div className="prose prose-sm max-w-none text-xs sm:text-sm text-gray-700">
                  <p>Last updated: June 15, 2023</p>
                  <p>
                    Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Space Mate application (the "Service")
                    operated by Space Mate Technologies Pvt. Ltd. ("us", "we", or "our").
                  </p>
                  <p>
                    Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. 
                    These Terms apply to all visitors, users and others who access or use the Service.
                  </p>
                  <p>
                    By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms
                    then you may not access the Service.
                  </p>
                  
                  <h4 className="text-base sm:text-lg font-medium mt-4 mb-2">Accounts</h4>
                  <p>
                    When you create an account with us, you must provide us information that is accurate, complete, and current at all times.
                    Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                  </p>
                  
                  <h4 className="text-base sm:text-lg font-medium mt-4 mb-2">Intellectual Property</h4>
                  <p>
                    The Service and its original content, features and functionality are and will remain the exclusive property of
                    Space Mate Technologies Pvt. Ltd. and its licensors.
                  </p>
                </div>
                
                <Separator className="my-4 sm:my-6" />
                
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Privacy Policy</h3>
                <div className="prose prose-sm max-w-none text-xs sm:text-sm text-gray-700">
                  <p>Last updated: June 15, 2023</p>
                  <p>
                    Space Mate Technologies Pvt. Ltd. ("us", "we", or "our") operates the Space Mate application (the "Service").
                    This page informs you of our policies regarding the collection, use, and disclosure of Personal Information when you use our Service.
                  </p>
                  <p>
                    We will not use or share your information with anyone except as described in this Privacy Policy.
                  </p>
                  
                  <h4 className="text-base sm:text-lg font-medium mt-4 mb-2">Information Collection And Use</h4>
                  <p>
                    While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or
                    identify you. Personally identifiable information may include, but is not limited to, your email address, name, phone number, and
                    other information ("Personal Information").
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="updates" className="mt-0 space-y-4 sm:space-y-6">
              <div className="bg-white rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Release Notes</h3>
                
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge className="bg-purple-600">Current</Badge>
                      <h4 className="font-bold text-sm sm:text-base">Version 1.0.0</h4>
                      <span className="text-xs sm:text-sm text-gray-500">Released June 15, 2023</span>
                    </div>
                    <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-gray-700">
                      <li>Initial release of Space Mate platform</li>
                      <li>Complete PG management functionality</li>
                      <li>Resident management system</li>
                      <li>Room allocation features</li>
                      <li>Payment processing and tracking</li>
                      <li>Basic reporting capabilities</li>
                      <li>Mobile responsive design</li>
                    </ul>
                  </div>
                  
                  <Separator className="my-3 sm:my-4" />
                  
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline">Beta</Badge>
                      <h4 className="font-bold text-sm sm:text-base">Version 0.9.0</h4>
                      <span className="text-xs sm:text-sm text-gray-500">Released April 2, 2023</span>
                    </div>
                    <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-gray-700">
                      <li>Beta release for limited users</li>
                      <li>Core functionality testing</li>
                      <li>Performance improvements</li>
                      <li>Bug fixes from alpha version</li>
                    </ul>
                  </div>
                  
                  <Separator className="my-3 sm:my-4" />
                  
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline">Alpha</Badge>
                      <h4 className="font-bold text-sm sm:text-base">Version 0.5.0</h4>
                      <span className="text-xs sm:text-sm text-gray-500">Released January 10, 2023</span>
                    </div>
                    <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-gray-700">
                      <li>Alpha testing version</li>
                      <li>Internal release only</li>
                      <li>Basic functionality implementation</li>
                      <li>UI/UX testing</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6 bg-slate-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-bold text-sm sm:text-base mb-2">Upcoming Features</h4>
                  <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-gray-700">
                    <li>Enhanced reporting and analytics</li>
                    <li>Integration with accounting software</li>
                    <li>Advanced food management system</li>
                    <li>Resident mobile app</li>
                    <li>AI-powered occupancy predictions</li>
                    <li>Multi-language support</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="bg-slate-50 border-t p-3 sm:p-4 text-center text-xs sm:text-sm text-gray-500">
          © 2023 Space Mate Technologies Pvt. Ltd. All rights reserved.
        </CardFooter>
      </Card>
    </div>
  );
};

export default PGAdminAbout; 