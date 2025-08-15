
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RoomService {
  id: string;
  name: string;
  description: string;
  price: number | null;
  status: "available" | "unavailable" | "processing" | "completed";
  eta?: string;
  icon: React.ReactNode;
}

interface RoomServiceCardProps {
  service: RoomService;
  onRequest: (serviceId: string) => void;
}

const RoomServiceCard = ({ service, onRequest }: RoomServiceCardProps) => {
  const statusStyles = {
    available: {
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-700",
      badge: "bg-green-100 text-green-800",
    },
    unavailable: {
      bg: "bg-gray-50",
      border: "border-gray-100",
      text: "text-gray-500",
      badge: "bg-gray-100 text-gray-600",
    },
    processing: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      text: "text-amber-700",
      badge: "bg-amber-100 text-amber-800",
    },
    completed: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-700",
      badge: "bg-blue-100 text-blue-800",
    },
  };

  const style = statusStyles[service.status];

  return (
    <div className={cn("rounded-xl border p-4", style.border, style.bg)}>
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className={cn("mr-3 p-2 rounded-full", style.badge)}>
            {service.icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{service.name}</h3>
            <p className="text-sm text-gray-600">{service.description}</p>
          </div>
        </div>
        <Badge variant="outline" className={style.badge}>
          {service.status === "available" && "Available"}
          {service.status === "unavailable" && "Unavailable"}
          {service.status === "processing" && "Processing"}
          {service.status === "completed" && "Completed"}
        </Badge>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <div className={cn("text-sm", style.text)}>
          {service.status === "available" && "Ready to request"}
          {service.status === "unavailable" && "Currently unavailable"}
          {service.status === "processing" && (
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              ETA: {service.eta}
            </span>
          )}
          {service.status === "completed" && (
            <span className="flex items-center">
              <Check className="w-3 h-3 mr-1" />
              Service completed
            </span>
          )}
        </div>
        <div>
          {service.price !== null && (
            <span className="text-sm font-medium mr-2">₹{service.price}</span>
          )}
          <Button
            size="sm"
            variant={service.status === "available" ? "default" : "outline"}
            className={cn(
              service.status === "available"
                ? "bg-hostel-primary hover:bg-hostel-secondary"
                : ""
            )}
            disabled={service.status !== "available"}
            onClick={() => onRequest(service.id)}
          >
            {service.status === "available" && "Request"}
            {service.status === "unavailable" && "Unavailable"}
            {service.status === "processing" && "View Status"}
            {service.status === "completed" && "Details"}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomServiceCard;
