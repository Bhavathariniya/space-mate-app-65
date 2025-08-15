import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Download, BarChart3 } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface AnalyticsHeaderProps {
  onExportData: (type: string, timeRange: string) => void;
}

const AnalyticsHeader = ({ onExportData }: AnalyticsHeaderProps) => {
  const [timeRange, setTimeRange] = useState("6m");
  const [showFilter, setShowFilter] = useState(false);
  const timeOptions = [
    { value: "6m", label: "Last 6 Months" },
    { value: "3m", label: "Last 3 Months" },
    { value: "1y", label: "This Year" },
    { value: "all", label: "All Time" },
  ];
  return (
    <Card className="border-slate-200">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-100 rounded-t-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-3 text-indigo-600" />
              Analytics Dashboard
            </CardTitle>
            <p className="text-slate-600 text-sm mt-1">Comprehensive business insights and trends</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="flex items-center gap-2 w-full sm:w-auto" onClick={() => setShowFilter(true)}>
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button 
              size="sm" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 w-full sm:w-auto"
              onClick={() => onExportData('analytics', timeRange)}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        {showFilter && (
          <div className="mt-4 p-4 bg-white border rounded shadow-sm">
            <div className="mb-2 font-medium">Advanced Filter (mocked)</div>
            <div className="mb-2 text-sm text-gray-500">Add filter controls here (by PG, by admin, by metric, etc).</div>
            <Button size="sm" variant="outline" onClick={() => setShowFilter(false)}>Close</Button>
          </div>
        )}
      </CardHeader>
    </Card>
  );
};

export default AnalyticsHeader;
