
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingOverlay } from "@/components/loading-overlay"
import { useToast } from "@/hooks/use-toast"
import { ShieldCheck, User } from "lucide-react"

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/erp-session', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store'
        });
        
        if (res.status === 401) {
          router.replace("/");
          return;
        }

        const data = await res.json();

        if (data.authenticated && data.student) {
          setStudent(data.student);
        } else {
          router.replace("/");
        }
      } catch (e) {
        console.error('[DASHBOARD-FETCH-ERROR]', e);
        toast({ variant: "destructive", title: "Session Error", description: "Failed to connect to student vault." });
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router, toast]);

  if (loading) return <LoadingOverlay status="Accessing Vault" />;
  if (!student) return null;

  return (
    <div className="pulse-container">
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mt-4">
        <div className="order-2 md:order-1 text-center md:text-left">
          <h1 className="text-3xl font-black font-headline tracking-tighter leading-tight mb-6 text-white uppercase">
            {student.name || 'Academic identity'}
          </h1>
          <div className="w-24 h-1 bg-primary rounded-full mt-4 mx-auto md:mx-0 -rotate-6 shadow-[0_0_8px_rgba(255,210,26,0.3)]" />
        </div>

        <div className="order-1 md:order-2 flex justify-center">
          <div className="profile-ring">
            <div className="profile-inner">
              {student.photoUrl && !imageError ? (
                <img 
                  src={student.photoUrl} 
                  alt="Student" 
                  className="w-[85%] h-[85%] rounded-full object-cover border border-white/5 shadow-2xl" 
                  onError={() => {
                    setImageError(true);
                  }}
                />
              ) : (
                <User className="w-24 h-24 text-primary stroke-[1.2]" />
              )}
              <div className="absolute -bottom-1 -right-1 w-16 h-16 rounded-full bg-black border-2 border-primary flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="order-3 md:order-3 text-center md:text-right hidden md:block rotate-[-2deg]">
          <h3 className="text-3xl text-primary font-headline italic mb-1">Pulse</h3>
          <p className="text-2xl text-muted-foreground font-light leading-none">
            Today.<br />Better.<br />Tomorrow.
          </p>
          <div className="w-20 h-1 bg-primary rounded-full mt-4 ml-auto -rotate-12 shadow-[0_0_8px_rgba(255,210,26,0.3)]" />
        </div>
      </section>

      {/* Academic Identity */}
      <section className="mt-16 space-y-4">
        <h2 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] px-2">Academic Identity</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 p-4 rounded-2xl border border-white/5 bg-neutral-900/40 flex items-center relative overflow-hidden transition-all hover:border-primary/20 group">
            <div className="absolute top-0 left-0 h-full w-1 bg-primary/40 group-hover:bg-primary transition-colors" />
            <div className="flex flex-col pl-2">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Enrollment No</span>
              <span className="text-xs font-bold font-headline text-white group-hover:text-primary transition-colors truncate max-w-[140px]">{student.enrollmentNo || 'N/A'}</span>
            </div>
          </div>
          
          <div className="h-20 p-4 rounded-2xl border border-white/5 bg-neutral-900/40 flex items-center relative overflow-hidden transition-all hover:border-primary/20 group">
            <div className="absolute top-0 left-0 h-full w-1 bg-primary/40 group-hover:bg-primary transition-colors" />
            <div className="flex flex-col pl-2 w-full">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Branch</span>
              <span className="text-[11px] font-bold font-headline text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight pr-1">{student.branch || 'N/A'}</span>
            </div>
          </div>

          <div className="h-20 p-4 rounded-2xl border border-white/5 bg-neutral-900/40 flex items-center relative overflow-hidden transition-all hover:border-primary/20 group">
            <div className="absolute top-0 left-0 h-full w-1 bg-primary/40 group-hover:bg-primary transition-colors" />
            <div className="flex flex-col pl-2">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Semester</span>
              <span className="text-xs font-bold font-headline text-white group-hover:text-primary transition-colors truncate max-w-[140px]">{student.semester ? `${student.semester}th Sem` : 'N/A'}</span>
            </div>
          </div>

          <div className="h-20 p-4 rounded-2xl border border-white/5 bg-neutral-900/40 flex items-center relative overflow-hidden transition-all hover:border-primary/20 group">
            <div className="absolute top-0 left-0 h-full w-1 bg-primary/40 group-hover:bg-primary transition-colors" />
            <div className="flex flex-col pl-2">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Section</span>
              <span className="text-xs font-bold font-headline text-white group-hover:text-primary transition-colors truncate max-w-[140px]">{student.section || 'N/A'}</span>
            </div>
          </div>
        </div>
      </section>

      <p className="mt-16 mb-12 text-center text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-30">
        PreRP Student I_NAV Engine &copy; 2026
      </p>
    </div>
  )
}
