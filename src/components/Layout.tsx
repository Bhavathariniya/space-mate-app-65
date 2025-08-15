
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { 
  Home, User, Calendar, Bell, Menu, LogOut, 
  X, Settings, Info, List, Shield, MessageSquare,
  HelpCircle, Building, Utensils, CreditCard, Wrench, AlertCircle, Shirt
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Layout = () => {
  const { userRole, isAuthenticated, currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  // Check if we're on super admin route
  const isSuperAdmin = location.pathname.startsWith('/super-admin');

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        label: "Home",
        icon: Home,
        path: `/${userRole === UserRole.PUBLIC ? "public" : userRole}`,
      },
      {
        label: "Rooms",
        icon: List,
        path: `/${userRole === UserRole.PUBLIC ? "public" : userRole}/rooms`,
      },
    ];

    // Only add these items for authenticated users
    if (userRole !== UserRole.PUBLIC) {
      baseItems.push(
        {
          label: "Meals",
          icon: Calendar,
          path: `/${userRole}/meals`,
        },
        {
          label: "Messages",
          icon: MessageSquare,
          path: `/${userRole}/messages`,
        },
        {
          label: "Notifications",
          icon: Bell,
          path: `/${userRole}/notifications`,
        },
        {
          label: "Profile",
          icon: User,
          path: `/${userRole}/profile`,
        }
      );
    }

    return baseItems;
  };

  const getSettingsItems = () => {
    if (userRole === UserRole.PUBLIC) return [];

    return [
      {
        label: "Settings",
        icon: Settings,
        path: `/${userRole}/settings`,
      },
      {
        label: "Help",
        icon: HelpCircle,
        path: `/${userRole}/help`,
      },
      {
        label: "About",
        icon: Info,
        path: `/${userRole}/about`,
      },
    ];
  };

  const navItems = getNavItems();
  const settingsItems = getSettingsItems();

  // Determine navigation path based on role if at root
  useEffect(() => {
    if (location.pathname === "/") {
      if (isAuthenticated) {
        navigate(`/${userRole}`);
      } else {
        navigate("/public");
      }
    }
  }, [isAuthenticated, userRole, location.pathname, navigate]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/role-selection");
    setIsDrawerOpen(false);
  };

  // Render Super Admin Header if on super admin route
  if (isSuperAdmin) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Super Admin Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30 pt-safe">
          <div className="container mx-auto flex justify-between items-center h-16 px-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Super Admin
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden sm:flex bg-green-50 text-green-700 border-green-200 px-3 py-1 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </Badge>
              
              {/* Mobile Menu Button */}
              <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80%] sm:w-[350px] pt-safe">
                  <div className="h-full flex flex-col">
                    {/* Super Admin Profile Section */}
                    <div className="flex flex-col items-center py-6 border-b">
                      <Avatar className="h-20 w-20 mb-2">
                        <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl">
                          SA
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="font-semibold text-lg">Super Admin</h2>
                      <p className="text-gray-500 text-sm">superadmin@spacemate.com</p>
                      <p className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full mt-2">
                        System Administrator
                      </p>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 py-4">
                      <ul className="space-y-1">
                        <li>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-base py-6 hover:bg-indigo-50",
                              isActive('/super-admin') 
                                ? "text-indigo-600 bg-indigo-50"
                                : "text-gray-600 hover:text-indigo-600"
                            )}
                            onClick={() => handleNavigation('/super-admin')}
                          >
                            <Shield size={18} className="mr-3" />
                            Dashboard
                          </Button>
                        </li>
                        
                        <li>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-base py-6 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={handleLogout}
                          >
                            <LogOut size={18} className="mr-3" />
                            Logout
                          </Button>
                        </li>
                      </ul>
                    </nav>

                    {/* App Info Section */}
                    <div className="pt-2 border-t">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-gray-500 hover:text-indigo-600"
                      >
                        <Info size={16} className="mr-2" />
                        About Space Mate
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-gray-500 hover:text-indigo-600"
                      >
                        <Settings size={16} className="mr-2" />
                        App Settings
                      </Button>
                      <div className="text-xs text-gray-400 mt-4 text-center pb-safe">
                        Space Mate v1.0.0
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto py-6 px-4 pb-safe">
          <Outlet />
        </main>
      </div>
    );
  }

  // Regular Layout for other routes
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b sticky top-0 z-30 shadow-sm bg-white pt-safe">
        <div className="container mx-auto flex justify-between items-center h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-hostel-primary to-hostel-secondary text-white w-10 h-10 rounded-md flex items-center justify-center font-bold text-lg">
              SM
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-hostel-primary to-hostel-secondary bg-clip-text text-transparent">
              Space Mate
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop Profile */}
            {!isMobile && isAuthenticated && currentUser && (
              <div className="hidden md:flex items-center gap-3 mr-2">
                <div className="text-right">
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">
                    {userRole === UserRole.ADMIN ? "Admin" : "Guest"}
                  </p>
                </div>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={currentUser.profileImage} />
                  <AvatarFallback className="bg-hostel-primary text-white">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative p-2 rounded-full hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px] pt-safe">
                <div className="h-full flex flex-col">
                  {/* Mobile Profile Section */}
                  {isAuthenticated && currentUser && (
                    <div className="flex items-center gap-4 p-4 border-b">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={currentUser.profileImage} />
                        <AvatarFallback className="bg-hostel-primary text-white">
                          {currentUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold">{currentUser.name}</h2>
                        <p className="text-sm text-gray-500">
                          {userRole === UserRole.ADMIN ? "Admin" : "Guest"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <nav className="flex-1 overflow-y-auto">
                    <ul className="space-y-1 p-2">
                      {navItems.map((item) => (
                        <li key={item.path}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start gap-3 py-6",
                              isActive(item.path)
                                ? "bg-hostel-primary/10 text-hostel-primary"
                                : "text-gray-600 hover:bg-gray-100"
                            )}
                            onClick={() => handleNavigation(item.path)}
                          >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                          </Button>
                        </li>
                      ))}
                    </ul>

                    {/* Settings Section */}
                    {userRole !== UserRole.PUBLIC && (
                      <>
                        <div className="px-4 py-2">
                          <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-gray-500">
                            Settings
                          </h2>
                        </div>
                        <ul className="space-y-1 p-2">
                          {settingsItems.map((item) => (
                            <li key={item.path}>
                              <Button
                                variant="ghost"
                                className={cn(
                                  "w-full justify-start gap-3 py-6",
                                  isActive(item.path)
                                    ? "bg-hostel-primary/10 text-hostel-primary"
                                    : "text-gray-600 hover:bg-gray-100"
                                )}
                                onClick={() => handleNavigation(item.path)}
                              >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </nav>

                  {/* Bottom Actions */}
                  <div className="p-4 border-t">
                    {isAuthenticated ? (
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        Logout
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => navigate("/login")}
                      >
                        Login
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto py-6 px-4 pb-safe">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg pb-safe z-30">
          <div className="grid grid-cols-5 h-16">
            {navItems.slice(0, 5).map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="lg"
                className={cn(
                  "flex flex-col items-center justify-center h-full w-full rounded-none gap-1.5 transition-all duration-200",
                  isActive(item.path)
                    ? "text-hostel-primary bg-hostel-primary/10 animate-bounce-short"
                    : "text-gray-600 hover:bg-gray-100"
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
