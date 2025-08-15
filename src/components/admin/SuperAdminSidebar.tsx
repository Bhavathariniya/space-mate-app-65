import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Shield, CreditCard, BarChart3, LineChart, Users, Activity, Settings, Info, LogOut, Send } from "lucide-react";
import { useLocation } from "react-router-dom";

interface SuperAdminSidebarProps {
  onTabChange: (tabId: string) => void;
  activeTab?: string;
}

const navigationItems = [
  { label: "Dashboard", icon: Shield, tab: "overview" },
  { label: "Subscriptions", icon: CreditCard, tab: "subscriptions" },
  { label: "Revenue", icon: BarChart3, tab: "revenue" },
  { label: "Analytics", icon: LineChart, tab: "analytics" },
  { label: "PG Admin Management", icon: Users, tab: "admins" },
  { label: "Admin Operations", icon: Send, tab: "bulk-ops" },
  { label: "Live Activity Feed", icon: Activity, tab: "activity" },
];

const SuperAdminSidebar = ({ onTabChange, activeTab }: SuperAdminSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Mock super admin data
  const superAdmin = {
    name: "Super Admin",
    email: "superadmin@spacemate.com",
    avatar: "",
    role: "System Administrator"
  };

  // Determine active tab from location hash or path (mocked for now)
  // In a real app, you might sync this with the current tab state
  // For now, highlight none as active

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="p-2 rounded-full hover:bg-slate-100"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80%] sm:w-[350px] pt-safe flex flex-col">
        {/* Profile Section */}
        <div className="flex flex-col items-center py-6 border-b">
          <Avatar className="h-20 w-20 mb-2">
            <AvatarImage src={superAdmin.avatar} alt={superAdmin.name} />
            <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl">
              SA
            </AvatarFallback>
          </Avatar>
          <h2 className="font-bold text-xl mt-2">{superAdmin.name}</h2>
          <p className="text-gray-500 text-sm">{superAdmin.email}</p>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full mt-2">{superAdmin.role}</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.tab}>
                <Button
                  variant={activeTab === item.tab ? "default" : "ghost"}
                  className={`w-full justify-start text-base py-6 flex items-center gap-3 transition-colors rounded-lg ${
                    activeTab === item.tab
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                  onClick={() => {
                    onTabChange(item.tab);
                    setIsOpen(false);
                  }}
                >
                  <item.icon size={20} className="mr-2" />
                  {item.label}
                </Button>
              </li>
            ))}
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-base py-6 text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-3"
                onClick={() => {
                  window.location.href = "/role-selection";
                  setIsOpen(false);
                }}
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </Button>
            </li>
          </ul>
        </nav>

        {/* Bottom Info Section */}
        <div className="pt-2 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-500 hover:text-indigo-600 flex items-center gap-2"
          >
            <Info size={16} className="mr-2" />
            About Space Mate
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-500 hover:text-indigo-600 flex items-center gap-2"
          >
            <Settings size={16} className="mr-2" />
            App Settings
          </Button>
          <div className="text-xs text-gray-400 mt-4 text-center pb-safe">
            Space Mate v1.0.0
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SuperAdminSidebar;