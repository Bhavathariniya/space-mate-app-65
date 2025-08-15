
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent back button on splash screen
    window.history.pushState(null, "", window.location.pathname);
    
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.pathname);
    };
    
    window.addEventListener("popstate", handlePopState);

    // Always redirect to role selection after splash screen timeout
    const timer = setTimeout(() => {
      navigate("/role-selection", { replace: true });
    }, 2500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-hostel-primary via-hostel-secondary to-hostel-tertiary text-white pt-safe pb-safe">
      <div className="animate-scale-in text-center">
        <div className="w-28 h-28 bg-white rounded-full mb-8 mx-auto flex items-center justify-center shadow-lg shadow-hostel-accent/30">
          <img src="/placeholder.svg" alt="Logo" className="w-20 h-20" />
        </div>
        <h1 className="text-4xl font-bold mb-3 tracking-wider">Space Mate</h1>
        <p className="text-hostel-accent text-lg">Your Home Away From Home</p>
        <div className="mt-10">
          <div className="w-16 h-1.5 bg-white/40 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
      <div className="absolute bottom-8 text-xs text-white/70 text-center">
        <p>© 2025 Space Mate</p>
        <p>Version 1.0.0</p>
      </div>
    </div>
  );
};

export default SplashScreen;
