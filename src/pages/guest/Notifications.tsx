
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notifications } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Bell, Calendar, CreditCard, Info, Settings } from "lucide-react";

const GuestNotifications = () => {
  const { currentUser } = useAuth();
  
  // Filter notifications for the current user
  const userNotifications = notifications.filter(
    notification => notification.userId === currentUser?.id
  );
  
  // Group notifications by date
  const groupedNotifications: Record<string, typeof notifications> = {};
  
  userNotifications.forEach(notification => {
    const date = format(new Date(notification.createdAt), "yyyy-MM-dd");
    if (!groupedNotifications[date]) {
      groupedNotifications[date] = [];
    }
    groupedNotifications[date].push(notification);
  });
  
  const handleNotificationAction = (notificationId: string, action: "yes" | "no") => {
    console.log(`Notification ID: ${notificationId}, Action: ${action}`);
    // In a real app, this would update the backend
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "meal":
        return <Calendar className="h-5 w-5 text-green-600" />;
      case "payment":
        return <CreditCard className="h-5 w-5 text-blue-600" />;
      case "announcement":
        return <Bell className="h-5 w-5 text-purple-600" />;
      case "service":
        return <Settings className="h-5 w-5 text-orange-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };
  
  return (
    <div className="space-y-6 p-4 sm:p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <span className="bg-hostel-accent text-hostel-primary px-3 py-1 rounded-full text-sm">
          {userNotifications.length} New
        </span>
      </div>
      
      {Object.keys(groupedNotifications).length > 0 ? (
        Object.entries(groupedNotifications)
          .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
          .map(([date, notifs]) => (
            <div key={date} className="space-y-3">
              <h2 className="text-sm font-medium text-gray-500 px-1">
                {format(new Date(date), "EEEE, MMMM do")}
              </h2>
              
              {notifs.map(notification => (
                <Card key={notification.id} className="overflow-hidden border border-gray-100">
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getBackgroundColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-gray-800">{notification.title}</h3>
                          <span className="text-xs text-gray-500 ml-2">
                            {format(new Date(notification.createdAt), "h:mm a")}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        
                        <div className="mt-3 flex items-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${getTypeStyles(notification.type)}`}>
                            {notification.type}
                          </span>
                          
                          {!notification.read && (
                            <span className="ml-2 inline-block w-2 h-2 bg-hostel-primary rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {notification.requiresAction && (
                      <div className="mt-4 pt-3 border-t flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNotificationAction(notification.id, "no")}
                        >
                          No
                        </Button>
                        <Button
                          size="sm"
                          className="bg-hostel-primary hover:bg-hostel-secondary text-white"
                          onClick={() => handleNotificationAction(notification.id, "yes")}
                        >
                          Yes
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ))
      ) : (
        <Card>
          <div className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No notifications yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              We'll notify you when there's something important.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

// Helper function to get styles based on notification type
const getTypeStyles = (type: string) => {
  switch (type) {
    case "meal":
      return "bg-green-100 text-green-800";
    case "payment":
      return "bg-blue-100 text-blue-800";
    case "announcement":
      return "bg-purple-100 text-purple-800";
    case "service":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get background color for icon
const getBackgroundColor = (type: string) => {
  switch (type) {
    case "meal":
      return "bg-green-100";
    case "payment":
      return "bg-blue-100";
    case "announcement":
      return "bg-purple-100";
    case "service":
      return "bg-orange-100";
    default:
      return "bg-gray-100";
  }
};

export default GuestNotifications;
