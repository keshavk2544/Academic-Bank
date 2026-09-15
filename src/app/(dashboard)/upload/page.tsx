
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  Upload, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  GraduationCap,
  FileUp,
  X,
  FileText,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { LoadingOverlay } from "@/components/loading-overlay"
import { useFirestore } from "@/firebase"
import { collection, addDoc } from "firebase/firestore"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"
import { cn } from "@/lib/utils"

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

export default function UploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const db = useFirestore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    uploaderName: "",
    qid: "",
    fileName: "",
    resourceType: "",
    course: "",
    subject: "",
    year: "",
    faculty: ""
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Course selector state
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<'dept' | 'course'>('dept')
  const [tempDept, setTempDept] = useState<string | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/erp-session', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store'
        });
        
        if (res.status === 401) {
          router.replace("/");
          return;
        }

        const data = await res.json();

        if (data.authenticated && data.student) {
          setFormData(prev => ({
            ...prev,
            uploaderName: data.student.name || "",
            qid: data.student.studentId || data.student.enrollmentNo || ""
          }));
        } else {
          router.replace("/");
        }
      } catch (e) {
        console.error('[UPLOAD-SESSION-FETCH-ERROR]', e);
        toast({ 
          variant: "destructive", 
          title: "Session Error", 
          description: "Failed to verify identity for upload." 
        });
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [router, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, resourceType: value }))
  }

  const handleSelectDept = (dept: string) => {
    setTempDept(dept)
    setCurrentStep('course')
  }

  const handleSelectCourse = (course: string) => {
    setFormData(prev => ({ ...prev, course }))
    setSelectorOpen(false)
    setTimeout(() => {
      setCurrentStep('dept')
      setTempDept(null)
    }, 300)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Auto-fill file name if empty
      if (!formData.fileName) {
        setFormData(prev => ({ ...prev, fileName: file.name }))
      }
    }
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!formData.fileName) {
        setFormData(prev => ({ ...prev, fileName: file.name }))
      }
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please choose a document to upload to the vault.",
      })
      return
    }

    setIsSubmitting(true)
    
    const resourcePayload = {
      ...formData,
      year: formData.year ? parseInt(formData.year) : null,
      createdAt: new Date().toISOString(),
      status: "approved",
      size: (selectedFile.size / (1024 * 1024)).toFixed(1) + " MB"
    }

    const resourcesRef = collection(db, 'resources')
    
    addDoc(resourcesRef, resourcePayload)
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: 'resources',
          operation: 'create',
          requestResourceData: resourcePayload
        })
        errorEmitter.emit('permission-error', permissionError)
      })

    toast({
      title: "Vault Synchronized",
      description: "Your academic contribution is now available in the REPO.",
    })
    
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/academics")
    }, 800)
  }

  const isTypeSelected = formData.resourceType !== ""
  const isPYQ = formData.resourceType === "pyq"
  const isNotesOrIMP = formData.resourceType === "notes" || formData.resourceType === "imp"

  if (isLoading) return <LoadingOverlay status="Verifying Identity" />;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 pb-24 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle at 50% 0%,#1a1a24 0%,#050505 60%)] pointer-events-none -z-10" />

      <div className="w-full max-w-[600px] animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] backdrop-blur-2xl rounded-[1.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="text-center mb-8">
            <h1 className="text-[2rem] font-extrabold tracking-tight bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent leading-tight mb-1">
              Upload Resource
            </h1>
            <p className="text-[0.9rem] font-medium text-[#a1a1aa]">Add materials to the Quantum University Vault</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* File Selection Zone */}
            <div className="space-y-2">
              <Label className="text-[0.75rem] font-bold uppercase tracking-widest text-[#a1a1aa]">Document Selection</Label>
              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !selectedFile && fileInputRef.current?.click()}
                className={cn(
                  "relative group cursor-pointer h-40 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-3 overflow-hidden",
                  selectedFile 
                    ? "border-amber-500/50 bg-amber-500/5" 
                    : isDragging 
                      ? "border-amber-500 bg-amber-500/10 scale-[1.02]" 
                      : "border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/[0.02]"
                )}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm font-bold text-white truncate max-w-[200px]">{selectedFile.name}</p>
                      <p className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(); }}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/5 text-white hover:bg-red-500 hover:text-white transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="mt-1 flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-bold uppercase tracking-widest">
                      <Check className="w-3 h-3" /> Ready
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                      <FileUp className="w-7 h-7 text-zinc-500 group-hover:text-amber-500 transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">Drag & Drop Document</p>
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mt-1">or click to browse filesystem</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="uploaderName" className="text-[0.75rem] font-bold uppercase tracking-widest text-[#a1a1aa]">Uploader Name</Label>
                <Input 
                  id="uploaderName" 
                  value={formData.uploaderName} 
                  className="bg-black/40 border-white/[0.08] rounded-xl h-12 focus:ring-1 focus:ring-amber-500/50 cursor-not-allowed opacity-80" 
                  required 
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="qid" className="text-[0.75rem] font-bold uppercase tracking-widest text-[#a1a1aa]">QID</Label>
                <Input 
                  id="qid" 
                  placeholder="e.g. QID12345" 
                  value={formData.qid}
                  className="bg-black/40 border-white/[0.08] rounded-xl h-12 focus:ring-1 focus:ring-amber-500/50 cursor-not-allowed opacity-80" 
                  required 
                  readOnly
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fileName" className="text-[0.75rem] font-bold uppercase tracking-widest text-[#a1a1aa]">File Display Name</Label>
                <Input 
                  id="fileName" 
                  placeholder="e.g. End_Term_Networking.pdf" 
                  value={formData.fileName}
                  onChange={handleInputChange}
                  className="bg-black/40 border-white/[0.08] rounded-xl h-12 focus:ring-1 focus:ring-amber-500/50" 
                  required 
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="resourceType" className="text-[0.75rem] font-bold uppercase tracking-widest text-[#a1a1aa]">Resource Type</Label>
                <Select onValueChange={handleSelectChange} value={formData.resourceType}>
                  <SelectTrigger className="bg-black/40 border-white/[0.08] rounded-xl h-12 focus:ring-1 focus:ring-amber-500/50">
                    <SelectValue placeholder="Select what you are uploading..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050505] border-white/[0.08] text-white">
                    <SelectItem value="pyq">Previous Year Question (PYQ)</SelectItem>
                    <SelectItem value="notes">Class Notes</SelectItem>
                    <SelectItem value="imp">Important Topics (IMP)</SelectItem>
                    <SelectItem value="mft">Mid/Final Term (MFT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isTypeSelected && (
              <div className="pt-6 mt-6 border-t border-dashed border-white/[0.08] space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 gap-5">
                  
                  <div className="space-y-2">
                    <Label className="text-[0.75rem] font-bold uppercase tracking-widest text-[#a1a1aa]">Course Name</Label>
                    <Dialog open={selectorOpen} onOpenChange={setSelectorOpen}>
                      <DialogTrigger asChild>
                        <button 
                          type="button"
                          className="w-full bg-black/40 border border-white/[0.08] rounded-xl h-12 px-4 flex items-center justify-between text-sm transition-all focus:ring-1 focus:ring-amber-500/50 hover:bg-white/[0.05]"
                        >
                          <span className={formData.course ? "text-white font-medium" : "text-zinc-500"}>
                            {formData.course || "Select your course..."}
                          </span>
                          <ChevronRight className="w-4 h-4 text-zinc-500" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#0b0b0b] border-white/[0.08] text-white sm:max-w-[500px] p-0 overflow-hidden shadow-2xl">
                        <DialogHeader className="p-6 border-b border-white/[0.05] bg-white/[0.02]">
                          <DialogTitle className="text-xl font-bold flex items-center gap-3">
                            {currentStep === 'course' && (
                              <button 
                                onClick={() => setCurrentStep('dept')}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <ChevronLeft className="w-5 h-5 text-amber-500" />
                              </button>
                            )}
                            <div className="flex flex-col items-start gap-0.5">
                              <span className="text-xs uppercase tracking-[0.2em] text-amber-500/80 font-black">Drill-Down Vault</span>
                              <span>{currentStep === 'dept' ? "Select Department" : tempDept}</span>
                            </div>
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="p-2 max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
                          {currentStep === 'dept' ? (
                            <div className="grid grid-cols-1 gap-1">
                              {DEPARTMENTS.map(dept => (
                                <button
                                  key={dept.name}
                                  type="button"
                                  onClick={() => handleSelectDept(dept.name)}
                                  className="w-full p-4 text-left rounded-xl hover:bg-white/[0.05] transition-all flex items-center justify-between group"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:border-amber-500/30 group-hover:bg-amber-500/5 transition-all">
                                      <GraduationCap className="w-5 h-5 text-zinc-500 group-hover:text-amber-500" />
                                    </div>
                                    <span className="font-semibold text-zinc-300 group-hover:text-white">{dept.name}</span>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-1 p-2">
                              {DEPARTMENTS.find(d => d.name === tempDept)?.courses.map(course => (
                                <button
                                  key={course}
                                  type="button"
                                  onClick={() => handleSelectCourse(course)}
                                  className="w-full p-4 text-left rounded-xl hover:bg-white/[0.05] transition-all group relative overflow-hidden"
                                >
                                  <div className="absolute left-0 top-0 h-full w-1 bg-amber-500 opacity-0 group-hover:opacity-100 transition-all" />
                                  <p className="text-sm font-medium text-zinc-400 group-hover:text-white">{course}</p>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-[0.75rem] font-bold uppercase tracking-widest text-[#a1a1aa]">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="e.g. Data Structures" 
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="bg-black/40 border-white/[0.08] rounded-xl h-12 focus:ring-1 focus:ring-amber-500/50" 
                      required 
                    />
                  </div>

                  {isPYQ && (
                    <div className="space-y-2 animate-in fade-in duration-300">
                      <Label htmlFor="year" className="text-[0.75rem] font-bold uppercase tracking-widest text-[#a1a1aa]">Year of Examination</Label>
                      <Input 
                        id="year" 
                        type="number" 
                        placeholder="e.g. 2023" 
                        value={formData.year}
                        onChange={handleInputChange}
                        className="bg-black/40 border-white/[0.08] rounded-xl h-12 focus:ring-1 focus:ring-amber-500/50" 
                        required 
                      />
                    </div>
                  )}

                  {isNotesOrIMP && (
                    <div className="space-y-2 animate-in fade-in duration-300">
                      <Label htmlFor="faculty" className="text-[0.75rem] font-bold uppercase tracking-widest text-[#a1a1aa]">Faculty / Professor Name</Label>
                      <Input 
                        id="faculty" 
                        placeholder="e.g. Dr. A. Sharma" 
                        value={formData.faculty}
                        onChange={handleInputChange}
                        className="bg-black/40 border-white/[0.08] rounded-xl h-12 focus:ring-1 focus:ring-amber-500/50" 
                        required 
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.course || !selectedFile}
              className="w-full h-14 mt-8 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#fbbf24] text-black font-bold text-base rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Upload className="w-5 h-5 mr-2" strokeWidth={2.5} />
              {isSubmitting ? "Uploading..." : "Upload to Vault"}
            </Button>
          </form>
        </div>

        <button 
          onClick={() => router.back()}
          className="mt-8 mx-auto flex items-center gap-2 text-[#a1a1aa] hover:text-white transition-colors text-sm font-semibold uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" />
          Return to Vault
        </button>
      </div>
    </div>
  )
}
