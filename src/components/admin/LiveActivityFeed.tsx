import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Activity } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useActivityFeed } from "@/hooks/useActivityFeed";
import ActivityFeedControls from "./ActivityFeedControls";
import ActivityItem from "./ActivityItem";
import { Badge } from "@/components/ui/badge";

const LiveActivityFeed = () => {
  const {
    activities,
    isLoading,
    filter,
    setFilter,
    isLive,
    refreshActivities,
    toggleLiveUpdates,
  } = useActivityFeed();
  const isMobile = useIsMobile();

  return (
    <Card className="shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50/80 to-indigo-50/80 animate-fade-in-up">
      <CardHeader className="px-6 py-5 border-b border-gray-100 bg-white/80">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
          <CardTitle className="flex items-center gap-3 text-2xl font-extrabold text-slate-900 tracking-tight">
            <Zap className="h-7 w-7 text-indigo-500 drop-shadow" />
            Live Activity Feed
            <Badge className={`${isLive ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-gray-100 text-gray-700'} ml-2 px-3 py-1 rounded-full font-semibold text-xs shadow-sm`}>
              {isLive ? 'Live' : 'Paused'}
            </Badge>
            <Badge variant="outline" className="bg-slate-50 text-slate-700 text-xs ml-2 px-2 py-1 rounded-full font-medium border border-slate-200">
              {activities.length} Items
            </Badge>
          </CardTitle>
          <ActivityFeedControls
            filter={filter}
            setFilter={setFilter}
            isLive={isLive}
            isLoading={isLoading}
            activitiesCount={activities.length}
            toggleLiveUpdates={toggleLiveUpdates}
            refreshActivities={refreshActivities}
            isMobile={isMobile}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className={`overflow-y-auto ${isMobile ? 'max-h-[70vh]' : 'max-h-[600px]'} bg-white/80`}>
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-semibold">No recent activities</p>
              <p className="text-sm text-gray-400">Your activity feed is currently empty. Check back later!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {activities.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  isLatest={index === 0}
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveActivityFeed;
