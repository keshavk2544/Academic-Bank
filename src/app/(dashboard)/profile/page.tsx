
"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  LogOut, 
  RefreshCw,
  Fingerprint,
  IdCard,
  GraduationCap,
  Briefcase,
  AlertCircle,
  FileText,
  Trash2
} from "lucide-react"
import { LoadingOverlay } from "@/components/loading-overlay"
import { useToast } from "@/hooks/use-toast"
import { StudentProfile } from "@/types/student"
import { useFirestore, useCollection, useStorage } from "@/firebase"
import { collection, query, where, deleteDoc, doc } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors"
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

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const db = useFirestore()
  const storage = useStorage()
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [mountTime] = useState(Date.now());
  const [resourceToDelete, setResourceToDelete] = useState<any>(null);

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/student/profile', { 
        method: 'GET',
        credentials: 'include',
        cache: 'no-store' 
      })
      
      if (res.status === 401) {
        router.replace("/")
        return
      }

      const data = await res.json()
      if (data.success && data.student) {
        setStudent(data.student)
      } else {
        setError(data.message || "Failed to load profile identity.")
      }
    } catch (e) {
      setError("Network interruption during identity pulse.")
    } finally {
      setIsLoading(false)
    }
  }

  const userResourcesQuery = useMemo(() => {
    const qid = student?.studentId || student?.enrollmentNo;
    if (!db || !qid) return null;
    return query(
      collection(db, 'resources'),
      where('qid', '==', qid)
    );
  }, [db, student]);

  const { data: rawMyResources, loading: loadingResources } = useCollection(userResourcesQuery);
  
  const myResources = useMemo(() => {
    if (!rawMyResources) return [];
    return [...rawMyResources].sort((a: any, b: any) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [rawMyResources]);

  const handleSyncERP = async () => {
    setIsSyncing(true)
    try {
      const res = await fetch('/api/student/sync', { 
        method: 'POST',
        credentials: 'include',
        cache: 'no-store'
      })
      const data = await res.json()
      
      if (data.success && data.student) {
        setStudent(data.student)
        setImageError(false)
        toast({ title: "Sync Successful", description: "Your academic identity has been updated." })
      } else {
        toast({ 
          variant: "destructive", 
          title: "Sync Unavailable", 
          description: data.message || "ERP sync unavailable. Your existing profile is still available." 
        })
      }
    } catch (e) {
      toast({ 
        variant: "destructive", 
        title: "Sync Error", 
        description: "Network interruption during ERP sync." 
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const confirmDelete = async () => {
    if (!resourceToDelete || !db) return;
    
    const resourceRef = doc(db, 'resources', resourceToDelete.id);
    
    // 1. Storage cleanup if exists
    if (resourceToDelete.storagePath) {
      const storageRef = ref(storage, resourceToDelete.storagePath);
      await deleteObject(storageRef).catch(err => console.warn('Storage cleanup failed or file missing', err));
    }

    // 2. Firestore metadata removal
    deleteDoc(resourceRef)
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: `resources/${resourceToDelete.id}`,
          operation: 'delete',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
        
        toast({
          variant: "destructive",
          title: "Purge Failed",
          description: "Could not remove the document metadata."
        });
      });
    
    toast({
      title: "Document Removed",
      description: "The resource has been purged from the vault."
    });
    setResourceToDelete(null);
  }

  const handleSignOut = async () => {
    await fetch('/api/auth/erp-logout', { method: 'POST', credentials: 'include' })
    localStorage.removeItem("userRole")
    router.push("/")
  }

  if (isLoading) return <LoadingOverlay status="Accessing Profile Pulse" />

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {isSyncing && <LoadingOverlay status="Syncing ERP Data" />}

      <header className="px-6 pt-4 flex flex-col items-center">
        <div className="relative z-10 -mb-12">
          <div className="w-32 h-32 rounded-full border-[6px] border-black overflow-hidden shadow-2xl bg-[#111] flex items-center justify-center">
            {!imageError ? (
              <img 
                src={`/api/student/photo?t=${mountTime}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <Fingerprint className="w-12 h-12 text-primary/40" />
            )}
          </div>
        </div>
        
        <div className="bg-primary w-full rounded-[3.5rem] pt-16 pb-8 text-center text-black px-6 shadow-xl">
           <h1 className="text-3xl font-headline font-black tracking-tighter leading-none mb-1">{student?.name || 'Academic Identity'}</h1>
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{student?.course || 'No course data'}</p>
        </div>
      </header>

      <div className="px-6 mt-16 space-y-8">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-2xl flex items-center gap-3 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <p className="text-xs font-bold">{error}</p>
          </div>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold font-headline tracking-tight">My Contributions</h2>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg border border-white/5">
              {myResources?.length || 0} Docs
            </span>
          </div>

          <div className="space-y-3">
            {loadingResources ? (
              <div className="h-16 bg-white/5 rounded-[2rem] animate-pulse border border-white/5" />
            ) : myResources && myResources.length > 0 ? (
              myResources.map((res: any) => {
                const uploadTime = res.createdAt ? new Date(res.createdAt).getTime() : 0;
                const now = new Date().getTime();
                const hoursPassed = (now - uploadTime) / (1000 * 60 * 60);
                const canDelete = hoursPassed < 24;

                return (
                  <div key={res.id} className="bg-card p-3 rounded-[2rem] border border-white/5 flex items-center justify-between group transition-all hover:bg-white/[0.08]">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0 pr-2">
                        <h4 className="text-[0.9rem] font-bold text-zinc-100 truncate">{res.subject}</h4>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                          {res.resourceType?.toUpperCase() || 'DOC'} • {res.year || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {canDelete && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setResourceToDelete(res);
                        }}
                        className="w-9 h-9 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shrink-0 border border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 rounded-[2.5rem] border border-dashed border-white/10 bg-white/[0.02]">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">No contributions yet in the vault</p>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold font-headline tracking-tight">Academic Pulse</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-card p-4 rounded-[2.5rem] flex items-center justify-between border border-white/5">
              <div className="pl-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <IdCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Student ID</h3>
                  <p className="text-sm font-bold font-headline">{student?.studentId || 'Not available'}</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-4 rounded-[2.5rem] flex items-center justify-between border border-white/5">
              <div className="pl-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Branch</h3>
                  <p className="text-sm font-bold font-headline">{student?.branch || 'Not available'}</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-4 rounded-[2.5rem] flex items-center justify-between border border-white/5">
              <div className="pl-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Semester</h3>
                  <p className="text-sm font-bold font-headline">{student?.semester ? `${student.semester}th Semester` : 'Not available'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold font-headline tracking-tight">System Controls</h2>
          </div>
          <div className="bg-card p-6 rounded-[2.5rem] border border-white/5 space-y-4">
            
            <Button 
              onClick={handleSyncERP}
              disabled={isSyncing}
              className="w-full h-14 rounded-full font-black text-xs uppercase tracking-widest bg-white/5 text-primary border border-primary/20 hover:bg-primary/10"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isSyncing && "animate-spin")} /> Sync ERP Data
            </Button>
            
            <Button 
              onClick={handleSignOut}
              variant="destructive"
              className="w-full h-14 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-destructive/20"
            >
              <LogOut className="w-4 h-4 mr-2" /> De-Initialize Session
            </Button>
          </div>
        </section>
      </div>

      <AlertDialog open={!!resourceToDelete} onOpenChange={(open) => !open && setResourceToDelete(null)}>
        <AlertDialogContent className="bg-[#0b0b0b] border border-white/10 text-white rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-headline font-bold">Purge Resource?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This will permanently remove the document from the Academic Vault and Firebase Storage. This action cannot be undone once synchronized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
            >
              Purge Document
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
