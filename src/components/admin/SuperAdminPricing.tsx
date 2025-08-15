
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Crown, Clock, Zap } from "lucide-react";

const SuperAdminPricing = () => {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="bg-white border-b border-slate-100 rounded-t-lg">
        <CardTitle className="text-xl font-semibold text-slate-900 flex items-center">
          <Zap className="h-5 w-5 mr-3 text-indigo-600" />
          Subscription Plans
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-blue-900 text-lg">Monthly Plan</h3>
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-2">₹1,000</div>
              <div className="text-blue-700 text-sm mb-3">per PG per month</div>
              <Badge className="bg-blue-200 text-blue-800 text-xs">Most Flexible</Badge>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50 relative hover:shadow-md transition-all duration-200">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-purple-600 text-white text-xs px-3 py-1">POPULAR</Badge>
            </div>
            <CardContent className="p-5 pt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-purple-900 text-lg">6-Month Plan</h3>
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-900 mb-2">₹5,500</div>
              <div className="text-purple-700 text-sm mb-3">per PG (save ₹500)</div>
              <Badge className="bg-purple-200 text-purple-800 text-xs">8% Discount</Badge>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-emerald-900 text-lg">Yearly Plan</h3>
                <Crown className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-900 mb-2">₹10,000</div>
              <div className="text-emerald-700 text-sm mb-3">per PG (save ₹2,000)</div>
              <Badge className="bg-emerald-200 text-emerald-800 text-xs">17% Discount</Badge>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 text-sm">Free Trial</h4>
                <p className="text-xs text-amber-800">2-3 months complimentary access for new PG admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default SuperAdminPricing;
