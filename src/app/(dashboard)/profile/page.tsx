
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  LogOut, 
  RefreshCw,
  Fingerprint,
  IdCard,
  GraduationCap,
  Briefcase,
  AlertCircle
} from "lucide-react"
import { LoadingOverlay } from "@/components/loading-overlay"
import { useToast } from "@/hooks/use-toast"
import { StudentProfile } from "@/types/student"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/student/profile', { 
        method: 'GET',
        credentials: 'include',
        cache: 'no-store' 
      })
      
      if (res.status === 401) {
        router.replace("/")
        return
      }

      const data = await res.json()
      if (data.success && data.student) {
        setStudent(data.student)
      } else {
        setError(data.message || "Failed to load profile identity.")
      }
    } catch (e) {
      console.error('[PROFILE-FETCH-ERROR]', e)
      setError("Network interruption during identity pulse.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSyncERP = async () => {
    setIsSyncing(true)
    try {
      const res = await fetch('/api/student/sync', { 
        method: 'POST',
        credentials: 'include',
        cache: 'no-store'
      })
      const data = await res.json()
      
      if (data.success && data.student) {
        setStudent(data.student)
        toast({ title: "Sync Successful", description: "Your academic identity has been updated." })
      } else {
        toast({ 
          variant: "destructive", 
          title: "Sync Unavailable", 
          description: data.message || "ERP sync unavailable. Your existing profile is still available." 
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

  const handleSignOut = async () => {
    await fetch('/api/auth/erp-logout', { method: 'POST', credentials: 'include' })
    localStorage.removeItem("userRole")
    router.push("/")
  }

  if (isLoading) return <LoadingOverlay status="Accessing Profile Pulse" />

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {isSyncing && <LoadingOverlay status="Syncing ERP Data" />}

      <header className="px-6 pt-4 flex flex-col items-center">
        <div className="relative z-10 -mb-12">
          <div className="w-32 h-32 rounded-full border-[6px] border-black overflow-hidden shadow-2xl bg-[#111] flex items-center justify-center">
            {student?.photoUrl ? (
              <img 
                src={student.photoUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Fingerprint className="w-12 h-12 text-primary/40" />
            )}
          </div>
        </div>
        
        <div className="bg-primary w-full rounded-[3.5rem] pt-16 pb-8 text-center text-black px-6 shadow-xl">
           <h1 className="text-3xl font-headline font-black tracking-tighter leading-none mb-1">{student?.name || 'Academic Identity'}</h1>
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{student?.course || 'No course data'}</p>
        </div>
      </header>

      <div className="px-6 mt-16 space-y-8">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-2xl flex items-center gap-3 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <p className="text-xs font-bold">{error}</p>
          </div>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold font-headline tracking-tight">Academic Pulse</h2>
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
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Student ID</h3>
                  <p className="text-sm font-bold font-headline">{student?.studentId || 'Not available'}</p>
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
