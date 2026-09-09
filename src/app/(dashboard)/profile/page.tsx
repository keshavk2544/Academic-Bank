
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  LogOut, 
  Mail, 
  Phone, 
  ChevronRight,
  SlidersHorizontal
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
    <div className="min-h-screen bg-black text-white pb-32">
      <header className="px-6 pt-4 flex flex-col items-center">
        <div className="relative z-10 -mb-12">
          <div className="w-32 h-32 rounded-full border-[6px] border-black overflow-hidden shadow-2xl">
            <img 
              src="https://picsum.photos/seed/keshav/200" 
              alt="Profile" 
              className="w-full h-full object-cover"
              data-ai-hint="student profile"
            />
          </div>
        </div>
        
        <div className="bg-primary w-full rounded-[3.5rem] pt-16 pb-8 text-center text-black px-6 shadow-xl">
           <h1 className="text-3xl font-headline font-black tracking-tighter leading-none mb-1">Keshav Krishan</h1>
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{role}</p>
        </div>
      </header>

      <div className="px-6 mt-16 space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold font-headline tracking-tight">Identity Details</h2>
            <SlidersHorizontal className="w-5 h-5 opacity-40" />
          </div>

          <div className="space-y-4">
            <div className="bg-card p-4 rounded-[2.5rem] flex items-center justify-between border border-white/5">
              <div className="pl-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Email Address</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">keshav.k@univ.edu</p>
                </div>
              </div>
              <button className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform active:scale-90">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-card p-4 rounded-[2.5rem] flex items-center justify-between border border-white/5">
              <div className="pl-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Phone Connection</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">+1 (555) 000-0000</p>
                </div>
              </div>
              <button className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform active:scale-90">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold font-headline tracking-tight">Developer Mode</h2>
          </div>
          <div className="bg-card p-6 rounded-[2.5rem] border border-white/5 space-y-6">
            <div className="flex gap-2">
              <button 
                onClick={() => switchRole("student")}
                className={cn("flex-1 py-3 rounded-full text-[10px] font-black uppercase transition-all", role === "student" ? "bg-primary text-black" : "bg-black text-white border border-white/10")}
              >
                Student
              </button>
              <button 
                onClick={() => switchRole("admin")}
                className={cn("flex-1 py-3 rounded-full text-[10px] font-black uppercase transition-all", role === "admin" ? "bg-primary text-black" : "bg-black text-white border border-white/10")}
              >
                Admin
              </button>
            </div>
            <Button 
              onClick={handleSignOut}
              variant="destructive"
              className="w-full h-14 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-destructive/20"
            >
              <LogOut className="w-4 h-4 mr-2" /> De-Initialize Session
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
