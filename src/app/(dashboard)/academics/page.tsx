
"use client"

import { useState, useMemo } from "react"
import { 
  FileText, 
  Download, 
  Calendar,
  Code,
  MoreVertical,
  History
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useFirestore, useCollection } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"

const DOC_TYPE_OPTIONS = ["PYQ", "NOTES", "IMP TOPIC", "MFT"];

export default function AcademicsPage() {
  const db = useFirestore()
  const [selectedType, setSelectedType] = useState("ALL");

  const resourcesQuery = useMemo(() => query(
    collection(db, 'resources'),
    orderBy('createdAt', 'desc')
  ), [db])

  const { data: fetchedResources, loading } = useCollection(resourcesQuery)

  const filteredFiles = useMemo(() => {
    if (!fetchedResources) return [];
    return fetchedResources.filter(file => {
      const typeKey = (file.resourceType === 'imp' ? 'IMP TOPIC' : file.resourceType).toUpperCase();
      const matchesType = selectedType === "ALL" || typeKey === selectedType;
      return matchesType;
    });
  }, [fetchedResources, selectedType]);

  const getIcon = (docType: string) => {
    switch (docType.toUpperCase()) {
      case 'NOTES': return <FileText className="w-[18px] h-[18px] text-[#fbbf24]" strokeWidth={2.5} />;
      case 'MFT': return <Calendar className="w-[18px] h-[18px] text-[#34d399]" strokeWidth={2.5} />;
      case 'IMP': 
      case 'IMP TOPIC': return <Code className="w-[18px] h-[18px] text-[#60a5fa]" strokeWidth={2.5} />;
      case 'PYQ': return <History className="w-[18px] h-[18px] text-[#f87171]" strokeWidth={2.5} />;
      default: return <FileText className="w-[18px] h-[18px] text-[#fbbf24]" strokeWidth={2.5} />;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return 'Recent';
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
          {loading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-white/5 rounded-[1.25rem] border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredFiles.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10">
                  <p className="text-[#a1a1aa] font-medium">No resources found in this vault sector.</p>
                </div>
              ) : (
                filteredFiles.map((file: any) => (
                  <div 
                    key={file.id} 
                    className="group flex items-center justify-between p-5 bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] backdrop-blur-2xl rounded-[1.25rem] transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01] hover:border-white/20 hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
                  >
                    <div className="flex items-center gap-5 min-w-0">
                      {/* 3D Icon Box */}
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden group-hover:scale-110 group-hover:-rotate-2 transition-all duration-500">
                        <div className="absolute inset-0 bg-white/5 opacity-40 blur-xl z-0" />
                        <div className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                          {getIcon(file.resourceType)}
                        </div>
                      </div>
                      
                      <div className="min-w-0">
                        <h3 className="text-[1.05rem] font-bold text-zinc-100 mb-0.5 group-hover:text-[#fbbf24] transition-colors truncate">
                          {file.subject}
                        </h3>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[0.75rem] font-medium text-zinc-400 line-clamp-1">
                            {file.course} <span className="mx-1.5 text-zinc-600">•</span> {file.year}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[0.65rem] font-black text-black bg-[#fbbf24] px-1.5 py-0.5 rounded uppercase tracking-tighter">
                              {(() => {
                                let type = (file.resourceType === 'imp' ? 'IMP' : file.resourceType).toUpperCase();
                                if (file.resourceType === 'pyq' && file.examType) {
                                  type = `${type} ${file.examType === 'MID SEM' ? 'MID' : 'END'}`;
                                }
                                return type;
                              })()}
                            </span>
                            <span className="text-[0.7rem] font-bold text-[#52525b] uppercase tracking-widest">{file.size || '0.0 MB'}</span>
                            <div className="w-1 h-1 rounded-full bg-[#3f3f46] hidden sm:block" />
                            <span className="text-[0.7rem] font-bold text-[#52525b] hidden sm:block uppercase tracking-widest">{formatDate(file.createdAt)}</span>
                          </div>
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
                )
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
