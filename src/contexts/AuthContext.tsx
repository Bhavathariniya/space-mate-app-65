import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole, AdminSubRole, User } from "@/types";
import { useSupabaseAuth } from "./SupabaseAuthContext";

interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole;
  adminSubRole: AdminSubRole | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole, subRole?: AdminSubRole) => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void;
  setAdminSubRole: (subRole: AdminSubRole) => void;
  updateUser: (user: User) => void;
}

interface Credentials {
  email: string;
  password: string;
}

interface AdminCredentials {
  [AdminSubRole.SUPER_ADMIN]: Credentials;
  [AdminSubRole.PG_ADMIN]: Credentials;
  [AdminSubRole.WARDEN]: Credentials;
}

interface DefaultCredentials {
  [UserRole.ADMIN]: AdminCredentials;
  [UserRole.PG_GUEST]: Credentials;
  [UserRole.PUBLIC]: Credentials;
}

// Default users for development purposes
const demoUsers = {
  superAdmin: {
    id: "super-admin-1",
    name: "Super Admin",
    email: "superadmin@test.com",
    role: UserRole.ADMIN,
    adminSubRole: AdminSubRole.SUPER_ADMIN,
    profileImage: "/placeholder.svg"
  },
  pgAdmin: {
    id: "pg-admin-1",
    name: "PG Admin",
    email: "pgadmin@test.com",
    role: UserRole.ADMIN,
    adminSubRole: AdminSubRole.PG_ADMIN,
    profileImage: "/placeholder.svg"
  },
  warden: {
    id: "warden-1",
    name: "Warden User",
    email: "warden@test.com",
    role: UserRole.ADMIN,
    adminSubRole: AdminSubRole.WARDEN,
    profileImage: "/placeholder.svg"
  },
  guest: {
    id: "guest-1",
    name: "Guest User",
    email: "guest@test.com",
    role: UserRole.PG_GUEST,
    roomNumber: "101",
    joinDate: "2023-01-01",
    endDate: "2024-01-01",
    profileImage: "/placeholder.svg"
  }
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userRole: UserRole.PUBLIC,
  adminSubRole: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  setRole: () => {},
  setAdminSubRole: () => {},
  updateUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: supabaseUser, profile, isAuthenticated: supabaseIsAuthenticated, signOut } = useSupabaseAuth();
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.PUBLIC);
  const [adminSubRole, setAdminSubRoleState] = useState<AdminSubRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Update auth state when Supabase auth changes
  useEffect(() => {
    if (supabaseUser && profile && supabaseIsAuthenticated) {
      // Map Supabase profile to our User type
      const mappedUser: User = {
        id: supabaseUser.id,
        name: profile.full_name || profile.email,
        email: profile.email,
        role: mapSupabaseRoleToUserRole(profile.role),
        adminSubRole: mapSupabaseAdminSubRole(profile.admin_sub_role),
        profileImage: profile.avatar_url || "/placeholder.svg",
        phone: profile.phone || undefined,
      };

      setCurrentUser(mappedUser);
      setUserRole(mappedUser.role);
      setAdminSubRoleState(mappedUser.adminSubRole || null);
      setIsAuthenticated(true);
    } else {
      setCurrentUser(null);
      setUserRole(UserRole.PUBLIC);
      setAdminSubRoleState(null);
      setIsAuthenticated(false);
    }
  }, [supabaseUser, profile, supabaseIsAuthenticated]);

  // Helper functions to map Supabase roles to our enum types
  const mapSupabaseRoleToUserRole = (role: string): UserRole => {
    switch (role) {
      case 'super_admin':
      case 'pg_admin':
      case 'warden':
        return UserRole.ADMIN;
      case 'guest':
        return UserRole.PG_GUEST;
      default:
        return UserRole.PUBLIC;
    }
  };

  const mapSupabaseAdminSubRole = (adminRole: string | null): AdminSubRole | undefined => {
    if (!adminRole) return undefined;
    
    switch (adminRole) {
      case 'super_admin':
        return AdminSubRole.SUPER_ADMIN;
      case 'pg_admin':
        return AdminSubRole.PG_ADMIN;
      case 'warden':
        return AdminSubRole.WARDEN;
      default:
        return undefined;
    }
  };

  // Legacy login function for backward compatibility
  const login = async (email: string, password: string, role: UserRole, adminSubRole?: AdminSubRole) => {
    // This is now handled by Supabase authentication in the Login component
    console.warn("Using deprecated login method. Please use Supabase authentication directly.");
    throw new Error("Please use the new authentication system");
  };


  const logout = async () => {
    try {
      await signOut();
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const setRole = (role: UserRole) => {
    console.log("Setting role:", role);
    setUserRole(role);
    localStorage.setItem("userRole", role);
  };

  const setAdminSubRole = (subRole: AdminSubRole) => {
    setAdminSubRoleState(subRole);
    localStorage.setItem("adminSubRole", subRole);
  };

  const updateUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole,
        adminSubRole,
        isAuthenticated,
        login,
        logout,
        setRole,
        setAdminSubRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
