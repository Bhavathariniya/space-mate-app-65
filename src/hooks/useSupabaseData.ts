import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

// Auth hook
export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, session, loading };
};

// PG Properties hook
export const usePGProperties = () => {
  return useQuery({
    queryKey: ['pg-properties'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('pg_properties')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Notifications hook
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
  });
};

// All data hook - fetches data from multiple tables
export const useAllData = () => {
  return useQuery({
    queryKey: ['all-data'],
    queryFn: async () => {
      try {
        const [
          assetsResult,
          paymentsResult,
          maintenanceResult,
          mealsResult,
          roomAssignmentsResult,
          roomsResult
        ] = await Promise.all([
          (supabase as any).from('assets').select('*'),
          (supabase as any).from('payments').select('*'),
          (supabase as any).from('maintenance_issues').select('*'),
          (supabase as any).from('meals').select('*'),
          (supabase as any).from('room_assignments').select('*'),
          (supabase as any).from('rooms').select('*')
        ]);

        return {
          assets: assetsResult.data || [],
          payments: paymentsResult.data || [],
          maintenance: maintenanceResult.data || [],
          meals: mealsResult.data || [],
          roomAssignments: roomAssignmentsResult.data || [],
          rooms: roomsResult.data || []
        };
      } catch (error) {
        console.error('Error fetching all data:', error);
        return {
          assets: [],
          payments: [],
          maintenance: [],
          meals: [],
          roomAssignments: [],
          rooms: []
        };
      }
    },
  });
};