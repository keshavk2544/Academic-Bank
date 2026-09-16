
"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { 
  Users, 
  BookOpen, 
  Archive, 
  ShieldAlert, 
  Trash2,
  Search,
  MoreVertical,
  Filter,
  UserPlus,
  FileText,
  Calendar,
  Code,
  History,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFirestore, useCollection, useStorage } from "@/firebase"
import { collection, query, orderBy, deleteDoc, doc } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const MOCK_STUDENTS = [
  { id: "22CSE1042", name: "Keshav Krishan", email: "keshav.k@univ.edu", semester: "6", status: "Active" },
  { id: "22CSE1045", name: "Sarah Jenkins", email: "sarah.j@univ.edu", semester: "6", status: "Probation" },
  { id: "22CSE1050", name: "Michael Chen", email: "m.chen@univ.edu", semester: "4", status: "Active" },
  { id: "22CSE1055", name: "Priya Sharma", email: "priya.s@univ.edu", semester: "6", status: "Inactive" },
];

export default function AdminPage() {
  const { toast } = useToast()
  const db = useFirestore()
  const storage = useStorage()
  const [role, setRole] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [resourceToDelete, setResourceToDelete] = useState<any>(null)

  // Real-time Resources
  const resourcesQuery = useMemo(() => query(
    collection(db, 'resources'),
    orderBy('createdAt', 'desc')
  ), [db])

  const { data: fetchedResources, loading } = useCollection(resourcesQuery)

  const filteredResources = useMemo(() => {
    if (!fetchedResources) return []
    return fetchedResources.filter(res => 
      res.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.uploaderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.qid?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [fetchedResources, searchQuery])

  useEffect(() => {
    const userRole = localStorage.getItem("userRole") || "student"
    setRole(userRole)
  }, [])

  const handlePurge = async () => {
    if (!resourceToDelete || !db) return

    try {
      // 1. Storage cleanup
      if (resourceToDelete.storagePath) {
        const storageRef = ref(storage, resourceToDelete.storagePath)
        await deleteObject(storageRef).catch(err => console.warn('Storage file already missing', err))
      }

      // 2. Firestore cleanup
      await deleteDoc(doc(db, 'resources', resourceToDelete.id))

      toast({
        title: "Vault Purged",
        description: "Resource and binary data removed successfully."
      })
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Purge Failed",
        description: "System error during administrative cleanup."
      })
    } finally {
      setResourceToDelete(null)
    }
  }

  const getIcon = (docType: string) => {
    switch (docType?.toUpperCase()) {
      case 'NOTES': return <FileText className="w-4 h-4 text-[#fbbf24]" />;
      case 'MFT': return <Calendar className="w-4 h-4 text-[#34d399]" />;
      case 'IMP': return <Code className="w-4 h-4 text-[#60a5fa]" />;
      case 'PYQ': return <History className="w-4 h-4 text-[#f87171]" />;
      default: return <FileText className="w-4 h-4 text-[#fbbf24]" />;
    }
  }

  if (role !== "admin") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <ShieldAlert className="w-16 h-16 text-red-500 animate-pulse" />
          <h1 className="text-2xl font-headline font-bold text-center">Unauthorized Access</h1>
          <p className="text-muted-foreground text-center max-w-md">
            This sector is restricted to administrator pulses only. Please return to the dashboard.
          </p>
          <Button variant="outline" className="glass border-white/10" asChild>
            <a href="/dashboard">Back to Dashboard</a>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500 px-6 pt-4 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Central Command</h2>
            <h1 className="text-3xl font-headline font-bold">Admin Console</h1>
          </div>
          <div className="flex gap-2">
             <Button className="bg-primary hover:bg-primary/90 rounded-xl font-bold h-11 px-6 shadow-lg shadow-primary/20 text-black">
               <UserPlus className="w-4 h-4 mr-2" /> Onboard Student
             </Button>
          </div>
        </header>

        <Tabs defaultValue="repository" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 h-12 p-1 gap-1 rounded-2xl w-full md:w-auto overflow-x-auto scrollbar-none">
            <TabsTrigger value="repository" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold text-xs uppercase tracking-widest px-6 shrink-0">
              <Archive className="w-4 h-4 mr-2" /> Repository
            </TabsTrigger>
            <TabsTrigger value="students" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold text-xs uppercase tracking-widest px-6 shrink-0">
              <Users className="w-4 h-4 mr-2" /> Students
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold text-xs uppercase tracking-widest px-6 shrink-0">
              <BookOpen className="w-4 h-4 mr-2" /> Quizzes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="repository" className="space-y-4">
            <GlassCard className="p-4 border-white/5 flex items-center gap-4">
               <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <Input 
                  className="bg-white/5 border-none h-10 pl-10 rounded-xl focus:ring-1 focus:ring-primary" 
                  placeholder="Search resources by subject or contributor..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
               <Button variant="outline" className="glass border-white/10 h-10 px-4 rounded-xl">
                 <Filter className="w-4 h-4 mr-2" /> Filter
               </Button>
            </GlassCard>

            <div className="grid gap-3">
              {loading ? (
                <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
              ) : filteredResources.length > 0 ? (
                filteredResources.map((res: any) => (
                  <GlassCard key={res.id} className="p-4 hover:bg-white/10 transition-all border-white/5 group">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          {getIcon(res.resourceType)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm truncate">{res.subject}</h4>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
                            {res.resourceType} • {res.size || '0 MB'} • <span className="text-primary">{res.uploaderName}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setResourceToDelete(res)}
                          className="h-9 w-9 text-red-400 hover:bg-red-400/20 hover:text-red-400 rounded-xl"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                ))
              ) : (
                <div className="text-center py-12 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                   <Archive className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-20" />
                   <p className="text-sm font-bold text-muted-foreground">No resources found in the vault.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <div className="grid gap-3">
              {MOCK_STUDENTS.map((student) => (
                <GlassCard key={student.id} className="p-4 hover:bg-white/10 transition-colors border-white/5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                        {student.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{student.name}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                          {student.id} • Semester {student.semester}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={cn(
                        "rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest",
                        student.status === "Active" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                        student.status === "Probation" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-red-500/10 text-red-400 border-red-500/20"
                      )}>
                        {student.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
             <GlassCard className="h-[400px] border-white/5 bg-white/5 flex flex-col items-center justify-center text-center p-12 opacity-50">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-headline font-bold mb-1">No Quiz Analytics Yet</h3>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Historical data of AI-generated quizzes will appear here as students interact with the study engine.
                </p>
              </GlassCard>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={!!resourceToDelete} onOpenChange={(open) => !open && setResourceToDelete(null)}>
        <AlertDialogContent className="bg-[#0b0b0b] border border-white/10 text-white rounded-[2rem]">
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <AlertDialogTitle className="text-xl font-headline font-bold">Admin Force Purge</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              You are about to permanently remove <span className="text-white font-bold">"{resourceToDelete?.subject}"</span> from the Academic Vault. This will delete the metadata and the actual file from storage. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl">Abort</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handlePurge}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
            >
              Purge Resource
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
