import { ReactNode, useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  Wrench,
  Users,
  Bell,
  Home,
  Menu,
  LogOut,
  Info,
  Settings,
  Building2,
  ChevronLeft,
  MessageSquare,
  Lock,
  HelpCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigationItems = [
  { tab: "overview", label: "Dashboard", icon: Home, path: "/warden" },
  { tab: "assets", label: "Assets", icon: Building2, path: "/warden/assets" },
  { tab: "requests", label: "Requests", icon: ClipboardList, path: "/warden/requests" },
  { tab: "maintenance", label: "Maintenance", icon: Wrench, path: "/warden/maintenance" },
  { tab: "messages", label: "Messages", icon: MessageSquare, path: "/warden/messages" },
  { tab: "notifications", label: "Notifications", icon: Bell, path: "/warden/notifications" }
];

const settingsItems = [
  { tab: "settings", label: "Settings", icon: Settings, path: "/warden/settings" },
  { tab: "security", label: "Security", icon: Lock, path: "/warden/security" },
  { tab: "help", label: "Help", icon: HelpCircle, path: "/warden/help" },
  { tab: "about", label: "About", icon: Info, path: "/warden/about" }
];

const WardenLayout = () => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after initial render to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine active tab from path
  const activeTab = navigationItems.find(item => 
    location.pathname === item.path || 
    (item.path !== '/warden' && location.pathname.startsWith(item.path))
  )?.tab || "overview";

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

  // Prevent hydration issues with SSR
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Left side */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-white border-r shadow-sm transition-all duration-300 ease-in-out z-30 fixed h-full",
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
        
        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <li key={item.tab}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start text-base py-6 flex items-center gap-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-purple-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-purple-50 hover:text-purple-700",
                      isCollapsed ? "px-2 justify-center" : "px-3"
                    )}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <div className={cn(
                      "flex items-center justify-center",
                      isActive ? "text-white" : "text-purple-600"
                    )}>
                      <Icon size={20} />
                    </div>
                    
                    {!isCollapsed && (
                      <span className="ml-3">{item.label}</span>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>

          {/* Settings Section */}
          {!isCollapsed && <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-gray-500">
              Settings
            </h2>
          </div>}
          
          <ul className="space-y-1 px-3">
            {settingsItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <li key={item.tab}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start text-base py-6 flex items-center gap-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-purple-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-purple-50 hover:text-purple-700",
                      isCollapsed ? "px-2 justify-center" : "px-3"
                    )}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <div className={cn(
                      "flex items-center justify-center",
                      isActive ? "text-white" : "text-purple-600"
                    )}>
                      <Icon size={20} />
                    </div>
                    
                    {!isCollapsed && (
                      <span className="ml-3">{item.label}</span>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile & Logout */}
        <div className={cn(
          "border-t mt-auto",
          isCollapsed ? "p-2" : "p-4"
        )}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10 border-2 border-purple-100 shadow-sm">
                  <AvatarImage src={currentUser?.profileImage} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    {currentUser?.name?.charAt(0) || 'W'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">{currentUser?.name || "Warden"}</span>
                  <span className="text-xs text-gray-500">Warden</span>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-base py-2 text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-3 transition-colors"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-10 w-10 border-2 border-purple-100 shadow-sm">
                <AvatarImage src={currentUser?.profileImage} />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  {currentUser?.name?.charAt(0) || 'W'}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={handleLogout}
              >
                <LogOut size={16} />
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Container */}
      <div className={cn(
        "flex flex-col flex-1 min-h-screen",
        isCollapsed ? "md:ml-20" : "md:ml-72"
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
                {navigationItems.find(item => activeTab === item.tab)?.label || "Dashboard"}
              </h2>
            </div>
            
            {/* Mobile Menu Button */}
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px] p-0">
                <div className="flex flex-col h-full">
                  {/* User Profile Section */}
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-10 h-10 rounded-md flex items-center justify-center font-bold text-lg">
                        SM
                      </div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Space Mate
                      </h1>
                    </div>
                  </div>

                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={currentUser?.profileImage} />
                        <AvatarFallback className="bg-purple-100 text-purple-600">{currentUser?.name?.charAt(0) || "W"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold text-gray-900">{currentUser?.name || "Warden"}</h2>
                        <p className="text-sm text-gray-500">Warden</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-2">
                      {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.tab;
                        return (
                          <li key={item.tab}>
                            <Button
                              variant={isActive ? "default" : "ghost"}
                              className={cn(
                                "w-full justify-start text-base py-3 flex items-center gap-3 rounded-lg transition-colors",
                                isActive
                                  ? "bg-purple-600 text-white shadow-md"
                                  : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                              )}
                              onClick={() => handleNavigation(item.path)}
                            >
                              <Icon size={20} className="mr-2" />
                              {item.label}
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>

                  {/* App Info Section */}
                  <div className="p-4 border-t">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-500 hover:text-purple-600 flex items-center gap-2"
                    >
                      <Info size={18} className="mr-2" />
                      About Space Mate
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-500 hover:text-purple-600 flex items-center gap-2"
                    >
                      <Settings size={18} className="mr-2" />
                      App Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start mt-4 text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} className="mr-2" />
                      Logout
                    </Button>
                    <div className="text-xs text-gray-400 mt-4 text-center">
                      Space Mate v1.0.0
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
            <div className="grid grid-cols-5 h-16">
              {navigationItems.slice(0, 5).map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 transition-colors",
                      isActive 
                        ? "text-purple-600 relative after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-0.5 after:bg-purple-600" 
                        : "text-gray-500"
                    )}
                  >
                    <Icon size={20} />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WardenLayout; 