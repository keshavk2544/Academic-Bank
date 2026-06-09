
"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Plus, 
  Hash, 
  ChevronLeft, 
  Send, 
  Paperclip, 
  Mic, 
  Smile,
  MoreVertical,
  Users,
  Bell,
  Download,
  Pin,
  Phone,
  CheckCheck,
  FileText,
  MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"

const academicGroups = [
  { id: 'cn', name: "CN Group", lastMsg: "Aman: Notes uploaded for Unit 3 – Check it out!", time: "9:30 AM", unread: 24, color: "bg-blue-500", icon: Users },
  { id: 'java', name: "Java Programming", lastMsg: "Riya: Can anyone explain this question?", time: "9:18 AM", unread: 5, color: "bg-orange-500", icon: Bell },
  { id: 'dbms', name: "DBMS Group", lastMsg: "Yash: Here is the ER Diagram for the project", time: "8:57 AM", unread: 2, color: "bg-emerald-500", icon: Hash },
  { id: 'cse', name: "Unofficial CSE Group", lastMsg: "Karan: Meme battle tonight 🔥", time: "8:45 AM", unread: 102, color: "bg-purple-500", icon: Users },
  { id: 'sec6', name: "Section 6", lastMsg: "Neha: We have a surprise for tomorrow 😊", time: "Yesterday", unread: 14, color: "bg-teal-500", icon: Users },
  { id: 'placement', name: "Placement Cell", lastMsg: "Placement Team: New drive from Microsoft", time: "Yesterday", unread: 3, color: "bg-pink-500", icon: FileText },
  { id: 'oop', name: "OOP with C++", lastMsg: "Prof. Sharma: Class test on Saturday", time: "Mon", unread: 7, color: "bg-indigo-500", icon: MessageSquare },
]

const clubs = [
  { id: 'coding', name: "Coding Club", lastMsg: "Rahul: Hackathon registrations are open!", time: "9:25 AM", unread: 8, color: "bg-green-500", icon: Hash },
  { id: 'photo', name: "Photography Club", lastMsg: "Meera: Check out this click 📸", time: "Yesterday", unread: 3, color: "bg-purple-500", icon: Bell },
  { id: 'drama', name: "Drama Club", lastMsg: "We're finalizing the script for the event.", time: "Yesterday", unread: 6, color: "bg-amber-500", icon: Users },
]

const directMessages = [
  { id: 'aman', name: "Aman Verma", lastMsg: "See you in the library!", time: "9:40 AM", unread: 1, avatar: "A" },
  { id: 'riya', name: "Riya Singh", lastMsg: "Thanks for the help! 😊", time: "9:15 AM", unread: 0, avatar: "R" },
  { id: 'prof', name: "Prof. Sharma", lastMsg: "Don't forget the assignment.", time: "Yesterday", unread: 2, avatar: "P" },
]

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("academics")

  const currentChat = selectedChat ? [...academicGroups, ...clubs, ...directMessages].find(c => c.id === selectedChat) : null

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-120px)] gap-6 animate-in fade-in duration-500 overflow-hidden">
        
        {/* Chat List Sidebar */}
        <div className={cn(
          "w-full lg:w-[400px] flex flex-col gap-4 transition-all duration-300",
          selectedChat && "hidden lg:flex"
        )}>
          <div className="flex items-center justify-between px-2">
            <h1 className="text-3xl font-headline font-bold">Chats</h1>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-xl hover:bg-white/5 transition-colors"><Search className="w-5 h-5" /></button>
              <button className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <Tabs defaultValue="academics" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full bg-white/5 border border-white/10 p-1 rounded-2xl h-12">
              <TabsTrigger value="academics" className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                <LibraryIcon className="w-4 h-4" /> Academics
              </TabsTrigger>
              <TabsTrigger value="clubs" className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                <Users className="w-4 h-4" /> Clubs
              </TabsTrigger>
              <TabsTrigger value="direct" className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                <UserIcon className="w-4 h-4" /> Direct
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2">
              <TabsContent value="academics" className="m-0 space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2">Academic Groups</p>
                {academicGroups.map((group) => (
                  <ChatItem key={group.id} item={group} onClick={() => setSelectedChat(group.id)} isActive={selectedChat === group.id} />
                ))}
              </TabsContent>
              <TabsContent value="clubs" className="m-0 space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2">Clubs</p>
                {clubs.map((club) => (
                  <ChatItem key={club.id} item={club} onClick={() => setSelectedChat(club.id)} isActive={selectedChat === club.id} />
                ))}
              </TabsContent>
              <TabsContent value="direct" className="m-0 space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2">Direct Messages</p>
                {directMessages.map((dm) => (
                  <ChatItem key={dm.id} item={dm} onClick={() => setSelectedChat(dm.id)} isActive={selectedChat === dm.id} />
                ))}
              </TabsContent>
            </div>
          </Tabs>

          <div className="mt-auto px-2 pb-2">
            <button className="w-full flex items-center justify-between p-4 rounded-[24px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <ZapIcon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-bold">Stay updated with your academic groups</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Chat Window */}
        <div className={cn(
          "flex-1 flex flex-col glass rounded-[32px] overflow-hidden relative border-white/10 transition-all duration-300",
          !selectedChat && "hidden lg:flex items-center justify-center bg-white/[0.02]"
        )}>
          {selectedChat ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedChat(null)} className="lg:hidden p-2 hover:bg-white/5 rounded-xl">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className={cn(
                    "w-12 h-12 rounded-[18px] flex items-center justify-center text-white font-bold text-lg",
                    currentChat?.color || "bg-primary"
                  )}>
                    {currentChat?.avatar || <Hash className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{currentChat?.name}</h3>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      128 Members, 24 Online
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 rounded-xl hover:bg-white/5 transition-colors text-muted-foreground hover:text-white"><Phone className="w-5 h-5" /></button>
                  <button className="p-2.5 rounded-xl hover:bg-white/5 transition-colors text-muted-foreground hover:text-white"><MoreVertical className="w-5 h-5" /></button>
                </div>
              </div>

              {/* Pinned Message */}
              <div className="px-4 py-2 bg-primary/10 border-b border-primary/20 flex items-center gap-3 text-[11px] font-bold text-primary group cursor-pointer hover:bg-primary/15 transition-colors">
                <Pin className="w-3.5 h-3.5" />
                <span>Pinned: Digital Notes – Unit 3</span>
                <ChevronRightIcon className="w-3 h-3 ml-auto opacity-50" />
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed opacity-95">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">Today</span>
                </div>

                <MessageBubble 
                  user="Aman" 
                  avatar="A" 
                  text="Guys, notes uploaded for Unit 3 – Check it out!" 
                  time="9:30 AM"
                  file={{ name: "CN_Unit3_Notes.pdf", size: "2.4 MB", type: "PDF" }}
                />

                <MessageBubble 
                  user="Riya" 
                  avatar="R" 
                  text="Can anyone explain OSI model in simple words?" 
                  time="9:31 AM"
                  reactions={[{ emoji: "👍", count: 3 }]}
                />

                <MessageBubble 
                  isMe 
                  text="I'll explain in tomorrow's session! 🙌" 
                  time="9:32 AM"
                />

                <MessageBubble 
                  user="Yash" 
                  avatar="Y" 
                  text="Here's the diagram we discussed in last class." 
                  time="9:35 AM"
                  image="https://picsum.photos/seed/diagram/400/250"
                />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white/5 backdrop-blur-xl border-t border-white/10">
                <div className="flex items-center gap-3">
                  <button className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-muted-foreground transition-all">
                    <Plus className="w-5 h-5" />
                  </button>
                  <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-[24px] px-4 py-2 shadow-inner group focus-within:border-primary/50 transition-all">
                    <Input 
                      className="border-none bg-transparent focus-visible:ring-0 text-sm placeholder:text-muted-foreground/50 h-10 p-0" 
                      placeholder="Type a message..." 
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <button className="p-2 text-muted-foreground hover:text-primary transition-colors"><Smile className="w-5 h-5" /></button>
                      <button className="p-2 text-muted-foreground hover:text-primary transition-colors"><Mic className="w-5 h-5" /></button>
                    </div>
                  </div>
                  <button className="w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-primary to-accent text-white rounded-[20px] shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                    <Send className="w-5 h-5 -rotate-45" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center p-8">
              <div className="w-20 h-20 rounded-[32px] bg-primary/10 flex items-center justify-center border border-primary/20">
                <MessageSquare className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-headline font-bold">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">Choose a group or person to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

function ChatItem({ item, onClick, isActive }: { item: any, onClick: () => void, isActive: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-3 rounded-3xl transition-all group",
        isActive 
          ? "bg-primary/20 border border-primary/30 shadow-lg" 
          : "hover:bg-white/5 text-foreground"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-[18px] flex items-center justify-center text-white font-bold shrink-0 shadow-lg",
        item.color || "bg-primary"
      )}>
        {item.avatar || (item.icon ? <item.icon className="w-5 h-5" /> : <Hash className="w-5 h-5" />)}
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <h4 className="font-bold text-sm truncate">{item.name}</h4>
          <span className="text-[10px] text-muted-foreground font-medium shrink-0">{item.time}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground truncate font-medium">{item.lastMsg}</p>
          {item.unread > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
              {item.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function MessageBubble({ user, avatar, text, time, isMe, file, reactions, image }: any) {
  return (
    <div className={cn("flex gap-3 group", isMe ? "flex-row-reverse" : "flex-row")}>
      {!isMe && (
        <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-primary shrink-0 text-sm">
          {avatar}
        </div>
      )}
      <div className={cn("flex flex-col max-w-[85%] lg:max-w-[70%]", isMe ? "items-end" : "items-start")}>
        {!isMe && <span className="text-[10px] font-bold text-muted-foreground mb-1 ml-1">{user}</span>}
        
        <div className={cn(
          "relative p-3 rounded-[24px] shadow-sm",
          isMe 
            ? "bg-gradient-to-tr from-primary to-accent text-white rounded-tr-none" 
            : "glass border-white/10 text-foreground rounded-tl-none"
        )}>
          {text && <p className="text-sm leading-relaxed">{text}</p>}
          
          {image && (
            <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black/20">
              <img src={image} alt="Attachment" className="w-full h-auto object-cover" />
            </div>
          )}

          {file && (
            <div className="mt-2 p-3 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-4 group/file hover:bg-white/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 border border-red-500/30">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-bold truncate">{file.name}</p>
                <p className="text-[10px] opacity-60 font-bold">{file.size} • {file.type}</p>
              </div>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1 px-1">
          <span className="text-[9px] font-bold text-muted-foreground opacity-60">{time}</span>
          {isMe && <CheckCheck className="w-3 h-3 text-primary" />}
        </div>

        {reactions && (
          <div className="flex gap-1 mt-1 -ml-1">
            {reactions.map((r: any, i: number) => (
              <div key={i} className="flex items-center gap-1 bg-white/10 border border-white/10 rounded-full px-1.5 py-0.5 text-[10px] shadow-sm hover:scale-110 transition-transform cursor-pointer">
                <span>{r.emoji}</span>
                <span className="font-bold opacity-70">{r.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Minimal placeholder icons to match the design style
function LibraryIcon(props: any) { return <LibraryIconInternal {...props} /> }
function LibraryIconInternal({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  )
}

function UserIcon(props: any) { return <UserIconInternal {...props} /> }
function UserIconInternal({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function ZapIcon(props: any) { return <ZapIconInternal {...props} /> }
function ZapIconInternal({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function ChevronRightIcon(props: any) { return <ChevronRightIconInternal {...props} /> }
function ChevronRightIconInternal({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
