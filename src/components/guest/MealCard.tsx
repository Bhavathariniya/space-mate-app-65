
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coffee, Utensils, Wine } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MealCardProps {
  meal: {
    id: string;
    date: string;
    mealType: "breakfast" | "lunch" | "dinner";
    menu: string;
    isActive: boolean;
  };
  attendance?: "yes" | "no" | null;
  onRespond: (mealId: string, response: "yes" | "no") => void;
}

const MealCard = ({ meal, attendance, onRespond }: MealCardProps) => {
  const mealIcons = {
    breakfast: <Coffee className="h-4 w-4" />,
    lunch: <Utensils className="h-4 w-4" />,
    dinner: <Wine className="h-4 w-4" />,
  };

  const mealTitle = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
  };

  const mealColors = {
    breakfast: "bg-amber-50 text-amber-800 border-amber-100",
    lunch: "bg-green-50 text-green-800 border-green-100",
    dinner: "bg-purple-50 text-purple-800 border-purple-100",
  };

  // Only allow responding if the meal is active
  const canRespond = meal.isActive;

  const formatMealTime = (mealType: string) => {
    switch (mealType) {
      case "breakfast":
        return "7:30 AM - 9:30 AM";
      case "lunch":
        return "12:30 PM - 2:30 PM";
      case "dinner":
        return "7:30 PM - 9:30 PM";
      default:
        return "";
    }
  };

  return (
    <Card className={cn("overflow-hidden border", meal.isActive ? "border-hostel-primary/20" : "border-gray-200")}>
      <div className={cn("p-3 flex items-center justify-between", 
        mealColors[meal.mealType])}>
        <div className="flex items-center">
          <span className="mr-2">{mealIcons[meal.mealType]}</span>
          <h3 className="font-medium">{mealTitle[meal.mealType]}</h3>
        </div>
        <div className="text-xs">
          {formatMealTime(meal.mealType)}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="text-sm text-gray-500">
            {format(new Date(meal.date), "EEEE, MMMM d")}
          </div>
          <Badge variant={meal.isActive ? "default" : "outline"}>
            {meal.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1">Menu</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">{meal.menu}</p>
        </div>
        
        {canRespond && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant={attendance === "yes" ? "default" : "outline"}
              size="sm"
              className={cn("flex-1", attendance === "yes" ? "bg-green-600" : "")}
              onClick={() => onRespond(meal.id, "yes")}
            >
              I'll attend
            </Button>
            <Button
              variant={attendance === "no" ? "default" : "outline"}
              size="sm"
              className={cn("flex-1", attendance === "no" ? "bg-red-600" : "")}
              onClick={() => onRespond(meal.id, "no")}
            >
              Skip this meal
            </Button>
          </div>
        )}
        
        {!canRespond && (
          <div className="text-center text-sm text-gray-500 py-1">
            {meal.isActive ? "Response period ended" : "Meal inactive"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealCard;
