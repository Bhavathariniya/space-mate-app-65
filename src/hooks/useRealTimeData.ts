import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Real-time hook for PG Properties
export const useRealTimePGProperties = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['pg-properties-realtime'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pg_properties')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  useEffect(() => {
    // Set up real-time subscription
    const subscription = supabase
      .channel('pg_properties_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pg_properties',
        },
        (payload) => {
          console.log('PG Properties real-time update:', payload);
          
          // Invalidate and refetch the query
          queryClient.invalidateQueries({ queryKey: ['pg-properties-realtime'] });
          
          // Show toast for important changes (only if toast is available)
          try {
            if (payload.eventType === 'INSERT') {
              toast({
                title: "New PG Property Added",
                description: `Property "${payload.new.name}" has been added.`,
              });
            } else if (payload.eventType === 'UPDATE') {
              toast({
                title: "PG Property Updated",
                description: `Property "${payload.new.name}" has been updated.`,
              });
            }
          } catch (error) {
            console.log('Toast not available in this context');
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, toast]);

  return { properties, isLoading, error };
};

// Real-time hook for Rooms
export const useRealTimeRooms = (pgPropertyId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: rooms, isLoading, error } = useQuery({
    queryKey: ['rooms-realtime', pgPropertyId],
    queryFn: async () => {
      let query = supabase
        .from('rooms')
        .select('*');
      
      if (pgPropertyId) {
        query = query.eq('pg_property_id', pgPropertyId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!pgPropertyId || pgPropertyId === undefined,
    refetchInterval: 3000, // Refetch every 3 seconds
  });

  useEffect(() => {
    // Set up real-time subscription
    const subscription = supabase
      .channel('rooms_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
        },
        (payload) => {
          console.log('Rooms real-time update:', payload);
          
          // Invalidate and refetch the query
          queryClient.invalidateQueries({ queryKey: ['rooms-realtime'] });
          
          // Show toast for important changes
          try {
            if (payload.eventType === 'UPDATE' && payload.new.is_available !== payload.old.is_available) {
              const status = payload.new.is_available ? 'available' : 'occupied';
              toast({
                title: `Room ${payload.new.room_number} ${status}`,
                description: `Room status has been updated.`,
              });
            }
          } catch (error) {
            console.log('Toast not available in this context');
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, toast, pgPropertyId]);

  return { rooms, isLoading, error };
};

// Real-time hook for Payments
export const useRealTimePayments = (userId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: payments, isLoading, error } = useQuery({
    queryKey: ['payments-realtime', userId],
    queryFn: async () => {
      let query = supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId || userId === undefined,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  useEffect(() => {
    // Set up real-time subscription
    const subscription = supabase
      .channel('payments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments',
        },
        (payload) => {
          console.log('Payments real-time update:', payload);
          
          // Invalidate and refetch the query
          queryClient.invalidateQueries({ queryKey: ['payments-realtime'] });
          
          // Show toast for new payments
          try {
            if (payload.eventType === 'INSERT') {
              toast({
                title: "New Payment Received",
                description: `Payment of ₹${payload.new.amount} has been received.`,
              });
            } else if (payload.eventType === 'UPDATE' && payload.new.status === 'completed') {
              toast({
                title: "Payment Completed",
                description: `Payment of ₹${payload.new.amount} has been completed.`,
              });
            }
          } catch (error) {
            console.log('Toast not available in this context');
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, toast, userId]);

  return { payments, isLoading, error };
};

// Real-time hook for Notifications
export const useRealTimeNotifications = (userId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['notifications-realtime', userId],
    queryFn: async () => {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId || userId === undefined,
    refetchInterval: 2000, // Refetch every 2 seconds
  });

  useEffect(() => {
    // Set up real-time subscription
    const subscription = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          console.log('Notifications real-time update:', payload);
          
          // Invalidate and refetch the query
          queryClient.invalidateQueries({ queryKey: ['notifications-realtime'] });
          
          // Show toast for new notifications
          try {
            if (payload.new.user_id === userId || !userId) {
              toast({
                title: payload.new.title,
                description: payload.new.message,
              });
            }
          } catch (error) {
            console.log('Toast not available in this context');
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, toast, userId]);

  return { notifications, isLoading, error };
};

// Real-time hook for Maintenance Issues
export const useRealTimeMaintenance = (pgPropertyId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: maintenance, isLoading, error } = useQuery({
    queryKey: ['maintenance-realtime', pgPropertyId],
    queryFn: async () => {
      let query = supabase
        .from('maintenance_issues')
        .select('*')
        .order('reported_at', { ascending: false });
      
      if (pgPropertyId) {
        query = query.eq('pg_property_id', pgPropertyId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!pgPropertyId || pgPropertyId === undefined,
    refetchInterval: 4000, // Refetch every 4 seconds
  });

  useEffect(() => {
    // Set up real-time subscription
    const subscription = supabase
      .channel('maintenance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_issues',
        },
        (payload) => {
          console.log('Maintenance real-time update:', payload);
          
          // Invalidate and refetch the query
          queryClient.invalidateQueries({ queryKey: ['maintenance-realtime'] });
          
          // Show toast for new maintenance issues
          try {
            if (payload.eventType === 'INSERT') {
              toast({
                title: "New Maintenance Issue",
                description: `Issue: ${payload.new.title}`,
              });
            } else if (payload.eventType === 'UPDATE' && payload.new.status === 'completed') {
              toast({
                title: "Maintenance Completed",
                description: `Issue: ${payload.new.title} has been resolved.`,
              });
            }
          } catch (error) {
            console.log('Toast not available in this context');
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, toast, pgPropertyId]);

  return { maintenance, isLoading, error };
};

// Real-time hook for Meals
export const useRealTimeMeals = (pgPropertyId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: meals, isLoading, error } = useQuery({
    queryKey: ['meals-realtime', pgPropertyId],
    queryFn: async () => {
      let query = supabase
        .from('meals')
        .select('*')
        .order('date', { ascending: true });
      
      if (pgPropertyId) {
        query = query.eq('pg_property_id', pgPropertyId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!pgPropertyId || pgPropertyId === undefined,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  useEffect(() => {
    // Set up real-time subscription
    const subscription = supabase
      .channel('meals_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meals',
        },
        (payload) => {
          console.log('Meals real-time update:', payload);
          
          // Invalidate and refetch the query
          queryClient.invalidateQueries({ queryKey: ['meals-realtime'] });
          
          // Show toast for new meals
          try {
            if (payload.eventType === 'INSERT') {
              toast({
                title: "New Meal Added",
                description: `${payload.new.meal_type} menu has been updated.`,
              });
            }
          } catch (error) {
            console.log('Toast not available in this context');
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, toast, pgPropertyId]);

  return { meals, isLoading, error };
}; 