
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Shield, User } from "lucide-react";
import { useEffect } from "react";

const RoleSelection = () => {
  const navigate = useNavigate();
  const { setRole } = useAuth();

  useEffect(() => {
    // Handle back button on role selection - prevent app closure
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      // Stay on role selection page instead of closing app
      window.history.pushState(null, "", "/role-selection");
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    console.log("Role selected:", role);
    setRole(role);
    
    if (role === UserRole.PUBLIC) {
      navigate("/public", { replace: true });
    } else {
      navigate("/login", { replace: false });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-hostel-light to-hostel-accent p-4 pt-safe pb-safe">
      <div className="w-full max-w-sm space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-hostel-primary to-hostel-secondary rounded-2xl mb-4 mx-auto flex items-center justify-center shadow-md">
            <img src="/placeholder.svg" alt="Logo" className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Space Mate</h1>
          <p className="text-sm text-gray-600 mb-6">Your one-stop solution for PG accommodation</p>
        </div>

        <div className="space-y-3">
          <div 
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex items-center active:scale-95"
            onClick={() => handleRoleSelect(UserRole.ADMIN)}
          >
            <div className="w-12 h-12 rounded-full bg-hostel-accent flex items-center justify-center mr-3 flex-shrink-0">
              <Shield className="text-hostel-primary w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-lg text-gray-800">Admin</h2>
              <p className="text-sm text-gray-600 truncate">Manage your hostel properties and guests</p>
            </div>
          </div>

          <div 
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex items-center active:scale-95"
            onClick={() => handleRoleSelect(UserRole.PG_GUEST)}
          >
            <div className="w-12 h-12 rounded-full bg-hostel-accent flex items-center justify-center mr-3 flex-shrink-0">
              <User className="text-hostel-primary w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-lg text-gray-800">User</h2>
              <p className="text-sm text-gray-600 truncate">Access your resident details and services</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          Find your perfect accommodation with Space Mate
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
