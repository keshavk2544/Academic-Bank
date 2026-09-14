
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingOverlay } from "@/components/loading-overlay"
import { useToast } from "@/hooks/use-toast"
import { ShieldCheck, User, ChevronRight, LayoutGrid, Calendar } from "lucide-react"

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
          <p className="text-2xl text-muted-foreground font-light mb-1">
            Welcome Back,
          </p>
          <h1 className="text-5xl font-black font-headline tracking-tighter leading-tight mb-6">
            {student.name || 'Academic identity'}
          </h1>
          <div className="w-24 h-1 bg-primary rounded-full mt-4 mx-auto md:mx-0 -rotate-6 shadow-[0_0_8px_rgba(255,210,26,0.3)]" />
        </div>

        <div className="order-1 md:order-2 flex justify-center">
          <div className="profile-ring">
            <div className="profile-inner">
              {student.photoUrl ? (
                <img src={student.photoUrl} alt="Student" className="w-[85%] h-[85%] rounded-full object-cover border border-white/5 shadow-2xl" />
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

      {/* Quick Access */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black font-headline">Quick Access</h2>
          <span className="text-muted-foreground text-sm font-medium">Less clicks. More progress.</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <button onClick={() => router.push('/timetable')} className="h-32 p-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#131313] to-[#0c0c0c] flex items-center text-left transition-all active:scale-[0.98] group hover:border-primary/20">
            <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mr-5 group-hover:bg-primary/10 transition-colors">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold mb-1">Timetable</h4>
              <p className="text-sm text-muted-foreground">View your classes</p>
            </div>
            <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" />
          </button>

          <button onClick={() => router.push('/academics')} className="h-32 p-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#131313] to-[#0c0c0c] flex items-center text-left transition-all active:scale-[0.98] group hover:border-primary/20">
            <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mr-5 group-hover:bg-primary/10 transition-colors">
              <LayoutGrid className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold mb-1">Vault Services</h4>
              <p className="text-sm text-muted-foreground">Manage records</p>
            </div>
            <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </div>
      </section>

      <p className="mt-16 mb-12 text-center text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-30">
        PreRP Student Pulse Engine &copy; 2025
      </p>
    </div>
  )
}
