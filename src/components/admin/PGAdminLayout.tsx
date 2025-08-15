import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Search,
  User,
  IndianRupee,
  ClipboardList,
  HelpCircle,
  Info,
  CreditCard,
  Users,
  Home,
  Building,
  Utensils,
  Bell,
  Calendar,
  BarChart,
  UserPlus,
  Bed,
  Coffee,
  DollarSign,
  FileBarChart,
  ShieldAlert,
  MessageSquare,
  Wrench,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavigationItem {
  label: string;
  icon: React.ElementType;
  path: string;
  description: string;
  badge?: string;
}

interface NavigationCategory {
  category: string;
  items: NavigationItem[];
}

// Desktop navigation items with categories
const navigationItems: NavigationCategory[] = [
  {
    category: "Overview",
    items: [
      { 
        label: "Dashboard", 
        icon: Home, 
        path: "/pg-admin",
        description: "Main overview"
      }
    ]
  },
  {
    category: "Resident Management",
    items: [
      { 
        label: "Joining Requests", 
        icon: UserPlus, 
        path: "/pg-admin/residents/requests",
        description: "New applications",
        badge: "3"
      },
      { 
        label: "Residents List", 
        icon: Users, 
        path: "/pg-admin/residents",
        description: "Manage residents"
      },
      { 
        label: "Room Management", 
        icon: Bed, 
        path: "/pg-admin/rooms",
        description: "Room allocation"
      }
    ]
  },
  {
    category: "Services",
    items: [
      { 
        label: "Service Requests", 
        icon: ClipboardList, 
        path: "/pg-admin/requests",
        description: "Maintenance requests",
        badge: "5"
      },
      { 
        label: "Food Management", 
        icon: Coffee, 
        path: "/pg-admin/food",
        description: "Meal planning"
      },
      { 
        label: "Maintenance", 
        icon: Wrench, 
        path: "/pg-admin/maintenance",
        description: "Building maintenance"
      }
    ]
  },
  {
    category: "Financial",
    items: [
      { 
        label: "Payments", 
        icon: IndianRupee, 
        path: "/pg-admin/payments",
        description: "Payment tracking"
      },
      { 
        label: "Expenses", 
        icon: DollarSign, 
        path: "/pg-admin/expenses",
        description: "Expense management"
      },
      { 
        label: "Reports", 
        icon: FileBarChart, 
        path: "/pg-admin/reports",
        description: "Financial reports"
      }
    ]
  },
  {
    category: "Communication",
    items: [
      { 
        label: "Messages", 
        icon: MessageSquare, 
        path: "/pg-admin/messages",
        description: "Resident communication"
      }
    ]
  },
  {
    category: "Administration",
    items: [
      { 
        label: "Settings", 
        icon: Settings, 
        path: "/pg-admin/settings",
        description: "System preferences"
      },
      { 
        label: "Security", 
        icon: ShieldAlert, 
        path: "/pg-admin/security",
        description: "Access control"
      },
      { 
        label: "Help", 
        icon: HelpCircle, 
        path: "/pg-admin/help",
        description: "Support & guidance"
      },
      { 
        label: "About", 
        icon: Info, 
        path: "/pg-admin/about",
        description: "App information"
      }
    ]
  }
];

// Mobile bottom navigation items (simplified)
const mobileNavigationItems: Array<{
  label: string;
  icon: React.ElementType;
  path: string;
}> = [
  { label: "Dashboard", icon: Home, path: "/pg-admin" },
  { label: "Residents", icon: Users, path: "/pg-admin/residents" },
  { label: "Rooms", icon: Building, path: "/pg-admin/rooms" },
  { label: "Food", icon: Utensils, path: "/pg-admin/food" },
  { label: "Requests", icon: ClipboardList, path: "/pg-admin/requests" }
];

// Paths to hide in mobile side menu and notifications
const mobileHiddenPaths = [
  "/pg-admin",
  "/pg-admin/residents",
  "/pg-admin/rooms",
  "/pg-admin/food",
  "/pg-admin/requests",
  "/pg-admin/notifications" // Add notifications to hidden paths
];

const PGAdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  // Check if screen is desktop on mount and when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/role-selection");
  };

  // Updated isActive function to be more precise
  const isActive = (path: string) => {
    if (!path) return false;
    
    // Exact match for dashboard
    if (path === '/pg-admin' && location.pathname === '/pg-admin') {
      return true;
    }
    
    // Special case for residents section
    if (path === '/pg-admin/residents') {
      return location.pathname === '/pg-admin/residents' || 
             location.pathname === '/pg-admin/residents/list';
    }
    
    if (path === '/pg-admin/residents/requests') {
      return location.pathname === '/pg-admin/residents/requests';
    }
    
    // For other paths, check exact match
    return location.pathname === path;
  };

  // Filter navigation items based on search and mobile view
  const filteredNavItems = navigationItems.reduce<NavigationItem[]>((acc, category) => {
    const filteredItems = category.items.filter(item =>
      (item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      // Hide specific items in mobile side menu
      (!isMobile || !mobileHiddenPaths.includes(item.path))
    );
    return [...acc, ...filteredItems];
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col bg-white border-r shadow-sm transition-all duration-300 ease-in-out z-30 h-full fixed left-0",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Logo and Branding */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-10 h-10 rounded-md flex items-center justify-center font-bold text-lg shadow-md">
              SM
            </div>
            {!isCollapsed && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Space Mate
              </h1>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-gray-100"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft className={cn(
              "h-5 w-5 text-gray-500 transition-transform duration-300",
              isCollapsed ? "rotate-180" : ""
            )} />
          </Button>
        </div>

        {/* User Profile */}
        {!isCollapsed ? (
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-purple-100">
                <AvatarImage src={currentUser?.profileImage} />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  {currentUser?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-gray-800">{currentUser?.name || 'PG Admin'}</h2>
                <p className="text-sm text-gray-500">PG Admin</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 border-b flex justify-center">
            <Avatar className="h-10 w-10 border-2 border-purple-100">
              <AvatarImage src={currentUser?.profileImage} />
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                {currentUser?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        {/* Search Bar - Desktop */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* Desktop Sidebar Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navigationItems.map((category) => {
            // Filter out items that should be hidden in mobile view
            const visibleItems = category.items.filter(item => 
              !isMobile || !mobileHiddenPaths.includes(item.path)
            );
            
            // Skip rendering the category if it has no visible items
            if (visibleItems.length === 0) return null;

            return (
              <div key={category.category} className="mb-6">
                {!isCollapsed && (
                  <h2 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {category.category}
                  </h2>
                )}
                <ul className="space-y-1">
                  {visibleItems.map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                      <li key={item.path}>
                        <Button
                          variant={active ? "default" : "ghost"}
                          className={cn(
                            "w-full transition-colors",
                            isCollapsed
                              ? "justify-center px-0 py-3 h-12"
                              : "justify-start text-base py-6 gap-3",
                            "flex items-center rounded-lg",
                            active
                              ? "bg-purple-600 text-white shadow-md"
                              : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                          )}
                          onClick={() => handleNavigation(item.path)}
                          title={isCollapsed ? item.label : undefined}
                        >
                          <Icon size={20} className={active ? "text-white" : "text-purple-600"} />
                          {!isCollapsed && (
                            <>
                              <span>{item.label}</span>
                              {item.badge && (
                                <Badge className="ml-auto bg-purple-100 text-purple-600">
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className={cn(
          "p-2 border-t",
          isCollapsed ? "text-center" : "px-4 py-3"
        )}>
          {!isCollapsed ? (
            <Button
              variant="ghost"
              className="w-full justify-start text-base py-2 text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-3"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut size={18} />
            </Button>
          )}
          
          {!isCollapsed && (
            <p className="text-xs text-gray-500 text-center mt-4">
              Space Mate v1.0.0
            </p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex flex-col w-full min-h-screen transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:ml-20" : "lg:ml-72"
      )}>
        {/* Header */}
        <header className="border-b sticky top-0 z-30 shadow-sm bg-white">
          <div className="container mx-auto flex justify-between items-center h-16 px-4">
            <div className="flex items-center gap-2">
              <div className="flex md:hidden items-center gap-3">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-10 h-10 rounded-md flex items-center justify-center font-bold text-lg">
                  SM
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Space Mate
                </h1>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 hidden md:block">
                {navigationItems.find(category => 
                  category.items.find(item => isActive(item.path))
                )?.items.find(item => isActive(item.path))?.label || "Dashboard"}
              </h2>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4">
              {/* Notification Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => handleNavigation("/pg-admin/notifications")}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* Mobile Menu Button */}
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 p-0">
                  <div className="flex flex-col h-full">
                    {/* Mobile Drawer Header */}
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-9 h-9 rounded-md flex items-center justify-center font-bold text-base shadow-sm">
                          SM
                        </div>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                          Space Mate
                        </h1>
                      </div>
                    </div>
                    
                    {/* User Profile in Drawer */}
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-purple-100">
                          <AvatarImage src={currentUser?.profileImage} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                            {currentUser?.name?.charAt(0) || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="font-semibold text-gray-900">{currentUser?.name || 'PG Admin'}</h2>
                          <p className="text-sm text-gray-500">PG Admin</p>
                        </div>
                      </div>
                    </div>

                    {/* Search in Drawer */}
                    <div className="p-4 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="Search..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 bg-gray-50 border-gray-200 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Navigation Links in Drawer */}
                    <nav className="flex-1 py-4 overflow-y-auto">
                      <ul className="space-y-1 px-2">
                        {filteredNavItems.map((item) => {
                          const active = isActive(item.path);
                          const Icon = item.icon;
                          return (
                            <li key={item.path}>
                              <Button
                                variant={active ? "default" : "ghost"}
                                className={cn(
                                  "w-full justify-start text-base py-6 flex items-center gap-3 rounded-lg transition-colors",
                                  active
                                    ? "bg-purple-600 text-white shadow-md"
                                    : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                )}
                                onClick={() => handleNavigation(item.path)}
                              >
                                <Icon size={20} className={active ? "text-white" : "text-purple-600"} />
                                <span>{item.label}</span>
                                {item.badge && (
                                  <Badge className="ml-auto bg-purple-100 text-purple-600">
                                    {item.badge}
                                  </Badge>
                                )}
                              </Button>
                            </li>
                          );
                        })}
                      </ul>
                    </nav>
                    
                    {/* Logout Button in Drawer */}
                    <div className="p-4 border-t">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-base py-2 text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-3"
                        onClick={handleLogout}
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </Button>
                      <p className="text-xs text-gray-500 text-center mt-4">
                        Space Mate v1.0.0
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
          
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 bg-gray-50 pb-20 lg:pb-6">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="grid grid-cols-5 h-16">
            {mobileNavigationItems.map((item) => {
              const active = item.path ? isActive(item.path) : false;
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (item.path) {
                      handleNavigation(item.path);
                    } else {
                      setIsSidebarOpen(true);
                    }
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center relative transition-all duration-200",
                    active && "animate-bounce-short"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center rounded-full w-10 h-10 relative transition-colors duration-200",
                    active ? "bg-purple-100 text-purple-600" : "text-gray-500 hover:text-purple-600"
                  )}>
                    <Icon size={20} />
                  </div>
                  <span className={cn(
                    "text-xs mt-1 transition-colors duration-200",
                    active ? "text-purple-600 font-medium" : "text-gray-500"
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default PGAdminLayout; 