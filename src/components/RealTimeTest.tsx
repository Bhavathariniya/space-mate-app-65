import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRealTimePGProperties, useRealTimeRooms, useRealTimePayments, useRealTimeNotifications } from '@/hooks/useRealTimeData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Activity, Wifi, WifiOff, RefreshCw } from 'lucide-react';

const RealTimeTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { toast } = useToast();

  // Real-time data hooks
  const { properties, isLoading: propertiesLoading } = useRealTimePGProperties();
  const { rooms, isLoading: roomsLoading } = useRealTimeRooms();
  const { payments, isLoading: paymentsLoading } = useRealTimePayments();
  const { notifications, isLoading: notificationsLoading } = useRealTimeNotifications();

  // Test real-time connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        setConnectionStatus('connecting');
        
        // Test basic connection
        const { data, error } = await supabase
          .from('pg_properties')
          .select('count')
          .limit(1);

        if (error) {
          console.error('Connection test failed:', error);
          setConnectionStatus('disconnected');
          return;
        }

        setConnectionStatus('connected');
        
        // Test real-time subscription
        const subscription = supabase
          .channel('test_connection')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'pg_properties',
          }, (payload) => {
            console.log('Real-time test received:', payload);
            setLastUpdate(new Date());
            toast({
              title: "Real-time Update",
              description: `Received update for ${payload.table}`,
            });
          })
          .subscribe((status) => {
            console.log('Subscription status:', status);
            if (status === 'SUBSCRIBED') {
              setConnectionStatus('connected');
            } else {
              setConnectionStatus('disconnected');
            }
          });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Connection test error:', error);
        setConnectionStatus('disconnected');
      }
    };

    testConnection();
  }, [toast]);

  // Update timestamp every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addTestData = async () => {
    try {
      // Add test notification
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          title: 'Test Notification',
          message: 'This is a test notification for real-time testing',
          type: 'test',
          pg_property_id: properties?.[0]?.id || null,
          is_read: false,
          requires_action: false,
        });

      if (notifError) {
        console.error('Error adding test notification:', notifError);
        toast({
          title: "Error",
          description: "Failed to add test notification",
          variant: "destructive",
        });
        return;
      }

      // Add test payment
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: '11111111-1111-1111-1111-111111111111', // Use existing user
          pg_property_id: properties?.[0]?.id || '550e8400-e29b-41d4-a716-446655440001',
          type: 'test',
          amount: Math.floor(Math.random() * 5000) + 1000,
          status: 'completed',
          description: 'Test payment for real-time testing',
          currency: 'INR',
          payment_method: 'test',
          transaction_id: `TXN-${Date.now()}`,
        });

      if (paymentError) {
        console.error('Error adding test payment:', paymentError);
        toast({
          title: "Error",
          description: "Failed to add test payment",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Test Data Added",
        description: "Test notification and payment added successfully",
      });
    } catch (error) {
      console.error('Error adding test data:', error);
      toast({
        title: "Error",
        description: "Failed to add test data",
        variant: "destructive",
      });
    }
  };

  const refreshData = () => {
    setLastUpdate(new Date());
    toast({
      title: "Data Refreshed",
      description: "All real-time data has been refreshed",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time Connection Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Connection Status:</span>
              <Badge 
                variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
                className="flex items-center gap-1"
              >
                {connectionStatus === 'connected' ? (
                  <Wifi className="h-3 w-3" />
                ) : (
                  <WifiOff className="h-3 w-3" />
                )}
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Last Update: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>

          {/* Test Actions */}
          <div className="flex gap-2">
            <Button onClick={addTestData} variant="outline" size="sm">
              Add Test Data
            </Button>
            <Button onClick={refreshData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">PG Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {propertiesLoading ? 'Loading...' : 'Active properties'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rooms?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {roomsLoading ? 'Loading...' : 'Total rooms'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {paymentsLoading ? 'Loading...' : 'Total payments'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {notificationsLoading ? 'Loading...' : 'Total notifications'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {notifications?.slice(0, 5).map((notif: any) => (
                <div key={notif.id} className="p-2 border rounded">
                  <div className="font-medium">{notif.title}</div>
                  <div className="text-sm text-muted-foreground">{notif.message}</div>
                </div>
              ))}
              {(!notifications || notifications.length === 0) && (
                <p className="text-muted-foreground">No notifications</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {payments?.slice(0, 5).map((payment: any) => (
                <div key={payment.id} className="p-2 border rounded">
                  <div className="font-medium">₹{payment.amount}</div>
                  <div className="text-sm text-muted-foreground">{payment.description}</div>
                  <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                    {payment.status}
                  </Badge>
                </div>
              ))}
              {(!payments || payments.length === 0) && (
                <p className="text-muted-foreground">No payments</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeTest; 