import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Meal } from "@/types";
import { format } from "date-fns";
import { Calendar, Check, Clock, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MealFormProps {
  initialData?: Partial<Meal>;
  onSubmit: (data: Partial<Meal>) => void;
  onCancel: () => void;
}

const MealForm = ({ initialData, onSubmit, onCancel }: MealFormProps) => {
  const [mealData, setMealData] = useState<Partial<Meal>>(
    initialData || {
      date: format(new Date(), "yyyy-MM-dd"),
      mealType: "breakfast",
      menu: "",
      isActive: true
    }
  );

  const [date, setDate] = useState<Date>(
    mealData.date ? new Date(mealData.date) : new Date()
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMealData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setMealData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setMealData(prev => ({ ...prev, isActive: checked }));
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setMealData(prev => ({ 
        ...prev, 
        date: format(selectedDate, "yyyy-MM-dd") 
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(mealData);
  };

  // Define meal type styles
  const getMealTypeStyles = (type: string) => {
    switch (type) {
      case "breakfast":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "lunch":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "dinner":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "";
    }
  };

  // Sample meal suggestions based on meal type
  const mealSuggestions: Record<string, string[]> = {
    breakfast: [
      "Idli, Sambar, Coconut Chutney, Coffee/Tea",
      "Bread, Eggs, Fruit, Coffee/Tea",
      "Poha, Chai, Fruits",
      "Upma, Coconut Chutney, Coffee/Tea",
      "Aloo Paratha, Curd, Butter, Tea"
    ],
    lunch: [
      "Rice, Dal, Paneer Curry, Chapati, Raita, Salad",
      "Rice, Sambar, Rasam, Poriyal, Curd",
      "Pulao, Rajma, Raita, Papad, Salad",
      "Chapati, Vegetable Curry, Rice, Dal, Pickle"
    ],
    dinner: [
      "Rice, Mixed Vegetables, Chapati, Dal, Pickle",
      "Chapati, Paneer Butter Masala, Rice, Dal",
      "Pulao, Dal Tadka, Raita, Papad",
      "Chapati, Vegetable Curry, Curd Rice"
    ]
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm">Date</Label>
          <div className="flex">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !mealData.date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {mealData.date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mealType" className="text-sm">Meal Type</Label>
          <div className="grid grid-cols-3 gap-2">
            {["breakfast", "lunch", "dinner"].map(type => (
              <Button
                key={type}
                type="button"
                variant="outline"
                className={cn(
                  "h-9 flex justify-center items-center capitalize",
                  mealData.mealType === type ? getMealTypeStyles(type) : ""
                )}
                onClick={() => handleSelectChange("mealType", type)}
              >
                {mealData.mealType === type && <Check className="mr-1 h-3.5 w-3.5" />}
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="menu" className="text-sm">Menu Details</Label>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Served at meal time</span>
          </div>
        </div>
        <Textarea
          id="menu"
          name="menu"
          className="min-h-[120px] resize-none"
          value={mealData.menu}
          onChange={handleTextChange}
          placeholder="Enter detailed menu items..."
        />
        {mealData.mealType && mealSuggestions[mealData.mealType] && (
          <div className="pt-1.5">
            <p className="text-xs text-muted-foreground mb-1.5">Quick suggestions:</p>
            <div className="flex flex-wrap gap-1.5">
              {mealSuggestions[mealData.mealType].map((suggestion, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-secondary truncate max-w-[200px]"
                  onClick={() => setMealData(prev => ({ ...prev, menu: suggestion }))}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between bg-muted/30 p-2.5 rounded-md">
        <div>
          <Label 
            htmlFor="isActive" 
            className="text-sm font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <span>Active</span>
            {mealData.isActive ? (
              <Badge variant="default" className="bg-green-500 text-xs">Visible to residents</Badge>
            ) : (
              <Badge variant="outline" className="text-xs">Hidden from residents</Badge>
            )}
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Toggle this off to temporarily hide this meal from the menu
          </p>
        </div>
        <Switch
          id="isActive"
          checked={mealData.isActive}
          onCheckedChange={handleSwitchChange}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-hostel-primary hover:bg-hostel-secondary">
          {initialData?.id ? "Update Meal" : "Add Meal"}
        </Button>
      </div>
    </form>
  );
};

export default MealForm;
