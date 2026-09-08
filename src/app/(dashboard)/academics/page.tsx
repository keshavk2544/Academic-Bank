
"use client"

import { useState, useMemo, use } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { 
  FileText, 
  Download, 
  PlusCircle,
  Clock,
  User,
  Search,
  ChevronLeft,
  X,
  Plus
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const SUBJECT_OPTIONS = [
  "Machine Learning",
  "Computer Networks",
  "Data Structures",
  "Cloud Computing",
  "Cyber Security",
  "Operating Systems",
  "Database Management"
];

const DOC_TYPE_OPTIONS = ["PYQ", "NOTES", "IMP TOPIC", "MFT"];

export default function AcademicsPage(props: { params: Promise<any>; searchParams: Promise<any> }) {
  use(props.params);
  use(props.searchParams);
  const router = useRouter()

  const [files] = useState([
    { title: "Machine Learning Unit 2", size: "4.2 MB", date: "2 days ago", type: "Machine Learning", docType: "NOTES", contributor: "Keshav Krishan" },
    { title: "Computer Networks Lab", size: "12.8 MB", date: "1 week ago", type: "Computer Networks", docType: "MFT", contributor: "Sarah Jenkins" },
    { title: "Operating Systems L15", size: "1.5 MB", date: "Today", type: "Operating Systems", docType: "NOTES", contributor: "Michael Chen" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            file.contributor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || file.docType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [files, searchTerm, selectedType]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-black text-white pb-32">
        <header className="yellow-header">
           <div className="flex items-center justify-between mb-8">
            <ChevronLeft className="w-8 h-8 cursor-pointer" onClick={() => router.back()} />
            <h2 className="text-xl font-headline font-bold">Repository</h2>
            <Plus className="w-8 h-8 cursor-pointer" /> 
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-headline font-bold">Academic Vault</h1>
            <p className="text-black/60 text-sm">Access curated study materials.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
            <Input 
              placeholder="Search files..." 
              className="pill-input pl-14 placeholder:text-white/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="px-6 mt-8 space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            <button 
              onClick={() => setSelectedType("all")}
              className={cn("px-6 py-2 rounded-full text-[10px] font-bold uppercase border shrink-0 transition-all", selectedType === "all" ? "bg-primary border-primary text-black" : "bg-card border-white/10 text-muted-foreground")}
            >
              All
            </button>
            {DOC_TYPE_OPTIONS.map(type => (
              <button 
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn("px-6 py-2 rounded-full text-[10px] font-bold uppercase border shrink-0 transition-all", selectedType === type ? "bg-primary border-primary text-black" : "bg-card border-white/10 text-muted-foreground")}
              >
                {type}
              </button>
            ))}
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-headline">Recent Uploads</h2>
              <span className="text-[10px] font-black opacity-40">{filteredFiles.length} Files</span>
            </div>

            <div className="space-y-3">
              {filteredFiles.map((file, idx) => (
                <div key={idx} className="card-item">
                  <div className="flex items-center gap-4">
                    <div className="icon-box">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold truncate max-w-[150px]">{file.title}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{file.docType} • {file.size}</p>
                    </div>
                  </div>
                  <button className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-primary transition-all active:scale-95">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
