import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle, Mail, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";

const WardenHelp = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How do I handle maintenance requests?",
      answer: "You can view and manage maintenance requests through the Requests tab. Each request can be assigned a priority level and status. Click on a request to view details and update its status."
    },
    {
      question: "How do I manage room assets?",
      answer: "Navigate to the Assets section to view and manage all room assets. You can update asset conditions, mark items for maintenance, and generate reports on asset status."
    },
    {
      question: "What should I do in case of emergencies?",
      answer: "For emergencies, immediately contact emergency services if needed. Use the notification system to alert relevant staff and residents. Document the incident in the system once the situation is under control."
    },
    {
      question: "How do I communicate with residents?",
      answer: "Use the Messages feature to communicate with residents. You can send individual or broadcast messages. For urgent matters, use the Notifications system to send push notifications."
    },
    {
      question: "How do I generate reports?",
      answer: "Various reports can be generated from different sections. For maintenance reports, use the Maintenance section. For asset reports, use the Assets section. Each report can be customized and exported."
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
        <p className="text-muted-foreground">Find help and answers to your questions.</p>
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
        {/* Quick Help */}
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
              <Phone className="h-4 w-4" />
              Contact Support
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Mail className="h-4 w-4" />
              Email Support
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <MessageCircle className="h-4 w-4" />
              Live Chat
            </Button>
          </CardContent>
        </Card>

        {/* Video Tutorials */}
        <Card>
          <CardHeader>
            <CardTitle>Video Tutorials</CardTitle>
            <CardDescription>Learn through step-by-step videos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Getting Started Guide
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Managing Maintenance Requests
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Asset Management Tutorial
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
    </div>
  );
};

export default WardenHelp; 