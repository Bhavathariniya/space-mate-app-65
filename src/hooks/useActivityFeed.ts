
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ActivityItem } from "@/types/activity";

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "payment",
    title: "Payment Received",
    description: "Rajesh Kumar paid ₹1,000 for monthly subscription",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    user: "Rajesh Kumar",
    amount: 1000,
    severity: "high",
  },
  {
    id: "2",
    type: "registration",
    title: "New Admin Registration",
    description: "New PG admin registered with 2 properties",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    user: "Sneha Patel",
    severity: "medium",
  },
  {
    id: "3",
    type: "login",
    title: "Admin Login",
    description: "Priya Sharma logged into the system",
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    user: "Priya Sharma",
    severity: "low",
  },
  {
    id: "4",
    type: "subscription",
    title: "Subscription Upgraded",
    description: "Amit Patel upgraded from Monthly to Yearly plan",
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    user: "Amit Patel",
    amount: 10000,
    severity: "high",
  },
  {
    id: "5",
    type: "property",
    title: "New Property Added",
    description: "Sunset Villa PG added with 30 rooms",
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    user: "Ravi Kumar",
    severity: "medium",
  },
];

export const useActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [isLive, setIsLive] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate initial load
    setActivities(mockActivities);

    // Simulate real-time updates
    let interval: NodeJS.Timeout;
    
    if (isLive) {
      interval = setInterval(() => {
        const types = ["login", "payment", "registration", "subscription", "property"];
        const severities = ["low", "medium", "high"];
        const users = ["Rajesh Kumar", "Priya Sharma", "Amit Patel", "Sneha Patel", "Ravi Kumar"];
        
        const newActivity: ActivityItem = {
          id: Date.now().toString(),
          type: types[Math.floor(Math.random() * types.length)] as any,
          title: "Live Activity Update",
          description: `Real-time activity from ${users[Math.floor(Math.random() * users.length)]}`,
          timestamp: new Date().toISOString(),
          user: users[Math.floor(Math.random() * users.length)],
          severity: severities[Math.floor(Math.random() * severities.length)] as any,
          amount: Math.random() > 0.5 ? Math.floor(Math.random() * 10000) + 500 : undefined,
        };

        setActivities(prev => [newActivity, ...prev.slice(0, 19)]); // Keep max 20 items
        
        // Show toast for high priority activities
        if (newActivity.severity === "high") {
          toast({
            title: "High Priority Activity",
            description: newActivity.description,
          });
        }
      }, 15000); // Update every 15 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive, toast]);

  const refreshActivities = () => {
    setIsLoading(true);
    setTimeout(() => {
      setActivities([...mockActivities]);
      setIsLoading(false);
      toast({
        title: "Activities Refreshed",
        description: "Latest activity data loaded",
      });
    }, 1000);
  };

  const toggleLiveUpdates = () => {
    setIsLive(!isLive);
    toast({
      title: isLive ? "Live Updates Paused" : "Live Updates Resumed",
      description: isLive ? "Activity feed will no longer update automatically" : "Activity feed will update in real-time",
    });
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === "all") return true;
    return activity.type === filter;
  });

  return {
    activities: filteredActivities,
    isLoading,
    filter,
    setFilter,
    isLive,
    refreshActivities,
    toggleLiveUpdates,
  };
};
