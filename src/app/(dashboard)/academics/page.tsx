
"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { 
  FileText, 
  Download, 
  PlusCircle,
  Clock,
  ChevronRight,
  ShieldCheck
} from "lucide-react"

export default function AcademicsPage() {
  const files = [
    { title: "Machine Learning Unit 2", size: "4.2 MB", date: "2 days ago", color: "text-blue-400", type: "PDF Document" },
    { title: "Computer Networks Lab Manual", size: "12.8 MB", date: "1 week ago", color: "text-purple-400", type: "Lab Guide" },
    { title: "Operating Systems Lecture 15", size: "1.5 MB", date: "Today", color: "text-pink-400", type: "Lecture Notes" },
    { title: "Java Advanced Concepts", size: "2.1 MB", date: "3 days ago", color: "text-orange-400", type: "Core Subject" },
    { title: "Database Normalization PDF", size: "890 KB", date: "5 days ago", color: "text-green-400", type: "Cheat Sheet" },
  ];

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

        <div className="flex flex-col gap-3">
          {files.map((file, idx) => (
            <GlassCard key={idx} className="p-0 group hover:bg-white/5 transition-all border-white/5 relative overflow-hidden">
              {/* Subtle side accent */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-current ${file.color} opacity-30 group-hover:opacity-100 transition-opacity`} />
              
              <div className="flex items-center justify-between p-4 md:p-5">
                <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                  {/* Icon with background */}
                  <div className={`p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10 ${file.color} shrink-0 transition-transform group-hover:scale-105`}>
                    <FileText className="w-6 h-6 md:w-8 md:h-8" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                       <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{file.type}</span>
                       <span className="w-1 h-1 rounded-full bg-white/20" />
                       <span className="text-[9px] md:text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {file.date}
                       </span>
                    </div>
                    <h4 className="font-headline font-bold text-base md:text-xl truncate leading-tight">{file.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="font-bold text-white/40">{file.size}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-400/70" /> Verified by Faculty</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <button className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl glass border-white/10 text-xs font-bold text-muted-foreground hover:text-white hover:border-white/20 transition-all">
                    View Online
                  </button>
                  <button className="p-3 md:p-4 rounded-xl bg-accent text-accent-foreground shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Empty state hint */}
        <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-[32px]">
          <p className="text-sm text-muted-foreground italic">You've reached the end of your recent academic repository. <span className="text-accent font-bold cursor-pointer hover:underline">Load more files</span></p>
        </div>
      </div>
    </DashboardLayout>
  )
}
