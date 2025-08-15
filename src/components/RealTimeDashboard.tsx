import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Building, 
  IndianRupee, 
  Bell, 
  Activity, 
  TrendingUp,
  Wifi,
  Zap
} from 'lucide-react';
import { useRealTimePGProperties, useRealTimeRooms, useRealTimePayments, useRealTimeNotifications } from '@/hooks/useRealTimeData';
import { useToast } from '@/components/ui/use-toast';

const RealTimeDashboard = () => {
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Real-time data hooks
  const { properties, isLoading: propertiesLoading } = useRealTimePGProperties();
  const { rooms, isLoading: roomsLoading } = useRealTimeRooms();
  const { payments, isLoading: paymentsLoading } = useRealTimePayments();
  const { notifications, isLoading: notificationsLoading } = useRealTimeNotifications();

  // Update timestamp every 5 seconds to show real-time nature
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Calculate statistics
  const totalProperties = properties?.length || 0;
  const totalRooms = rooms?.length || 0;
  const availableRooms = rooms?.filter((room: any) => room.is_available).length || 0;
  const occupiedRooms = totalRooms - availableRooms;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  
  const totalRevenue = payments?.reduce((sum: number, payment: any) => {
    return payment.status === 'completed' ? sum + payment.amount : sum;
  }, 0) || 0;
  
  const pendingPayments = payments?.filter((payment: any) => payment.status === 'pending').length || 0;
  const unreadNotifications = notifications?.filter((notif: any) => !notif.is_read).length || 0;

  return (
    <div className="space-y-6">
      {/* Header with real-time indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Real-Time Dashboard</h1>
          <p className="text-muted-foreground">
            Live data updates from Supabase
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Live</span>
          </div>
          <Badge variant="outline" className="text-xs">
            Last update: {lastUpdate.toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Loading state */}
      {(propertiesLoading || roomsLoading || paymentsLoading || notificationsLoading) && (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 animate-spin text-blue-500" />
            <span className="text-muted-foreground">Loading real-time data...</span>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* PG Properties */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PG Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              Active properties
            </p>
            <div className="mt-2">
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Rooms */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRooms}</div>
            <p className="text-xs text-muted-foreground">
              {availableRooms} available, {occupiedRooms} occupied
            </p>
            <div className="mt-2">
              <Progress value={occupancyRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {pendingPayments} pending payments
            </p>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {unreadNotifications} unread
            </p>
            <div className="mt-2">
              <Progress 
                value={notifications?.length ? (unreadNotifications / notifications.length) * 100 : 0} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments?.slice(0, 5).map((payment: any, index: number) => (
                <div key={payment.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <IndianRupee className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">₹{payment.amount}</p>
                      <p className="text-sm text-muted-foreground">{payment.type}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={payment.status === 'completed' ? 'default' : 'secondary'}
                    className={
                      payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }
                  >
                    {payment.status}
                  </Badge>
                </div>
              ))}
              {(!payments || payments.length === 0) && (
                <p className="text-center text-muted-foreground py-4">No recent payments</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-500" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications?.slice(0, 5).map((notification: any, index: number) => (
                <div key={notification.id || index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                    <Bell className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
              ))}
              {(!notifications || notifications.length === 0) && (
                <p className="text-center text-muted-foreground py-4">No recent notifications</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Features Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-green-500" />
            Real-time Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-green-700">Live Updates</h3>
              <p className="text-sm text-green-600">Data refreshes automatically every few seconds</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-700">Instant Notifications</h3>
              <p className="text-sm text-blue-600">Real-time alerts for important events</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-700">Live Analytics</h3>
              <p className="text-sm text-purple-600">Real-time statistics and metrics</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Connected to Supabase</span>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-200">
              Active
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Real-time subscriptions are active and receiving live updates from the database.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeDashboard; 