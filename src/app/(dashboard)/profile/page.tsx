
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
  SlidersHorizontal,
  RefreshCw,
  Fingerprint,
  IdCard,
  GraduationCap,
  Briefcase
} from "lucide-react"
import { LoadingOverlay } from "@/components/loading-overlay"
import { useToast } from "@/hooks/use-toast"
import { StudentProfile } from "@/types/student"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [role, setRole] = useState("student")
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    setRole(localStorage.getItem("userRole") || "student")
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/student/profile')
      const data = await res.json()
      if (data.success) {
        setStudent(data.student)
      } else {
        router.push("/")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSyncERP = async () => {
    setIsSyncing(true)
    try {
      const res = await fetch('/api/student/sync', { method: 'POST' })
      const data = await res.json()
      
      if (data.success) {
        setStudent(data.student)
        toast({ title: "Sync Successful", description: "Your academic profile has been updated from QUMS." })
      } else {
        toast({ 
          variant: "destructive", 
          title: "Sync Unavailable", 
          description: data.message || "Could not reach QUMS server pulse." 
        })
      }
    } catch (e) {
      toast({ 
        variant: "destructive", 
        title: "Sync Error", 
        description: "Network interruption during ERP sync." 
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const switchRole = (newRole: string) => {
    localStorage.setItem("userRole", newRole)
    setRole(newRole)
    window.location.reload()
  }

  const handleSignOut = async () => {
    await fetch('/api/auth/erp-logout', { method: 'POST' })
    localStorage.removeItem("userRole")
    router.push("/")
  }

  if (isLoading) return <LoadingOverlay status="Accessing Profile Pulse" />

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {isSyncing && <LoadingOverlay status="Syncing ERP Data" />}

      <header className="px-6 pt-4 flex flex-col items-center">
        <div className="relative z-10 -mb-12">
          <div className="w-32 h-32 rounded-full border-[6px] border-black overflow-hidden shadow-2xl bg-[#111]">
            {student?.photoUrl ? (
              <img 
                src={student.photoUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary/40">
                <Fingerprint className="w-12 h-12" />
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-primary w-full rounded-[3.5rem] pt-16 pb-8 text-center text-black px-6 shadow-xl">
           <h1 className="text-3xl font-headline font-black tracking-tighter leading-none mb-1">{student?.name || 'Academic Identity'}</h1>
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{student?.course || role}</p>
        </div>
      </header>

      <div className="px-6 mt-16 space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold font-headline tracking-tight">Academic Pulse</h2>
            <SlidersHorizontal className="w-5 h-5 opacity-40" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-card p-4 rounded-[2.5rem] flex items-center justify-between border border-white/5">
              <div className="pl-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Registration ID</h3>
                  <p className="text-sm font-bold font-headline">{student?.registrationId || 'Not available'}</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-4 rounded-[2.5rem] flex items-center justify-between border border-white/5">
              <div className="pl-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <IdCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Enrollment No</h3>
                  <p className="text-sm font-bold font-headline">{student?.enrollmentNo || 'Not available'}</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-4 rounded-[2.5rem] flex items-center justify-between border border-white/5">
              <div className="pl-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Branch</h3>
                  <p className="text-sm font-bold font-headline">{student?.branch || 'Not available'}</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-4 rounded-[2.5rem] flex items-center justify-between border border-white/5">
              <div className="pl-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Semester</h3>
                  <p className="text-sm font-bold font-headline">{student?.semester ? `${student.semester}th Semester` : 'Not available'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold font-headline tracking-tight">System Controls</h2>
          </div>
          <div className="bg-card p-6 rounded-[2.5rem] border border-white/5 space-y-4">
            
            <Button 
              onClick={handleSyncERP}
              disabled={isSyncing}
              className="w-full h-14 rounded-full font-black text-xs uppercase tracking-widest bg-white/5 text-primary border border-primary/20 hover:bg-primary/10"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isSyncing && "animate-spin")} /> Sync ERP Data
            </Button>

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
