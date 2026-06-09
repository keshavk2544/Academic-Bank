
"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  Mail, 
  Phone, 
  Award, 
  Zap,
  Star,
  ChevronRight
} from "lucide-react"

export default function ProfilePage() {
  const [role, setRole] = useState("student")

  useEffect(() => {
    setRole(localStorage.getItem("userRole") || "student")
  }, [])

  const switchRole = (newRole: string) => {
    localStorage.setItem("userRole", newRole)
    setRole(newRole)
    window.location.reload()
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row items-center gap-8 bg-primary/5 p-8 rounded-[40px] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
          
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] glass border-2 border-primary/30 p-1 group-hover:border-primary transition-all duration-500">
              <div className="w-full h-full rounded-[36px] overflow-hidden bg-white/5 flex items-center justify-center">
                <User className="w-16 h-16 text-muted-foreground/30" />
              </div>
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-xl shadow-lg hover:scale-110 transition-transform">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center md:text-left flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-headline font-bold">Alex Rivera</h1>
              <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 text-sm mt-1">
                Computer Science & Engineering • Class of 2026
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-4 py-1.5 rounded-full glass border-white/10 text-xs font-bold text-primary flex items-center gap-2">
                <Star className="w-3 h-3" /> Gold Medalist
              </span>
              <span className="px-4 py-1.5 rounded-full glass border-white/10 text-xs font-bold text-accent flex items-center gap-2">
                <Shield className="w-3 h-3" /> Verified Student
              </span>
              <span className="px-4 py-1.5 rounded-full glass border-white/10 text-xs font-bold text-pink-400 flex items-center gap-2">
                <Zap className="w-3 h-3" /> 15 Day Streak
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <GlassCard className="space-y-6">
              <h3 className="text-xl font-headline font-bold">Contact Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Email Address</p>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-primary" /> alex.rivera@pre.university.edu
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Mobile Number</p>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-primary" /> +1 (555) 234-5678
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="space-y-6">
              <h3 className="text-xl font-headline font-bold">Achievement Showcase</h3>
              <div className="space-y-4">
                {[
                  { title: "Quiz Master", desc: "Top 1% in all subjects", icon: Award, date: "May 2025" },
                  { title: "Perfect Pulse", desc: "100% attendance for 30 days", icon: Zap, date: "Apr 2025" },
                ].map((ach, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl glass border-white/10">
                        <ach.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{ach.title}</h4>
                        <p className="text-xs text-muted-foreground">{ach.desc}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{ach.date}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="space-y-8">
            <GlassCard className="space-y-6">
              <h3 className="text-lg font-bold">Admin Controls</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Developer Mode: Switch roles to test the UI experience for different users.
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => switchRole("student")}
                  variant={role === "student" ? "default" : "outline"} 
                  className={`w-full h-11 rounded-xl ${role === "student" ? "bg-primary shadow-[0_0_15px_rgba(139,92,246,0.3)]" : "glass border-white/10"}`}
                >
                  Student View
                </Button>
                <Button 
                  onClick={() => switchRole("faculty")}
                  variant={role === "faculty" ? "default" : "outline"} 
                  className={`w-full h-11 rounded-xl ${role === "faculty" ? "bg-accent shadow-[0_0_15px_rgba(72,118,245,0.3)]" : "glass border-white/10"}`}
                >
                  Faculty View
                </Button>
                <Button 
                  onClick={() => switchRole("admin")}
                  variant={role === "admin" ? "default" : "outline"} 
                  className={`w-full h-11 rounded-xl ${role === "admin" ? "bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]" : "glass border-white/10"}`}
                >
                  Admin View
                </Button>
              </div>
            </GlassCard>

            <Button variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 h-12 rounded-xl border border-red-500/20">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out from PreRP
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
