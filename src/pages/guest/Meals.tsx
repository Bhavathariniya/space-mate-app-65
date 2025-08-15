
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { meals, mealResponses } from "@/data/mockData";
import { format, isToday, isPast, parseISO, addDays, startOfWeek } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import MealCard from "@/components/guest/MealCard";
import { useAuth } from "@/contexts/AuthContext";
import { Utensils, Coffee, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const GuestMeals = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  // Get the current mock meal responses
  const [userMealResponses, setUserMealResponses] = useState(mealResponses);
  
  // Filter meals for the selected date
  const formattedSelectedDate = format(selectedDate, "yyyy-MM-dd");
  const todaysMeals = meals.filter(meal => meal.date === formattedSelectedDate);
  
  // Group meals by date for the week view
  const weekStartDate = startOfWeek(new Date());
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));
  
  // Handle meal attendance response
  const handleMealResponse = (mealId: string, response: "yes" | "no") => {
    const existingResponse = userMealResponses.find(
      r => r.userId === currentUser?.id && r.mealId === mealId
    );
    
    if (existingResponse) {
      // Update existing response
      setUserMealResponses(prev => 
        prev.map(r => 
          r.userId === currentUser?.id && r.mealId === mealId
            ? { ...r, response, attending: response === "yes" }
            : r
        )
      );
    } else {
      // Add new response
      setUserMealResponses(prev => [
        ...prev,
        {
          id: `response-${Date.now()}`,
          userId: currentUser?.id || "",
          mealId,
          response,
          attending: response === "yes"
        }
      ]);
    }
    
    toast({
      title: "Response Recorded",
      description: `You've ${response === "yes" ? "confirmed attendance" : "skipped"} for this meal.`,
    });
  };
  
  // Check if a user has responded to a meal
  const getUserResponse = (mealId: string): "yes" | "no" | null => {
    const response = userMealResponses.find(
      r => r.userId === currentUser?.id && r.mealId === mealId
    );
    
    return response ? response.response as "yes" | "no" : null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meal Schedule</h1>
        <div className="bg-hostel-accent text-hostel-primary px-3 py-1 rounded-full text-sm font-medium flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>Today's Menu</span>
        </div>
      </div>
      
      <Tabs defaultValue="day" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="day">Day View</TabsTrigger>
          <TabsTrigger value="week">Week View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="day">
          <div className="mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-hostel-primary" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-1 px-2 pb-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="mx-auto"
                  initialFocus
                />
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-lg font-semibold mb-4">
            Meals for {format(selectedDate, "EEEE, MMMM d")}
            {isToday(selectedDate) && <span className="ml-2 bg-hostel-accent text-hostel-primary px-2 py-0.5 text-xs rounded-full">Today</span>}
          </h2>
          
          {todaysMeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todaysMeals.map(meal => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  attendance={getUserResponse(meal.id)}
                  onRespond={handleMealResponse}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Utensils className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">No meals scheduled for this date</p>
                <Button 
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSelectedDate(new Date())}
                >
                  View Today's Meals
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="week" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-hostel-primary" />
                  Weekly Menu
                </span>
                <div className="flex space-x-2">
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => {
                    setSelectedDate(addDays(weekStartDate, -7));
                  }}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => {
                    setSelectedDate(addDays(weekStartDate, 7));
                  }}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDates.map((date, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "text-center rounded-md p-2 cursor-pointer border hover:border-hostel-primary text-sm",
                      isToday(date) ? "bg-hostel-accent border-hostel-primary" : "border-transparent"
                    )}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="font-medium">{format(date, "EEE")}</div>
                    <div className={cn(
                      "w-7 h-7 rounded-full mx-auto flex items-center justify-center",
                      isToday(date) ? "bg-hostel-primary text-white" : ""
                    )}>
                      {format(date, "d")}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Coffee className="h-4 w-4 mr-2 text-amber-600" />
                    <h3 className="font-medium">Breakfast</h3>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDates.map((date, idx) => {
                      const dateStr = format(date, "yyyy-MM-dd");
                      const meal = meals.find(m => m.date === dateStr && m.mealType === "breakfast");
                      
                      return (
                        <div key={`breakfast-${idx}`} className={cn(
                          "border rounded-md p-2 text-sm h-24 overflow-hidden",
                          isPast(date) && !isToday(date) ? "bg-gray-50" : "",
                          isToday(date) ? "border-hostel-primary" : ""
                        )}>
                          {meal ? (
                            <>
                              <div className="text-xs font-medium mb-1 truncate">
                                {meal.menu.split(',')[0]}...
                              </div>
                              <div className="text-xs text-gray-500">
                                {meal.isActive ? "Active" : "Inactive"}
                              </div>
                              {meal.isActive && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 h-auto text-hostel-primary text-xs"
                                  onClick={() => setSelectedDate(date)}
                                >
                                  Respond
                                </Button>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center justify-center h-full text-xs text-gray-400">
                              No meal
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Utensils className="h-4 w-4 mr-2 text-green-600" />
                    <h3 className="font-medium">Lunch</h3>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDates.map((date, idx) => {
                      const dateStr = format(date, "yyyy-MM-dd");
                      const meal = meals.find(m => m.date === dateStr && m.mealType === "lunch");
                      
                      return (
                        <div key={`lunch-${idx}`} className={cn(
                          "border rounded-md p-2 text-sm h-24 overflow-hidden",
                          isPast(date) && !isToday(date) ? "bg-gray-50" : "",
                          isToday(date) ? "border-hostel-primary" : ""
                        )}>
                          {meal ? (
                            <>
                              <div className="text-xs font-medium mb-1 truncate">
                                {meal.menu.split(',')[0]}...
                              </div>
                              <div className="text-xs text-gray-500">
                                {meal.isActive ? "Active" : "Inactive"}
                              </div>
                              {meal.isActive && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 h-auto text-hostel-primary text-xs"
                                  onClick={() => setSelectedDate(date)}
                                >
                                  Respond
                                </Button>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center justify-center h-full text-xs text-gray-400">
                              No meal
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Utensils className="h-4 w-4 mr-2 text-purple-600" />
                    <h3 className="font-medium">Dinner</h3>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDates.map((date, idx) => {
                      const dateStr = format(date, "yyyy-MM-dd");
                      const meal = meals.find(m => m.date === dateStr && m.mealType === "dinner");
                      
                      return (
                        <div key={`dinner-${idx}`} className={cn(
                          "border rounded-md p-2 text-sm h-24 overflow-hidden",
                          isPast(date) && !isToday(date) ? "bg-gray-50" : "",
                          isToday(date) ? "border-hostel-primary" : ""
                        )}>
                          {meal ? (
                            <>
                              <div className="text-xs font-medium mb-1 truncate">
                                {meal.menu.split(',')[0]}...
                              </div>
                              <div className="text-xs text-gray-500">
                                {meal.isActive ? "Active" : "Inactive"}
                              </div>
                              {meal.isActive && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 h-auto text-hostel-primary text-xs"
                                  onClick={() => setSelectedDate(date)}
                                >
                                  Respond
                                </Button>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center justify-center h-full text-xs text-gray-400">
                              No meal
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Utensils className="h-5 w-5 mr-2 text-hostel-primary" />
                Meal Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 mb-4">
                Set your regular meal preferences to help us plan better. These preferences will be applied to all meals unless you specifically change your response for individual meals.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-amber-50 border-amber-100">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Coffee className="h-4 w-4 mr-2 text-amber-600" />
                        <h3 className="font-medium">Breakfast</h3>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs bg-white"
                      >
                        Usually Attend
                      </Button>
                    </div>
                    <p className="text-xs text-amber-800">7:30 AM - 9:30 AM</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 border-green-100">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Utensils className="h-4 w-4 mr-2 text-green-600" />
                        <h3 className="font-medium">Lunch</h3>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs bg-white"
                      >
                        Sometimes Skip
                      </Button>
                    </div>
                    <p className="text-xs text-green-800">12:30 PM - 2:30 PM</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 border-purple-100">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Utensils className="h-4 w-4 mr-2 text-purple-600" />
                        <h3 className="font-medium">Dinner</h3>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs bg-white"
                      >
                        Always Attend
                      </Button>
                    </div>
                    <p className="text-xs text-purple-800">7:30 PM - 9:30 PM</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  size="sm" 
                  className="bg-hostel-primary hover:bg-hostel-secondary"
                  onClick={() => {
                    toast({
                      title: "Preferences Saved",
                      description: "Your meal preferences have been updated successfully."
                    });
                  }}
                >
                  Update Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuestMeals;
