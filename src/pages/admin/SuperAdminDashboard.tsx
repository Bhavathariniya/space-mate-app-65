import React from 'react';
import SuperAdminOverview from '@/components/admin/SuperAdminOverview';

const SuperAdminDashboard: React.FC = () => {
  // Mock stats for now
  const mockStats = {
    totalPGs: 0,
    activePGs: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    customerSatisfaction: 0,
    conversionRate: 0,
    growthRate: 0,
    pendingRequests: 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <SuperAdminOverview stats={mockStats} onTabChange={() => {}} />
    </div>
  );
};

export default SuperAdminDashboard;