import { Badge } from "@/components/ui/badge";
import { Clock, Users, DollarSign, ArrowUpRight } from "lucide-react";
import { ActivityItem as ActivityItemType } from "@/types/activity";
import { getActivityIcon, getSeverityColor, formatTimestamp } from "@/utils/activityUtils";

interface ActivityItemProps {
  activity: ActivityItemType;
  isLatest: boolean;
  isMobile: boolean;
}

const ActivityItem = ({ activity, isLatest, isMobile }: ActivityItemProps) => {
  const IconComponent = getActivityIcon(activity.type);
  const severityColorClass = getSeverityColor(activity.severity);

  const renderContent = () => (
    <div className="flex items-start gap-4">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${isLatest ? 'bg-blue-600' : 'bg-slate-100'} flex items-center justify-center shadow-sm transition-all duration-300`}>
        {IconComponent && <IconComponent className={`h-5 w-5 ${isLatest ? 'text-white' : 'text-slate-600'}`} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
          <h4 className="text-base font-semibold text-slate-900 truncate flex-1 pr-2">
            {activity.title}
          </h4>
          <div className="flex items-center gap-2 mt-1 sm:mt-0 flex-shrink-0">
            <Badge className={`text-xs px-2 py-1 ${severityColorClass}`}>
              {activity.severity.charAt(0).toUpperCase() + activity.severity.slice(1)}
            </Badge>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="h-3 w-3" /> {formatTimestamp(activity.timestamp)}
            </span>
          </div>
        </div>
        <p className="text-sm text-slate-700 mb-2 line-clamp-2">{activity.description}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
          {activity.user && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3 text-slate-500" />
              <span className="font-medium text-slate-700">{activity.user}</span>
            </span>
          )}
          {activity.amount && (activity.type === 'payment_received' || activity.type === 'subscription_upgraded') && (
            <span className="flex items-center gap-1 font-medium text-green-600">
              <DollarSign className="h-3 w-3 text-green-500" />
              ₹{activity.amount.toLocaleString()}
            </span>
          )}
          {activity.amount && (activity.type === 'refund_issued' || activity.type === 'subscription_downgraded') && (
            <span className="flex items-center gap-1 font-medium text-red-600">
              <DollarSign className="h-3 w-3 text-red-500" />
              -₹{activity.amount.toLocaleString()}
            </span>
          )}
          {activity.properties && (
            <span className="flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-slate-500" />
              <span className="font-medium text-slate-700">{activity.properties.propertyName || 'N/A'}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 hover:bg-slate-50 transition-colors duration-200 cursor-pointer">
      {renderContent()}
    </div>
  );
};

export default ActivityItem;
