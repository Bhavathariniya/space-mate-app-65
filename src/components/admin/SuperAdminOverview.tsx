import { AdminStats } from "@/hooks/usePGAdmins";
import SuperAdminMetrics from "./SuperAdminMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Users, 
  CreditCard, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Building2, 
  DollarSign,
  ArrowRight,
  Zap,
  Target,
  Globe,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SuperAdminOverviewProps {
  stats: AdminStats;
  isLoading?: boolean;
  onTabChange: (tab: string) => void;
}

const SuperAdminOverview = ({ stats, isLoading, onTabChange }: SuperAdminOverviewProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && !isPaused) {
      autoScrollInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % 4);
      }, 3000); // Change slide every 3 seconds
    }

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [isMobile, isPaused]);

  const nextSlide = () => {
    if (carouselRef.current) {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }
  };

  const prevSlide = () => {
    if (carouselRef.current) {
      setCurrentSlide((prev) => (prev - 1 + 4) % 4);
    }
  };

  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    // Resume auto-scrolling after 2 seconds of no touch
    setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  const renderCard = (type: 'quick-actions' | 'system-health' | 'alerts' | 'subscription') => {
    switch (type) {
      case 'quick-actions':
        return (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300 group h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-800 text-lg font-bold flex items-center gap-2">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-between text-blue-700 hover:text-blue-900 hover:bg-blue-100 p-4 h-auto group/btn"
                onClick={() => onTabChange("subscriptions")}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">Recent Subscriptions</span>
                </div>
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-between text-blue-700 hover:text-blue-900 hover:bg-blue-100 p-4 h-auto group/btn"
                onClick={() => onTabChange("revenue")}
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-medium">Revenue Report</span>
                </div>
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-between text-blue-700 hover:text-blue-900 hover:bg-blue-100 p-4 h-auto group/btn"
                onClick={() => onTabChange("admins")}
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Manage Admins</span>
                </div>
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        );

      case 'system-health':
        return (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-800 text-lg font-bold flex items-center gap-2">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                <span className="text-green-700 font-medium">API Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-bold text-sm">Online</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                <span className="text-green-700 font-medium">Database</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-bold text-sm">Healthy</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                <span className="text-green-700 font-medium">Uptime</span>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-bold text-sm">99.9%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'alerts':
        return (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-xl transition-all duration-300 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-800 text-lg font-bold flex items-center gap-2">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                Alerts & Warnings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-orange-50/50 rounded-lg">
                <span className="text-orange-700 font-medium">New Issues</span>
                <span className="text-orange-600 font-bold text-sm">2</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50/50 rounded-lg">
                <span className="text-orange-700 font-medium">Pending Actions</span>
                <span className="text-orange-600 font-bold text-sm">5</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-between text-orange-700 hover:text-orange-900 hover:bg-orange-100 p-4 h-auto group/btn"
                onClick={() => onTabChange("activity")}
              >
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5" />
                  <span className="font-medium">View Activity Log</span>
                </div>
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        );

      case 'subscription':
        return (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-pink-50 hover:shadow-xl transition-all duration-300 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-rose-800 text-lg font-bold flex items-center gap-2">
                <div className="p-2 bg-rose-500 rounded-lg">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                Subscription Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-rose-50/50 rounded-lg">
                <span className="text-rose-700 font-medium">Expired This Month</span>
                <span className="text-rose-600 font-bold text-sm">{stats.expiredSubscriptions}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-rose-50/50 rounded-lg">
                <span className="text-rose-700 font-medium">Cancellations</span>
                <span className="text-rose-600 font-bold text-sm">{stats.cancellations}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-between text-rose-700 hover:text-rose-900 hover:bg-rose-100 p-4 h-auto group/btn"
                onClick={() => onTabChange("subscriptions")}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">Manage Subscriptions</span>
                </div>
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-8">
      <SuperAdminMetrics stats={stats} isLoading={isLoading} />
      
      {/* Desktop View - 2x2 Grid */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        {renderCard('quick-actions')}
        {renderCard('system-health')}
        {renderCard('alerts')}
        {renderCard('subscription')}
      </div>

      {/* Mobile View - Carousel */}
      <div className="md:hidden relative">
        <div 
          ref={carouselRef}
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            <div className="min-w-full">
              {renderCard('quick-actions')}
            </div>
            <div className="min-w-full">
              {renderCard('system-health')}
            </div>
            <div className="min-w-full">
              {renderCard('alerts')}
            </div>
            <div className="min-w-full">
              {renderCard('subscription')}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mt-2">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentSlide === index ? "bg-primary" : "bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminOverview;
