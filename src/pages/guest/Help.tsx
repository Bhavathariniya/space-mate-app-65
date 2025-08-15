import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle, Mail, Phone, MessageCircle, FileText } from "lucide-react";
import { useState } from "react";

const GuestHelp = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How do I submit a maintenance request?",
      answer: "To submit a maintenance request, go to the 'Requests' section in your dashboard. Click on 'New Request', fill in the details of the issue, and submit. You can track the status of your request from the same section."
    },
    {
      question: "How do I view my meal schedule?",
      answer: "You can view your meal schedule in the 'Meals' section. The schedule shows breakfast, lunch, and dinner timings, along with the menu for each day. You can also customize your meal preferences from this section."
    },
    {
      question: "What's the process for extending my stay?",
      answer: "To extend your stay, visit your profile section and click on 'Extend Stay'. Select your desired extension period and submit the request. The PG admin will review and confirm your extension request."
    },
    {
      question: "How do I pay my monthly rent?",
      answer: "Monthly rent can be paid through the 'Payments' section. You can choose from multiple payment methods including UPI, credit/debit cards, or net banking. All transactions are secure and you'll receive a receipt via email."
    },
    {
      question: "What should I do if I lose my room key?",
      answer: "If you lose your room key, immediately inform the warden through the 'Messages' section or contact the help desk. A temporary key will be provided while a replacement is arranged."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help Center</h1>
        <p className="text-muted-foreground">Find answers and get support</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-purple-600" />
              Quick Help
            </CardTitle>
            <CardDescription>Get immediate assistance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat with Support
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Phone className="h-4 w-4" />
              Call Warden
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Mail className="h-4 w-4" />
              Email Support
            </Button>
          </CardContent>
        </Card>

        {/* Guides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Helpful Guides
            </CardTitle>
            <CardDescription>Step-by-step tutorials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Getting Started Guide
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Room Maintenance Guide
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Payment Instructions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Common questions and answers</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
          <CardDescription>Important numbers and contacts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h4 className="font-medium">Warden</h4>
                <p className="text-sm text-gray-500">Available 24/7 for emergencies</p>
              </div>
              <Button variant="outline" size="sm">
                +91 98765 43210
              </Button>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h4 className="font-medium">Security</h4>
                <p className="text-sm text-gray-500">24/7 Security Desk</p>
              </div>
              <Button variant="outline" size="sm">
                +91 98765 43211
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Maintenance</h4>
                <p className="text-sm text-gray-500">For urgent repairs</p>
              </div>
              <Button variant="outline" size="sm">
                +91 98765 43212
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestHelp; 