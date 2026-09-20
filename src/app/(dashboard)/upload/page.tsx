"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  Upload, 
  ChevronLeft, 
  ChevronRight,
  FileUp,
  X,
  FileText,
  AlertTriangle
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
import { useFirestore, useStorage } from "@/firebase"
import { collection, addDoc } from "firebase/firestore"
import { ref, uploadBytesResumable, deleteObject } from "firebase/storage"
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
  }
];

const VALID_YEARS = Array.from({ length: 13 }, (_, i) => (2018 + i).toString());
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export default function UploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const db = useFirestore()
  const storage = useStorage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    uploaderName: "",
    qid: "",
    fileName: "",
    resourceType: "",
    examType: "",
    course: "",
    subject: "",
    year: "",
    faculty: ""
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
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
    setFormData(prev => ({ ...prev, resourceType: value, examType: "" }))
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

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "File size must be 20 MB or less."
      });
      return false;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Unsupported type",
        description: "Only PDF and DOC files are allowed."
      });
      return false;
    }

    return true;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) {
      setSelectedFile(file)
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
    if (file && validateFile(file)) {
      setSelectedFile(file)
      if (!formData.fileName) {
        setFormData(prev => ({ ...prev, fileName: file.name }))
      }
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || !selectedFile) return;

    setIsSubmitting(true)
    setUploadProgress(0)
    
    // 1. Generate unique ID
    const docId = crypto.randomUUID();
    const safeName = selectedFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const storagePath = `resources/${docId}/${safeName}`;
    const storageRef = ref(storage, storagePath);

    // 2. Execute Streamed Upload
    const uploadTask = uploadBytesResumable(storageRef, selectedFile, {
      contentType: selectedFile.type
    });

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(prev => prev !== progress ? progress : prev);
      }, 
      (error) => {
        console.error('[UPLOAD-ERROR]', error);
        setIsSubmitting(false);
        setUploadProgress(0);
        
        let errorTitle = "Sync Interrupted";
        let errorMsg = "An unexpected error occurred during upload.";

        switch (error.code) {
          case 'storage/unauthorized':
            errorTitle = "Access Denied";
            errorMsg = "Check your Firebase Storage Security Rules.";
            break;
          case 'storage/quota-exceeded':
            errorTitle = "Storage Full";
            errorMsg = "The project storage quota has been reached.";
            break;
        }

        toast({
          variant: "destructive",
          title: errorTitle,
          description: errorMsg
        });
      }, 
      async () => {
        try {
          // 3. Finalize Metadata in Firestore
          const resourcePayload = {
            ...formData,
            year: formData.year ? parseInt(formData.year) : null,
            createdAt: new Date().toISOString(),
            status: "approved",
            size: (selectedFile.size / (1024 * 1024)).toFixed(1) + " MB",
            fileSize: selectedFile.size,
            contentType: selectedFile.type,
            storagePath: storagePath
          };

          const resourcesRef = collection(db, 'resources');
          await addDoc(resourcesRef, resourcePayload);
          
          toast({ title: "Vault Synchronized", description: "Document added successfully." });
          router.push("/academics");
        } catch (error) {
          console.error('[FIRESTORE-SYNC-ERROR]', error);
          await deleteObject(storageRef).catch(() => {});
          setIsSubmitting(false);
          setUploadProgress(0);
          toast({ variant: "destructive", title: "Indexing Failed", description: "Document uploaded but index could not be created." });
        }
      }
    );
  }

  const isTypeSelected = formData.resourceType !== ""

  if (isLoading) return <LoadingOverlay status="Verifying Identity" />;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 pb-20 relative overflow-hidden selection:bg-amber-500 selection:text-black font-body">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle at 50% 0%,#1a1a24 0%,#050505 60%)] pointer-events-none -z-10" />

      <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] backdrop-blur-2xl rounded-[1.25rem] p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="text-center mb-5">
            <h1 className="text-[1.25rem] font-extrabold tracking-tight bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent leading-tight mb-0.5 font-headline">
              Upload Resource
            </h1>
            <p className="text-[0.7rem] font-medium text-[#a1a1aa]">Add PDF or DOC to the Vault</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[0.6rem] font-bold uppercase tracking-widest text-[#a1a1aa]">Document</Label>
                <div className="flex items-center gap-1 text-[8px] font-black text-amber-500/60 uppercase">
                  <AlertTriangle className="w-2 h-2" /> PDF / DOC • Limit: 20MB
                </div>
              </div>
              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !selectedFile && !isSubmitting && fileInputRef.current?.click()}
                className={cn(
                  "relative group cursor-pointer h-20 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-1.5 overflow-hidden",
                  selectedFile 
                    ? "border-amber-500/50 bg-amber-500/5" 
                    : isDragging 
                      ? "border-amber-500 bg-amber-500/10 scale-[1.01]" 
                      : "border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/[0.02]",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  disabled={isSubmitting}
                />
                
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-1 animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-[10px] font-bold text-white truncate max-w-[150px]">{selectedFile.name}</p>
                      <p className="text-[8px] font-bold text-amber-500/70 uppercase tracking-widest">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    {!isSubmitting && (
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeFile(); }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/5 text-white hover:bg-red-500 hover:text-white transition-all"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <FileUp className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-500 transition-colors" />
                    <p className="text-[9px] font-bold text-zinc-400">Drag or Click to Upload</p>
                  </>
                )}

                {isSubmitting && (
                  <div className="absolute bottom-0 left-0 h-1 bg-amber-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                )}
              </div>
              {isSubmitting && (
                <p className="text-[9px] font-black text-center text-amber-500 uppercase tracking-widest mt-1">
                  Synchronizing... {uploadProgress}%
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="uploaderName" className="text-[0.6rem] font-bold uppercase tracking-widest text-[#a1a1aa]">Name</Label>
                <Input id="uploaderName" value={formData.uploaderName} className="bg-black/40 border-white/[0.08] rounded-lg h-9 text-[11px] opacity-70" readOnly />
              </div>
              <div className="space-y-1">
                <Label htmlFor="qid" className="text-[0.6rem] font-bold uppercase tracking-widest text-[#a1a1aa]">QID</Label>
                <Input id="qid" value={formData.qid} className="bg-black/40 border-white/[0.08] rounded-lg h-9 text-[11px] opacity-70" readOnly />
              </div>

              <div className="space-y-1 col-span-2">
                <Label htmlFor="fileName" className="text-[0.6rem] font-bold uppercase tracking-widest text-[#a1a1aa]">File Display Name</Label>
                <Input id="fileName" value={formData.fileName} onChange={handleInputChange} className="bg-black/40 border-white/[0.08] rounded-lg h-9 text-[11px]" required disabled={isSubmitting} />
              </div>

              <div className="space-y-1 col-span-2">
                <Label htmlFor="resourceType" className="text-[0.6rem] font-bold uppercase tracking-widest text-[#a1a1aa]">Type</Label>
                <Select onValueChange={handleSelectChange} value={formData.resourceType} disabled={isSubmitting}>
                  <SelectTrigger className="bg-black/40 border-white/[0.08] rounded-lg h-9 text-[11px]">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050505] border-white/[0.08] text-white">
                    <SelectItem value="pyq">PYQ</SelectItem>
                    <SelectItem value="notes">Notes</SelectItem>
                    <SelectItem value="imp">IMP Topics</SelectItem>
                    <SelectItem value="mft">MFT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isTypeSelected && (
              <div className="pt-3 mt-3 border-t border-dashed border-white/[0.08] space-y-3 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <Label className="text-[0.6rem] font-bold uppercase tracking-widest text-[#a1a1aa]">Course</Label>
                  <Dialog open={selectorOpen} onOpenChange={setSelectorOpen}>
                    <DialogTrigger asChild>
                      <button type="button" className="w-full bg-black/40 border border-white/[0.08] rounded-lg h-9 px-3 flex items-center justify-between text-[11px] hover:bg-white/[0.05]" disabled={isSubmitting}>
                        <span className={formData.course ? "text-white truncate" : "text-zinc-500"}>{formData.course || "Select course..."}</span>
                        <ChevronRight className="w-3 h-3 text-zinc-500" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0b0b0b] border-white/[0.08] text-white sm:max-w-[400px] p-0 shadow-2xl rounded-[2rem] overflow-hidden">
                      <DialogHeader className="p-4 border-b border-white/[0.05]">
                        <DialogTitle className="text-base font-bold flex items-center gap-2">
                          {currentStep === 'course' && <ChevronLeft className="w-4 h-4 text-amber-500 cursor-pointer" onClick={() => setCurrentStep('dept')} />}
                          <span>{currentStep === 'dept' ? "Departments" : tempDept}</span>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="p-1 max-h-[350px] overflow-y-auto scrollbar-none">
                        {currentStep === 'dept' ? (
                          DEPARTMENTS.map(dept => (
                            <button key={dept.name} type="button" onClick={() => handleSelectDept(dept.name)} className="w-full p-3 text-left rounded-lg hover:bg-white/[0.05] transition-all flex items-center justify-between text-[12px]">
                              <span className="font-semibold text-zinc-300">{dept.name}</span>
                              <ChevronRight className="w-3 h-3 text-zinc-600" />
                            </button>
                          ))
                        ) : (
                          DEPARTMENTS.find(d => d.name === tempDept)?.courses.map(course => (
                            <button key={course} type="button" onClick={() => handleSelectCourse(course)} className="w-full p-3 text-left rounded-lg hover:bg-white/[0.05] text-[11px] text-zinc-400 hover:text-white">
                              {course}
                            </button>
                          ))
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="subject" className="text-[0.6rem] font-bold uppercase tracking-widest text-[#a1a1aa]">Subject</Label>
                  <Input id="subject" value={formData.subject} onChange={handleInputChange} className="bg-black/40 border-white/[0.08] rounded-lg h-9 text-[11px]" required disabled={isSubmitting} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="year" className="text-[0.6rem] font-bold uppercase tracking-widest text-[#a1a1aa]">Document Year</Label>
                  <Select onValueChange={(val) => setFormData(prev => ({...prev, year: val}))} value={formData.year} disabled={isSubmitting}>
                    <SelectTrigger className="bg-black/40 border-white/[0.08] rounded-lg h-9 text-[11px]">
                      <SelectValue placeholder="Select year..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#050505] border-white/[0.08] text-white">
                      {VALID_YEARS.map(yr => <SelectItem key={yr} value={yr}>{yr}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.course || !formData.year || !selectedFile}
              className="w-full h-10 mt-4 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black font-bold text-[13px] rounded-lg shadow-lg active:scale-95"
            >
              <Upload className="w-3 h-3 mr-2" strokeWidth={2.5} />
              {isSubmitting ? `Synchronizing... ${uploadProgress}%` : "Upload to Vault"}
            </Button>
          </form>
        </div>

        <button 
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="mt-5 mx-auto flex items-center gap-1.5 text-[#a1a1aa] hover:text-white transition-colors text-[9px] font-semibold uppercase tracking-widest disabled:opacity-50"
        >
          <ChevronLeft className="w-3 h-3" />
          Back to Vault
        </button>
      </div>
    </div>
  )
}
