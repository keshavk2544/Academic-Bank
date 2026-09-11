
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingOverlay } from "@/components/loading-overlay"
import { useToast } from "@/hooks/use-toast"
import { ShieldCheck, User, Book, Hash } from "lucide-react"

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [student, setStudent] = useState<{ name: string; qid: string; course: string; section: string } | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <LoadingOverlay status="Accessing Vault" />;
  if (!student) return null;

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <header className="px-6 pt-4 flex flex-col items-center">
        <div className="relative z-10 -mb-12">
          <div className="w-32 h-32 rounded-full border-[6px] border-black overflow-hidden shadow-2xl bg-muted flex items-center justify-center">
             <User className="w-16 h-16 text-primary" />
          </div>
        </div>
        
        <div className="bg-primary w-full rounded-[3.5rem] pt-16 pb-8 text-center text-black px-6 shadow-xl relative overflow-hidden">
           <h1 className="text-3xl font-headline font-black tracking-tighter leading-none mb-1">{student.name}</h1>
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Verified Student Pulse</p>
        </div>
      </header>

      <div className="px-6 mt-16 space-y-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold font-headline tracking-tight">Academic Identity</h2>
            <ShieldCheck className="w-5 h-5 text-primary animate-pulse" />
          </div>

          <div className="grid gap-4">
            <div className="bg-card p-6 rounded-[2.5rem] border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Hash className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Student ID / QID</h3>
                <p className="text-lg font-bold font-headline">{student.qid}</p>
              </div>
            </div>

            <div className="bg-card p-6 rounded-[2.5rem] border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Book className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current Course</h3>
                <p className="text-lg font-bold font-headline">{student.course}</p>
              </div>
            </div>

            <div className="bg-card p-6 rounded-[2.5rem] border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Assigned Section</h3>
                <p className="text-lg font-bold font-headline">Section {student.section}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
