
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Upload, 
  ChevronLeft, 
  FileText, 
  BookOpen, 
  Calendar, 
  User,
  GraduationCap
} from "lucide-react"
import { cn } from "@/lib/utils"
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
import { useToast } from "@/hooks/use-toast"

export default function UploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    uploaderName: "Keshav Krishan",
    qid: "",
    fileName: "",
    resourceType: "",
    course: "",
    subject: "",
    year: "",
    faculty: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, resourceType: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate upload delay
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Ready for Vault",
        description: "Your file is ready to be uploaded to the Academic Vault!",
      })
    }, 1500)
  }

  const isTypeSelected = formData.resourceType !== ""
  const isPYQ = formData.resourceType === "pyq"
  const isNotesOrIMP = formData.resourceType === "notes" || formData.resourceType === "imp"

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* Premium Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#1a1a24_0%,#050505_60%)] pointer-events-none -z-10" />

      <div className="w-full max-w-[600px] animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] backdrop-blur-2xl rounded-[1.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Top subtle glow */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="text-center mb-8">
            <h1 className="text-[2rem] font-extrabold tracking-tight bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent leading-tight mb-1">
              Upload Resource
            </h1>
            <p className="text-[0.9rem] font-medium text-[#a1a1aa]">Add materials to the Quantum University Vault</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="uploaderName" className="text-[0.75rem] font-bold uppercase tracking-widest text-[#a1a1aa]">Uploader Name</Label>
                <Input 
                  id="uploaderName" 
                  value={formData.uploaderName} 
                  onChange={handleInputChange}
                  className="bg-black/40 border-white/[0.08] rounded-xl h-12 focus:ring-1 focus:ring-amber-500/50" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="qid" className="text-[0.75rem] font-bold uppercase tracking-widest text-[#a1a1aa]">QID</Label>
                <Input 
                  id="qid" 
                  placeholder="e.g. QID12345" 
                  value={formData.qid}
                  onChange={handleInputChange}
                  className="bg-black/40 border-white/[0.08] rounded-xl h-12 focus:ring-1 focus:ring-amber-500/50" 
                  required 
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fileName" className="text-[0.75rem] font-bold uppercase tracking-widest text-[#a1a1aa]">File Name</Label>
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

            {/* Dynamic Section */}
            {isTypeSelected && (
              <div className="pt-6 mt-6 border-t border-dashed border-white/[0.08] space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="course" className="text-[0.75rem] font-bold uppercase tracking-widest text-[#a1a1aa]">Course Name</Label>
                    <Input 
                      id="course" 
                      placeholder="e.g. B.Tech Computer Science" 
                      value={formData.course}
                      onChange={handleInputChange}
                      className="bg-black/40 border-white/[0.08] rounded-xl h-12 focus:ring-1 focus:ring-amber-500/50" 
                      required 
                    />
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
              disabled={isSubmitting}
              className="w-full h-14 mt-8 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#fbbf24] text-black font-bold text-base rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:scale-95"
            >
              <Upload className="w-5 h-5 mr-2" strokeWidth={2.5} />
              {isSubmitting ? "Uploading..." : "Upload to Vault"}
            </Button>
          </form>
        </div>

        {/* Back navigation */}
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
