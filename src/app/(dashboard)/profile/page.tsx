
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
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
  ChevronRight,
  Plus,
  Edit2,
  Copy
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [role, setRole] = useState("student")

  useEffect(() => {
    setRole(localStorage.getItem("userRole") || "student")
  }, [])

  const switchRole = (newRole: string) => {
    localStorage.setItem("userRole", newRole)
    setRole(newRole)
    window.location.reload()
  }

  const handleSignOut = () => {
    localStorage.removeItem("userRole")
    router.push("/")
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-black text-white pb-32">
        <header className="yellow-header h-[250px] flex flex-col items-center justify-center text-center">
          <div className="absolute top-8 left-8">
            <Edit2 className="w-6 h-6" />
          </div>
          <div className="absolute top-8 right-8">
            <Copy className="w-6 h-6" />
          </div>

          <div className="relative mt-8">
            <div className="w-32 h-32 rounded-full border-[6px] border-black bg-muted overflow-hidden">
               <img 
                src="https://picsum.photos/seed/keshav/200" 
                alt="Profile" 
                className="w-full h-full object-cover"
                data-ai-hint="student profile"
              />
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-headline font-bold">Keshav Krishan</h1>
            <p className="text-black/60 font-bold uppercase text-[10px] tracking-widest">{role}</p>
          </div>
        </header>

        <div className="px-6 mt-8 space-y-8">
          <div className="flex gap-3 justify-center">
            <button className="bg-card w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5">
              <Settings className="w-5 h-5" />
            </button>
            <button className="bg-card flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 border border-white/5 font-bold">
              <Plus className="w-5 h-5" /> Add New Detail
            </button>
            <button className="bg-card w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5">
              <Copy className="w-5 h-5" />
            </button>
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-headline">Information</h2>
              <button className="text-[10px] font-black uppercase tracking-widest opacity-40">Edit</button>
            </div>

            <div className="space-y-3">
              <div className="card-item">
                <div className="flex items-center gap-4">
                  <div className="icon-box">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Email Address</h4>
                    <p className="text-xs text-muted-foreground">keshav.k@univ.edu</p>
                  </div>
                </div>
              </div>

              <div className="card-item">
                <div className="flex items-center gap-4">
                  <div className="icon-box">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Phone Number</h4>
                    <p className="text-xs text-muted-foreground">+1 (555) 000-0000</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold font-headline">Controls</h2>
            <div className="bg-card p-6 rounded-[2.5rem] border border-white/5 space-y-4">
              <p className="text-xs text-muted-foreground">Switch roles for development preview.</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => switchRole("student")}
                  className={cn("flex-1 py-3 rounded-full text-xs font-bold transition-all", role === "student" ? "bg-primary text-black" : "bg-black text-white border border-white/10")}
                >
                  Student
                </button>
                <button 
                  onClick={() => switchRole("admin")}
                  className={cn("flex-1 py-3 rounded-full text-xs font-bold transition-all", role === "admin" ? "bg-primary text-black" : "bg-black text-white border border-white/10")}
                >
                  Admin
                </button>
              </div>
              <Button 
                onClick={handleSignOut}
                variant="destructive"
                className="w-full h-14 rounded-full font-bold"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
