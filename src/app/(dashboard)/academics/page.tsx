
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
  Search,
  X,
  ChevronDown,
  ChevronRight,
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

const TYPE_LABELS: Record<string, string> = {
  "ALL": "Any Type",
  "PYQ (Mid)": "PYQ (Mid)",
  "PYQ (End)": "PYQ (End)",
  "MFT": "MFT",
  "Important Topics": "Important Topics",
  "Notes": "Notes"
};

const REACTION_TYPES = [
  { id: 'like', emoji: '👍', label: 'Like' },
  { id: 'dislike', emoji: '👎', label: 'Dislike' },
];

const DEPARTMENTS = [
  {
    name: "Engineering & Technology",
    courses: [
      "B.Tech Computer Science & Engineering (Core)",
      "B.Tech CSE (AI & Machine Learning)",
      "B.Tech CSE (Cyber Security)",
      "B.Tech CSE (Cloud Computing & DevOps)",
      "B.Tech CSE (Full Stack Web Development)",
      "B.Tech CSE (Data Science)",
      "B.Tech Mechanical Engineering",
      "B.Tech Civil Engineering",
      "B.Tech Mechatronics Engineering",
      "BCA (General)",
      "BCA (Cyber Security)",
      "BCA (Data Science)",
      "BCA (Artificial Intelligence & Machine Learning)",
      "MCA (Master of Computer Applications)",
      "M.Tech Computer Science & Engineering",
      "M.Tech Thermal Engineering",
      "M.Tech Structural Engineering",
      "Diploma in Computer Science & Engineering",
      "Diploma in Mechanical Engineering",
      "Diploma in Civil Engineering",
      "Diploma in Electrical Engineering"
    ]
  },
  {
    name: "Business & Management",
    courses: [
      "BBA (General Management)",
      "BBA (Digital Marketing)",
      "BBA (Banking & Insurance)",
      "BBA (Business Analytics)",
      "BBA (Family Business & Entrepreneurship)",
      "B.Com (Hons)",
      "B.Com (Banking & Insurance)",
      "B.Com (International Finance & Accounting)",
      "MBA (Dual Specialization: Marketing & HR)",
      "MBA (Dual Specialization: Marketing & Finance)",
      "MBA (Dual Specialization: Finance & HR)",
      "MBA (Dual Specialization: Operations & Supply Chain)",
      "MBA (Dual Specialization: International Business)",
      "MBA (Business Analytics)",
      "MBA (Logistics & Supply Chain Management)",
      "M.Com"
    ]
  },
  {
    name: "Health Sciences & Pharmacy",
    courses: [
      "B.Pharm (Bachelor of Pharmacy)",
      "D.Pharm (Diploma in Pharmacy)",
      "B.Sc. Medical Laboratory Technology (BMLT)",
      "B.Sc. Medical Radiology & Imaging Technology (BMRIT)",
      "B.Sc. Nutrition & Dietetics",
      "M.Sc. Nutrition & Dietetics"
    ]
  },
  {
    name: "Agricultural Studies",
    courses: [
      "B.Sc. (Hons) Agriculture",
      "M.Sc. Agriculture (Agronomy)",
      "M.Sc. Agriculture (Horticulture)",
      "M.Sc. Agriculture (Genetics & Plant Breeding)"
    ]
  },
  {
    name: "Media, Design & Animation",
    courses: [
      "BA (Hons) Journalism & Mass Communication (BJMC)",
      "MA Journalism & Mass Communication",
      "B.Des Graphic Design",
      "B.Des UI/UX Design",
      "B.Des Interior Design",
      "B.Sc. Animation & VFX",
      "Diploma in Animation & Graphic Design"
    ]
  },
  {
    name: "Law",
    courses: [
      "BA LLB (Hons) - 5-Year Integrated",
      "BBA LLB (Hons) - 5-Year Integrated",
      "LLM (Corporate Law)",
      "LLM (Criminal Law)"
    ]
  },
  {
    name: "Hospitality & Tourism",
    courses: [
      "BHM (Bachelor of Hotel Management)",
      "Diploma in Hotel Management (DHM)"
    ]
  },
  {
    name: "Sciences & Humanities",
    courses: [
      "B.Sc. (Hons) Physics",
      "B.Sc. (Hons) Chemistry",
      "B.Sc. (Hons) Mathematics",
      "M.Sc. Physics",
      "M.Sc. Chemistry",
      "M.Sc. Mathematics",
      "BA (Hons) English",
      "BA (Hons) Psychology",
      "BA (Hons) Economics",
      "MA English",
      "MA Economics"
    ]
  }
];

export default function AcademicsPage() {
  const db = useFirestore()
  const { toast } = useToast()
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedCourse, setSelectedCourse] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [viewResource, setViewResource] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  
  // Selector state for Course filter
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<'dept' | 'course'>('dept')
  const [tempDept, setTempDept] = useState<string | null>(null)

  const handleSelectDept = (dept: string) => {
    setTempDept(dept)
    setCurrentStep('course')
  }

  const handleSelectCourse = (course: string) => {
    setSelectedCourse(course)
    setSelectorOpen(false)
    setTimeout(() => {
      setCurrentStep('dept')
      setTempDept(null)
    }, 300)
  }

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

  // Dynamic filter options for Year (keep dynamic based on existing data)
  const dynamicYears = useMemo(() => {
    if (!fetchedResources) return [];
    const years = fetchedResources.map(f => f.year?.toString()).filter(Boolean);
    return Array.from(new Set(years)).sort((a, b) => b.localeCompare(a));
  }, [fetchedResources]);

  const filteredFiles = useMemo(() => {
    if (!fetchedResources) return [];
    return fetchedResources.filter(file => {
      // Search logic
      const matchesSearch = !searchQuery || [
        file.subject,
        file.course,
        file.resourceType,
        file.fileName,
        file.faculty
      ].some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()));

      // Type logic
      let matchesType = true;
      if (selectedType !== "ALL") {
        if (selectedType === "PYQ (Mid)") matchesType = file.resourceType === 'pyq' && file.examType === 'MID SEM';
        else if (selectedType === "PYQ (End)") matchesType = file.resourceType === 'pyq' && file.examType === 'END SEM';
        else if (selectedType === "MFT") matchesType = file.resourceType === 'mft';
        else if (selectedType === "Important Topics") matchesType = file.resourceType === 'imp';
        else if (selectedType === "Notes") matchesType = file.resourceType === 'notes';
      }

      // Course logic
      const matchesCourse = selectedCourse === "ALL" || file.course === selectedCourse;

      // Year logic
      const matchesYear = selectedYear === "ALL" || file.year?.toString() === selectedYear;

      return matchesSearch && matchesType && matchesCourse && matchesYear;
    });
  }, [fetchedResources, searchQuery, selectedType, selectedCourse, selectedYear]);

  const isFilterActive = searchQuery || selectedType !== "ALL" || selectedCourse !== "ALL" || selectedYear !== "ALL";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("ALL");
    setSelectedCourse("ALL");
    setSelectedYear("ALL");
  };

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

  const handleReaction = (documentId: string, reactionType: string) => {
    if (!userQid) {
      toast({ variant: "destructive", title: "Identity Required", description: "Please log in to react to vault resources." });
      return;
    }

    const reactionId = `${documentId}_${userQid}`;
    const reactionRef = doc(db, 'reactions', reactionId);
    const currentReaction = fetchedReactions?.find(r => r.id === reactionId);

    if (currentReaction?.reactionType === reactionType) {
      deleteDoc(reactionRef);
    } else {
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,#1a1a24_0%,transparent_60%)] pointer-events-none -z-10" />

      <div className="max-w-[720px] mx-auto px-6 pt-4 flex flex-col gap-6 relative z-10">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-[2rem] font-extrabold tracking-tight bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent leading-tight font-headline">
              Academic Vault
            </h1>
            <p className="text-[0.85rem] font-medium text-[#a1a1aa]">Quantum University Resource Archive</p>
          </div>
        </header>

        {/* Search & Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
            <Input 
              placeholder="Search resources, subjects, topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border-white/[0.08] rounded-2xl h-12 pl-11 pr-4 text-sm focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all backdrop-blur-xl"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-zinc-500"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Dropdown Row */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className={cn(
                "h-9 min-w-[120px] rounded-xl bg-white/[0.03] border-white/[0.08] text-[11px] font-bold uppercase tracking-wider transition-all",
                selectedType !== "ALL" && "border-amber-500/50 bg-amber-500/5 text-amber-500"
              )}>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/10 text-white">
                <SelectItem value="ALL">Any Type</SelectItem>
                <SelectItem value="PYQ (Mid)">PYQ (Mid)</SelectItem>
                <SelectItem value="PYQ (End)">PYQ (End)</SelectItem>
                <SelectItem value="MFT">MFT</SelectItem>
                <SelectItem value="Important Topics">Important Topics</SelectItem>
                <SelectItem value="Notes">Notes</SelectItem>
              </SelectContent>
            </Select>

            {/* Course Filter (Dialog-based selector) */}
            <Dialog open={selectorOpen} onOpenChange={setSelectorOpen}>
              <DialogTrigger asChild>
                <button className={cn(
                  "h-9 min-w-[120px] px-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-between gap-2",
                  selectedCourse !== "ALL" && "border-amber-500/50 bg-amber-500/5 text-amber-500"
                )}>
                  <span className="truncate max-w-[80px]">
                    {selectedCourse === "ALL" ? "Course" : selectedCourse}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-50 shrink-0" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#0b0b0b] border-white/[0.08] text-white sm:max-w-[400px] p-0 shadow-2xl rounded-[2rem] overflow-hidden">
                <DialogHeader className="p-4 border-b border-white/[0.05]">
                  <DialogTitle className="text-base font-bold flex items-center gap-2">
                    {currentStep === 'course' && (
                      <ChevronLeft className="w-4 h-4 text-amber-500 cursor-pointer" onClick={() => setCurrentStep('dept')} />
                    )}
                    <span>{currentStep === 'dept' ? "Filter by Department" : tempDept}</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="p-1 max-h-[350px] overflow-y-auto scrollbar-none">
                  {currentStep === 'dept' ? (
                    <>
                      <button
                        onClick={() => { setSelectedCourse("ALL"); setSelectorOpen(false); }}
                        className="w-full p-3 text-left rounded-lg hover:bg-white/[0.05] transition-all flex items-center justify-between text-[12px] text-amber-500 font-bold"
                      >
                        <span>Any Course</span>
                      </button>
                      {DEPARTMENTS.map(dept => (
                        <button
                          key={dept.name}
                          onClick={() => handleSelectDept(dept.name)}
                          className="w-full p-3 text-left rounded-lg hover:bg-white/[0.05] transition-all flex items-center justify-between text-[12px]"
                        >
                          <span className="font-semibold text-zinc-300">{dept.name}</span>
                          <ChevronRight className="w-3 h-3 text-zinc-600" />
                        </button>
                      ))}
                    </>
                  ) : (
                    DEPARTMENTS.find(d => d.name === tempDept)?.courses.map(course => (
                      <button
                        key={course}
                        onClick={() => handleSelectCourse(course)}
                        className="w-full p-3 text-left rounded-lg hover:bg-white/[0.05] text-[11px] text-zinc-400 hover:text-white"
                      >
                        {course}
                      </button>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Year Filter */}
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className={cn(
                "h-9 min-w-[100px] rounded-xl bg-white/[0.03] border-white/[0.08] text-[11px] font-bold uppercase tracking-wider transition-all",
                selectedYear !== "ALL" && "border-amber-500/50 bg-amber-500/5 text-amber-500"
              )}>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/10 text-white">
                <SelectItem value="ALL">Any Year</SelectItem>
                {dynamicYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              {filteredFiles.length} {filteredFiles.length === 1 ? 'File' : 'Files'} Found
            </span>
            {isFilterActive && (
              <button 
                onClick={clearFilters}
                className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
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
            <div className="flex flex-col gap-3.5">
              {filteredFiles.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.01] rounded-[2.5rem] border border-dashed border-white/10 animate-in fade-in duration-700">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-zinc-600" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-200 mb-1">No resources found</h3>
                  <p className="text-xs font-medium text-[#a1a1aa] max-w-[240px] mx-auto leading-relaxed">
                    Try adjusting your search query or filters to scan other vault sectors.
                  </p>
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

                        {/* Reaction Bar */}
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
