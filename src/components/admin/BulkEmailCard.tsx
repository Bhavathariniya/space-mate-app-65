
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BulkEmailCardProps {
  selectedCount: number;
  someSelected: boolean;
}

const BulkEmailCard = ({ selectedCount, someSelected }: BulkEmailCardProps) => {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const { toast } = useToast();

  const handleBulkEmail = () => {
    if (!emailSubject || !emailMessage) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message for the email.",
        variant: "destructive",
      });
      return;
    }

    console.log(`Sending email to ${selectedCount} admins:`, {
      subject: emailSubject,
      message: emailMessage,
    });

    toast({
      title: "Email Sent",
      description: `Email sent to ${selectedCount} selected admins.`,
    });

    setEmailSubject("");
    setEmailMessage("");
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-blue-900 flex items-center">
          <Mail className="h-5 w-5 mr-2" />
          Bulk Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Email Subject"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          className="border-blue-300 focus:border-blue-500"
        />
        <textarea
          placeholder="Email Message"
          value={emailMessage}
          onChange={(e) => setEmailMessage(e.target.value)}
          className="w-full min-h-[100px] p-3 border border-blue-300 rounded-md focus:border-blue-500 focus:ring-blue-500 resize-none"
        />
        <Button
          onClick={handleBulkEmail}
          disabled={!someSelected}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Send className="h-4 w-4 mr-2" />
          Send Email to {selectedCount} Admins
        </Button>
      </CardContent>
    </Card>
  );
};

export default BulkEmailCard;
