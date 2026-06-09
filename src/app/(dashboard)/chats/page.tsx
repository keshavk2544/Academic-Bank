
"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Plus, 
  Hash, 
  ChevronRight, 
  Send, 
  Paperclip, 
  Mic, 
  Smile,
  MoreVertical,
  Users,
  Bell
} from "lucide-react"

const channels = [
  { category: "CSE Department", items: ["General", "Announcements", "Events"] },
  { category: "Section A (Year 3)", items: ["Daily Updates", "Labs", "Feedback"] },
  { category: "Subjects", items: ["java-prog", "dbms-core", "os-theory", "discrete-maths"] },
]

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState("java-prog")

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6 animate-in fade-in duration-500">
        
        {/* Channel Sidebar */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="glass border-white/10 pl-10 h-11 rounded-xl" placeholder="Search workspace..." />
          </div>
          
          <GlassCard className="flex-1 overflow-y-auto p-2">
            <div className="p-2 flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Channels</span>
              <Plus className="w-4 h-4 text-primary cursor-pointer" />
            </div>
            
            <div className="space-y-6">
              {channels.map((group) => (
                <div key={group.category} className="space-y-1">
                  <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-tighter">
                    {group.category}
                    <ChevronRight className="w-3 h-3 rotate-90" />
                  </div>
                  {group.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => setActiveChannel(item)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                        activeChannel === item 
                        ? "bg-primary text-primary-foreground shadow-lg" 
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      }`}
                    >
                      <Hash className="w-4 h-4 opacity-50" />
                      {item}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Chat Window */}
        <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden relative">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between glass">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/20 border border-accent/30">
                <Hash className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-lg">#{activeChannel}</h3>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" /> 142 Members • Discussion for {activeChannel} course
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-white" />
              <Bell className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-white" />
              <MoreVertical className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex flex-col items-center py-10 opacity-30">
              <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mb-4">
                <Hash className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-headline font-bold">Beginning of #{activeChannel}</h4>
              <p className="text-sm">Welcome to the subject channel!</p>
            </div>

            {[
              { user: "Prof. Sarah", msg: "I've uploaded the practice problems for Chapter 3. Please review them before tomorrow's lecture.", time: "10:15 AM", avatar: "P" },
              { user: "Mark Taylor", msg: "Thanks Professor! Will they be included in the mid-terms?", time: "10:20 AM", avatar: "M" },
              { user: "Prof. Sarah", msg: "Yes, similar concepts will be covered.", time: "10:22 AM", avatar: "P" },
              { user: "Alex Rivera", msg: "Has anyone finished Lab 4 yet? I'm stuck on the database connection part.", time: "11:05 AM", avatar: "A" },
            ].map((m, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="w-10 h-10 rounded-2xl glass flex items-center justify-center font-bold text-primary shrink-0 border-primary/20">
                  {m.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{m.user}</span>
                    <span className="text-[10px] text-muted-foreground">{m.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5 group-hover:bg-white/10 transition-colors">
                    {m.msg}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-white/5 backdrop-blur-xl border-t border-white/10">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-[20px] p-2 pr-4 shadow-inner">
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                <Plus className="w-5 h-5" />
              </button>
              <Input 
                className="border-none bg-transparent focus-visible:ring-0 text-sm placeholder:text-muted-foreground/50 h-10" 
                placeholder={`Message #${activeChannel}`} 
              />
              <div className="flex items-center gap-2 shrink-0">
                <button className="p-2 text-muted-foreground hover:text-accent transition-colors"><Mic className="w-5 h-5" /></button>
                <button className="p-2 text-muted-foreground hover:text-pink-400 transition-colors"><Smile className="w-5 h-5" /></button>
                <button className="w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-xl shadow-[0_0_10px_rgba(139,92,246,0.3)] hover:scale-105 active:scale-95 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  )
}
