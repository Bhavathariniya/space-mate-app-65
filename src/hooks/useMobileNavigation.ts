
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useMobileNavigation = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
    setIsDrawerOpen(false);
  }, [navigate]);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen(prev => !prev);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  return {
    isDrawerOpen,
    handleNavigation,
    toggleDrawer,
    closeDrawer
  };
};
