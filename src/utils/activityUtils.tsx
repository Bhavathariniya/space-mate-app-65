import React from "react";
import {
  Activity,
  Users,
  DollarSign,
  Building2,
  UserPlus,
  CreditCard,
} from "lucide-react";

export const getActivityIcon = (type: string) => {
  switch (type) {
    case "payment":
      return DollarSign;
    case "registration":
      return UserPlus;
    case "login":
      return Users;
    case "subscription":
      return CreditCard;
    case "property":
      return Building2;
    default:
      return Activity;
  }
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-700 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return date.toLocaleDateString();
};
