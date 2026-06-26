
"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { 
  FileText, 
  Calculator, 
  Scan, 
  FileStack,
  ArrowRight,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Download,
  QrCode,
  CheckCircle2,
  Sparkles,
  User,
  Briefcase,
  GraduationCap
} from "lucide-react"
import { cn } from "@/lib/utils"

type ToolType = "pdf" | "cgpa" | "resume" | "qr" | null

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolType>(null)
  const { toast } = useToast()

  const tools = [
    { id: "pdf", icon: FileStack, title: "PDF Transformer", desc: "Merge, split, and convert academic documents.", color: "text-red-400", bg: "bg-red-400/10" },
    { id: "cgpa", icon: Calculator, title: "CGPA Analytics", desc: "Predict and calculate your academic performance.", color: "text-green-400", bg: "bg-green-400/10" },
    { id: "resume", icon: FileText, title: "Modern Resume", desc: "Build a tech-focused resume for placements.", color: "text-blue-400", bg: "bg-blue-400/10" },
    { id: "qr", icon: Scan, title: "Pulse Scanner", desc: "Generate or scan attendance pulse codes.", color: "text-purple-400", bg: "bg-purple-400/10" },
  ]

  const handleToolAction = (message: string) => {
    toast({
      title: "Action Initiated",
      description: message,
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
        <header className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {activeTool && (
                <button 
                  onClick={() => setActiveTool(null)}
                  className="p-2 -ml-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Smart Utils</h2>
            </div>
            <h1 className="text-3xl font-headline font-bold">
              {activeTool ? tools.find(t => t.id === activeTool)?.title : "Toolbox & Utilities"}
            </h1>
          </div>
        </header>

        {!activeTool ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <GlassCard 
                key={tool.id} 
                onClick={() => setActiveTool(tool.id as ToolType)}
                className="group cursor-pointer hover:border-primary/50 transition-all relative overflow-hidden flex flex-col h-full border-white/5"
              >
                <div className={cn("p-4 rounded-2xl border border-white/10 w-fit mb-4 transition-transform group-hover:scale-110", tool.bg, tool.color)}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold mb-2 flex items-center justify-between">
                  {tool.title} 
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{tool.desc}</p>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-primary/5 transition-colors" />
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            {activeTool === 'pdf' && <PdfTransformerUI onAction={handleToolAction} />}
            {activeTool === 'cgpa' && <CgpaAnalyticsUI />}
            {activeTool === 'resume' && <ResumeBuilderUI onAction={handleToolAction} />}
            {activeTool === 'qr' && <PulseScannerUI />}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function PdfTransformerUI({ onAction }: { onAction: (m: string) => void }) {
  const [files, setFiles] = useState<{name: string, size: string}[]>([])

  const addMockFile = () => {
    const names = ["Unit_2_Notes.pdf", "Lab_Report_Final.pdf", "Semester_Syllabus.pdf"]
    const newFile = { 
      name: names[Math.floor(Math.random() * names.length)], 
      size: (Math.random() * 5 + 1).toFixed(1) + " MB" 
    }
    setFiles([...files, newFile])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <GlassCard className="border-dashed border-2 border-white/10 p-12 text-center flex flex-col items-center gap-4 hover:border-primary/30 transition-all cursor-pointer group" onClick={addMockFile}>
          <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">Drag & Drop Documents</h3>
            <p className="text-sm text-muted-foreground">Select PDF, DOCX or Images to transform</p>
          </div>
          <Button variant="outline" className="glass border-white/10 mt-2">Browse Files</Button>
        </GlassCard>

        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Queued Files</h4>
            {files.map((file, i) => (
              <GlassCard key={i} className="p-4 flex items-center justify-between border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-400/10 text-red-400">
                    <FileStack className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{file.size}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                  className="p-2 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      <GlassCard className="h-fit space-y-6 border-white/10">
        <h3 className="text-lg font-bold">Quick Actions</h3>
        <div className="space-y-3">
          <Button 
            onClick={() => onAction("Merging files...")} 
            disabled={files.length < 2}
            className="w-full justify-start gap-3 h-12 bg-white/5 hover:bg-white/10 border-white/10 border text-white rounded-xl"
          >
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><FileStack className="w-4 h-4" /></div>
            Merge Documents
          </Button>
          <Button 
            onClick={() => onAction("Extracting pages...")} 
            disabled={files.length === 0}
            className="w-full justify-start gap-3 h-12 bg-white/5 hover:bg-white/10 border-white/10 border text-white rounded-xl"
          >
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400"><Scan className="w-4 h-4" /></div>
            Split PDF
          </Button>
          <Button 
            onClick={() => onAction("Compressing PDF...")} 
            disabled={files.length === 0}
            className="w-full justify-start gap-3 h-12 bg-white/5 hover:bg-white/10 border-white/10 border text-white rounded-xl"
          >
            <div className="p-1.5 rounded-lg bg-green-500/20 text-green-400"><Download className="w-4 h-4" /></div>
            Compress
          </Button>
        </div>
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
          <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">Storage Usage</p>
          <Progress value={32} className="h-1.5 mb-2" />
          <p className="text-[9px] text-muted-foreground">320 MB of 1 GB used</p>
        </div>
      </GlassCard>
    </div>
  )
}

function CgpaAnalyticsUI() {
  const [semesters, setSemesters] = useState([{ sgpa: "", credits: "" }])
  
  const cgpa = useMemo(() => {
    let totalGradePoints = 0
    let totalCredits = 0
    semesters.forEach(sem => {
      const s = parseFloat(sem.sgpa)
      const c = parseFloat(sem.credits)
      if (!isNaN(s) && !isNaN(c)) {
        totalGradePoints += s * c
        totalCredits += c
      }
    })
    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : "0.00"
  }, [semesters])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <GlassCard className="space-y-6 border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Grade Points Tracker</h3>
            <Button 
              size="sm" 
              onClick={() => setSemesters([...semesters, { sgpa: "", credits: "" }])}
              className="rounded-xl bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Semester
            </Button>
          </div>

          <div className="space-y-4">
            {semesters.map((sem, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 items-end animate-in fade-in slide-in-from-left-2">
                <div className="col-span-1 text-xs font-black opacity-30 h-10 flex items-center">0{i+1}</div>
                <div className="col-span-5 space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">SGPA</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="e.g. 8.5" 
                    value={sem.sgpa}
                    onChange={(e) => {
                      const newSems = [...semesters]
                      newSems[i].sgpa = e.target.value
                      setSemesters(newSems)
                    }}
                    className="glass border-white/10 h-10 rounded-xl"
                  />
                </div>
                <div className="col-span-4 space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Credits</Label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 24" 
                    value={sem.credits}
                    onChange={(e) => {
                      const newSems = [...semesters]
                      newSems[i].credits = e.target.value
                      setSemesters(newSems)
                    }}
                    className="glass border-white/10 h-10 rounded-xl"
                  />
                </div>
                <div className="col-span-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    disabled={semesters.length === 1}
                    onClick={() => setSemesters(semesters.filter((_, idx) => idx !== i))}
                    className="text-muted-foreground hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="space-y-6">
        <GlassCard className="text-center p-10 bg-primary/5 border-primary/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent -z-10" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Current Standing</h3>
          <div className="text-7xl font-headline font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            {cgpa}
          </div>
          <p className="text-xs text-muted-foreground mb-6 italic">Cumulative Grade Point Average</p>
          <Progress value={parseFloat(cgpa) * 10} className="h-2 mb-2 bg-white/5" />
          <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
            <span>Pass</span>
            <span>Distinction</span>
            <span>Perfect</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-white/10">
          <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" /> Academic Insights
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {parseFloat(cgpa) > 8.5 
              ? "You're in the top 10% of your cohort. Maintain this consistency for direct qualification in Tier-1 recruitment drives." 
              : "Focus on elective subjects in the next semester to boost your overall aggregate above 8.0."}
          </p>
        </GlassCard>
      </div>
    </div>
  )
}

function ResumeBuilderUI({ onAction }: { onAction: (m: string) => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <GlassCard className="space-y-8 border-white/10">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-3 glass border-white/10 p-1 h-12 rounded-2xl mb-8">
              <TabsTrigger value="personal" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
                <User className="w-4 h-4" /> <span className="hidden sm:inline">Identity</span>
              </TabsTrigger>
              <TabsTrigger value="academic" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> <span className="hidden sm:inline">Education</span>
              </TabsTrigger>
              <TabsTrigger value="work" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> <span className="hidden sm:inline">Experience</span>
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] pr-4">
              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground">Full Name</Label>
                    <Input placeholder="Alex Rivera" className="glass h-12 rounded-xl border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground">Professional Email</Label>
                    <Input placeholder="alex.rivera@edu.com" className="glass h-12 rounded-xl border-white/10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground">Technical Headline</Label>
                  <Input placeholder="Full Stack Developer | AI Enthusiast" className="glass h-12 rounded-xl border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground">Personal Summary</Label>
                  <textarea className="w-full min-h-[100px] glass p-4 rounded-xl border-white/10 bg-transparent text-sm focus:border-primary outline-none transition-all" placeholder="Tell recruiters about your unique perspective..." />
                </div>
              </TabsContent>

              <TabsContent value="academic" className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <h4 className="text-sm font-bold">Bachelor of Technology (CSE)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Institute Name" className="glass h-10 border-white/10" />
                    <Input placeholder="Passing Year" className="glass h-10 border-white/10" />
                  </div>
                </div>
                <Button variant="outline" className="w-full glass border-white/10 border-dashed h-12 rounded-xl">
                  <Plus className="w-4 h-4 mr-2" /> Add Certifications
                </Button>
              </TabsContent>

              <TabsContent value="work" className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold">New Project or Internship</h4>
                    <span className="text-[10px] font-black text-accent uppercase">Currently Active</span>
                  </div>
                  <Input placeholder="Role Title" className="glass h-10 border-white/10" />
                  <textarea className="w-full min-h-[100px] glass p-4 rounded-xl border-white/10 bg-transparent text-sm" placeholder="Key responsibilities and achievements..." />
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </GlassCard>
      </div>

      <div className="space-y-6">
        <GlassCard className="p-0 border-white/10 overflow-hidden">
          <div className="bg-primary/20 p-4 border-b border-white/10 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-widest">Live Preview</h4>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
          </div>
          <div className="p-6 space-y-4 scale-[0.8] origin-top opacity-50 select-none">
            <div className="h-4 w-1/2 bg-white/20 rounded-full" />
            <div className="h-2 w-full bg-white/10 rounded-full" />
            <div className="h-2 w-3/4 bg-white/10 rounded-full" />
            <div className="pt-8 grid grid-cols-3 gap-4">
              <div className="h-20 bg-white/5 rounded-xl" />
              <div className="h-20 bg-white/5 rounded-xl" />
              <div className="h-20 bg-white/5 rounded-xl" />
            </div>
          </div>
        </GlassCard>
        
        <Button 
          onClick={() => onAction("Compiling resume PDF...")}
          className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 font-bold"
        >
          Generate High-End Resume
        </Button>
      </div>
    </div>
  )
}

function PulseScannerUI() {
  const [view, setView] = useState<'scan' | 'my-qr'>('scan')
  
  return (
    <div className="flex flex-col items-center max-w-xl mx-auto space-y-8">
      <div className="flex p-1 glass rounded-2xl border border-white/10 w-full">
        <button 
          onClick={() => setView('scan')}
          className={cn(
            "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
            view === 'scan' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"
          )}
        >
          Scan Pulse
        </button>
        <button 
          onClick={() => setView('my-qr')}
          className={cn(
            "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
            view === 'my-qr' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"
          )}
        >
          My Pulse Code
        </button>
      </div>

      <GlassCard className="w-full p-8 flex flex-col items-center text-center border-white/10">
        {view === 'scan' ? (
          <>
            <div className="w-64 h-64 border-2 border-dashed border-primary/40 rounded-[40px] flex items-center justify-center bg-white/5 relative overflow-hidden mb-8 group">
              <Scan className="w-24 h-24 text-primary/30 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/60 shadow-[0_0_15px_rgba(139,92,246,1)] animate-scan" />
            </div>
            <h3 className="text-xl font-headline font-bold mb-2">Initialize Scanner</h3>
            <p className="text-xs text-muted-foreground mb-8">Access camera to scan attendance pulse or laboratory access codes.</p>
            <Button className="w-full h-12 bg-primary hover:bg-primary/90 rounded-xl font-bold">Start Session</Button>
          </>
        ) : (
          <>
            <div className="w-64 h-64 p-8 glass border-primary/30 rounded-[40px] flex items-center justify-center bg-white mb-8 group">
              <QrCode className="w-full h-full text-black" />
            </div>
            <div className="space-y-2 mb-8">
              <h3 className="text-xl font-headline font-bold">QR-748291</h3>
              <p className="text-xs text-muted-foreground">Show this to the supervisor to mark your attendance manually.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-muted-foreground uppercase font-black">Refresh In</p>
                <p className="text-sm font-bold text-accent">01:42</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-muted-foreground uppercase font-black">Status</p>
                <div className="flex items-center gap-1 text-sm font-bold text-green-400">
                  <CheckCircle2 className="w-3 h-3" /> Encrypted
                </div>
              </div>
            </div>
          </>
        )}
      </GlassCard>

      <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
        All pulse interactions are cryptographically verified and geo-fenced. <br />
        Attempting to share codes outside the campus zone will result in a trust score penalty.
      </p>
    </div>
  )
}
