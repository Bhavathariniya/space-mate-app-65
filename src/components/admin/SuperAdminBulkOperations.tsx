import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Send, UserPlus, MessageSquareText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const initialManagers = [
  { id: "m1", name: "Rajesh Kumar", email: "rajesh@pgowner.com" },
  { id: "m2", name: "Priya Sharma", email: "priya@hostels.com" },
  { id: "m3", name: "Amit Patel", email: "amit@pgmanagement.com" },
];
const initialWardens = [
  { id: "w1", name: "Suresh Warden", email: "suresh.warden@pg.com" },
  { id: "w2", name: "Meena Warden", email: "meena.warden@pg.com" },
  { id: "w3", name: "John Warden", email: "john.warden@pg.com" },
];

const SuperAdminBulkOperations = () => {
  const { toast } = useToast();
  const [managers, setManagers] = useState(initialManagers);
  const [wardens, setWardens] = useState(initialWardens);
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [selectedWardens, setSelectedWardens] = useState<string[]>([]);
  const [managerMessage, setManagerMessage] = useState("");
  const [wardenMessage, setWardenMessage] = useState("");
  const [managerSubject, setManagerSubject] = useState("");
  const [wardenSubject, setWardenSubject] = useState("");
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showWardenModal, setShowWardenModal] = useState(false);
  const [newManager, setNewManager] = useState({ name: "", email: "" });
  const [newWarden, setNewWarden] = useState({ name: "", email: "" });

  const handleSendMessage = (type: 'manager' | 'warden') => {
    const selectedUsers = type === 'manager' ? selectedManagers : selectedWardens;
    const message = type === 'manager' ? managerMessage : wardenMessage;
    const subject = type === 'manager' ? managerSubject : wardenSubject;

    if (selectedUsers.length === 0 || !message) {
      toast({
        title: "Error",
        description: "Please select users and type a message.",
        variant: "destructive",
      });
      return;
    }

    // Simulate sending message
    console.log(`Sending message to ${type}s:`, { selectedUsers, subject, message });

    toast({
      title: "Success",
      description: `Intimation sent to ${selectedUsers.length} selected ${type}s!`, 
    });

    if (type === 'manager') {
      setSelectedManagers([]);
      setManagerMessage("");
      setManagerSubject("");
    } else {
      setSelectedWardens([]);
      setWardenMessage("");
      setWardenSubject("");
    }
  };

  const handleCreateManager = () => {
    if (!newManager.name || !newManager.email) {
      toast({
        title: "Error",
        description: "Please fill in manager name and email.",
        variant: "destructive",
      });
      return;
    }
    setManagers(prev => [...prev, { ...newManager, id: `m${prev.length + 1}` }]);
    setNewManager({ name: "", email: "" });
    setShowManagerModal(false);
    toast({
      title: "Success",
      description: `New manager ${newManager.name} created!`, 
    });
  };

  const handleCreateWarden = () => {
    if (!newWarden.name || !newWarden.email) {
      toast({
        title: "Error",
        description: "Please fill in warden name and email.",
        variant: "destructive",
      });
      return;
    }
    setWardens(prev => [...prev, { ...newWarden, id: `w${prev.length + 1}` }]);
    setNewWarden({ name: "", email: "" });
    setShowWardenModal(false);
    toast({
      title: "Success",
      description: `New warden ${newWarden.name} created!`, 
    });
  };

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6 text-center lg:text-left">
        <h2 className="text-3xl font-bold text-slate-800">Admin Operations</h2>
        <p className="text-slate-600">Send intimations and manage personnel roles within the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PG Manager Operations */}
        <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-blue-800 flex items-center gap-2">
              <UserPlus className="h-6 w-6 text-blue-600" /> PG Manager
            </CardTitle>
            <Button size="sm" variant="secondary" onClick={() => setShowManagerModal(true)} className="gap-1">
              <Plus className="h-4 w-4" /> New Manager
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="select-managers" className="text-sm font-medium text-blue-700 mb-2 block">Select Managers:</Label>
              <div className="bg-white rounded-lg border max-h-52 overflow-y-auto p-3 shadow-inner">
                {managers.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">No managers found.</div>
                ) : (
                  managers.map(m => (
                    <div key={m.id} className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-md transition-colors">
                      <Checkbox
                        id={`manager-${m.id}`}
                        checked={selectedManagers.includes(m.id)}
                        onCheckedChange={(checked) => {
                          if (checked) setSelectedManagers(prev => [...prev, m.id]);
                          else setSelectedManagers(prev => prev.filter(id => id !== m.id));
                        }}
                        className="text-blue-600"
                      />
                      <Label htmlFor={`manager-${m.id}`} className="cursor-pointer flex-1">
                        <div className="font-medium text-slate-800">{m.name}</div>
                        <div className="text-sm text-slate-500">{m.email}</div>
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="manager-subject" className="text-sm font-medium text-blue-700 mb-2 block">Subject (Optional):</Label>
              <Input 
                id="manager-subject" 
                placeholder="Subject of the message" 
                value={managerSubject}
                onChange={e => setManagerSubject(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="manager-message" className="text-sm font-medium text-blue-700 mb-2 block">Message:</Label>
              <textarea
                id="manager-message"
                className="w-full p-3 border border-gray-300 rounded-lg min-h-[120px] resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-800"
                value={managerMessage}
                onChange={e => setManagerMessage(e.target.value)}
                placeholder="Type your message here..."
              />
            </div>
            <Button
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={selectedManagers.length === 0 || !managerMessage}
              onClick={() => handleSendMessage('manager')}
            >
              <Send className="h-4 w-4" /> Send Intimation ({selectedManagers.length} selected)
            </Button>
          </CardContent>
        </Card>

        {/* Warden Operations */}
        <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-purple-800 flex items-center gap-2">
              <UserPlus className="h-6 w-6 text-purple-600" /> Warden
            </CardTitle>
            <Button size="sm" variant="secondary" onClick={() => setShowWardenModal(true)} className="gap-1">
              <Plus className="h-4 w-4" /> New Warden
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="select-wardens" className="text-sm font-medium text-purple-700 mb-2 block">Select Wardens:</Label>
              <div className="bg-white rounded-lg border max-h-52 overflow-y-auto p-3 shadow-inner">
                {wardens.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">No wardens found.</div>
                ) : (
                  wardens.map(w => (
                    <div key={w.id} className="flex items-center gap-3 p-2 hover:bg-purple-50 rounded-md transition-colors">
                      <Checkbox
                        id={`warden-${w.id}`}
                        checked={selectedWardens.includes(w.id)}
                        onCheckedChange={(checked) => {
                          if (checked) setSelectedWardens(prev => [...prev, w.id]);
                          else setSelectedWardens(prev => prev.filter(id => id !== w.id));
                        }}
                        className="text-purple-600"
                      />
                      <Label htmlFor={`warden-${w.id}`} className="cursor-pointer flex-1">
                        <div className="font-medium text-slate-800">{w.name}</div>
                        <div className="text-sm text-slate-500">{w.email}</div>
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="warden-subject" className="text-sm font-medium text-purple-700 mb-2 block">Subject (Optional):</Label>
              <Input 
                id="warden-subject" 
                placeholder="Subject of the message" 
                value={wardenSubject}
                onChange={e => setWardenSubject(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="warden-message" className="text-sm font-medium text-purple-700 mb-2 block">Message:</Label>
              <textarea
                id="warden-message"
                className="w-full p-3 border border-gray-300 rounded-lg min-h-[120px] resize-y focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-slate-800"
                value={wardenMessage}
                onChange={e => setWardenMessage(e.target.value)}
                placeholder="Type your message here..."
              />
            </div>
            <Button
              className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              disabled={selectedWardens.length === 0 || !wardenMessage}
              onClick={() => handleSendMessage('warden')}
            >
              <Send className="h-4 w-4" /> Send Intimation ({selectedWardens.length} selected)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Create New Manager Modal */}
      <Dialog open={showManagerModal} onOpenChange={setShowManagerModal}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-700">
              <UserPlus className="h-5 w-5" /> Create New PG Manager
            </DialogTitle>
            <DialogDescription>Fill in the details to add a new PG Manager to the system.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="manager-name" className="text-right">Name</Label>
              <Input
                id="manager-name"
                placeholder="Manager Name"
                value={newManager.name}
                onChange={e => setNewManager({ ...newManager, name: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="manager-email" className="text-right">Email</Label>
              <Input
                id="manager-email"
                placeholder="Manager Email"
                type="email"
                value={newManager.email}
                onChange={e => setNewManager({ ...newManager, email: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManagerModal(false)}>Cancel</Button>
            <Button type="submit" onClick={handleCreateManager}>Create Manager</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Warden Modal */}
      <Dialog open={showWardenModal} onOpenChange={setShowWardenModal}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-700">
              <UserPlus className="h-5 w-5" /> Create New Warden
            </DialogTitle>
            <DialogDescription>Fill in the details to add a new Warden to the system.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="warden-name" className="text-right">Name</Label>
              <Input
                id="warden-name"
                placeholder="Warden Name"
                value={newWarden.name}
                onChange={e => setNewWarden({ ...newWarden, name: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="warden-email" className="text-right">Email</Label>
              <Input
                id="warden-email"
                placeholder="Warden Email"
                type="email"
                value={newWarden.email}
                onChange={e => setNewWarden({ ...newWarden, email: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWardenModal(false)}>Cancel</Button>
            <Button type="submit" onClick={handleCreateWarden}>Create Warden</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperAdminBulkOperations;
