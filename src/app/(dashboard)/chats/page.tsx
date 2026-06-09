
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
  const [selectedChatId, setSelectedChatId] = useState<string | null>("1");
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
      <div className="flex h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] border border-white/10 rounded-[32px] overflow-hidden bg-white/[0.02] animate-in fade-in duration-500">
        {/* Chat List Sidebar */}
        <div className={cn(
          "flex flex-col w-full md:w-80 lg:w-96 border-r border-white/5 bg-white/[0.01]",
          selectedChatId && "hidden md:flex"
        )}>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-headline font-bold">Messages</h1>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-xl bg-white/5">
                  <Plus className="w-5 h-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl bg-white/5">
                  <Users className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search groups or people..." 
                className="pl-10 h-11 bg-white/5 border-white/10 rounded-2xl focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1 pb-6">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative",
                    selectedChatId === chat.id 
                      ? "bg-primary/20 text-white shadow-sm" 
                      : "hover:bg-white/5"
                  )}
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-bold text-lg", chat.color)}>
                    {chat.name[0]}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm truncate">{chat.name}</h4>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{chat.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate leading-tight">
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="absolute bottom-4 right-4 w-5 h-5 rounded-lg bg-primary text-[10px] flex items-center justify-center font-bold text-white shadow-lg shadow-primary/30">
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
          "flex-1 flex flex-col relative",
          !selectedChatId && "hidden md:flex items-center justify-center text-center p-12 bg-white/[0.01]"
        )}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01] backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden rounded-xl bg-white/5"
                    onClick={() => setSelectedChatId(null)}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-bold", activeChat.color)}>
                    {activeChat.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-base leading-tight">{activeChat.name}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-bold uppercase tracking-[0.2em] mt-1">
                      <Circle className="w-2 h-2 fill-current" /> Active Now
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-xl bg-white/5 text-muted-foreground hover:text-white">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-xl bg-white/5 text-muted-foreground hover:text-white">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-xl bg-white/5 text-muted-foreground hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Message List */}
              <ScrollArea className="flex-1 p-6 bg-transparent">
                <div className="space-y-6">
                  {activeChat.messages?.length > 0 ? (
                    activeChat.messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={cn(
                          "flex flex-col max-w-[85%] md:max-w-[70%] space-y-1.5",
                          msg.isMe ? "ml-auto items-end" : "items-start"
                        )}
                      >
                        {!msg.isMe && (
                          <span className="text-[10px] font-bold text-muted-foreground ml-2 uppercase tracking-widest opacity-60">
                            {msg.sender}
                          </span>
                        )}
                        <div className={cn(
                          "px-5 py-3 rounded-[24px] text-sm shadow-sm relative",
                          msg.isMe 
                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                            : "bg-white/10 rounded-tl-none"
                        )}>
                          {msg.text}
                          <div className={cn(
                            "text-[8px] mt-1.5 font-bold uppercase opacity-60",
                            msg.isMe ? "text-right" : "text-left"
                          )}>
                            {msg.time}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-20 mt-32">
                      <div className="w-20 h-20 rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center">
                        <Hash className="w-10 h-10" />
                      </div>
                      <p className="text-sm font-bold tracking-widest uppercase">Encryption Active</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-6 bg-white/[0.01] border-t border-white/5">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="rounded-2xl bg-white/5 text-muted-foreground shrink-0 w-12 h-12">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 relative group">
                    <Input 
                      placeholder="Type a message..." 
                      className="bg-white/5 border-white/10 h-14 rounded-3xl pr-14 focus:ring-primary focus:border-primary/50 transition-all"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity"
                    >
                      <Smile className="w-6 h-6" />
                    </Button>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    className="h-14 w-14 rounded-[28px] bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all shrink-0"
                  >
                    <Send className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6 flex flex-col items-center justify-center h-full px-6">
              <div className="w-24 h-24 rounded-[48px] bg-primary/10 flex items-center justify-center border border-primary/20 animate-float">
                <Hash className="w-12 h-12 text-primary" />
              </div>
              <div className="max-w-xs text-center">
                <h2 className="text-2xl font-headline font-bold mb-2">Connect with Peers</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Select a campus group or start a direct conversation to coordinate study sessions and events.
                </p>
              </div>
              <Button variant="outline" className="rounded-2xl border-white/10 glass">
                Explore Groups
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
