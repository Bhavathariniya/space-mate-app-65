import { Button } from "@/components/ui/button";
import { Activity, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ActivityFeedControlsProps {
  filter: string;
  setFilter: (filter: string) => void;
  isLive: boolean;
  isLoading: boolean;
  activitiesCount: number;
  toggleLiveUpdates: () => void;
  refreshActivities: () => void;
  isMobile: boolean;
}

const ActivityFeedControls = ({
  filter,
  setFilter,
  isLive,
  isLoading,
  activitiesCount,
  toggleLiveUpdates,
  refreshActivities,
  isMobile,
}: ActivityFeedControlsProps) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3">
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-full md:w-[170px] text-sm rounded-full border-gray-200 bg-white shadow-sm hover:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition">
          <Activity className="h-4 w-4 mr-2 text-indigo-400" />
          <SelectValue placeholder="Filter activities" />
        </SelectTrigger>
        <SelectContent className="rounded-xl shadow-lg">
          <SelectItem value="all">All Activities</SelectItem>
          <SelectItem value="payment">Payments</SelectItem>
          <SelectItem value="registration">Registrations</SelectItem>
          <SelectItem value="login">Logins</SelectItem>
          <SelectItem value="subscription">Subscriptions</SelectItem>
          <SelectItem value="property">Properties</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLiveUpdates}
        className={`flex-shrink-0 rounded-full px-4 py-2 font-semibold shadow-sm border-2 transition-all duration-200 focus:ring-2 focus:ring-green-100
          ${isLive ? 'text-green-700 border-green-300 bg-green-50 hover:bg-green-100' : 'text-gray-700 border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
      >
        <Activity className={`h-4 w-4 mr-2 ${isLive ? 'animate-pulse text-green-500' : 'text-gray-400'}`} />
        {isLive ? 'Pause Live' : 'Resume Live'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={refreshActivities}
        disabled={isLoading}
        className="flex-shrink-0 rounded-full px-4 py-2 font-semibold shadow-sm border-2 border-gray-200 bg-white hover:bg-gray-100 transition-all duration-200 focus:ring-2 focus:ring-indigo-100"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin text-indigo-400' : 'text-gray-400'}`} />
        Refresh
      </Button>
    </div>
  );
};

export default ActivityFeedControls;
