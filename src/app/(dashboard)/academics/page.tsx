
"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { 
  FileText, 
  Download, 
  PlusCircle,
  Clock,
  User,
  Upload,
  CheckCircle2,
  Search,
  ChevronRight,
  Filter,
  X
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SUBJECT_OPTIONS = [
  "Machine Learning",
  "Computer Networks",
  "Data Structures",
  "Cloud Computing",
  "Cyber Security",
  "Operating Systems",
  "Database Management",
  "Artificial Intelligence",
  "Software Engineering",
  "Discrete Mathematics",
  "Professional Ethics",
  "Embedded Systems",
  "Mobile App Development",
  "Web Technologies"
];

const DOC_TYPE_OPTIONS = ["PYQ", "NOTES", "IMP TOPIC", "MFT"];

export default function AcademicsPage() {
  const [contributorName, setContributorName] = useState("Alex Rivera");

  const [files, setFiles] = useState([
    { title: "Machine Learning Unit 2", size: "4.2 MB", date: "2 days ago", color: "text-blue-400", type: "Machine Learning", docType: "NOTES", contributor: "Alex Rivera" },
    { title: "Computer Networks Lab Manual", size: "12.8 MB", date: "1 week ago", color: "text-purple-400", type: "Computer Networks", docType: "MFT", contributor: "Sarah Jenkins" },
    { title: "Operating Systems Lecture 15", size: "1.5 MB", date: "Today", color: "text-pink-400", type: "Operating Systems", docType: "NOTES", contributor: "Michael Chen" },
    { title: "Java Advanced Concepts", size: "2.1 MB", date: "3 days ago", color: "text-orange-400", type: "Web Technologies", docType: "IMP TOPIC", contributor: "Priya Sharma" },
    { title: "Database Normalization PDF", size: "890 KB", date: "5 days ago", color: "text-green-400", type: "Database Management", docType: "PYQ", contributor: "Jordan Lee" },
  ]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [newFile, setNewFile] = useState({ title: "", subject: "", fileName: "", docType: "" });

  const filteredSubjectsForDialog = SUBJECT_OPTIONS.filter(s => 
    s.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            file.contributor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || file.docType === selectedType;
      const matchesSubject = selectedSubject === "all" || file.type === selectedSubject;
      return matchesSearch && matchesType && matchesSubject;
    });
  }, [files, searchTerm, selectedType, selectedSubject]);

  const handleUpload = () => {
    if (!newFile.title || !newFile.subject || !newFile.docType) return;

    const addedFile = {
      title: newFile.title,
      size: "2.4 MB", 
      date: "Just now",
      color: "text-accent",
      type: newFile.subject,
      docType: newFile.docType,
      contributor: contributorName
    };

    setFiles([addedFile, ...files]);
    setNewFile({ title: "", subject: "", fileName: "", docType: "" });
    setSubjectSearch("");
    setIsDialogOpen(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedSubject("all");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <header className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] mb-1">Academic Vault</h2>
              <h1 className="text-2xl font-headline font-bold">Study Repository</h1>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-xl text-sm font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
                  <PlusCircle className="w-4 h-4" /> Contribute Material
                </button>
              </DialogTrigger>
              <DialogContent className="glass border-white/10 sm:max-w-[450px] rounded-[32px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline font-bold">Contribute to Vault</DialogTitle>
                  <p className="text-sm text-muted-foreground italic">Share your knowledge with the campus ecosystem.</p>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Contributor Name</Label>
                    <Input 
                      id="name" 
                      value={contributorName} 
                      disabled 
                      className="glass border-white/10 bg-white/5 h-12 rounded-xl text-white/50 cursor-not-allowed" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Document Title</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g., Data Structures Unit 3 Summary" 
                      value={newFile.title}
                      onChange={(e) => setNewFile({ ...newFile, title: e.target.value })}
                      className="glass border-white/10 bg-white/5 h-12 rounded-xl focus:border-accent" 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Subject Area</Label>
                    {!newFile.subject ? (
                      <div className="relative">
                        <div className="relative group">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                          <Input 
                            placeholder="Type to find subject..." 
                            value={subjectSearch}
                            onChange={(e) => setSubjectSearch(e.target.value)}
                            className="glass border-white/10 bg-white/5 h-12 pl-11 rounded-xl focus:border-accent transition-all"
                          />
                        </div>
                        {subjectSearch && (
                          <div className="absolute top-full left-0 right-0 mt-2 z-50 glass border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2">
                            <ScrollArea className="h-48">
                              <div className="p-2">
                                {filteredSubjectsForDialog.length === 0 ? (
                                  <p className="p-4 text-xs text-center text-muted-foreground">No subjects match.</p>
                                ) : (
                                  filteredSubjectsForDialog.map((sub) => (
                                    <button
                                      key={sub}
                                      type="button"
                                      className="w-full text-left px-4 py-3 rounded-xl text-sm hover:bg-white/10 transition-colors flex items-center justify-between group"
                                      onClick={() => {
                                        setNewFile({ ...newFile, subject: sub });
                                        setSubjectSearch("");
                                      }}
                                    >
                                      {sub}
                                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </button>
                                  ))
                                )}
                              </div>
                            </ScrollArea>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 rounded-xl glass border-accent/30 bg-accent/10 animate-in zoom-in-95">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-accent/20 text-accent">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold text-white">{newFile.subject}</span>
                        </div>
                        <button 
                          onClick={() => setNewFile({ ...newFile, subject: "" })}
                          className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-red-400 transition-colors"
                        >
                          Change
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Document Type</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {DOC_TYPE_OPTIONS.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewFile({ ...newFile, docType: type })}
                          className={cn(
                            "py-2 rounded-xl text-[10px] font-bold transition-all border",
                            newFile.docType === type 
                              ? "bg-accent text-accent-foreground border-accent shadow-[0_0_10px_rgba(72,118,245,0.3)]" 
                              : "glass border-white/10 text-muted-foreground hover:border-white/20 hover:text-white"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Upload File</Label>
                    <div className="relative group cursor-pointer">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setNewFile({ ...newFile, fileName: e.target.files?.[0]?.name || "" })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 group-hover:border-accent/50 transition-colors">
                        {newFile.fileName ? (
                          <>
                            <CheckCircle2 className="w-8 h-8 text-green-400" />
                            <span className="text-xs font-medium text-green-400 truncate max-w-[200px]">{newFile.fileName}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-muted-foreground group-hover:text-accent transition-colors" />
                            <span className="text-xs font-bold text-muted-foreground">Drop PDF/DOC or click to browse</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleUpload}
                    disabled={!newFile.title || !newFile.subject || !newFile.docType}
                    className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold text-base shadow-lg shadow-accent/20"
                  >
                    Initialize Contribution
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <GlassCard className="p-2 border-white/5 bg-white/5 flex flex-col md:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input 
                className="glass border-none h-9 pl-9 rounded-lg bg-white/5 text-xs focus:ring-1 focus:ring-accent/50" 
                placeholder="Quick search title or name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="glass border-none h-9 rounded-lg bg-white/5 min-w-[130px] text-xs">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  <SelectItem value="all">All Subjects</SelectItem>
                  {SUBJECT_OPTIONS.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="glass border-none h-9 rounded-lg bg-white/5 min-w-[110px] text-xs">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  <SelectItem value="all">All Types</SelectItem>
                  {DOC_TYPE_OPTIONS.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(searchTerm || selectedType !== "all" || selectedSubject !== "all") && (
                <button 
                  onClick={clearFilters}
                  className="p-2 rounded-lg glass border-none bg-white/5 text-muted-foreground hover:text-red-400 transition-colors"
                  title="Clear Filters"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </GlassCard>
        </header>

        <div className="flex flex-col gap-2">
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file, idx) => (
              <GlassCard key={idx} className="p-0 group hover:bg-white/5 transition-all border-white/5 relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-current ${file.color} opacity-30 group-hover:opacity-100 transition-opacity`} />
                
                <div className="flex items-center justify-between p-3 md:p-4">
                  <div className="flex items-center gap-4 md:gap-5 flex-1 min-w-0">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className={`p-2.5 md:p-3 rounded-xl bg-white/5 border border-white/10 ${file.color} transition-transform group-hover:scale-105`}>
                        <FileText className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <span className={cn("text-[8px] font-black uppercase tracking-wider opacity-80", file.color)}>
                        {file.docType}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{file.type}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-[9px] font-bold text-accent uppercase tracking-widest flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> {file.date}
                        </span>
                      </div>
                      <h4 className="font-headline font-bold text-sm md:text-base truncate leading-tight">{file.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                          <span className="font-bold text-white/40">{file.size}</span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-accent/70" /> 
                            <span className="text-white/60 font-medium">{file.contributor}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg glass border-white/10 text-[10px] font-bold text-muted-foreground hover:text-white hover:border-white/20 transition-all">
                      View
                    </button>
                    <button className="p-2.5 rounded-lg bg-accent text-accent-foreground shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="py-16 text-center glass rounded-[24px] border-white/5">
              <div className="inline-flex p-3 rounded-full bg-white/5 mb-3">
                <Filter className="w-6 h-6 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-lg font-headline font-bold mb-1">No matches found</h3>
              <p className="text-xs text-muted-foreground">Refine your filters to see more academic materials.</p>
              <button 
                onClick={clearFilters}
                className="mt-4 text-accent font-bold text-xs hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {filteredFiles.length > 0 && (
          <div className="py-6 text-center border border-dashed border-white/10 rounded-[24px] bg-white/5">
            <p className="text-xs text-muted-foreground italic">You've reached the end of the vault. <span className="text-accent font-bold cursor-pointer hover:underline">Load more files</span></p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
