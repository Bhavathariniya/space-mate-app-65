
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { PGAdmin } from "@/hooks/usePGAdmins";

interface BulkSelectionControlsProps {
  admins: PGAdmin[];
  selectedAdmins: string[];
  onSelectionChange: (adminIds: string[]) => void;
  onExportSelected: () => void;
}

const BulkSelectionControls = ({
  admins,
  selectedAdmins,
  onSelectionChange,
  onExportSelected,
}: BulkSelectionControlsProps) => {
  const selectedCount = selectedAdmins.length;
  const allSelected = selectedAdmins.length === admins.length;
  const someSelected = selectedAdmins.length > 0;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(admins.map(admin => admin.id));
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <Checkbox
          checked={allSelected}
          onCheckedChange={handleSelectAll}
          className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
        />
        <span className="text-sm font-medium text-slate-700">
          {allSelected ? "Deselect All" : "Select All"} ({admins.length} admins)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={someSelected ? "default" : "outline"} className="ml-2">
          {selectedCount} Selected
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={onExportSelected}
          disabled={!someSelected}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Selected
        </Button>
      </div>
    </div>
  );
};

export default BulkSelectionControls;
