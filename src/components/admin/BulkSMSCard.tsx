
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BulkSMSCardProps {
  selectedCount: number;
  someSelected: boolean;
}

const BulkSMSCard = ({ selectedCount, someSelected }: BulkSMSCardProps) => {
  const [smsMessage, setSmsMessage] = useState("");
  const { toast } = useToast();

  const handleBulkSMS = () => {
    if (!smsMessage) {
      toast({
        title: "Missing Message",
        description: "Please enter an SMS message.",
        variant: "destructive",
      });
      return;
    }

    console.log(`Sending SMS to ${selectedCount} admins:`, {
      message: smsMessage,
    });

    toast({
      title: "SMS Sent",
      description: `SMS sent to ${selectedCount} selected admins.`,
    });

    setSmsMessage("");
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-green-900 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Bulk SMS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <textarea
          placeholder="SMS Message (160 characters max)"
          value={smsMessage}
          onChange={(e) => setSmsMessage(e.target.value)}
          maxLength={160}
          className="w-full min-h-[100px] p-3 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500 resize-none"
        />
        <div className="text-xs text-green-600">
          {smsMessage.length}/160 characters
        </div>
        <Button
          onClick={handleBulkSMS}
          disabled={!someSelected}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <Send className="h-4 w-4 mr-2" />
          Send SMS to {selectedCount} Admins
        </Button>
      </CardContent>
    </Card>
  );
};

export default BulkSMSCard;
