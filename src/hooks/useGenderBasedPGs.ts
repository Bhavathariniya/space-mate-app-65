import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GenderBasedPG {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  monthly_rent: number;
  security_deposit: number;
  total_rooms: number;
  occupied_rooms: number;
  rating: number;
  gender: string;
  pg_type: string;
}

export const useGenderBasedPGs = (userGender: string | null, pgPreference: string | null) => {
  const [pgProperties, setPgProperties] = useState<GenderBasedPG[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenderBasedPGs = async () => {
      if (!userGender || !pgPreference) {
        setPgProperties([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('pg_properties')
          .select('*')
          .eq('is_active', true);

        // Filter based on gender and preference
        if (pgPreference === 'co-living') {
          // For co-living, show all unisex PGs
          query = query.eq('gender', 'unisex');
        } else if (pgPreference === 'men-only') {
          // For men-only, show male PGs and co-living
          query = query.in('gender', ['male', 'unisex']);
        } else if (pgPreference === 'women-only') {
          // For women-only, show female PGs and co-living
          query = query.in('gender', ['female', 'unisex']);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        setPgProperties(data || []);
      } catch (err) {
        console.error('Error fetching gender-based PGs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch PG properties');
        setPgProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGenderBasedPGs();
  }, [userGender, pgPreference]);

  return {
    pgProperties,
    loading,
    error,
    refetch: () => {
      if (userGender && pgPreference) {
        const fetchGenderBasedPGs = async () => {
          try {
            setLoading(true);
            setError(null);

            let query = supabase
              .from('pg_properties')
              .select('*')
              .eq('is_active', true);

            if (pgPreference === 'co-living') {
              query = query.eq('gender', 'unisex');
            } else if (pgPreference === 'men-only') {
              query = query.in('gender', ['male', 'unisex']);
            } else if (pgPreference === 'women-only') {
              query = query.in('gender', ['female', 'unisex']);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) {
              throw fetchError;
            }

            setPgProperties(data || []);
          } catch (err) {
            console.error('Error refetching gender-based PGs:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch PG properties');
          } finally {
            setLoading(false);
          }
        };

        fetchGenderBasedPGs();
      }
    }
  };
};

