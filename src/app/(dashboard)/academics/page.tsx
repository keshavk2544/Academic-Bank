
"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  Folder, 
  FileText, 
  Download, 
  Share2, 
  Search,
  Filter,
  PlusCircle,
  Clock,
  ExternalLink
} from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AcademicsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-1">Academic Vault</h2>
            <h1 className="text-3xl font-headline font-bold">Study Repository</h1>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground rounded-xl font-bold hover:bg-accent/90 transition-all shadow-[0_0_15px_rgba(72,118,245,0.4)]">
            <PlusCircle className="w-4 h-4" /> Contribute Material
          </button>
        </header>

        <Tabs defaultValue="notes" className="w-full">
          <TabsList className="glass border-white/10 bg-white/5 p-1 h-14 w-full md:w-auto mb-8">
            <TabsTrigger value="notes" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Notes & PDFs</TabsTrigger>
            <TabsTrigger value="assignments" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Assignments</TabsTrigger>
            <TabsTrigger value="papers" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">PYQs</TabsTrigger>
            <TabsTrigger value="timetable" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Timetable</TabsTrigger>
          </TabsList>

          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="glass border-white/10 pl-10 h-12 rounded-xl" placeholder="Search across all academic files..." />
            </div>
            <button className="glass border-white/10 px-6 h-12 rounded-xl flex items-center gap-2 text-sm text-muted-foreground hover:text-white">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          <TabsContent value="notes" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Machine Learning Unit 2", size: "4.2 MB", date: "2 days ago", color: "text-blue-400" },
                { title: "Computer Networks Lab Manual", size: "12.8 MB", date: "1 week ago", color: "text-purple-400" },
                { title: "Operating Systems Lecture 15", size: "1.5 MB", date: "Today", color: "text-pink-400" },
                { title: "Java Advanced Concepts", size: "2.1 MB", date: "3 days ago", color: "text-orange-400" },
                { title: "Database Normalization PDF", size: "890 KB", date: "5 days ago", color: "text-green-400" },
              ].map((file, idx) => (
                <GlassCard key={idx} className="group hover:scale-[1.02] active:scale-[0.98]">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${file.color}`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg glass border-white/10 text-muted-foreground hover:text-white hover:border-white/20">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg glass border-white/10 text-muted-foreground hover:text-white hover:border-white/20">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg mb-1">{file.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {file.date}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>{file.size}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timetable" className="mt-0">
            <GlassCard className="p-0 overflow-hidden border-accent/20">
              <div className="p-6 bg-accent/10 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Current Semester Schedule</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Section A • Semester 6</p>
                </div>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                  <ExternalLink className="w-5 h-5 text-accent" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">Mon</th>
                      <th className="px-6 py-4">Tue</th>
                      <th className="px-6 py-4">Wed</th>
                      <th className="px-6 py-4">Thu</th>
                      <th className="px-6 py-4">Fri</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { time: "09:00 - 10:00", subjects: ["ML", "CN", "DBMS", "OS", "PE"] },
                      { time: "10:00 - 11:00", subjects: ["Lab (CN)", "ML", "PE", "OS", "CN"] },
                      { time: "11:15 - 12:15", subjects: ["Lab (CN)", "Lib", "Project", "DBMS", "ML"] },
                      { time: "01:00 - 02:00", subjects: ["Seminar", "PE", "CN", "Project", "Lib"] },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-5 text-xs font-bold text-accent whitespace-nowrap">{row.time}</td>
                        {row.subjects.map((sub, i) => (
                          <td key={i} className="px-6 py-5">
                            <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-muted-foreground">
                              {sub}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
