
"use client"

import { useState } from "react"
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
  Search
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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

export default function AcademicsPage() {
  const [files, setFiles] = useState([
    { title: "Machine Learning Unit 2", size: "4.2 MB", date: "2 days ago", color: "text-blue-400", type: "PDF Document", contributor: "Alex Rivera" },
    { title: "Computer Networks Lab Manual", size: "12.8 MB", date: "1 week ago", color: "text-purple-400", type: "Lab Guide", contributor: "Sarah Jenkins" },
    { title: "Operating Systems Lecture 15", size: "1.5 MB", date: "Today", color: "text-pink-400", type: "Lecture Notes", contributor: "Michael Chen" },
    { title: "Java Advanced Concepts", size: "2.1 MB", date: "3 days ago", color: "text-orange-400", type: "Core Subject", contributor: "Priya Sharma" },
    { title: "Database Normalization PDF", size: "890 KB", date: "5 days ago", color: "text-green-400", type: "Cheat Sheet", contributor: "Jordan Lee" },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubjectPopoverOpen, setIsSubjectPopoverOpen] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [newFile, setNewFile] = useState({ title: "", subject: "", fileName: "" });

  const filteredSubjects = SUBJECT_OPTIONS.filter(s => 
    s.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const handleUpload = () => {
    if (!newFile.title || !newFile.subject) return;

    const addedFile = {
      title: newFile.title,
      size: "2.4 MB", // Mock size
      date: "Just now",
      color: "text-accent",
      type: newFile.subject,
      contributor: "Alex Rivera" // Auto-filled from mock session
    };

    setFiles([addedFile, ...files]);
    setNewFile({ title: "", subject: "", fileName: "" });
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-1">Academic Vault</h2>
            <h1 className="text-3xl font-headline font-bold">Study Repository</h1>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground rounded-xl font-bold hover:bg-accent/90 transition-all shadow-[0_0_15px_rgba(72,118,245,0.4)]">
                <PlusCircle className="w-4 h-4" /> Contribute Material
              </button>
            </DialogTrigger>
            <DialogContent className="glass border-white/10 sm:max-w-[425px] rounded-[32px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-bold">Contribute to Vault</DialogTitle>
                <p className="text-sm text-muted-foreground italic">Share your knowledge with the campus ecosystem.</p>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Contributor Name</Label>
                  <Input 
                    id="name" 
                    value="Alex Rivera" 
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
                  <Label htmlFor="subject" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Subject Area</Label>
                  <Popover open={isSubjectPopoverOpen} onOpenChange={setIsSubjectPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isSubjectPopoverOpen}
                        className="glass border-white/10 bg-white/5 h-12 rounded-xl justify-between font-normal hover:bg-white/10"
                      >
                        <span className={newFile.subject ? "text-white" : "text-muted-foreground"}>
                          {newFile.subject || "Select Subject Area..."}
                        </span>
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0 glass border-white/10" align="start">
                      <div className="flex items-center border-b border-white/10 px-3 h-10">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Search subject..."
                          value={subjectSearch}
                          onChange={(e) => setSubjectSearch(e.target.value)}
                        />
                      </div>
                      <ScrollArea className="h-60">
                        <div className="p-1">
                          {filteredSubjects.length === 0 ? (
                            <p className="p-4 text-xs text-center text-muted-foreground">No subject found.</p>
                          ) : (
                            filteredSubjects.map((sub) => (
                              <button
                                key={sub}
                                className={cn(
                                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/10",
                                  newFile.subject === sub ? "bg-accent text-accent-foreground" : "text-foreground"
                                )}
                                onClick={() => {
                                  setNewFile({ ...newFile, subject: sub });
                                  setIsSubjectPopoverOpen(false);
                                  setSubjectSearch("");
                                }}
                              >
                                {sub}
                              </button>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
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
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 group-hover:border-accent/50 transition-colors">
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
                  disabled={!newFile.title || !newFile.subject}
                  className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold text-base shadow-[0_0_15px_rgba(72,118,245,0.4)]"
                >
                  Initialize Contribution
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <div className="flex flex-col gap-3">
          {files.map((file, idx) => (
            <GlassCard key={idx} className="p-0 group hover:bg-white/5 transition-all border-white/5 relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-current ${file.color} opacity-30 group-hover:opacity-100 transition-opacity`} />
              
              <div className="flex items-center justify-between p-4 md:p-5">
                <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
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
                      <div className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1.5">
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

        <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-[32px]">
          <p className="text-sm text-muted-foreground italic">You've reached the end of your recent academic repository. <span className="text-accent font-bold cursor-pointer hover:underline">Load more files</span></p>
        </div>
      </div>
    </DashboardLayout>
  )
}
