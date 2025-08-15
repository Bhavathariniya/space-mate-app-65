
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  User,
  Building2,
  CreditCard,
  Activity,
  Mail,
  Phone,
  Calendar,
  IndianRupee,
  MapPin,
  Save,
  Edit,
} from "lucide-react";
import { PGAdmin } from "@/hooks/usePGAdmins";
import { useToast } from "@/hooks/use-toast";

interface AdminDetailModalProps {
  admin: PGAdmin | null;
  isOpen: boolean;
  onClose: () => void;
}

const AdminDetailModal = ({ admin, isOpen, onClose }: AdminDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAdmin, setEditedAdmin] = useState<PGAdmin | null>(admin);
  const { toast } = useToast();

  if (!admin) return null;

  const handleSave = () => {
    if (!editedAdmin) return;
    
    console.log("Saving admin details:", editedAdmin);
    toast({
      title: "Admin Updated",
      description: "Admin details have been successfully updated.",
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "free": return "bg-blue-100 text-blue-800";
      case "expired": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Mock additional data that would come from API
  const additionalData = {
    phone: "+91 98765 43210",
    address: "123 Business District, Mumbai, Maharashtra",
    joinDate: "2024-01-15",
    lastLogin: "2024-06-08 14:30",
    paymentHistory: [
      { date: "2024-06-01", amount: 1000, status: "paid", plan: "Monthly" },
      { date: "2024-05-01", amount: 1000, status: "paid", plan: "Monthly" },
      { date: "2024-04-01", amount: 1000, status: "paid", plan: "Monthly" },
    ],
    properties: [
      { id: "PG001A", name: "Sunrise PG", rooms: 20, occupied: 18 },
      { id: "PG001B", name: "Moonlight PG", rooms: 15, occupied: 12 },
      { id: "PG001C", name: "Garden View PG", rooms: 25, occupied: 22 },
    ],
    activityLog: [
      { date: "2024-06-08", action: "Updated room pricing", details: "Changed monthly rent for Room 101" },
      { date: "2024-06-07", action: "Added new tenant", details: "Registered new tenant in Room 205" },
      { date: "2024-06-06", action: "Payment received", details: "Monthly subscription payment processed" },
    ]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                {admin.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{admin.name}</h2>
                <p className="text-sm text-gray-600">{admin.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editedAdmin?.name || ""}
                          onChange={(e) => setEditedAdmin(prev => prev ? {...prev, name: e.target.value} : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={editedAdmin?.email || ""}
                          onChange={(e) => setEditedAdmin(prev => prev ? {...prev, email: e.target.value} : null)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{admin.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{additionalData.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{additionalData.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Joined: {additionalData.joinDate}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Subscription Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge className={getStatusColor(admin.subscriptionStatus)}>
                      {admin.subscriptionStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Plan:</span>
                    <span className="text-sm">{admin.subscriptionTier || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Monthly Revenue:</span>
                    <span className="text-sm font-semibold text-green-600">₹{admin.monthlyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Properties:</span>
                    <span className="text-sm">{admin.totalPGs} total, {admin.activePGs} active</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="space-y-4">
            <div className="grid gap-4">
              {additionalData.properties.map((property) => (
                <Card key={property.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-8 w-8 text-indigo-600" />
                        <div>
                          <h3 className="font-semibold">{property.name}</h3>
                          <p className="text-sm text-gray-600">ID: {property.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{property.occupied}/{property.rooms}</div>
                        <div className="text-sm text-gray-600">Occupancy</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <div className="space-y-3">
              {additionalData.paymentHistory.map((payment, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IndianRupee className="h-8 w-8 text-green-600" />
                        <div>
                          <h3 className="font-semibold">₹{payment.amount.toLocaleString()}</h3>
                          <p className="text-sm text-gray-600">{payment.plan} Plan</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {payment.status}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">{payment.date}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <div className="space-y-3">
              {additionalData.activityLog.map((activity, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Activity className="h-5 w-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{activity.action}</h3>
                        <p className="text-sm text-gray-600">{activity.details}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Account Status</span>
                  <Button variant="outline" size="sm">
                    {admin.subscriptionStatus === 'active' ? 'Suspend' : 'Activate'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Send Notifications</span>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Reset Password</span>
                  <Button variant="outline" size="sm">Send Reset Link</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {isEditing && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminDetailModal;
