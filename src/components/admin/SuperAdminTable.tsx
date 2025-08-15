
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PGAdmin } from "@/hooks/usePGAdmins";

interface SuperAdminTableProps {
  pgAdmins: PGAdmin[];
  isLoading: boolean;
}

const SuperAdminTable = ({ pgAdmins, isLoading }: SuperAdminTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-700 font-medium">Active</Badge>;
      case "free":
        return <Badge className="bg-blue-100 text-blue-700 font-medium">Free Trial</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-700 font-medium">Expired</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 font-medium">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="hidden lg:block">
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-white border-b border-slate-100 rounded-t-lg">
          <CardTitle className="text-xl font-semibold text-slate-900">Detailed Admin Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Admin Details</TableHead>
                    <TableHead className="font-semibold text-slate-700">Common ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">Properties</TableHead>
                    <TableHead className="font-semibold text-slate-700">Subscription</TableHead>
                    <TableHead className="font-semibold text-slate-700">Revenue</TableHead>
                    <TableHead className="font-semibold text-slate-700">Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pgAdmins.map((admin) => (
                    <TableRow key={admin.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {admin.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{admin.name}</div>
                            <div className="text-sm text-slate-500">{admin.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-300 text-slate-700">{admin.commonId}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-semibold text-slate-900">
                            {admin.totalPGs} / <span className="text-emerald-600">{admin.activePGs}</span>
                          </div>
                          <div className="text-xs text-slate-500">Total / Active</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(admin.subscriptionStatus)}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-emerald-600 text-lg">
                          ₹{admin.monthlyRevenue.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">per month</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-600">
                          {new Date(admin.lastActive).toLocaleDateString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminTable;
