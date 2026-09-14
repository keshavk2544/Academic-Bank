"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingOverlay } from "@/components/loading-overlay"
import { useToast } from "@/hooks/use-toast"
import { ShieldCheck, User, ArrowRight, Upload, BookOpen } from "lucide-react"

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

      {/* Academic Identity */}
      <section className="mt-16 space-y-4">
        <h2 className="text-xl font-bold font-headline tracking-tight px-2">Academic Identity</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="identity-card">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Enrollment No</span>
              <span className="text-sm font-bold font-headline">{student.enrollmentNo || 'N/A'}</span>
            </div>
          </div>
          <div className="identity-card">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Branch</span>
              <span className="text-sm font-bold font-headline">{student.branch || 'N/A'}</span>
            </div>
          </div>
          <div className="identity-card">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Semester</span>
              <span className="text-sm font-bold font-headline">{student.semester || 'N/A'}</span>
            </div>
          </div>
          <div className="identity-card">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Section</span>
              <span className="text-sm font-bold font-headline">{student.section || 'N/A'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6 px-2">
          <div>
            <h2 className="text-2xl font-bold font-headline tracking-tight">Quick Access</h2>
            <p className="text-xs text-muted-foreground">Less clicks. More progress.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <a href="/upload" className="card-item group">
            <div className="flex items-center gap-4">
              <div className="icon-box group-hover:bg-primary group-hover:text-black transition-colors">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Repository</h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Share records</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>

          <a href="/academics" className="card-item group">
            <div className="flex items-center gap-4">
              <div className="icon-box group-hover:bg-primary group-hover:text-black transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Academic Vault</h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Manage records</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        </div>
      </section>

      <p className="mt-16 mb-12 text-center text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-30">
        PreRP Student Pulse Engine &copy; 2025
      </p>
    </div>
  )
}
