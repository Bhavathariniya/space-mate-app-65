import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  Bell, Check, Search, AlertCircle, MessageSquare, 
  Info, Calendar, Package, User, Clock, Shield,
  X, Eye, Filter, Calendar as CalendarIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'alert' | 'info' | 'request' | 'system';
  source: 'resident' | 'admin' | 'system';
  actionRequired?: boolean;
  category?: string;
}

const WardenNotifications = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Maintenance Request',
      description: 'John Doe (Room 101) has reported a water leakage issue in the bathroom.',
      timestamp: '2024-03-22 09:30 AM',
      read: false,
      type: 'request',
      source: 'resident',
      actionRequired: true,
      category: 'maintenance'
    },
    {
      id: '2',
      title: 'System Maintenance',
      description: 'The system will undergo maintenance tonight from 2:00 AM to 4:00 AM.',
      timestamp: '2024-03-21 04:15 PM',
      read: true,
      type: 'info',
      source: 'system',
      category: 'system'
    },
    {
      id: '3',
      title: 'New Resident Check-in',
      description: 'Emma Wilson has been assigned to Room 203 and will check in tomorrow.',
      timestamp: '2024-03-21 02:45 PM',
      read: false,
      type: 'info',
      source: 'admin',
      category: 'resident'
    },
    {
      id: '4',
      title: 'Urgent: Power Outage',
      description: 'A power outage is scheduled in Block A for emergency repairs from 10:00 AM to 12:00 PM today.',
      timestamp: '2024-03-20 08:00 AM',
      read: true,
      type: 'alert',
      source: 'admin',
      actionRequired: true,
      category: 'facility'
    },
    {
      id: '5',
      title: 'Package Delivered',
      description: 'A package for Room 302 has been received at the front desk.',
      timestamp: '2024-03-19 03:30 PM',
      read: true,
      type: 'info',
      source: 'system',
      category: 'delivery'
    },
    {
      id: '6',
      title: 'Security Alert',
      description: 'Unauthorized person was reported near the west entrance. Security has been notified.',
      timestamp: '2024-03-18 11:20 PM',
      read: false,
      type: 'alert',
      source: 'system',
      actionRequired: true,
      category: 'security'
    }
  ]);

  // Filter notifications
  const filteredNotifications = notifications
    .filter(notification => {
      const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            notification.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || notification.type === filterType;
      const matchesTab = 
        (activeTab === 'all') ||
        (activeTab === 'unread' && !notification.read) ||
        (activeTab === 'actionRequired' && notification.actionRequired);
      
      return matchesSearch && matchesType && matchesTab;
    })
    .sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    toast({
      title: "Marked as read",
      description: "Notification has been marked as read"
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read"
    });
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    setShowDetailsDialog(false);
    toast({
      title: "Notification deleted",
      description: "The notification has been deleted"
    });
  };

  const getNotificationIcon = (type: string, source: string) => {
    if (type === 'alert') return <AlertCircle className="h-5 w-5 text-red-500" />;
    if (type === 'request') return <MessageSquare className="h-5 w-5 text-blue-500" />;
    if (type === 'info' && source === 'admin') return <Info className="h-5 w-5 text-purple-500" />;
    if (source === 'system') return <Bell className="h-5 w-5 text-gray-500" />;
    return <Bell className="h-5 w-5 text-gray-500" />;
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'maintenance': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'resident': return <User className="h-4 w-4 text-blue-500" />;
      case 'facility': return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'delivery': return <Package className="h-4 w-4 text-green-500" />;
      case 'security': return <Shield className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired).length;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500">Stay updated with alerts and information</p>
        </div>
        <Button 
          variant="outline" 
          className="text-purple-600 w-full md:w-auto"
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          <Check className="h-4 w-4 mr-2" />
          Mark All as Read
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">All Notifications</CardTitle>
            <Bell className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-gray-500">Total notifications</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-gray-500">Unread notifications</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Required</CardTitle>
            <Info className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actionRequiredCount}</div>
            <p className="text-xs text-gray-500">Notifications requiring action</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Notification Center</CardTitle>
              <CardDescription>View all system and resident notifications</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full sm:w-[200px]"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="alert">Alerts</SelectItem>
                  <SelectItem value="info">Information</SelectItem>
                  <SelectItem value="request">Requests</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4 w-full md:w-auto overflow-x-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread" className="whitespace-nowrap">
                Unread
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="actionRequired" className="whitespace-nowrap">
                Action Required
                {actionRequiredCount > 0 && (
                  <Badge variant="secondary" className="ml-2">{actionRequiredCount}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-0">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No notifications found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={cn(
                        "p-4 border rounded-lg hover:bg-gray-50 transition-colors",
                        !notification.read ? 'bg-purple-50 border-purple-200' : ''
                      )}
                    >
                      <div className="flex gap-3 items-start">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type, notification.source)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1">
                            <h3 className="font-medium truncate">{notification.title}</h3>
                            <div className="flex items-center gap-1 text-gray-500 text-xs whitespace-nowrap">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span>{notification.timestamp}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {notification.description}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex flex-wrap gap-1.5">
                              <Badge variant={
                                notification.type === 'alert' ? 'destructive' :
                                notification.type === 'request' ? 'default' :
                                'secondary'
                              } className="whitespace-nowrap">
                                {notification.type}
                              </Badge>
                              {notification.category && (
                                <Badge variant="outline" className="flex items-center gap-1 whitespace-nowrap">
                                  {getCategoryIcon(notification.category)}
                                  <span className="capitalize">{notification.category}</span>
                                </Badge>
                              )}
                              {notification.actionRequired && (
                                <Badge variant="warning" className="whitespace-nowrap">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-2 mt-2 sm:mt-0">
                              {!notification.read && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  <span className="hidden sm:inline">Mark as Read</span>
                                  <span className="inline sm:hidden">Read</span>
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedNotification(notification);
                                  setShowDetailsDialog(true);
                                }}
                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">View Details</span>
                                <span className="inline sm:hidden">View</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Notification Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="text-lg font-semibold">{selectedNotification.title}</h3>
                  <Badge variant={
                    selectedNotification.type === 'alert' ? 'destructive' :
                    selectedNotification.type === 'request' ? 'default' :
                    'secondary'
                  } className="w-fit">
                    {selectedNotification.type}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>{selectedNotification.timestamp}</span>
                  </div>
                  {selectedNotification.actionRequired && (
                    <Badge variant="warning">Action Required</Badge>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-800 whitespace-pre-line">{selectedNotification.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Source</p>
                  <p className="font-medium capitalize">{selectedNotification.source}</p>
                </div>
                {selectedNotification.category && (
                  <div>
                    <p className="text-gray-500">Category</p>
                    <p className="font-medium capitalize">{selectedNotification.category}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium">{selectedNotification.read ? 'Read' : 'Unread'}</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  className="text-red-600"
                  onClick={() => handleDeleteNotification(selectedNotification.id)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                {!selectedNotification.read && (
                  <Button
                    variant="outline"
                    className="text-green-600"
                    onClick={() => {
                      handleMarkAsRead(selectedNotification.id);
                      setShowDetailsDialog(false);
                    }}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark as Read
                  </Button>
                )}
                {selectedNotification.actionRequired && (
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Take Action
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WardenNotifications; 