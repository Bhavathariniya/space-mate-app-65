import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  Headphones, 
  HelpCircle, 
  Mail, 
  MessageSquare, 
  Phone, 
  Search, 
  Video, 
  X,
  ChevronDown,
  FileText
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const PGAdminHelp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("faq");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API request
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "We've received your message and will respond shortly.",
      });
      
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  // Sample tutorials data
  const tutorials = [
    { 
      id: 1, 
      title: "Getting Started with Space Mate", 
      description: "Learn the basics of navigating and using Space Mate PG Management System", 
      duration: "5:30", 
      thumbnail: "https://placehold.co/300x180",
      new: true
    },
    { 
      id: 2, 
      title: "Managing Resident Records", 
      description: "How to add, edit, and manage resident information", 
      duration: "7:45", 
      thumbnail: "https://placehold.co/300x180" 
    },
    { 
      id: 3, 
      title: "Processing Payments", 
      description: "Guide to handling resident payments and generating receipts", 
      duration: "6:15", 
      thumbnail: "https://placehold.co/300x180" 
    },
    { 
      id: 4, 
      title: "Room Allocation", 
      description: "How to assign and manage room allocations effectively", 
      duration: "4:20", 
      thumbnail: "https://placehold.co/300x180" 
    },
    { 
      id: 5, 
      title: "Managing Food Services", 
      description: "Set up and manage food service schedules and menus", 
      duration: "8:10", 
      thumbnail: "https://placehold.co/300x180",
      new: true
    },
    { 
      id: 6, 
      title: "Generating Reports", 
      description: "How to create and export different types of reports", 
      duration: "5:55", 
      thumbnail: "https://placehold.co/300x180" 
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
                <CardTitle className="text-xl sm:text-2xl font-bold">Help Center</CardTitle>
                <CardDescription className="text-sm hidden sm:block">Find answers, tutorials, and support</CardDescription>
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
          {/* Search */}
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input 
                placeholder="Search for help topics..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-6 h-auto">
              <TabsTrigger value="faq" className="py-2 text-xs sm:text-sm">
                <HelpCircle className="h-4 w-4 mr-1 sm:mr-2 shrink-0" />
                <span>FAQs</span>
              </TabsTrigger>
              <TabsTrigger value="tutorials" className="py-2 text-xs sm:text-sm">
                <Video className="h-4 w-4 mr-1 sm:mr-2 shrink-0" />
                <span>Tutorials</span>
              </TabsTrigger>
              <TabsTrigger value="guides" className="py-2 text-xs sm:text-sm">
                <FileText className="h-4 w-4 mr-1 sm:mr-2 shrink-0" />
                <span>User Guides</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="py-2 text-xs sm:text-sm">
                <Phone className="h-4 w-4 mr-1 sm:mr-2 shrink-0" />
                <span>Contact Us</span>
              </TabsTrigger>
            </TabsList>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="mt-0">
              <div className="bg-white rounded-lg p-3 sm:p-4">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Frequently Asked Questions</h3>
                
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="item-1" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-medium py-4 hover:no-underline">
                      How do I add a new resident?
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-1 text-gray-600">
                      To add a new resident, navigate to the "Residents" section from the bottom navigation bar, then click on the "Add Resident" button. Fill out the required information in the form and click "Save" to add the resident to your system.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-medium py-4 hover:no-underline">
                      How do I process rent payments?
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-1 text-gray-600">
                      To process rent payments, go to the "Payments" section in the side menu. Select the resident from the list, click on "Record Payment", enter the payment details (amount, date, payment method), and click "Save" to record the payment. The system will automatically generate a receipt.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-medium py-4 hover:no-underline">
                      How do I manage room assignments?
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-1 text-gray-600">
                      Room assignments can be managed from the "Rooms" section in the bottom navigation. Click on a room to view its details, then use the "Assign Resident" button to allocate a resident to the room. You can also change room assignments by clicking the "Change Room" option on a resident's profile.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-medium py-4 hover:no-underline">
                      How do I set up meal plans?
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-1 text-gray-600">
                      To set up meal plans, navigate to the "Food" section in the bottom navigation. Click on "Meal Plans" tab, then "Create New Plan". Define the meal schedule, menu items, and pricing, then assign residents to the plan. You can create multiple meal plans for different resident groups.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-medium py-4 hover:no-underline">
                      How do I handle maintenance requests?
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-1 text-gray-600">
                      Maintenance requests can be managed from the "Service Requests" section in the side menu. You can view all pending requests, assign them to staff members, update their status, and mark them as resolved once completed. Residents can submit requests through their resident portal.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-medium py-4 hover:no-underline">
                      How do I generate occupancy reports?
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-1 text-gray-600">
                      To generate occupancy reports, go to the "Reports" section in the side menu. Select "Occupancy Report" from the available report types, choose the date range and additional filters if needed, then click "Generate Report". You can view the report online or export it as PDF or Excel.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-7" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-medium py-4 hover:no-underline">
                      How do I process a resident checkout?
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-1 text-gray-600">
                      To process a resident checkout, navigate to the resident's profile in the "Residents" section. Click on "Process Checkout", complete the checkout form including move-out date, room condition, refund details, and final billing. The system will automatically update room availability and generate final invoices.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>

            {/* Tutorials Tab */}
            <TabsContent value="tutorials" className="mt-0">
              <div className="bg-white rounded-lg p-3 sm:p-4">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Video Tutorials</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {tutorials.map(tutorial => (
                    <Card key={tutorial.id} className="overflow-hidden">
                      <div className="relative">
                        <img 
                          src={tutorial.thumbnail} 
                          alt={tutorial.title}
                          className="w-full h-32 sm:h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                          <Button variant="outline" className="bg-white bg-opacity-90 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                            <Video className="h-4 w-4 sm:h-5 sm:w-5" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                          {tutorial.duration}
                        </div>
                        {tutorial.new && (
                          <Badge className="absolute top-2 left-2 bg-purple-600">New</Badge>
                        )}
                      </div>
                      <CardContent className="p-3 sm:p-4">
                        <h4 className="font-bold text-sm sm:text-base">{tutorial.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">{tutorial.description}</p>
                        <Button variant="ghost" size="sm" className="mt-2 w-full justify-between text-xs sm:text-sm">
                          Watch Tutorial <ChevronRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-center mt-4 sm:mt-6">
                  <Button variant="outline">
                    View All Tutorials
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* User Guides Tab */}
            <TabsContent value="guides" className="mt-0">
              <div className="bg-white rounded-lg p-3 sm:p-4">
                <h3 className="text-lg sm:text-xl font-bold mb-4">User Guides & Documentation</h3>
                
                <div className="grid gap-3 sm:gap-4">
                  <Card>
                    <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2">
                      <CardTitle className="text-base sm:text-lg">Getting Started Guide</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Complete overview for new PG administrators</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-1 sm:pt-0">
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">
                        This comprehensive guide covers everything you need to know to get started with the Space Mate platform, from initial setup to daily operations.
                      </p>
                      <Button variant="secondary" className="w-full justify-between text-xs sm:text-sm">
                        Download PDF <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2">
                      <CardTitle className="text-base sm:text-lg">Financial Management</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Guide to handling payments, invoices, and financial reports</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-1 sm:pt-0">
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">
                        Learn how to process payments, generate invoices, track expenses, and create financial reports for your PG business.
                      </p>
                      <Button variant="secondary" className="w-full justify-between text-xs sm:text-sm">
                        Download PDF <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2">
                      <CardTitle className="text-base sm:text-lg">Resident Management</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Complete guide to managing residents and applications</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-1 sm:pt-0">
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">
                        This guide covers all aspects of resident management including onboarding, resident profiles, communications, and conflict resolution.
                      </p>
                      <Button variant="secondary" className="w-full justify-between text-xs sm:text-sm">
                        Download PDF <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2">
                      <CardTitle className="text-base sm:text-lg">Room & Asset Management</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Guide to managing rooms, inventory, and assets</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-1 sm:pt-0">
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">
                        Learn how to effectively manage your property's rooms, track inventory, and maintain assets to ensure smooth operations.
                      </p>
                      <Button variant="secondary" className="w-full justify-between text-xs sm:text-sm">
                        Download PDF <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Contact Support Tab */}
            <TabsContent value="contact" className="mt-0">
              <div className="bg-white rounded-lg p-3 sm:p-4">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Contact Support</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <Card className="bg-slate-50">
                    <CardContent className="flex flex-col items-center justify-center p-3 sm:p-6 text-center">
                      <Phone className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600 mb-2 sm:mb-3" />
                      <h4 className="font-bold mb-0 sm:mb-1 text-sm sm:text-base">Call Us</h4>
                      <p className="text-gray-600 mb-1 sm:mb-2 text-xs sm:text-sm">Mon-Fri, 9am-6pm IST</p>
                      <a href="tel:+919876543210" className="text-purple-600 font-medium text-sm sm:text-base">+91 9876 543 210</a>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-50">
                    <CardContent className="flex flex-col items-center justify-center p-3 sm:p-6 text-center">
                      <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600 mb-2 sm:mb-3" />
                      <h4 className="font-bold mb-0 sm:mb-1 text-sm sm:text-base">Email Support</h4>
                      <p className="text-gray-600 mb-1 sm:mb-2 text-xs sm:text-sm">24/7 support</p>
                      <a href="mailto:support@spacemate.com" className="text-purple-600 font-medium text-sm sm:text-base">support@spacemate.com</a>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-50">
                    <CardContent className="flex flex-col items-center justify-center p-3 sm:p-6 text-center">
                      <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600 mb-2 sm:mb-3" />
                      <h4 className="font-bold mb-0 sm:mb-1 text-sm sm:text-base">Live Chat</h4>
                      <p className="text-gray-600 mb-1 sm:mb-2 text-xs sm:text-sm">Mon-Fri, 9am-9pm IST</p>
                      <Button variant="outline" size="sm" className="text-sm">Start Chat</Button>
                    </CardContent>
                  </Card>
                </div>
                
                <Separator className="my-4 sm:my-6" />
                
                <form onSubmit={handleContactSubmit} className="space-y-3 sm:space-y-4">
                  <h4 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Send us a message</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="name" className="text-sm">Your Name</Label>
                      <Input 
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        required
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="email" className="text-sm">Email Address</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        required
                        className="text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="subject" className="text-sm">Subject</Label>
                    <Input 
                      id="subject"
                      name="subject"
                      placeholder="What's this about?"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      required
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="message" className="text-sm">Message</Label>
                    <Textarea 
                      id="message"
                      name="message"
                      placeholder="How can we help you?"
                      rows={4}
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
                
                <Alert className="mt-4 sm:mt-6 bg-purple-50">
                  <Headphones className="h-4 w-4" />
                  <AlertTitle className="text-sm">Priority Support</AlertTitle>
                  <AlertDescription className="text-xs sm:text-sm">
                    Need urgent assistance? Premium subscribers get priority support with dedicated response times.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PGAdminHelp; 