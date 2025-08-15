
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BulkOperationsCardProps {
  selectedCount: number;
  someSelected: boolean;
}

const BulkOperationsCard = ({ selectedCount, someSelected }: BulkOperationsCardProps) => {
  const [bulkAction, setBulkAction] = useState<string>("");
  const { toast } = useToast();

  const handleBulkAction = () => {
    if (!bulkAction) {
      toast({
        title: "No Action Selected",
        description: "Please select a bulk action to perform.",
        variant: "destructive",
      });
      return;
    }

    console.log(`Performing bulk action: ${bulkAction} on ${selectedCount} admins`);

    toast({
      title: "Bulk Action Completed",
      description: `${bulkAction} applied to ${selectedCount} selected admins.`,
    });

    setBulkAction("");
  };

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-purple-900 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Bulk Operations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={bulkAction} onValueChange={setBulkAction}>
          <SelectTrigger className="border-purple-300 focus:border-purple-500">
            <SelectValue placeholder="Select bulk action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upgrade-monthly">Upgrade to Monthly</SelectItem>
            <SelectItem value="upgrade-yearly">Upgrade to Yearly</SelectItem>
            <SelectItem value="extend-trial">Extend Free Trial</SelectItem>
            <SelectItem value="suspend">Suspend Account</SelectItem>
            <SelectItem value="activate">Activate Account</SelectItem>
            <SelectItem value="send-reminder">Send Payment Reminder</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleBulkAction}
          disabled={!someSelected || !bulkAction}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Apply to {selectedCount} Admins
        </Button>
      </CardContent>
    </Card>
  );
};

export default BulkOperationsCard;
