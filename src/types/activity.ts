
export interface ActivityItem {
  id: string;
  type: "login" | "payment" | "registration" | "subscription" | "property" | "payment_received" | "subscription_upgraded" | "refund_issued" | "subscription_downgraded";
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  amount?: number;
  severity: "low" | "medium" | "high";
  properties?: {
    propertyName?: string;
    location?: string;
    amount?: number;
  };
}
