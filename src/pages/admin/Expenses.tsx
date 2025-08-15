import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DollarSign, 
  Plus, 
  FileText, 
  TrendingUp,
  Filter,
  Download,
  Search,
  MoreVertical,
  Utensils,
  Wrench,
  Wifi,
  Power,
  Droplet,
  ShoppingBag
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Expenses = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("march");

  const expenseCategories = [
    { name: "Food & Groceries", amount: 45000, icon: Utensils, change: "+12%" },
    { name: "Maintenance", amount: 15000, icon: Wrench, change: "-5%" },
    { name: "Utilities", amount: 25000, icon: Power, change: "+3%" },
    { name: "Internet", amount: 5000, icon: Wifi, change: "0%" }
  ];

  const recentExpenses = [
    {
      id: 1,
      date: "2024-03-10",
      description: "Monthly Grocery Stock",
      category: "Food & Groceries",
      amount: 15000,
      status: "completed"
    },
    {
      id: 2,
      date: "2024-03-09",
      description: "AC Repair - Room 102",
      category: "Maintenance",
      amount: 2500,
      status: "pending"
    },
    {
      id: 3,
      date: "2024-03-08",
      description: "Electricity Bill",
      category: "Utilities",
      amount: 12000,
      status: "completed"
    },
    {
      id: 4,
      date: "2024-03-07",
      description: "Internet Bill",
      category: "Internet",
      amount: 5000,
      status: "completed"
    },
    {
      id: 5,
      date: "2024-03-06",
      description: "Water Bill",
      category: "Utilities",
      amount: 3000,
      status: "completed"
    }
  ];

  const handleAddExpense = () => {
    toast({
      title: "Add New Expense",
      description: "Opening expense form...",
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-muted-foreground">Track and manage your PG expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddExpense}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Expense Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {expenseCategories.map((category, index) => (
          <Card key={index}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <category.icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{category.name}</p>
                    <p className="text-2xl font-bold">₹{category.amount.toLocaleString()}</p>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    category.change.startsWith("+") 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : category.change.startsWith("-")
                      ? "bg-red-100 text-red-800 border-red-200"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }
                >
                  {category.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>List of recent expenses and their status</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search expenses..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">January</SelectItem>
                  <SelectItem value="february">February</SelectItem>
                  <SelectItem value="march">March</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="text-right">₹{expense.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          expense.status === "completed"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }
                      >
                        {expense.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Expenses; 