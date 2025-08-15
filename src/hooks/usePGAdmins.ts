import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export interface PGAdmin {
  id: string;
  name: string;
  email: string;
  commonId: string;
  totalPGs: number;
  activePGs: number;
  subscriptionStatus: "free" | "active" | "expired" | "pending" | "trial";
  subscriptionTier: "monthly" | "six_month" | "yearly" | null;
  subscriptionStart: string | null;
  subscriptionEnd: string | null;
  subscriptionEndDate?: string | null; // Added for compatibility
  monthlyRevenue: number;
  freeTrialEnd: string | null;
  lastActive: string;
  phoneNumber?: string; // Added for compatibility
  joinDate?: string; // Added for compatibility
  location?: string; // Added for compatibility
}

export interface AdminStats {
  totalPGs: number;
  activePGs: number;
  monthlyRevenue: number;
  totalRevenue: number;
  activeSubscriptions: number;
  customerSatisfaction: number;
  conversionRate: number;
  growthRate: number;
  pendingRequests: number;
  expiredSubscriptions?: number; // Added for compatibility
  cancellations?: number; // Added for compatibility
}

// Mock API functions - in production these would be real API calls
const fetchPGAdmins = async (): Promise<PGAdmin[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data - replace with actual API call
  return [
    {
      id: "1",
      name: "Rajesh Kumar",
      email: "rajesh@pgowner.com",
      commonId: "PG001",
      totalPGs: 3,
      activePGs: 3,
      subscriptionStatus: "active",
      subscriptionTier: "yearly",
      subscriptionStart: "2024-01-01",
      subscriptionEnd: "2024-12-31",
      monthlyRevenue: 3000,
      freeTrialEnd: "2023-12-31",
      lastActive: "2024-06-06"
    },
    {
      id: "2",
      name: "Priya Sharma",
      email: "priya@hostels.com",
      commonId: "PG002",
      totalPGs: 1,
      activePGs: 1,
      subscriptionStatus: "free",
      subscriptionTier: null,
      subscriptionStart: null,
      subscriptionEnd: null,
      monthlyRevenue: 0,
      freeTrialEnd: "2024-08-01",
      lastActive: "2024-06-05"
    },
    {
      id: "3",
      name: "Amit Patel",
      email: "amit@pgmanagement.com",
      commonId: "PG003",
      totalPGs: 5,
      activePGs: 4,
      subscriptionStatus: "expired",
      subscriptionTier: "monthly",
      subscriptionStart: "2024-03-01",
      subscriptionEnd: "2024-05-31",
      monthlyRevenue: 5000,
      freeTrialEnd: "2024-02-29",
      lastActive: "2024-06-01"
    }
  ];
};

const updateAdminSubscription = async (adminId: string, newTier: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Updated admin ${adminId} to ${newTier} subscription`);
};

const extendAdminTrial = async (adminId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Extended trial for admin ${adminId}`);
};

export const usePGAdmins = () => {
  return useQuery({
    queryKey: ['pgAdmins'],
    queryFn: fetchPGAdmins,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ adminId, newTier }: { adminId: string; newTier: string }) =>
      updateAdminSubscription(adminId, newTier),
    onSuccess: (_, { newTier }) => {
      queryClient.invalidateQueries({ queryKey: ['pgAdmins'] });
      toast({
        title: "Subscription Updated",
        description: `Subscription tier updated to ${newTier}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
      console.error('Subscription update error:', error);
    },
  });
};

export const useExtendTrial = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: extendAdminTrial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pgAdmins'] });
      toast({
        title: "Trial Extended",
        description: "Free trial period extended by 30 days",
      });
    },
    onError: (error) => {
      toast({
        title: "Extension Failed",
        description: "Failed to extend trial. Please try again.",
        variant: "destructive",
      });
      console.error('Trial extension error:', error);
    },
  });
};

export const useAdminStats = (admins: PGAdmin[]): AdminStats => {
  const totalPGs = admins.reduce((sum, admin) => sum + admin.totalPGs, 0);
  const activePGs = admins.reduce((sum, admin) => sum + admin.activePGs, 0);
  const monthlyRevenue = admins.reduce((sum, admin) => sum + admin.monthlyRevenue, 0);
  const totalRevenue = monthlyRevenue * 6; // Calculate total revenue for 6 months
  const activeSubscriptions = admins.filter(admin => admin.subscriptionStatus === "active").length;

  // TODO: Replace with real pending requests logic
  const pendingRequests = 5;

  return {
    totalPGs,
    activePGs,
    monthlyRevenue,
    totalRevenue,
    activeSubscriptions,
    customerSatisfaction: 89, // Mock data
    conversionRate: 67, // Mock data
    growthRate: 12, // Mock data
    pendingRequests,
  };
};
