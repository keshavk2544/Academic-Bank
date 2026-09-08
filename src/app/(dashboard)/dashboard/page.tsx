
"use client"

import { useState, useEffect, use } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { 
  Search,
  BrainCircuit, 
  Library,
  ChevronRight,
  Clock,
  Scan,
  User,
  LayoutGrid
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function Dashboard(props: { params: Promise<any>; searchParams: Promise<any> }) {
  use(props.params);
  use(props.searchParams);

  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<string>("--:--");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-black text-white pb-24">
        {/* Top Header Section */}
        <header className="yellow-header">
          <div className="flex items-center justify-between mb-8">
            <LayoutGrid className="w-8 h-8 cursor-pointer" />
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-black/10">
              <img 
                src="https://picsum.photos/seed/student/200" 
                alt="Profile" 
                className="w-full h-full object-cover"
                data-ai-hint="student profile"
              />
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-headline font-bold mb-1">Hello, Keshav</h1>
            <p className="text-black/60 font-medium">What are you searching for?</p>
          </div>

          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
            <Input 
              placeholder="Search here..." 
              className="pill-input pl-14 placeholder:text-white/30"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-primary">
              <Search className="w-5 h-5" />
            </div>
          </div>
        </header>

        {/* Main Content Sections */}
        <div className="px-6 -mt-6 space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card p-6 rounded-[2.5rem] flex flex-col justify-between h-40 border border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Attendance</span>
              <div>
                <span className="text-3xl font-headline font-bold text-primary">87.5%</span>
                <Progress value={87.5} className="h-1 bg-white/5 mt-2" />
              </div>
            </div>
            <div className="bg-card p-6 rounded-[2.5rem] flex flex-col justify-between h-40 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</span>
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <span className="text-3xl font-headline font-bold">{currentTime}</span>
            </div>
          </div>

          {/* List of Actions */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-headline">Academic Hub</h2>
              <button className="text-[10px] font-black uppercase tracking-widest opacity-40">Filter</button>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => router.push('/tools')}
                className="card-item w-full"
              >
                <div className="text-left">
                  <h3 className="font-bold">AI Quiz Engine</h3>
                  <p className="text-xs text-muted-foreground">Generate study flashcards</p>
                </div>
                <div className="icon-box">
                  <BrainCircuit className="w-6 h-6" />
                </div>
              </button>

              <button 
                onClick={() => router.push('/academics')}
                className="card-item w-full"
              >
                <div className="text-left">
                  <h3 className="font-bold">Study Vault</h3>
                  <p className="text-xs text-muted-foreground">Access repository files</p>
                </div>
                <div className="icon-box">
                  <Library className="w-6 h-6" />
                </div>
              </button>

              <button 
                onClick={() => router.push('/attendance')}
                className="card-item w-full"
              >
                <div className="text-left">
                  <h3 className="font-bold">Pulse Scanner</h3>
                  <p className="text-xs text-muted-foreground">Verify attendance</p>
                </div>
                <div className="icon-box">
                  <Scan className="w-6 h-6" />
                </div>
              </button>
            </div>
          </section>

          {/* Recently Viewed */}
          <section className="space-y-4">
             <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-headline">Recent Files</h2>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </div>
            <div className="card-item">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Profile Settings</h4>
                  <p className="text-[10px] text-muted-foreground">Updated 2 days ago</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-black">
                   <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
