import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Send, 
  Search, 
  Users, 
  Star,
  Phone,
  Video,
  Image as ImageIcon,
  Paperclip,
  MoreVertical,
  CheckCheck
} from 'lucide-react';

const Messages = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "John Doe",
      avatar: "",
      lastMessage: "When will the AC repair be done?",
      time: "2m ago",
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "",
      lastMessage: "Thank you for the quick response",
      time: "1h ago",
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "",
      lastMessage: "Is the wifi working now?",
      time: "2h ago",
      unread: 1,
      online: true
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "John Doe",
      content: "When will the AC repair be done?",
      time: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      sender: "Admin",
      content: "The technician will arrive by 2 PM today.",
      time: "10:32 AM",
      isOwn: true
    },
    {
      id: 3,
      sender: "John Doe",
      content: "Okay, thank you. Please make sure they bring the necessary parts.",
      time: "10:33 AM",
      isOwn: false
    },
    {
      id: 4,
      sender: "Admin",
      content: "Yes, I've already informed them about the requirements.",
      time: "10:35 AM",
      isOwn: true
    }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add message handling logic here
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully.",
    });
    setNewMessage("");
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Conversations List */}
      <Card className="w-full md:w-80 flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              Messages
            </CardTitle>
            <Badge variant="outline" className="bg-purple-100 text-purple-600">
              3 unread
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all" onClick={() => setActiveTab("all")}>All</TabsTrigger>
            <TabsTrigger value="unread" onClick={() => setActiveTab("unread")}>Unread</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="space-y-2 p-4">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conversation.name}</p>
                      <span className="text-xs text-gray-500">{conversation.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <Badge className="bg-purple-600">{conversation.unread}</Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>John Doe</CardTitle>
                <CardDescription>Room 101 • Online</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4 overflow-auto">
          <ScrollArea className="h-[calc(100vh-24rem)]">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.isOwn
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                      message.isOwn ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      <span>{message.time}</span>
                      {message.isOwn && <CheckCheck className="h-4 w-4" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Messages; 