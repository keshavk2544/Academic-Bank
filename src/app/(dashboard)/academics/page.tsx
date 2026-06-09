
"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { 
  FileText, 
  Download, 
  Share2, 
  PlusCircle,
  Clock,
  ExternalLink
} from "lucide-react"

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
          <TabsContent value="notes" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[
                { title: "Machine Learning Unit 2", size: "4.2 MB", date: "2 days ago", color: "text-blue-400" },
                { title: "Computer Networks Lab Manual", size: "12.8 MB", date: "1 week ago", color: "text-purple-400" },
                { title: "Operating Systems Lecture 15", size: "1.5 MB", date: "Today", color: "text-pink-400" },
                { title: "Java Advanced Concepts", size: "2.1 MB", date: "3 days ago", color: "text-orange-400" },
                { title: "Database Normalization PDF", size: "890 KB", date: "5 days ago", color: "text-green-400" },
              ].map((file, idx) => (
                <GlassCard key={idx} className="p-4 group hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${file.color}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg glass border-white/10 text-muted-foreground hover:text-white hover:border-white/20">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-sm mb-1 line-clamp-2 leading-tight h-10">{file.title}</h4>
                  <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {file.date}</span>
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
