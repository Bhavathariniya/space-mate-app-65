
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { PGAdmin } from "@/hooks/usePGAdmins";
import { useToast } from "@/hooks/use-toast";
import BulkSelectionControls from "./BulkSelectionControls";
import BulkEmailCard from "./BulkEmailCard";
import BulkSMSCard from "./BulkSMSCard";
import BulkOperationsCard from "./BulkOperationsCard";

interface AdminBulkActionsProps {
  admins: PGAdmin[];
  selectedAdmins: string[];
  onSelectionChange: (adminIds: string[]) => void;
}

const AdminBulkActions = ({ admins, selectedAdmins, onSelectionChange }: AdminBulkActionsProps) => {
  const { toast } = useToast();
  const selectedCount = selectedAdmins.length;
  const someSelected = selectedAdmins.length > 0;

  const exportSelectedData = () => {
    const selectedAdminData = admins.filter(admin => selectedAdmins.includes(admin.id));
    console.log("Exporting data for selected admins:", selectedAdminData);
    
    toast({
      title: "Export Started",
      description: `Exporting data for ${selectedCount} selected admins.`,
    });
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-lg">
        <CardTitle className="text-xl font-semibold text-slate-900 flex items-center">
          <Users className="h-5 w-5 mr-3 text-indigo-600" />
          Bulk Admin Operations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <BulkSelectionControls
          admins={admins}
          selectedAdmins={selectedAdmins}
          onSelectionChange={onSelectionChange}
          onExportSelected={exportSelectedData}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BulkEmailCard selectedCount={selectedCount} someSelected={someSelected} />
          <BulkSMSCard selectedCount={selectedCount} someSelected={someSelected} />
        </div>

        <BulkOperationsCard selectedCount={selectedCount} someSelected={someSelected} />
      </CardContent>
    </Card>
  );
};

export default AdminBulkActions;
