import { Link, useNavigate } from "react-router-dom";
import { 
  Home, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  Bell, 
  RefreshCw,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

const tabs: Tab[] = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { id: "revenue", label: "Revenue", icon: TrendingUp },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "admins", label: "PG Admins", icon: Users },
  { id: "bulk-ops", label: "Admin Controls", icon: Settings },
  { id: "activity", label: "Activity Feed", icon: Bell },
];

interface SuperAdminHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const SuperAdminHeader = ({ 
  activeTab, 
  onTabChange, 
  onRefresh,
  isRefreshing 
}: SuperAdminHeaderProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    
    const hour = time.getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
    
    return () => clearInterval(interval);
  }, [time]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-slate-200/80 shadow-sm sticky top-0 z-30">
      <div className="container mx-auto py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 w-10 h-10 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">SM</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text">
                SpaceMate
              </h1>
              <p className="text-xs text-slate-500">Super Admin Portal</p>
            </div>
          </div>
          
          <div className="hidden lg:flex">
            <Tabs value={activeTab} onValueChange={onTabChange}>
              <TabsList className="grid grid-cols-7 w-[800px]">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-800 flex gap-2"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden md:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onRefresh}
              disabled={isRefreshing}
              className="hidden md:flex items-center gap-2"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-9 w-9 p-0 hover:bg-slate-100">
                  <Avatar className="h-9 w-9 border border-slate-200">
                    <AvatarImage src={currentUser?.profileImage} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700">
                      {currentUser?.name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{currentUser?.name || 'Admin User'}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser?.email || 'admin@example.com'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  navigate("/super-admin");
                  onTabChange("overview");
                }}>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTabChange("subscriptions")}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Subscription Management</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/super-admin/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-700"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
          <div>
            <span>{greeting}, </span>
            <span className="font-medium text-slate-700">{currentUser?.name?.split(' ')[0] || 'Admin'}</span>
          </div>
          <div>
            {time.toLocaleDateString('en-US', { 
              weekday: 'short',
              day: 'numeric', 
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
