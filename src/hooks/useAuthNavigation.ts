import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export const useAuthNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, profile } = useSupabaseAuth();

  useEffect(() => {
    // Only redirect if we're on the login page and user is authenticated
    if (isAuthenticated && profile && location.pathname === '/login') {
      // Route based on user role
      if (profile.role === 'super_admin') {
        navigate("/super-admin", { replace: true });
      } else if (profile.role === 'pg_admin') {
        navigate("/pg-admin", { replace: true });
      } else if (profile.role === 'warden') {
        navigate("/warden", { replace: true });
      } else if (profile.role === 'guest') {
        navigate("/guest", { replace: true });
      } else {
        navigate("/public", { replace: true });
      }
    }
  }, [isAuthenticated, profile, location.pathname, navigate]);
};