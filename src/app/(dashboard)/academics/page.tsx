"use client"

import { useState, useMemo, useEffect } from "react"
import { 
  FileText, 
  Download, 
  Calendar,
  Code,
  History,
  User,
  Hash,
  GraduationCap,
  CalendarDays,
  Database,
  FileCheck,
  File,
  ChevronLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useFirestore, useCollection } from "@/firebase"
import { collection, query, orderBy, setDoc, deleteDoc, doc } from "firebase/firestore"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

const DOC_TYPE_OPTIONS = ["PYQ", "NOTES", "IMP TOPIC", "MFT"];

const REACTION_TYPES = [
  { id: 'like', emoji: '👍', label: 'Like' },
  { id: 'dislike', emoji: '👎', label: 'Dislike' },
  { id: 'heart', emoji: '❤️', label: 'Heart' },
  { id: 'angry', emoji: '😡', label: 'Angry' },
];

export default function AcademicsPage() {
  const db = useFirestore()
  const { toast } = useToast()
  const [selectedType, setSelectedType] = useState("ALL");
  const [viewResource, setViewResource] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  
  // Fetch session to get user identity
  useEffect(() => {
    fetch('/api/auth/erp-session', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) setStudent(data.student);
      });
  }, []);

  const resourcesQuery = useMemo(() => query(
    collection(db, 'resources'),
    orderBy('createdAt', 'desc')
  ), [db])

  const reactionsQuery = useMemo(() => collection(db, 'reactions'), [db]);

  const { data: fetchedResources, loading } = useCollection(resourcesQuery)
  const { data: fetchedReactions } = useCollection(reactionsQuery)

  const userQid = student?.studentId || student?.enrollmentNo;

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

  // Reaction logic
  const handleReaction = (documentId: string, reactionType: string) => {
    if (!userQid) {
      toast({ variant: "destructive", title: "Identity Required", description: "Please log in to react to vault resources." });
      return;
    }

    const reactionId = `${documentId}_${userQid}`;
    const reactionRef = doc(db, 'reactions', reactionId);
    
    // Find if user already has this specific reaction
    const currentReaction = fetchedReactions?.find(r => r.id === reactionId);

    if (currentReaction?.reactionType === reactionType) {
      // Toggle off if same reaction
      deleteDoc(reactionRef);
    } else {
      // Set or update reaction
      setDoc(reactionRef, {
        documentId,
        userId: userQid,
        reactionType,
        createdAt: currentReaction?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  };

  const getDocReactions = (fileId: string) => {
    const fileReactions = fetchedReactions?.filter(r => r.documentId === fileId) || [];
    const summary: Record<string, number> = {};
    fileReactions.forEach(r => {
      summary[r.reactionType] = (summary[r.reactionType] || 0) + 1;
    });
    const userReaction = fileReactions.find(r => r.userId === userQid)?.reactionType;
    return { summary, userReaction };
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
            onClick={(e) => { e.stopPropagation(); setSelectedType("ALL"); }}
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
              onClick={(e) => { e.stopPropagation(); setSelectedType(type); }}
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
                <div key={i} className="h-20 bg-white/5 rounded-[1.25rem] border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {filteredFiles.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10">
                  <p className="text-[#a1a1aa] font-medium">No resources found in this vault sector.</p>
                </div>
              ) : (
                filteredFiles.map((file: any) => {
                  const { summary, userReaction } = getDocReactions(file.id);
                  
                  return (
                    <div 
                      key={file.id} 
                      onClick={() => setViewResource(file)}
                      className="group flex flex-col gap-3 p-3.5 bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] backdrop-blur-2xl rounded-[1.25rem] transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01] hover:border-white/20 hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] cursor-pointer relative"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          {/* 3D Icon Box */}
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden group-hover:scale-110 transition-all duration-500">
                            <div className="absolute inset-0 bg-white/5 opacity-40 blur-xl z-0" />
                            <div className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                              {getIcon(file.resourceType)}
                            </div>
                          </div>
                          
                          <div className="min-w-0">
                            <h3 className="text-[0.95rem] font-bold text-zinc-100 mb-0 group-hover:text-[#fbbf24] transition-colors truncate">
                              {file.subject}
                            </h3>
                            <p className="text-[0.7rem] font-medium text-zinc-400 line-clamp-1">
                              {file.course}
                            </p>
                          </div>
                        </div>

                        {/* Permanently Visible Reaction Bar */}
                        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-full p-1 shrink-0">
                          {REACTION_TYPES.map(r => {
                            const count = summary[r.id] || 0;
                            const isActive = userReaction === r.id;
                            return (
                              <button
                                key={r.id}
                                onClick={(e) => { e.stopPropagation(); handleReaction(file.id, r.id); }}
                                aria-label={r.label}
                                title={r.label}
                                className={cn(
                                  "flex items-center gap-1 px-1.5 py-0.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95",
                                  isActive 
                                    ? "bg-amber-500/15 border border-amber-500/30 opacity-100 blur-0 shadow-[0_0_8px_rgba(245,158,11,0.2)]" 
                                    : "opacity-35 blur-[0.5px] hover:opacity-100 hover:blur-0"
                                )}
                              >
                                <span className="text-base">{r.emoji}</span>
                                {count > 0 && <span className={cn("text-[9px] font-black", isActive ? "text-amber-500" : "text-zinc-500")}>{count}</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <span className="text-[0.6rem] font-black text-black bg-[#fbbf24] px-1.5 py-0.5 rounded uppercase tracking-tighter">
                            {(() => {
                              let type = (file.resourceType === 'imp' ? 'IMP' : file.resourceType).toUpperCase();
                              if (file.resourceType === 'pyq' && file.examType) {
                                type = `${type} ${file.examType === 'MID SEM' ? 'MID' : 'END'}`;
                              }
                              return type;
                            })()}
                          </span>
                          <span className="text-[0.65rem] font-bold text-[#52525b] uppercase tracking-widest">{file.year}</span>
                          <div className="w-1 h-1 rounded-full bg-[#3f3f46]" />
                          <span className="text-[0.65rem] font-bold text-[#52525b] uppercase tracking-widest">{file.size || '0.0 MB'}</span>
                          <div className="w-1 h-1 rounded-full bg-[#3f3f46] hidden sm:block" />
                          <span className="text-[0.65rem] font-bold text-[#52525b] hidden sm:block uppercase tracking-widest">{formatDate(file.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); /* Logic for actual download */ }}
                            className="w-9 h-9 rounded-full bg-[#fbbf24]/5 text-[#fbbf24] border border-[#fbbf24]/10 flex items-center justify-center transition-all duration-300 hover:bg-gradient-to-br hover:from-[#fbbf24] hover:to-[#f59e0b] hover:text-black hover:scale-110 active:scale-95"
                          >
                            <Download className="w-[16px] h-[16px]" strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </section>

        {/* Resource Details Dialog */}
        <Dialog open={!!viewResource} onOpenChange={(open) => !open && setViewResource(null)}>
          <DialogContent className="bg-[#0b0b0b] border border-white/10 text-white max-w-[440px] rounded-[2rem] overflow-hidden p-0 shadow-2xl">
            <DialogHeader className="p-6 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black">
              <DialogTitle className="text-xl font-black uppercase tracking-tighter">Docs</DialogTitle>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Academic Vault Record</p>
            </DialogHeader>

            <ScrollArea className="max-h-[500px]">
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Subject</h4>
                      <p className="text-sm font-bold text-zinc-100">{viewResource?.subject}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                      <File className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">File Name</h4>
                      <p className="text-sm font-bold text-zinc-100 truncate max-w-[280px]">{viewResource?.fileName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Course</h4>
                      <p className="text-sm font-bold text-zinc-100 leading-tight">{viewResource?.course}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Year</h4>
                        <p className="text-sm font-bold text-zinc-100">{viewResource?.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                        <Database className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">File Size</h4>
                        <p className="text-sm font-bold text-zinc-100">{viewResource?.size || '0.0 MB'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Uploader</h4>
                        <p className="text-sm font-bold text-zinc-100">{viewResource?.uploaderName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform">
                        <Hash className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Enrollment / QID</h4>
                        <p className="text-sm font-mono font-bold text-zinc-100">{viewResource?.qid}</p>
                      </div>
                    </div>

                    {viewResource?.faculty && (
                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Faculty</h4>
                          <p className="text-sm font-bold text-zinc-100">{viewResource?.faculty}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => {/* Logic for actual download */}}
                  className="w-full py-4 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform active:scale-95"
                >
                  Retrieve Document
                </button>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
