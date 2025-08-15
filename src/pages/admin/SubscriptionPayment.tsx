import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, CreditCard, Download, Shield } from "lucide-react";

// Mock data - replace with actual API calls
const mockAdminData = {
  name: "John Doe",
  email: "john.doe@example.com",
  pgCount: 3,
  currentPlan: "Monthly",
  status: "active",
  expiryDate: "2024-06-30",
};

const mockPaymentHistory = [
  { id: 1, date: "2024-05-01", amount: 3000, invoiceId: "INV-2024-001", status: "Paid" },
  { id: 2, date: "2024-04-01", amount: 3000, invoiceId: "INV-2024-002", status: "Paid" },
  { id: 3, date: "2024-03-01", amount: 3000, invoiceId: "INV-2024-003", status: "Paid" },
];

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  discount: number;
  description: string;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "monthly",
    name: "Monthly Plan",
    price: 1000,
    discount: 0,
    description: "Basic monthly plan (₹1,000/PG)"
  },
  {
    id: "biannual",
    name: "6 Months Plan",
    price: 950, // 5% off per month
    discount: 5,
    description: "Semi-annual plan with 5% discount (₹5,700/PG)"
  },
  {
    id: "annual",
    name: "12 Months Plan",
    price: 917, // 1 month free (11,000/12)
    discount: 8.3,
    description: "Annual plan - 1 month free (₹11,000/PG)"
  }
];

const SubscriptionPayment = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("monthly");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState<boolean>(false);

  const calculateTotalPrice = (planId: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) return 0;
    
    let months = 1;
    if (planId === "biannual") months = 6;
    if (planId === "annual") months = 12;
    
    return plan.price * mockAdminData.pgCount * months;
  };

  useEffect(() => {
    setTotalPrice(calculateTotalPrice(selectedPlan));
  }, [selectedPlan]);

  const handlePaymentSubmit = () => {
    setIsProcessingPayment(true);
    // Here you would integrate with an actual payment gateway
    setTimeout(() => {
      alert("Payment processed successfully!");
      setIsProcessingPayment(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Subscription</h1>
            <p className="text-muted-foreground">Manage your subscription plan and payments</p>
          </div>
          <Button variant="outline" onClick={() => setShowPaymentHistory(!showPaymentHistory)}>
            {showPaymentHistory ? "Hide" : "View"} Payment History
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Admin Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-1">
                <p className="text-muted-foreground">Name:</p>
                <p className="font-medium">{mockAdminData.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <p className="text-muted-foreground">Email:</p>
                <p className="font-medium">{mockAdminData.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <p className="text-muted-foreground">PG Count:</p>
                <p className="font-medium">{mockAdminData.pgCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>Your active plan details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">{mockAdminData.currentPlan} Plan</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Expires on {mockAdminData.expiryDate}
                    </span>
                  </div>
                </div>
                <Badge variant={mockAdminData.status === "active" ? "default" : "destructive"}>
                  {mockAdminData.status === "active" ? "Active" : "Expired"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {showPaymentHistory ? (
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Record of your previous payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPaymentHistory.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.invoiceId}</TableCell>
                      <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Subscription Plan</CardTitle>
                <CardDescription>Select a plan that fits your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  defaultValue={selectedPlan}
                  value={selectedPlan}
                  onValueChange={setSelectedPlan}
                  className="grid gap-4 md:grid-cols-3"
                >
                  {subscriptionPlans.map(plan => {
                    const duration = plan.id === "monthly" ? 1 : plan.id === "biannual" ? 6 : 12;
                    const totalForPlan = plan.price * mockAdminData.pgCount * duration;

                    return (
                      <div key={plan.id} className="relative">
                        <RadioGroupItem
                          value={plan.id}
                          id={plan.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={plan.id}
                          className="flex flex-col gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="flex justify-between">
                            <span className="text-lg font-medium">{plan.name}</span>
                            {plan.discount > 0 && (
                              <Badge variant="secondary">Save {plan.discount}%</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                          <div className="mt-2">
                            <span className="text-2xl font-bold">₹{plan.price}</span>
                            <span className="text-muted-foreground">/PG/month</span>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
                <CardDescription>Review your subscription details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan</span>
                    <span>
                      {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PG Count</span>
                    <span>{mockAdminData.pgCount} PG(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per PG</span>
                    <span>
                      ₹{subscriptionPlans.find(p => p.id === selectedPlan)?.price}/month
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span>
                      {selectedPlan === "monthly"
                        ? "1 month"
                        : selectedPlan === "biannual"
                        ? "6 months"
                        : "12 months"}
                    </span>
                  </div>

                  {subscriptionPlans.find(p => p.id === selectedPlan)?.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>
                        {subscriptionPlans.find(p => p.id === selectedPlan)?.discount}% off
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">Total Amount</p>
                    <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
                  </div>
                  <p className="text-2xl font-bold">₹{totalPrice.toLocaleString()}</p>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <div className="w-full">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handlePaymentSubmit}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? "Processing..." : "Proceed to Payment"}
                    {!isProcessingPayment && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex items-center justify-center text-sm text-muted-foreground gap-1">
                  <Shield className="h-4 w-4" />
                  <span>Payments are 256-bit encrypted and secure</span>
                </div>
              </CardFooter>
            </Card>

            <div className="flex items-center justify-center gap-2 bg-muted/50 p-4 rounded-lg">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Need help with payment? <a href="#" className="text-primary underline">Contact support</a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPayment; 