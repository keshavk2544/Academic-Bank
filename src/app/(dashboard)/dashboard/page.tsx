"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingOverlay } from "@/components/loading-overlay"
import { useToast } from "@/hooks/use-toast"
import { ShieldCheck, User, Hash, BookOpen, Copy, Check, ChevronRight, LayoutGrid, Calendar, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [student, setStudent] = useState<{ name: string; qid: string; course: string; section: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/erp-session');
        const data = await res.json();

        if (data.authenticated) {
          setStudent(data.student);
        } else {
          router.push("/");
        }
      } catch (e) {
        toast({ variant: "destructive", title: "Session Error", description: "Failed to connect to student vault." });
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router, toast]);

  const handleCopy = () => {
    if (!student?.qid) return;
    navigator.clipboard.writeText(student.qid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied", description: "Student ID copied to clipboard." });
  };

  if (loading) return <LoadingOverlay status="Accessing Vault" />;
  if (!student) return null;

  return (
    <div className="pulse-container">
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mt-12">
        {/* Left: Greeting */}
        <div className="order-2 md:order-1 text-center md:text-left">
          <p className="text-2xl text-muted-foreground font-light mb-1">Hello,</p>
          <h1 className="text-5xl font-black font-headline tracking-tighter leading-none mb-6">
            {student.name.split(' ')[0]}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed italic opacity-80">
            Keep learning.<br />Keep growing.
          </p>
          <div className="w-24 h-1 bg-primary rounded-full mt-4 mx-auto md:mx-0 -rotate-6 shadow-[0_0_8px_rgba(255,210,26,0.3)]" />
        </div>

        {/* Center: Profile Ring */}
        <div className="order-1 md:order-2 flex justify-center">
          <div className="profile-ring">
            <div className="profile-inner">
              <User className="w-24 h-24 text-primary stroke-[1.2]" />
              <div className="absolute -bottom-1 -right-1 w-16 h-16 rounded-full bg-black border-2 border-primary flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Motto */}
        <div className="order-3 md:order-3 text-center md:text-right hidden md:block rotate-[-2deg]">
          <h3 className="text-3xl text-primary font-headline italic mb-1">Student</h3>
          <p className="text-2xl text-muted-foreground font-light leading-none">
            Today.<br />Better.<br />Tomorrow.
          </p>
          <div className="w-20 h-1 bg-primary rounded-full mt-4 ml-auto -rotate-12 shadow-[0_0_8px_rgba(255,210,26,0.3)]" />
        </div>
      </section>

      {/* Academic Identity Grid */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black font-headline tracking-tight">Academic Identity</h2>
          <button className="px-5 py-2.5 rounded-full border border-white/10 bg-gradient-to-br from-[#0f0f0f] to-[#050505] text-muted-foreground text-sm font-bold flex items-center gap-2">
            Verified
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* QID Card */}
          <div className="identity-card">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-6 shrink-0 border border-primary/20">
              <Hash className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Student ID / QID</p>
              <p className="text-2xl font-bold font-headline truncate text-white/90">{student.qid}</p>
            </div>
            <button 
              onClick={handleCopy}
              className="w-16 h-16 rounded-2xl bg-[#202020] flex items-center justify-center text-muted-foreground transition-all active:scale-90"
            >
              {copied ? <Check className="w-7 h-7 text-green-400" /> : <Copy className="w-7 h-7" />}
            </button>
          </div>

          {/* Course Card */}
          <div className="identity-card">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-6 shrink-0 border border-primary/20">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Course</p>
              <p className="text-2xl font-bold font-headline truncate text-white/90">{student.course}</p>
            </div>
          </div>

          {/* Section Card */}
          <div className="identity-card">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-6 shrink-0 border border-primary/20">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Assigned Section</p>
              <p className="text-2xl font-bold font-headline truncate text-white/90">Section {student.section}</p>
            </div>
          </div>

          {/* Status Card (Highlighted) */}
          <div className="identity-card border-primary/40 bg-gradient-to-br from-[#151515] to-[#111108]">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mr-6 shrink-0 border border-primary/30">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Enrollment Status</p>
              <p className="text-2xl font-bold font-headline truncate text-white/90">Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black font-headline">Quick Access</h2>
          <span className="text-muted-foreground text-sm font-medium">Less clicks. More progress.</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <button className="h-32 p-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#131313] to-[#0c0c0c] flex items-center text-left transition-all active:scale-[0.98] group hover:border-primary/20">
            <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mr-5 group-hover:bg-primary/10 transition-colors">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold mb-1">Timetable</h4>
              <p className="text-sm text-muted-foreground">View your classes</p>
            </div>
            <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" />
          </button>

          <button className="h-32 p-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#131313] to-[#0c0c0c] flex items-center text-left transition-all active:scale-[0.98] group hover:border-primary/20">
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
