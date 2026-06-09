
"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Send, 
  Paperclip, 
  Smile,
  Hash,
  Users,
  ChevronLeft,
  Circle,
  Plus
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const CHATS = [
  {
    id: "1",
    name: "Machine Learning Group",
    lastMessage: "Alex: Did anyone finish the assignment?",
    time: "10:42 AM",
    unread: 3,
    type: "academic",
    color: "bg-blue-500/20 text-blue-400",
    messages: [
      { id: "m1", sender: "Sarah Jenkins", text: "Hey everyone! The Unit 2 notes are up in the Repo.", time: "09:00 AM", isMe: false },
      { id: "m2", sender: "Michael Chen", text: "Thanks Sarah! Checking them now.", time: "09:15 AM", isMe: false },
      { id: "m3", sender: "Alex Rivera", text: "Did anyone finish the assignment?", time: "10:42 AM", isMe: true },
    ]
  },
  {
    id: "2",
    name: "Cultural Club 2025",
    lastMessage: "Planning for the fest starts tomorrow.",
    time: "Yesterday",
    unread: 0,
    type: "club",
    color: "bg-pink-500/20 text-pink-400",
    messages: [
      { id: "c1", sender: "Jordan Lee", text: "The theme for this year is Cyberpunk.", time: "04:30 PM", isMe: false },
      { id: "c2", sender: "Priya Sharma", text: "Planning for the fest starts tomorrow.", time: "Yesterday", isMe: false },
    ]
  },
  {
    id: "3",
    name: "DBMS Lab - Batch A",
    lastMessage: "Lab record submission link is open.",
    time: "Monday",
    unread: 1,
    type: "academic",
    color: "bg-emerald-500/20 text-emerald-400",
    messages: []
  },
  {
    id: "4",
    name: "Hostel Committee",
    lastMessage: "Dinner timings changed for tonight.",
    time: "2 days ago",
    unread: 0,
    type: "social",
    color: "bg-orange-500/20 text-orange-400",
    messages: []
  }
];

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageInput, setMessageInput] = useState("");

  const activeChat = useMemo(() => 
    CHATS.find(chat => chat.id === selectedChatId), 
  [selectedChatId]);

  const filteredChats = useMemo(() => 
    CHATS.filter(chat => 
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    ), 
  [searchTerm]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    setMessageInput("");
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-10rem)] overflow-hidden border border-white/10 rounded-3xl bg-white/[0.01] animate-in fade-in duration-500">
        {/* Chat List Sidebar */}
        <div className={cn(
          "flex flex-col w-full md:w-80 lg:w-96 border-r border-white/10 bg-white/[0.02]",
          selectedChatId && "hidden md:flex"
        )}>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-headline font-bold">Messages</h1>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/5">
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/5">
                  <Users className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input 
                placeholder="Search groups..." 
                className="pl-9 h-9 bg-white/5 border-white/5 rounded-xl text-xs focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="px-2 pb-4">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all group relative mb-1",
                    selectedChatId === chat.id 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "hover:bg-white/5"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold",
                    selectedChatId === chat.id ? "bg-white/20 text-white" : chat.color
                  )}>
                    {chat.name[0]}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className={cn(
                        "font-bold text-xs truncate",
                        selectedChatId === chat.id ? "text-white" : "text-foreground"
                      )}>{chat.name}</h4>
                      <span className={cn(
                        "text-[9px] whitespace-nowrap",
                        selectedChatId === chat.id ? "text-white/70" : "text-muted-foreground"
                      )}>{chat.time}</span>
                    </div>
                    <p className={cn(
                      "text-[10px] truncate leading-tight",
                      selectedChatId === chat.id ? "text-white/80" : "text-muted-foreground"
                    )}>
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && selectedChatId !== chat.id && (
                    <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-primary text-[8px] flex items-center justify-center font-bold text-white shadow-lg shadow-primary/30">
                      {chat.unread}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Conversation View */}
        <div className={cn(
          "flex-1 flex flex-col",
          !selectedChatId && "hidden md:flex items-center justify-center text-center p-12"
        )}>
          {activeChat ? (
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.03] backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden h-8 w-8 rounded-lg bg-white/5"
                    onClick={() => setSelectedChatId(null)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm", activeChat.color)}>
                    {activeChat.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs leading-tight">{activeChat.name}</h3>
                    <div className="flex items-center gap-1 text-[8px] text-green-400 font-bold uppercase tracking-[0.1em] mt-0.5">
                      <Circle className="w-1.5 h-1.5 fill-current" /> Online
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5">
                    <Phone className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5">
                    <Video className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Message List */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {activeChat.messages?.length > 0 ? (
                    activeChat.messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={cn(
                          "flex flex-col max-w-[85%] md:max-w-[70%] space-y-1",
                          msg.isMe ? "ml-auto items-end" : "items-start"
                        )}
                      >
                        {!msg.isMe && (
                          <span className="text-[9px] font-bold text-muted-foreground ml-2 uppercase tracking-widest opacity-60">
                            {msg.sender}
                          </span>
                        )}
                        <div className={cn(
                          "px-3 py-2 rounded-2xl text-[13px] shadow-sm relative",
                          msg.isMe 
                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                            : "bg-white/10 rounded-tl-none border border-white/5"
                        )}>
                          {msg.text}
                          <div className={cn(
                            "text-[7px] mt-1 font-bold uppercase opacity-60",
                            msg.isMe ? "text-right" : "text-left"
                          )}>
                            {msg.time}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-20 mt-32">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Hash className="w-6 h-6" />
                      </div>
                      <p className="text-[9px] font-bold tracking-widest uppercase">Start a Conversation</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-3 bg-white/[0.03] border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white/5 text-muted-foreground shrink-0">
                    <Paperclip className="w-3.5 h-3.5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input 
                      placeholder="Message..." 
                      className="bg-white/5 border-white/5 h-9 rounded-xl pr-9 text-xs focus:ring-primary"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full text-muted-foreground h-7 w-7"
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    className="h-9 w-9 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 flex flex-col items-center justify-center h-full text-center px-6 bg-white/[0.01]">
              <div className="w-16 h-16 rounded-[32px] bg-primary/10 flex items-center justify-center border border-primary/20 animate-float">
                <Hash className="w-8 h-8 text-primary" />
              </div>
              <div className="max-w-xs">
                <h2 className="text-lg font-headline font-bold mb-2">Campus Connect</h2>
                <p className="text-muted-foreground text-[10px] leading-relaxed">
                  Select a campus group or start a direct conversation to coordinate study sessions and events.
                </p>
              </div>
              <Button variant="outline" className="rounded-xl border-white/10 h-8 text-[10px] px-6">
                Explore Groups
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
