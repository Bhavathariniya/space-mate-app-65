import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SupabaseAuthProvider } from "./contexts/SupabaseAuthContext";
import { UserRole, AdminSubRole } from "./types";
import { useEffect, Suspense, lazy } from "react";
import { App as CapApp } from "@capacitor/app";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load pages
const SplashScreen = lazy(() => import("./pages/SplashScreen"));
const RoleSelection = lazy(() => import("./pages/RoleSelection"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RequireAuth = lazy(() => import("./components/RequireAuth"));
const Layout = lazy(() => import("./components/Layout"));
const RealTimeDashboard = lazy(() => import("./components/RealTimeDashboard"));
const RealTimeTest = lazy(() => import("./components/RealTimeTest"));
const ComponentTest = lazy(() => import("./components/ComponentTest"));
const SuperAdminSetup = lazy(() => import("./components/SuperAdminSetup"));
const AuthTest = lazy(() => import("./components/AuthTest"));
const WardenTest = lazy(() => import("./pages/WardenTest"));
const SingleSuperAdminSetup = lazy(() => import("./pages/SingleSuperAdminSetup"));
const PGAdminLayout = lazy(() => import("./components/admin/PGAdminLayout"));
const WardenLayout = lazy(() => import("./components/admin/WardenLayout"));
const SuperAdmin = lazy(() => import("./pages/admin/SuperAdmin"));
const PGManager = lazy(() => import("./pages/admin/PGManager"));
const AddGuest = lazy(() => import("./pages/admin/AddGuest"));
const GuestsList = lazy(() => import("./pages/admin/GuestsList"));
const RoomManagement = lazy(() => import("./pages/admin/RoomManagement"));
const ServiceRequests = lazy(() => import("./pages/admin/ServiceRequests"));
const FinancialManagement = lazy(() => import("./pages/admin/FinancialManagement"));
const Notifications = lazy(() => import("./pages/admin/Notifications"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const JoiningRequests = lazy(() => import("./pages/admin/JoiningRequests"));
const FoodManagement = lazy(() => import("./pages/admin/FoodManagement"));
const SubscriptionPayment = lazy(() => import("./pages/admin/SubscriptionPayment"));
const SuperAdminSettings = lazy(() => import("./pages/admin/SuperAdminSettings"));
const PGAdminSettings = lazy(() => import("./pages/admin/PGAdminSettings"));
const PGAdminHelp = lazy(() => import("./pages/admin/PGAdminHelp"));
const PGAdminAbout = lazy(() => import("./pages/admin/PGAdminAbout"));
const Security = lazy(() => import("./pages/admin/Security"));
const Messages = lazy(() => import("./pages/admin/Messages"));
const Expenses = lazy(() => import("./pages/admin/Expenses"));

// Lazy load warden pages
const WardenDashboard = lazy(() => import("./pages/admin/WardenDashboard"));
const WardenAssets = lazy(() => import("./pages/admin/WardenAssets"));
const WardenRequests = lazy(() => import("./pages/admin/WardenRequests"));
const WardenMaintenance = lazy(() => import("./pages/admin/WardenMaintenance"));
const WardenNotifications = lazy(() => import("./pages/admin/WardenNotifications"));
const WardenSettings = lazy(() => import("./pages/admin/WardenSettings"));
const WardenHelp = lazy(() => import("./pages/admin/WardenHelp"));
const WardenAbout = lazy(() => import("./pages/admin/WardenAbout"));
const WardenSecurity = lazy(() => import("./pages/admin/WardenSecurity"));

// Lazy load guest pages
const GuestRooms = lazy(() => import("./pages/guest/Rooms"));
const GuestMeals = lazy(() => import("./pages/guest/Meals"));
const GuestNotifications = lazy(() => import("./pages/guest/Notifications"));
const GuestProfile = lazy(() => import("./pages/guest/Profile"));
const GuestIndex = lazy(() => import("./pages/guest/Index"));
const GuestSettings = lazy(() => import("./pages/guest/Settings"));
const GuestHelp = lazy(() => import("./pages/guest/Help"));
const GuestAbout = lazy(() => import("./pages/guest/About"));

// Lazy load public pages
const PublicRooms = lazy(() => import("./pages/public/Rooms"));
const RoomDetails = lazy(() => import("./pages/public/RoomDetails"));
const BookingForm = lazy(() => import("./pages/public/BookingForm"));
const Payment = lazy(() => import("./pages/public/Payment"));

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Warden protection component
const RequireWarden = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, userRole, adminSubRole } = useAuth();
  
  console.log("RequireWarden check - isAuthenticated:", isAuthenticated, "userRole:", userRole, "adminSubRole:", adminSubRole);
  
  if (!isAuthenticated || userRole !== UserRole.ADMIN || adminSubRole !== AdminSubRole.WARDEN) {
    console.error("Warden access denied - isAuthenticated:", isAuthenticated, "userRole:", userRole, "adminSubRole:", adminSubRole);
    return <Navigate to="/role-selection" replace />;
  }
  
  return children;
};

const queryClient = new QueryClient();

// Capacitor Android back button handler
const CapacitorBackHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let removeListener: (() => void) | undefined;
    (async () => {
      const handler = await CapApp.addListener("backButton", () => {
        if (location.pathname !== "/" && location.pathname !== "/role-selection") {
          navigate(-1);
        } else {
          CapApp.exitApp();
        }
      });
      removeListener = handler.remove;
    })();
    return () => {
      if (removeListener) removeListener();
    };
  }, [location, navigate]);
  return null;
};

// Super Admin protection component
const RequireSuperAdmin = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, userRole, adminSubRole } = useAuth();
  
  console.log("RequireSuperAdmin check - isAuthenticated:", isAuthenticated, "userRole:", userRole, "adminSubRole:", adminSubRole);
  
  if (!isAuthenticated || userRole !== UserRole.ADMIN || adminSubRole !== AdminSubRole.SUPER_ADMIN) {
    console.error("Super Admin access denied - isAuthenticated:", isAuthenticated, "userRole:", userRole, "adminSubRole:", adminSubRole);
    return <Navigate to="/role-selection" replace />;
  }
  
  return children;
};

// PG Manager protection component
const RequirePGManager = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, userRole, adminSubRole } = useAuth();
  
  console.log("RequirePGManager check - isAuthenticated:", isAuthenticated, "userRole:", userRole, "adminSubRole:", adminSubRole);
  
  if (!isAuthenticated || userRole !== UserRole.ADMIN || adminSubRole !== AdminSubRole.PG_ADMIN) {
    console.error("PG Manager access denied - isAuthenticated:", isAuthenticated, "userRole:", userRole, "adminSubRole:", adminSubRole);
    return <Navigate to="/role-selection" replace />;
  }
  
  return children;
};

const AppRoutes = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <CapacitorBackHandler />
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/realtime-demo" element={<RealTimeDashboard />} />
        <Route path="/realtime-test" element={<RealTimeTest />} />
        <Route path="/component-test" element={<ComponentTest />} />
        <Route path="/super-admin-setup" element={<SuperAdminSetup />} />
                      <Route path="/auth-test" element={<AuthTest />} />
              <Route path="/warden-test" element={<WardenTest />} />
              <Route path="/single-super-admin-setup" element={<SingleSuperAdminSetup />} />

              {/* Super Admin Route */}
        <Route path="/super-admin" element={
          <RequireSuperAdmin>
            <SuperAdmin />
          </RequireSuperAdmin>
        } />
        <Route path="/super-admin/settings" element={
          <RequireSuperAdmin>
            <SuperAdminSettings />
          </RequireSuperAdmin>
        } />

        {/* PG Manager Routes */}
        <Route path="/pg-admin" element={<PGAdminLayout />}>
          <Route index element={<PGManager />} />
          <Route path="residents/requests" element={<JoiningRequests />} />
          <Route path="residents" element={<GuestsList />} />
          <Route path="rooms" element={<RoomManagement />} />
          <Route path="food" element={<FoodManagement />} />
          <Route path="requests" element={<ServiceRequests />} />
          <Route path="payments" element={<FinancialManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<PGAdminSettings />} />
          <Route path="help" element={<PGAdminHelp />} />
          <Route path="about" element={<PGAdminAbout />} />
          <Route path="security" element={<Security />} />
          <Route path="messages" element={<Messages />} />
          <Route path="expenses" element={<Expenses />} />
        </Route>

        {/* Guest Routes */}
        <Route path="/guest" element={
          <RequireAuth allowedRole={UserRole.PG_GUEST}>
            <Layout />
          </RequireAuth>
        }>
          <Route index element={<GuestIndex />} />
          <Route path="rooms" element={<GuestRooms />} />
          <Route path="meals" element={<GuestMeals />} />
          <Route path="notifications" element={<GuestNotifications />} />
          <Route path="profile" element={<GuestProfile />} />
          <Route path="settings" element={<GuestSettings />} />
          <Route path="help" element={<GuestHelp />} />
          <Route path="about" element={<GuestAbout />} />
        </Route>

        {/* Public Routes */}
        <Route path="/public" element={<Layout />}>
          <Route path="rooms" element={<PublicRooms />} />
          <Route path="rooms/:id" element={<RoomDetails />} />
          <Route path="booking/:id" element={<BookingForm />} />
          <Route path="payment/:id" element={<Payment />} />
        </Route>

        {/* Warden Routes */}
        <Route path="/warden" element={<RequireWarden><WardenLayout /></RequireWarden>}>
          <Route index element={<WardenDashboard />} />
          <Route path="assets" element={<WardenAssets />} />
          <Route path="requests" element={<WardenRequests />} />
          <Route path="maintenance" element={<WardenMaintenance />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<WardenNotifications />} />
          <Route path="settings" element={<WardenSettings />} />
          <Route path="security" element={<WardenSecurity />} />
          <Route path="help" element={<WardenHelp />} />
          <Route path="about" element={<WardenAbout />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SupabaseAuthProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <div className="overflow-x-hidden">
              <AppRoutes />
            </div>
          </AuthProvider>
        </SupabaseAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
