"use client"

import { useState, useMemo } from "react"
import { 
  FileText, 
  Download, 
  Search,
  ChevronLeft,
  Calendar,
  Code,
  MoreVertical
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const DOC_TYPE_OPTIONS = ["PYQ", "NOTES", "IMP TOPIC", "MFT"];

export default function AcademicsPage() {
  const router = useRouter()

  const [files] = useState([
    { title: "Machine Learning Fundamentals", size: "4.2 MB", date: "2 hrs ago", type: "Machine Learning", docType: "NOTES", contributor: "Keshav Krishan" },
    { title: "Computer Networks End-Term", size: "12.8 MB", date: "Yesterday", type: "Computer Networks", docType: "MFT", contributor: "Sarah Jenkins" },
    { title: "Operating Systems Mid-Term", size: "1.5 MB", date: "Oct 12, 2024", type: "Operating Systems", docType: "NOTES", contributor: "Michael Chen" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            file.contributor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "ALL" || file.docType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [files, searchTerm, selectedType]);

  const getIcon = (docType: string) => {
    switch (docType) {
      case 'NOTES': return <FileText className="w-5 h-5 text-amber-400" />;
      case 'MFT': return <Calendar className="w-5 h-5 text-emerald-400" />;
      case 'IMP TOPIC': return <Code className="w-5 h-5 text-blue-400" />;
      default: return <FileText className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32 relative overflow-hidden">
      {/* Premium Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#1a1a24] to-transparent opacity-50 pointer-events-none" />

      <div className="max-w-[720px] mx-auto px-6 pt-12 space-y-10 relative z-10">
        
        {/* Header */}
        <header className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-forwards">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2 group cursor-pointer" onClick={() => router.back()}>
              <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Back</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Academic Vault
            </h1>
            <p className="text-sm font-medium text-muted-foreground">Quantum University Resource Archive</p>
          </div>
          <div className="w-20 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] backdrop-blur-xl flex items-center justify-center text-xs font-black tracking-tighter shadow-2xl hover:border-primary/40 transition-all hover:scale-105 hover:rotate-3">
            I_NAV
          </div>
        </header>

        {/* Search */}
        <div className="relative group animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-forwards opacity-0">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-amber-400" />
          <Input 
            placeholder="Search resources, topics, or subjects..." 
            className="h-14 bg-white/[0.08] border-white/[0.15] backdrop-blur-xl pl-14 rounded-2xl placeholder:text-muted-foreground/60 text-base focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all shadow-2xl text-white font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 fill-mode-forwards opacity-0">
          <button 
            onClick={() => setSelectedType("ALL")}
            className={cn(
              "px-6 py-2.5 rounded-2xl text-[11px] font-bold uppercase tracking-wider border shrink-0 transition-all backdrop-blur-md", 
              selectedType === "ALL" 
                ? "bg-gradient-to-br from-amber-400 to-amber-600 border-transparent text-black shadow-lg shadow-amber-500/30 translate-y-[-2px]" 
                : "bg-white/[0.03] border-white/[0.08] text-muted-foreground hover:bg-white/[0.06] hover:text-white"
            )}
          >
            All
          </button>
          {DOC_TYPE_OPTIONS.map(type => (
            <button 
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "px-6 py-2.5 rounded-2xl text-[11px] font-bold uppercase tracking-wider border shrink-0 transition-all backdrop-blur-md", 
                selectedType === type 
                  ? "bg-gradient-to-br from-amber-400 to-amber-600 border-transparent text-black shadow-lg shadow-amber-500/30 translate-y-[-2px]" 
                  : "bg-white/[0.03] border-white/[0.08] text-muted-foreground hover:bg-white/[0.06] hover:text-white"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* File Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-forwards opacity-0">
            <h2 className="text-xl font-bold tracking-tight">Recent Uploads</h2>
            <span className="text-[10px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              {filteredFiles.length} Files
            </span>
          </div>

          <div className="grid gap-4">
            {filteredFiles.map((file, idx) => (
              <div 
                key={idx} 
                className="group flex items-center justify-between p-5 bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] backdrop-blur-2xl rounded-[1.25rem] transition-all duration-500 hover:translate-y-[-5px] hover:scale-[1.01] hover:border-white/20 hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-bottom-6 fill-mode-forwards opacity-0"
                style={{ animationDelay: `${400 + idx * 100}ms` }}
              >
                <div className="flex items-center gap-5 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden group-hover:scale-108 group-hover:-rotate-2 transition-all duration-500">
                    <div className="absolute inset-0 bg-white/5 opacity-40 blur-xl z-0" />
                    <div className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      {getIcon(file.docType)}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-zinc-100 mb-1 group-hover:text-white transition-colors truncate">
                      {file.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest bg-white/[0.05] px-2 py-0.5 rounded-md border border-white/[0.05]">
                        {file.docType}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{file.size}</span>
                      <div className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:block" />
                      <span className="text-[10px] font-bold text-zinc-500 hidden sm:block uppercase tracking-tighter">{file.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-4">
                  <button className="w-11 h-11 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/10 flex items-center justify-center transition-all duration-300 hover:bg-gradient-to-br hover:from-amber-400 hover:to-amber-600 hover:text-black hover:scale-110 hover:shadow-lg hover:shadow-amber-500/40 active:scale-95 group/btn">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="w-11 h-11 rounded-full bg-white/[0.03] text-muted-foreground border border-transparent flex items-center justify-center transition-all hover:bg-white/[0.1] hover:text-white hover:scale-110 hidden sm:flex">
                    <MoreVertical className="w-5 h-5" />
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
