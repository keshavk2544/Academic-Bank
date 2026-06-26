
"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  BookOpen, 
  Archive, 
  ShieldAlert, 
  CheckCircle, 
  XCircle,
  Search,
  MoreVertical,
  Filter,
  UserPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const MOCK_STUDENTS = [
  { id: "22CSE1042", name: "Alex Rivera", email: "alex.r@univ.edu", semester: "6", status: "Active" },
  { id: "22CSE1045", name: "Sarah Jenkins", email: "sarah.j@univ.edu", semester: "6", status: "Probation" },
  { id: "22CSE1050", name: "Michael Chen", email: "m.chen@univ.edu", semester: "4", status: "Active" },
  { id: "22CSE1055", name: "Priya Sharma", email: "priya.s@univ.edu", semester: "6", status: "Inactive" },
];

const MOCK_REPO_FILES = [
  { id: 1, title: "Machine Learning Unit 2 Notes", contributor: "Alex Rivera", date: "2 hrs ago", status: "Pending" },
  { id: 2, title: "Database Systems PYQ 2024", contributor: "Sarah Jenkins", date: "5 hrs ago", status: "Pending" },
  { id: 3, title: "Operating Systems Lab Manual", contributor: "Jordan Lee", date: "Yesterday", status: "Approved" },
];

export default function AdminPage() {
  const [role, setRole] = useState<string>("")

  useEffect(() => {
    const userRole = localStorage.getItem("userRole") || "student"
    setRole(userRole)
  }, [])

  if (role !== "admin") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <ShieldAlert className="w-16 h-16 text-red-500 animate-pulse" />
          <h1 className="text-2xl font-headline font-bold text-center">Unauthorized Access</h1>
          <p className="text-muted-foreground text-center max-w-md">
            This sector is restricted to administrator pulses only. Please return to the dashboard.
          </p>
          <Button variant="outline" className="glass border-white/10" asChild>
            <a href="/dashboard">Back to Dashboard</a>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Central Command</h2>
            <h1 className="text-3xl font-headline font-bold">Admin Console</h1>
          </div>
          <div className="flex gap-2">
             <Button className="bg-primary hover:bg-primary/90 rounded-xl font-bold h-11 px-6 shadow-lg shadow-primary/20">
               <UserPlus className="w-4 h-4 mr-2" /> Onboard Student
             </Button>
          </div>
        </header>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 h-12 p-1 gap-1 rounded-2xl w-full md:w-auto">
            <TabsTrigger value="students" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-xs uppercase tracking-widest px-6">
              <Users className="w-4 h-4 mr-2" /> Students
            </TabsTrigger>
            <TabsTrigger value="repository" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-xs uppercase tracking-widest px-6">
              <Archive className="w-4 h-4 mr-2" /> Repository
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-xs uppercase tracking-widest px-6">
              <BookOpen className="w-4 h-4 mr-2" /> Quizzes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <GlassCard className="p-4 border-white/5 flex items-center gap-4">
               <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <Input className="bg-white/5 border-none h-10 pl-10 rounded-xl focus:ring-1 focus:ring-primary" placeholder="Search by roll number or name..." />
               </div>
               <Button variant="outline" className="glass border-white/10 h-10 px-4 rounded-xl">
                 <Filter className="w-4 h-4 mr-2" /> Filter
               </Button>
            </GlassCard>

            <div className="grid gap-3">
              {MOCK_STUDENTS.map((student) => (
                <GlassCard key={student.id} className="p-4 hover:bg-white/10 transition-colors border-white/5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                        {student.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{student.name}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                          {student.id} • Semester {student.semester}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={cn(
                        "rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest",
                        student.status === "Active" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                        student.status === "Probation" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-red-500/10 text-red-400 border-red-500/20"
                      )}>
                        {student.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="repository" className="space-y-4">
            <div className="grid gap-4">
              {MOCK_REPO_FILES.map((file) => (
                <GlassCard key={file.id} className="p-5 border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       {file.status === "Pending" && <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                       <h4 className="font-bold text-base">{file.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground italic">
                      Contributed by <span className="text-primary font-bold">{file.contributor}</span> • {file.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {file.status === "Pending" ? (
                      <>
                        <Button variant="ghost" className="h-10 text-xs font-bold text-red-400 hover:bg-red-400/10 rounded-xl">
                          <XCircle className="w-4 h-4 mr-2" /> Reject
                        </Button>
                        <Button className="h-10 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-green-500/20">
                          <CheckCircle className="w-4 h-4 mr-2" /> Approve
                        </Button>
                      </>
                    ) : (
                      <Badge className="bg-white/5 text-muted-foreground border-white/10 rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                        Approved
                      </Badge>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
             <GlassCard className="h-[400px] border-white/5 bg-white/5 flex flex-col items-center justify-center text-center p-12 opacity-50">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-headline font-bold mb-1">No Quiz Analytics Yet</h3>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Historical data of AI-generated quizzes will appear here as students interact with the study engine.
                </p>
              </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
