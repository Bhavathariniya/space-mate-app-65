import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays, startOfWeek, addWeeks } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  Filter, 
  Plus, 
  Search, 
  Star, 
  Trash,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import MealForm from "@/components/admin/MealForm";
import { Meal } from "@/types";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Sample data - would be replaced with real API data
const mockMeals: Meal[] = [
  {
    id: "1",
    date: "2024-04-15",
    mealType: "breakfast",
    menu: "Idli, Sambar, Coconut Chutney, Coffee/Tea",
    isActive: true,
  },
  {
    id: "2",
    date: "2024-04-15",
    mealType: "lunch",
    menu: "Rice, Dal, Paneer Curry, Chapati, Raita, Salad",
    isActive: true,
  },
  {
    id: "3",
    date: "2024-04-15",
    mealType: "dinner",
    menu: "Rice, Mixed Vegetables, Chapati, Dal, Pickle",
    isActive: true,
  },
  {
    id: "4",
    date: "2024-04-16",
    mealType: "breakfast",
    menu: "Bread, Omelette, Coffee/Tea",
    isActive: true,
  }
];

// Sample feedback data
const mockFeedback = [
  {
    date: "2024-04-15",
    mealType: "breakfast",
    rating: 4.2,
    totalResponses: 35,
    breakdown: [
      { rating: 5, count: 15 },
      { rating: 4, count: 12 },
      { rating: 3, count: 5 },
      { rating: 2, count: 2 },
      { rating: 1, count: 1 }
    ],
    comments: [
      { id: "c1", text: "Idli was very good today!", user: "John D.", reviewed: false },
      { id: "c2", text: "Sambar could be better, needs more salt", user: "Sara W.", reviewed: true },
      { id: "c3", text: "Coffee was excellent", user: "Mike P.", reviewed: false }
    ]
  },
  {
    date: "2024-04-15",
    mealType: "lunch",
    rating: 3.8,
    totalResponses: 28,
    breakdown: [
      { rating: 5, count: 8 },
      { rating: 4, count: 10 },
      { rating: 3, count: 8 },
      { rating: 2, count: 2 },
      { rating: 1, count: 0 }
    ],
    comments: [
      { id: "c4", text: "Paneer curry was delicious", user: "Amy R.", reviewed: false },
      { id: "c5", text: "Chapatis were undercooked", user: "David S.", reviewed: false }
    ]
  }
];

// Notification settings
const mockNotificationSettings = {
  breakfast: "09:00",
  lunch: "14:30",
  dinner: "21:00",
  isActive: true,
  remindAfter: 30 // minutes
};

const FoodManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("menu");
  const [meals, setMeals] = useState<Meal[]>(mockMeals);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddMealDialog, setShowAddMealDialog] = useState(false);
  const [showEditMealDialog, setShowEditMealDialog] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [notificationSettings, setNotificationSettings] = useState(mockNotificationSettings);
  const [feedback] = useState(mockFeedback);
  const [selectedFeedbackDate, setSelectedFeedbackDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
  // Filter meals based on search query
  const filteredMeals = meals.filter(meal => 
    meal.menu.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meal.date.includes(searchQuery)
  );
  
  // Group meals by date
  const mealsByDate = filteredMeals.reduce((acc, meal) => {
    if (!acc[meal.date]) {
      acc[meal.date] = [];
    }
    acc[meal.date].push(meal);
    return acc;
  }, {} as Record<string, Meal[]>);
  
  // Calculate week days for the weekly meal plan view
  const weekDays = Array(7).fill(0).map((_, i) => addDays(currentWeek, i));

  const handleBack = () => {
    navigate("/pg-admin");
  };

  const handleAddMeal = () => {
    setCurrentMeal(null);
    setShowAddMealDialog(true);
  };

  const handleEditMeal = (meal: Meal) => {
    setCurrentMeal(meal);
    setShowEditMealDialog(true);
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals(meals.filter(meal => meal.id !== mealId));
    toast({
      title: "Meal deleted",
      description: "The meal has been deleted from the menu",
    });
  };

  const handleMealSubmit = (mealData: Partial<Meal>) => {
    if (currentMeal) {
      // Update existing meal
      setMeals(meals.map(meal => meal.id === currentMeal.id ? { ...meal, ...mealData } as Meal : meal));
      toast({
        title: "Meal updated",
        description: "The meal has been updated in the menu",
      });
      setShowEditMealDialog(false);
    } else {
      // Add new meal
      const newMeal: Meal = {
        id: `${Date.now()}`,
        date: mealData.date || format(new Date(), "yyyy-MM-dd"),
        mealType: mealData.mealType || "breakfast",
        menu: mealData.menu || "",
        isActive: mealData.isActive !== undefined ? mealData.isActive : true,
      };
      setMeals([...meals, newMeal]);
      toast({
        title: "Meal added",
        description: "The meal has been added to the menu",
      });
      setShowAddMealDialog(false);
    }
  };

  const handleNotificationChange = (field: string, value: string | boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: value
    });
    toast({
      title: "Settings updated",
      description: "Notification settings have been updated",
    });
  };

  const handleMarkReviewed = (commentId: string) => {
    // Would update the comment status in the real app
    toast({
      title: "Comment reviewed",
      description: "The feedback comment has been marked as reviewed",
    });
  };
  
  // Navigation for week
  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const prevWeek = () => setCurrentWeek(addWeeks(currentWeek, -1));

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon"
            className="mr-4"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Food Management</h1>
            <p className="text-sm text-muted-foreground">Plan meals and manage resident feedback</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex" onClick={handleAddMeal}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button onClick={handleAddMeal} className="bg-hostel-primary hover:bg-hostel-secondary">
            <Plus className="h-4 w-4 mr-2" />
            Add Meal
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="menu" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b">
          <div className="container flex overflow-auto">
            <TabsList className="h-11 bg-transparent gap-4 px-0 justify-start">
              <TabsTrigger 
                value="menu"
                className="data-[state=active]:border-b-2 data-[state=active]:border-hostel-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-4 py-2 h-11"
              >
                Meal Planning
              </TabsTrigger>
              <TabsTrigger 
                value="feedback"
                className="data-[state=active]:border-b-2 data-[state=active]:border-hostel-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-4 py-2 h-11"
              >
                Feedback Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="data-[state=active]:border-b-2 data-[state=active]:border-hostel-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-4 py-2 h-11"
              >
                Notification Settings
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        {/* Meal Planning Tab */}
        <TabsContent value="menu" className="space-y-8 pt-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Weekly Meal Plan</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Schedule and modify meals for the week</p>
                </div>
                <div className="flex items-center bg-muted/50 rounded-md p-1 shadow-sm border">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevWeek}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="mx-2 text-sm font-medium">
                    {format(currentWeek, "d MMM")} - {format(addDays(currentWeek, 6), "d MMM")}
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                {weekDays.map((day) => {
                  const dateString = format(day, "yyyy-MM-dd");
                  const isToday = format(new Date(), "yyyy-MM-dd") === dateString;
                  const meals = mealsByDate[dateString] || [];
                  
                  return (
                    <div 
                      key={day.toString()} 
                      className={`border rounded-lg ${isToday ? 'border-hostel-primary/50 shadow-sm bg-hostel-primary/5' : ''}`}
                    >
                      <div className={`p-3 text-center border-b ${isToday ? 'bg-hostel-primary/10' : 'bg-muted/30'}`}>
                        <div className={`font-medium ${isToday ? 'text-hostel-primary' : ''}`}>
                          {format(day, "EEE")}
                        </div>
                        <div className={`text-sm ${isToday ? 'font-medium' : 'text-muted-foreground'}`}>
                          {format(day, "d MMM")}
                        </div>
                      </div>
                      <div className="p-2 space-y-2 min-h-[150px]">
                        {meals.length === 0 && (
                          <div className="flex items-center justify-center h-[100px] text-xs text-muted-foreground text-center">
                            No meals scheduled
                          </div>
                        )}
                        {meals.map((meal) => (
                          <div key={meal.id} className="p-2 bg-background border rounded-md relative group hover:shadow-sm transition-shadow">
                            <div className="flex items-center justify-between">
                              <Badge variant={meal.mealType === "breakfast" ? "outline" : 
                                      meal.mealType === "lunch" ? "secondary" : "default"} 
                                     className="capitalize mb-1">
                                {meal.mealType}
                              </Badge>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6" 
                                  onClick={() => handleEditMeal(meal)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-destructive"
                                  onClick={() => handleDeleteMeal(meal.id)}
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs leading-tight mt-1">{meal.menu}</div>
                            {!meal.isActive && (
                              <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] flex items-center justify-center rounded-md">
                                <span className="text-xs font-medium text-muted-foreground px-2 py-0.5 bg-muted/70 rounded">Inactive</span>
                              </div>
                            )}
                          </div>
                        ))}
                        <Button 
                          variant="ghost" 
                          className="w-full py-1.5 h-auto text-xs border border-dashed hover:border-hostel-primary/50 hover:bg-hostel-primary/5"
                          onClick={() => {
                            setCurrentMeal(null);
                            const mealData = {
                              date: format(day, "yyyy-MM-dd"),
                              mealType: "breakfast",
                              menu: "",
                              isActive: true
                            };
                            // Pre-set the date for the new meal
                            setCurrentMeal(mealData as Meal);
                            setShowAddMealDialog(true);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add meal
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">All Meals</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Complete list of all scheduled meals</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search meals..." 
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon" className="shrink-0">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-4" align="end">
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Filter Meals</h4>
                        <div className="space-y-2">
                          <Label htmlFor="meal-type">Meal Type</Label>
                          <Select defaultValue="all" onValueChange={(value) => {
                            // Filter logic would go here in a real app
                          }}>
                            <SelectTrigger id="meal-type">
                              <SelectValue placeholder="All types" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All types</SelectItem>
                              <SelectItem value="breakfast">Breakfast</SelectItem>
                              <SelectItem value="lunch">Lunch</SelectItem>
                              <SelectItem value="dinner">Dinner</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="meal-status">Status</Label>
                          <Select defaultValue="all" onValueChange={(value) => {
                            // Filter logic would go here in a real app
                          }}>
                            <SelectTrigger id="meal-status">
                              <SelectValue placeholder="All status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All status</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="date-range">Date Range</Label>
                          <Select defaultValue="all" onValueChange={(value) => {
                            // Filter logic would go here in a real app
                          }}>
                            <SelectTrigger id="date-range">
                              <SelectValue placeholder="Date range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All dates</SelectItem>
                              <SelectItem value="today">Today</SelectItem>
                              <SelectItem value="tomorrow">Tomorrow</SelectItem>
                              <SelectItem value="week">This week</SelectItem>
                              <SelectItem value="month">This month</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full mt-2" size="sm">Apply Filters</Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="font-medium">Date</TableHead>
                      <TableHead className="font-medium">Type</TableHead>
                      <TableHead className="hidden md:table-cell font-medium">Menu</TableHead>
                      <TableHead className="font-medium">Status</TableHead>
                      <TableHead className="text-right font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMeals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No meals found. Try adjusting your search or add a new meal.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMeals.map((meal) => (
                        <TableRow key={meal.id} className="group">
                          <TableCell>{format(new Date(meal.date), "dd MMM yyyy")}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={cn(
                                "capitalize",
                                meal.mealType === "breakfast" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                meal.mealType === "lunch" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                "bg-indigo-50 text-indigo-700 border-indigo-200"
                              )}
                            >
                              {meal.mealType}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                            <div className="line-clamp-2">{meal.menu}</div>
                          </TableCell>
                          <TableCell>
                            {meal.isActive ? (
                              <div className="flex items-center">
                                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                <span className="text-sm font-medium">Active</span>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <span className="h-2 w-2 rounded-full bg-slate-300 mr-2"></span>
                                <span className="text-sm text-muted-foreground">Inactive</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditMeal(meal)}
                                className="h-7 w-7"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteMeal(meal.id)}
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Analysis Tab */}
        <TabsContent value="feedback" className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Feedback Analysis</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Review and respond to resident feedback</p>
                  </div>
                  <div className="flex items-center w-full sm:w-auto">
                    <Select 
                      value={selectedFeedbackDate} 
                      onValueChange={setSelectedFeedbackDate}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All dates</SelectItem>
                        {feedback.map(item => (
                          <SelectItem key={`${item.date}-${item.mealType}`} value={item.date}>
                            {format(new Date(item.date), "dd MMM yyyy")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                {feedback
                  .filter(item => item.date === selectedFeedbackDate || selectedFeedbackDate === "all")
                  .map(feedbackItem => (
                    <Card key={`${feedbackItem.date}-${feedbackItem.mealType}`} className="mb-4 border-none shadow-none">
                      <CardHeader className="py-3 px-4 bg-muted/30 rounded-t-lg flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={feedbackItem.mealType === "breakfast" ? "outline" : 
                                feedbackItem.mealType === "lunch" ? "secondary" : "default"}
                              className="capitalize"
                            >
                              {feedbackItem.mealType}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(feedbackItem.date), "dd MMM yyyy")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center bg-background/80 rounded-full px-2.5 py-1 shadow-sm border">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="font-medium text-sm">{feedbackItem.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground text-xs ml-1">
                            ({feedbackItem.totalResponses})
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="py-4 px-4 border border-t-0 rounded-b-lg">
                        <div className="space-y-3 mb-5">
                          {feedbackItem.breakdown.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="text-sm font-medium w-4 text-right">{item.rating}</div>
                              <Progress 
                                value={(item.count / feedbackItem.totalResponses) * 100} 
                                className={cn(
                                  "h-2",
                                  item.rating >= 4 ? "bg-green-100" : 
                                  item.rating >= 3 ? "bg-blue-100" : 
                                  "bg-amber-100"
                                )}
                              />
                              <div className="text-sm text-muted-foreground w-8">
                                {item.count}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Comments</h4>
                            <Badge variant="secondary" className="text-xs">
                              {feedbackItem.comments.length} comments
                            </Badge>
                          </div>
                          
                          {feedbackItem.comments.length === 0 ? (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                              No comments received yet
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                              {feedbackItem.comments.map(comment => (
                                <div 
                                  key={comment.id} 
                                  className={cn(
                                    "p-3 rounded-lg border",
                                    comment.reviewed ? 
                                      'bg-background' : 'bg-blue-50 border-blue-200'
                                  )}
                                >
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">{comment.user}</span>
                                    {!comment.reviewed ? (
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-7 text-xs"
                                        onClick={() => handleMarkReviewed(comment.id)}
                                      >
                                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                        Mark reviewed
                                      </Button>
                                    ) : (
                                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                        Reviewed
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm mt-1">{comment.text}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {feedback.filter(item => item.date === selectedFeedbackDate || selectedFeedbackDate === "all").length === 0 && (
                    <div className="text-center py-12">
                      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                        <AlertCircle className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">No feedback found</h3>
                      <p className="text-sm text-muted-foreground">
                        There is no feedback data available for the selected date.
                      </p>
                    </div>
                  )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Rating Summary</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Overall food quality metrics</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="rounded-full bg-gradient-to-tr from-hostel-primary/10 to-hostel-secondary/20 p-1 w-28 h-28 flex items-center justify-center border border-hostel-primary/20 shadow-sm">
                    <div className="rounded-full bg-background w-24 h-24 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-hostel-primary">4.1</div>
                        <div className="text-xs text-muted-foreground">Last 30 days</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Meal-wise Rating</h4>
                  <div className="space-y-4">
                    <div className="bg-muted/30 p-3 rounded-md">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Breakfast</span>
                        <div className="flex items-center">
                          <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                          <span>4.2</span>
                        </div>
                      </div>
                      <Progress value={84} className="h-2 bg-blue-100" />
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Lunch</span>
                        <div className="flex items-center">
                          <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                          <span>3.8</span>
                        </div>
                      </div>
                      <Progress value={76} className="h-2 bg-amber-100" />
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Dinner</span>
                        <div className="flex items-center">
                          <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                          <span>4.3</span>
                        </div>
                      </div>
                      <Progress value={86} className="h-2 bg-green-100" />
                    </div>
                  </div>
                </div>
                
                <Card className="shadow-none bg-muted/30 border-dashed">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Improvement Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-3 pb-3">
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-hostel-primary"></span>
                        Improve lunch variety based on feedback
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-hostel-primary"></span>
                        Address breakfast serving time issues
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-hostel-primary"></span>
                        Consider more vegetarian dinner options
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Settings Tab */}
        <TabsContent value="settings" className="pt-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Feedback Notification Settings</CardTitle>
              <p className="text-sm text-muted-foreground">Configure when residents receive feedback requests for meals</p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="space-y-6 flex-1">
                  <div className="bg-muted/30 p-5 rounded-lg border">
                    <h3 className="text-base font-medium mb-3">Notification Timing</h3>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="breakfast-time" className="text-sm">Breakfast Feedback</Label>
                          <Badge variant="outline" className="text-xs">Daily</Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="breakfast-time" 
                            type="time" 
                            value={notificationSettings.breakfast}
                            onChange={(e) => handleNotificationChange("breakfast", e.target.value)}
                            className="flex-1"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Send feedback requests after breakfast service
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="lunch-time" className="text-sm">Lunch Feedback</Label>
                          <Badge variant="outline" className="text-xs">Daily</Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="lunch-time" 
                            type="time" 
                            value={notificationSettings.lunch}
                            onChange={(e) => handleNotificationChange("lunch", e.target.value)}
                            className="flex-1"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Send feedback requests after lunch service
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="dinner-time" className="text-sm">Dinner Feedback</Label>
                          <Badge variant="outline" className="text-xs">Daily</Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="dinner-time" 
                            type="time" 
                            value={notificationSettings.dinner}
                            onChange={(e) => handleNotificationChange("dinner", e.target.value)}
                            className="flex-1"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Send feedback requests after dinner service
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6 flex-1">
                  <div className="bg-muted/30 p-5 rounded-lg border">
                    <h3 className="text-base font-medium mb-3">Notification Behavior</h3>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="enable-notifications" className="text-sm">Feedback System</Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Toggle all feedback notifications
                            </p>
                          </div>
                          <Switch
                            id="enable-notifications"
                            checked={notificationSettings.isActive}
                            onCheckedChange={(checked) => handleNotificationChange("isActive", checked)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="remind-after" className="text-sm">Reminder Time</Label>
                            <span className="text-xs text-muted-foreground">Minutes</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Input 
                              id="remind-after" 
                              type="number" 
                              min="0"
                              value={notificationSettings.remindAfter}
                              onChange={(e) => handleNotificationChange("remindAfter", e.target.value)}
                              className="flex-1"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Time to wait before sending a reminder
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-2 mt-4">
                        <Button 
                          className="w-full bg-hostel-primary hover:bg-hostel-secondary" 
                          onClick={() => {
                            toast({
                              title: "Settings saved",
                              description: "Your notification settings have been updated.",
                            });
                          }}
                        >
                          Save Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Card className="border-dashed">
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Feedback Collection</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-xs text-muted-foreground space-y-2">
                        <p>
                          Residents receive automated notifications at configured times to provide feedback 
                          on meal quality. This helps maintain food quality standards and address concerns promptly.
                        </p>
                        <p>
                          Feedback is collected anonymously and aggregated for analysis in the dashboard.
                          Residents can rate meals and provide specific comments.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Meal Dialog */}
      <Dialog open={showAddMealDialog} onOpenChange={setShowAddMealDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Meal</DialogTitle>
            <DialogDescription>
              Enter details for the new meal to be added to the schedule.
            </DialogDescription>
          </DialogHeader>
          <MealForm 
            initialData={currentMeal as Partial<Meal>}
            onSubmit={handleMealSubmit} 
            onCancel={() => setShowAddMealDialog(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Meal Dialog */}
      <Dialog open={showEditMealDialog} onOpenChange={setShowEditMealDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Meal</DialogTitle>
            <DialogDescription>
              Update the details for this meal.
            </DialogDescription>
          </DialogHeader>
          {currentMeal && (
            <MealForm 
              initialData={currentMeal} 
              onSubmit={handleMealSubmit} 
              onCancel={() => setShowEditMealDialog(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoodManagement; 