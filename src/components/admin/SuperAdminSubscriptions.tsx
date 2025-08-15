import { PGAdmin } from "@/hooks/usePGAdmins";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  ChevronDown, 
  Search, 
  CreditCard, 
  Users, 
  FileText, 
  PlusCircle, 
  Edit2, 
  Trash2, 
  Eye, 
  ArrowUpDown, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MoreHorizontal
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";

// Mock subscription plans data
const initialPlans = [
  {
    id: "1",
    name: "Monthly Plan",
    description: "Basic monthly subscription",
    price: 1000,
    duration: 1,
    durationUnit: "month",
    discount: 0,
    isActive: true,
  },
  {
    id: "2",
    name: "6 Months Plan",
    description: "Semi-annual plan with discount",
    price: 5700,
    duration: 6,
    durationUnit: "months",
    discount: 5,
    isActive: true,
  },
  {
    id: "3",
    name: "Annual Plan",
    description: "Annual plan with one month free",
    price: 11000,
    duration: 12,
    durationUnit: "months",
    discount: 8.3,
    isActive: true,
  }
];

// Mock PG Admin subscriptions data
const initialSubscriptions = [
  {
    id: "sub1",
    pgAdminId: "admin1",
    pgAdminName: "Rahul Sharma",
    email: "rahul@example.com",
    pgCount: 3,
    plan: "Annual Plan",
    startDate: "2023-10-15",
    endDate: "2024-10-14",
    amount: 33000,
    status: "active",
    lastPayment: "2023-10-15"
  },
  {
    id: "sub2",
    pgAdminId: "admin2",
    pgAdminName: "Priya Patel",
    email: "priya@example.com",
    pgCount: 1,
    plan: "Monthly Plan",
    startDate: "2024-05-01",
    endDate: "2024-06-01",
    amount: 1000,
    status: "active",
    lastPayment: "2024-05-01"
  },
  {
    id: "sub3",
    pgAdminId: "admin3",
    pgAdminName: "Amit Kumar",
    email: "amit@example.com",
    pgCount: 2,
    plan: "6 Months Plan",
    startDate: "2024-02-15",
    endDate: "2024-08-14",
    amount: 11400,
    status: "active",
    lastPayment: "2024-02-15"
  },
  {
    id: "sub4",
    pgAdminId: "admin4",
    pgAdminName: "Neha Gupta",
    email: "neha@example.com",
    pgCount: 1,
    plan: "Monthly Plan",
    startDate: "2024-04-05",
    endDate: "2024-05-05",
    amount: 1000,
    status: "expired",
    lastPayment: "2024-04-05"
  }
];

// Mock payment history data
const initialPayments = [
  {
    id: "pay1",
    pgAdminId: "admin1",
    pgAdminName: "Rahul Sharma",
    amount: 33000,
    plan: "Annual Plan",
    date: "2023-10-15",
    transactionId: "TXN123456",
    status: "completed",
    method: "Credit Card"
  },
  {
    id: "pay2",
    pgAdminId: "admin2",
    pgAdminName: "Priya Patel",
    amount: 1000,
    plan: "Monthly Plan",
    date: "2024-05-01",
    transactionId: "TXN234567",
    status: "completed",
    method: "UPI"
  },
  {
    id: "pay3",
    pgAdminId: "admin3",
    pgAdminName: "Amit Kumar",
    amount: 11400,
    plan: "6 Months Plan",
    date: "2024-02-15",
    transactionId: "TXN345678",
    status: "completed",
    method: "Net Banking"
  },
  {
    id: "pay4",
    pgAdminId: "admin4",
    pgAdminName: "Neha Gupta",
    amount: 1000,
    plan: "Monthly Plan",
    date: "2024-04-05",
    transactionId: "TXN456789",
    status: "completed",
    method: "Credit Card"
  }
];

interface PlanFormData {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  durationUnit: string;
  discount: number;
  isActive: boolean;
}

interface SuperAdminSubscriptionsProps {
  admins: PGAdmin[];
  isLoading?: boolean;
}

const SuperAdminSubscriptions = ({ admins, isLoading }: SuperAdminSubscriptionsProps) => {
  const [plans, setPlans] = useState<PlanFormData[]>(initialPlans);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [payments, setPayments] = useState(initialPayments);
  const [isEditPlanDialogOpen, setIsEditPlanDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanFormData>({
    id: '',
    name: '',
    description: '',
    price: 0,
    duration: 1,
    durationUnit: 'month',
    discount: 0,
    isActive: true,
  });
  const [isAddingNewPlan, setIsAddingNewPlan] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [subscriptionTab, setSubscriptionTab] = useState("plans");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Animation styles
  useEffect(() => {
    // Add the animation styles if they don't exist
    if (!document.getElementById('animation-styles')) {
      const style = document.createElement('style');
      style.id = 'animation-styles';
      style.innerHTML = `
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes scale-in {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Refresh function
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Function to handle plan editing
  const handleEditPlan = (plan) => {
    setCurrentPlan(plan);
    setIsAddingNewPlan(false);
    setIsEditPlanDialogOpen(true);
  };

  // Function to handle adding new plan
  const handleAddNewPlan = () => {
    setCurrentPlan({
      id: '',
      name: '',
      description: '',
      price: 0,
      duration: 1,
      durationUnit: 'month',
      discount: 0,
      isActive: true,
    });
    setIsAddingNewPlan(true);
    setIsEditPlanDialogOpen(true);
  };

  // Function to save plan changes
  const handleSavePlan = () => {
    if (isAddingNewPlan) {
      const newPlan = {
        ...currentPlan,
        id: Date.now().toString(),
      };
      setPlans([...plans, newPlan]);
    } else {
      setPlans(plans.map(plan => plan.id === currentPlan.id ? { ...currentPlan, id: plan.id } : plan));
    }
    setIsEditPlanDialogOpen(false);
  };

  // Function to delete a plan
  const handleDeletePlan = (planId) => {
    setPlans(plans.filter(plan => plan.id !== planId));
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentPlan({
      ...currentPlan,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    });
  };

  // Filter subscriptions based on search query
  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.pgAdminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.plan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter payments based on search query
  const filteredPayments = payments.filter(payment => 
    payment.pgAdminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.plan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 lg:p-8">
        <div className="animate-pulse">
          <div className="h-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-sm text-muted-foreground">Manage subscription plans and PG admin payments</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search subscriptions..."
              className="pl-9 w-full sm:w-[240px] bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleAddNewPlan} className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Plan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="plans" value={subscriptionTab} onValueChange={setSubscriptionTab} className="space-y-4 md:space-y-6">
        <TabsList className="bg-white border border-gray-200 shadow-sm w-full overflow-x-auto flex no-scrollbar">
          <TabsTrigger value="plans" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none flex-1">
            <CreditCard className="h-4 w-4 mr-2" />
            Plans
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none flex-1">
            <Users className="h-4 w-4 mr-2" />
            Subscriptions
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Payment History
          </TabsTrigger>
        </TabsList>
        
        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className="bg-white border-gray-200 transition-all hover:shadow-md">
          <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <Badge variant={plan.isActive ? "default" : "secondary"}>
                      {plan.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Price per PG:</span>
                      <span className="font-medium">₹{plan.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{plan.duration} {plan.durationUnit}</span>
                    </div>
                    {plan.discount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Discount:</span>
                        <span className="font-medium text-green-600">{plan.discount}%</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => handleEditPlan(plan)}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" className="w-full sm:w-auto" onClick={() => handleDeletePlan(plan.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-xl font-semibold mb-2 sm:mb-0">PG Admin Subscriptions</h2>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PG Admin</TableHead>
                      <TableHead className="hidden sm:table-cell">Plan</TableHead>
                      <TableHead className="hidden md:table-cell">PG Count</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="hidden md:table-cell">
                        <div className="flex items-center">
                          Expiry Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.length > 0 ? (
                      filteredSubscriptions.map((subscription) => (
                        <TableRow key={subscription.id}>
                          <TableCell>
                            <div className="font-medium">{subscription.pgAdminName}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground">{subscription.email}</div>
                            <div className="text-xs text-muted-foreground sm:hidden mt-1">
                              {subscription.plan}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">{subscription.plan}</TableCell>
                          <TableCell className="hidden md:table-cell text-center">{subscription.pgCount}</TableCell>
                          <TableCell>₹{subscription.amount.toLocaleString()}</TableCell>
                          <TableCell className="hidden md:table-cell">{subscription.endDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant={subscription.status === "active" ? "outline" : "secondary"}
                              className={
                                subscription.status === "active"
                                  ? "bg-green-50 text-green-600 hover:bg-green-50 border-green-200"
                                  : "bg-red-50 text-red-600 hover:bg-red-50 border-red-200"
                              }
                            >
                              {subscription.status === "active" ? (
                                <div className="flex items-center">
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  Active
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <AlertCircle className="mr-1 h-3 w-3" />
                                  Expired
                                </div>
                              )}
                            </Badge>
                            <div className="text-xs text-muted-foreground md:hidden mt-1">
                              Expires: {subscription.endDate}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Renew Subscription
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Cancel Subscription
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          No subscriptions found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
                <div className="text-3xl font-bold">
                  {subscriptions.filter(sub => sub.status === "active").length}
                </div>
                <p className="text-sm text-muted-foreground">
                  Current active subscriptions
                </p>
          </CardContent>
        </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
                <div className="text-3xl font-bold">
                  ₹{(payments.reduce((acc, payment) => acc + payment.amount, 0) / 12).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">
                  Average monthly subscription revenue
                </p>
          </CardContent>
        </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">PGs Managed</CardTitle>
          </CardHeader>
          <CardContent>
                <div className="text-3xl font-bold">
                  {subscriptions.reduce((acc, sub) => acc + sub.pgCount, 0)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Total PGs under management
                </p>
          </CardContent>
        </Card>
      </div>
        </TabsContent>
        
        {/* Payment History Tab */}
        <TabsContent value="payments" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-xl font-semibold mb-2 sm:mb-0">Payment History</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                      <TableHead>
                        <div className="flex items-center">
                          Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>PG Admin</TableHead>
                      <TableHead className="hidden md:table-cell">Plan</TableHead>
                      <TableHead className="hidden lg:table-cell">Transaction ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="hidden md:table-cell">Method</TableHead>
                <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div className="font-medium">{payment.date}</div>
                          </TableCell>
                          <TableCell>
                            {payment.pgAdminName}
                            <div className="text-xs text-muted-foreground md:hidden mt-1">
                              {payment.plan}
                            </div>
                  </TableCell>
                          <TableCell className="hidden md:table-cell">{payment.plan}</TableCell>
                          <TableCell className="hidden lg:table-cell">{payment.transactionId}</TableCell>
                          <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                          <TableCell className="hidden md:table-cell">{payment.method}</TableCell>
                    <TableCell>
                      <Badge
                              variant="outline"
                              className="bg-green-50 text-green-600 hover:bg-green-50 border-green-200"
                      >
                              <div className="flex items-center">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Completed
                              </div>
                      </Badge>
                            <div className="text-xs text-muted-foreground md:hidden mt-1">
                              {payment.method}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Invoice
                            </Button>
                    </TableCell>
                  </TableRow>
                ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6">
                          No payment records found matching your search.
                        </TableCell>
                      </TableRow>
              )}
            </TableBody>
          </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Stats Cards */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ₹{payments.reduce((acc, payment) => acc + payment.amount, 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">
                  All-time subscription revenue
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Payments This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {payments.filter(payment => {
                    const paymentDate = new Date(payment.date);
                    const currentDate = new Date();
                    return paymentDate.getMonth() === currentDate.getMonth() &&
                           paymentDate.getFullYear() === currentDate.getFullYear();
                  }).length}
                </div>
                <p className="text-sm text-muted-foreground">
                  Total payments received
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ₹{(payments.reduce((acc, payment) => acc + payment.amount, 0) / payments.length).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">
                  Average transaction value
                </p>
        </CardContent>
      </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Renewals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center">
                  2
                  <Clock className="ml-2 h-5 w-5 text-amber-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Due in the next 7 days
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Plan Dialog */}
      <Dialog open={isEditPlanDialogOpen} onOpenChange={setIsEditPlanDialogOpen}>
        <DialogContent className="sm:max-w-[525px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAddingNewPlan ? "Add New Plan" : "Edit Subscription Plan"}
            </DialogTitle>
            <DialogDescription>
              {isAddingNewPlan 
                ? "Create a new subscription plan for PG admins."
                : "Make changes to the subscription plan here."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={currentPlan.name} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                name="description" 
                value={currentPlan.description} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price per PG (₹)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  value={currentPlan.price} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input 
                  id="discount" 
                  name="discount" 
                  type="number" 
                  min="0"
                  max="100"
                  value={currentPlan.discount} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input 
                  id="duration" 
                  name="duration" 
                  type="number" 
                  min="1"
                  value={currentPlan.duration} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="durationUnit">Duration Unit</Label>
                <select 
                  id="durationUnit" 
                  name="durationUnit" 
                  value={currentPlan.durationUnit}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="day">Day(s)</option>
                  <option value="week">Week(s)</option>
                  <option value="month">Month(s)</option>
                  <option value="year">Year(s)</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="isActive" 
                name="isActive"
                checked={currentPlan.isActive} 
                onCheckedChange={(checked) => setCurrentPlan({...currentPlan, isActive: checked})}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditPlanDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSavePlan} className="w-full sm:w-auto">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperAdminSubscriptions;
