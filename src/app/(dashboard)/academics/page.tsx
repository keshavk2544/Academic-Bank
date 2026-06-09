
"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { 
  FileText, 
  Download, 
  PlusCircle,
  Clock
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[
            { title: "Machine Learning Unit 2", size: "4.2 MB", date: "2 days ago", color: "text-blue-400" },
            { title: "Computer Networks Lab Manual", size: "12.8 MB", date: "1 week ago", color: "text-purple-400" },
            { title: "Operating Systems Lecture 15", size: "1.5 MB", date: "Today", color: "text-pink-400" },
            { title: "Java Advanced Concepts", size: "2.1 MB", date: "3 days ago", color: "text-orange-400" },
            { title: "Database Normalization PDF", size: "890 KB", date: "5 days ago", color: "text-green-400" },
          ].map((file, idx) => (
            <GlassCard key={idx} className="p-3 group hover:scale-[1.02] active:scale-[0.98] transition-all">
              <div className="flex justify-between items-start mb-2">
                <div className={`p-1.5 rounded-lg bg-white/5 border border-white/10 ${file.color}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 rounded-md glass border-white/10 text-muted-foreground hover:text-white hover:border-white/20">
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <h4 className="font-bold text-xs mb-1 line-clamp-2 leading-tight h-8">{file.title}</h4>
              <div className="flex flex-col gap-0.5 text-[9px] text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {file.date}</span>
                <span>{file.size}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
