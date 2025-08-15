import { AdminSubRole } from "@/types";
import { Shield, Users, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AdminSubRoleSelectionProps {
  onSubRoleSelect: (subRole: AdminSubRole) => void;
  onBack: () => void;
}

const AdminSubRoleSelection = ({ onSubRoleSelect, onBack }: AdminSubRoleSelectionProps) => {
  const subRoles = [
    {
      id: AdminSubRole.SUPER_ADMIN,
      title: "Super Admin",
      description: "Application owner with monetization access and PG oversight",
      icon: Shield,
      details: "Monitor PG operations, access analytics, and manage application monetization"
    },
    {
      id: AdminSubRole.PG_ADMIN,
      title: "PG Admin", 
      description: "Full PG management with complete administrative control",
      icon: Users,
      details: "Manage bookings, assets, staff, and all PG operations"
    },
    {
      id: AdminSubRole.WARDEN,
      title: "Warden",
      description: "Limited access for day-to-day PG maintenance tasks",
      icon: UserCheck,
      details: "Update asset details and assist with basic PG operations"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-2xl animate-fade-in shadow-xl border-hostel-accent/30">
        <CardHeader className="space-y-1 text-center bg-gradient-to-r from-hostel-primary to-hostel-secondary text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Select Your Admin Role</CardTitle>
          <CardDescription className="text-hostel-accent">
            Choose your specific administrative access level
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            {subRoles.map((subRole) => {
              const IconComponent = subRole.icon;
              return (
                <div
                  key={subRole.id}
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex items-start space-x-4"
                  onClick={() => onSubRoleSelect(subRole.id)}
                >
                  <div className="w-12 h-12 rounded-full bg-hostel-accent flex items-center justify-center flex-shrink-0 mt-1">
                    <IconComponent className="text-hostel-primary w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">{subRole.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{subRole.description}</p>
                    <p className="text-xs text-gray-500">{subRole.details}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-6">
            <button
              type="button"
              className="text-sm text-hostel-primary hover:text-hostel-secondary underline transition-colors"
              onClick={onBack}
            >
              Back to Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubRoleSelection;
