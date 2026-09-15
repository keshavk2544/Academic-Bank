"use client"

import { useState, useMemo } from "react"
import { 
  FileText, 
  Download, 
  Calendar,
  Code,
  MoreVertical,
} from "lucide-react"
import { cn } from "@/lib/utils"

const DOC_TYPE_OPTIONS = ["PYQ", "NOTES", "IMP TOPIC", "MFT"];

export default function AcademicsPage() {
  const [files] = useState([
    { title: "Machine Learning Fundamentals", size: "4.2 MB", date: "2 hrs ago", type: "Machine Learning", docType: "NOTES" },
    { title: "Computer Networks End-Term", size: "12.8 MB", date: "Yesterday", type: "Computer Networks", docType: "MFT" },
    { title: "Operating Systems Mid-Term", size: "1.5 MB", date: "Oct 12, 2024", type: "Operating Systems", docType: "NOTES" },
  ]);

  const [selectedType, setSelectedType] = useState("ALL");

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesType = selectedType === "ALL" || file.docType === selectedType;
      return matchesType;
    });
  }, [files, selectedType]);

  const getIcon = (docType: string) => {
    switch (docType) {
      case 'NOTES': return <FileText className="w-[22px] h-[22px] text-[#fbbf24]" strokeWidth={2.5} />;
      case 'MFT': return <Calendar className="w-[22px] h-[22px] text-[#34d399]" strokeWidth={2.5} />;
      case 'IMP TOPIC': return <Code className="w-[22px] h-[22px] text-[#60a5fa]" strokeWidth={2.5} />;
      default: return <FileText className="w-[22px] h-[22px] text-[#fbbf24]" strokeWidth={2.5} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32 relative overflow-x-hidden selection:bg-amber-500 selection:text-black font-sans antialiased">
      {/* Premium Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,#1a1a24_0%,transparent_60%)] pointer-events-none -z-10" />

      <div className="max-w-[720px] mx-auto px-6 pt-12 flex flex-col gap-10 relative z-10">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-[2.25rem] font-extrabold tracking-tight bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent leading-tight">
              Academic Vault
            </h1>
            <p className="text-[0.95rem] font-medium text-[#a1a1aa]">Quantum University Resource Archive</p>
          </div>
        </header>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          <button 
            onClick={() => setSelectedType("ALL")}
            className={cn(
              "px-6 py-2.5 rounded-2xl text-[0.8rem] font-semibold uppercase tracking-wider border shrink-0 transition-all backdrop-blur-md", 
              selectedType === "ALL" 
                ? "bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] border-transparent text-black shadow-lg shadow-amber-500/30 -translate-y-0.5" 
                : "bg-white/[0.03] border-white/[0.08] text-[#a1a1aa] hover:bg-white/[0.06] hover:text-white"
            )}
          >
            All
          </button>
          {DOC_TYPE_OPTIONS.map(type => (
            <button 
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "px-6 py-2.5 rounded-2xl text-[0.8rem] font-semibold uppercase tracking-wider border shrink-0 transition-all backdrop-blur-md", 
                selectedType === type 
                  ? "bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] border-transparent text-black shadow-lg shadow-amber-500/30 -translate-y-0.5" 
                  : "bg-white/[0.03] border-white/[0.08] text-[#a1a1aa] hover:bg-white/[0.06] hover:text-white"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* File Section */}
        <section>
          <div className="flex flex-col gap-4">
            {filteredFiles.map((file, idx) => (
              <div 
                key={idx} 
                className="group flex items-center justify-between p-5 bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] backdrop-blur-2xl rounded-[1.25rem] transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01] hover:border-white/20 hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
              >
                <div className="flex items-center gap-5 min-w-0">
                  {/* 3D Icon Box */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden group-hover:scale-110 group-hover:-rotate-2 transition-all duration-500">
                    <div className="absolute inset-0 bg-white/5 opacity-40 blur-xl z-0" />
                    <div className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      {getIcon(file.docType)}
                    </div>
                  </div>
                  
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-zinc-100 mb-1 group-hover:text-white transition-colors truncate">
                      {file.title}
                    </h3>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[0.75rem] font-bold text-[#a1a1aa] tracking-widest bg-white/[0.05] px-2 py-0.5 rounded-md">
                        {file.docType}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-[#52525b]" />
                      <span className="text-[0.75rem] font-semibold text-[#52525b] uppercase tracking-tighter">{file.size}</span>
                      <div className="w-1 h-1 rounded-full bg-[#52525b] hidden sm:block" />
                      <span className="text-[0.75rem] font-semibold text-[#52525b] hidden sm:block uppercase tracking-tighter">{file.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-4">
                  <button className="w-11 h-11 rounded-full bg-[#fbbf24]/5 text-[#fbbf24] border border-[#fbbf24]/10 flex items-center justify-center transition-all duration-300 hover:bg-gradient-to-br hover:from-[#fbbf24] hover:to-[#f59e0b] hover:text-black hover:scale-110 hover:shadow-lg hover:shadow-amber-500/40 active:scale-95">
                    <Download className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  </button>
                  <button className="w-11 h-11 rounded-full bg-white/[0.03] text-[#a1a1aa] flex items-center justify-center transition-all hover:bg-white/10 hover:text-white hover:scale-110 hidden sm:flex">
                    <MoreVertical className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
