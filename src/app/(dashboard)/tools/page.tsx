
"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Sparkles, 
  FileTransform, 
  Calculator, 
  Scan, 
  FileStack,
  ArrowRight,
  BrainCircuit,
  Zap,
  Loader2
} from "lucide-react"
import { aiStudyAssistant } from "@/ai/flows/ai-study-assistant-flow"
import { aiQuizFlashcardGenerator } from "@/ai/flows/ai-quiz-flashcard-generator-flow"
import { useToast } from "@/hooks/use-toast"

export default function ToolsPage() {
  const { toast } = useToast()
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [aiResponse, setAiResponse] = useState("")

  const handleAiAssistant = async () => {
    if (!query) return
    setLoading(true)
    try {
      // For demo, we use a hardcoded small doc data or prompt the assistant
      const result = await aiStudyAssistant({
        documentDataUri: "data:text/plain;base64,VGhpcyBpcyBhIHNhbXBsZSBhY2FkZW1pYyBkb2N1bWVudC4=", // Base64 for "This is a sample academic document."
        query: query
      })
      setAiResponse(result.response)
    } catch (err) {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to connect to the Academic Sage."
      })
    } finally {
      setLoading(false)
    }
  }

  const tools = [
    { id: "pdf", icon: FileStack, title: "PDF Transformer", desc: "Merge, split, and convert academic documents.", color: "text-red-400" },
    { id: "cgpa", icon: Calculator, title: "CGPA Analytics", desc: "Predict and calculate your academic performance.", color: "text-green-400" },
    { id: "resume", icon: FileText, title: "Modern Resume", desc: "Build a tech-focused resume for placements.", color: "text-blue-400" },
    { id: "qr", icon: Scan, title: "Pulse Scanner", desc: "Generate or scan attendance pulse codes.", color: "text-purple-400" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-12 animate-in fade-in duration-500">
        <header>
          <h2 className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-1">Smart Utils</h2>
          <h1 className="text-3xl font-headline font-bold">Toolbox & AI</h1>
        </header>

        {/* AI Assistant Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20 border border-primary/30">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-2xl font-headline font-bold">Academic Sage</h3>
          </div>
          
          <GlassCard className="p-0 border-primary/20 bg-primary/5 overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  I can summarize complex notes, explain topics, or generate flashcards instantly. Just paste your text or upload a document.
                </p>
                <div className="relative group">
                  <Textarea 
                    placeholder="Ask me anything about your course material..." 
                    className="min-h-[120px] glass border-white/10 rounded-2xl p-4 focus:border-primary/50 transition-all resize-none pr-12"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <Button 
                    onClick={handleAiAssistant}
                    disabled={loading || !query}
                    className="absolute bottom-4 right-4 h-10 w-10 p-0 rounded-xl bg-primary hover:bg-primary/90 shadow-lg"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {aiResponse && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 animate-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold text-primary uppercase tracking-widest">
                    <Zap className="w-3 h-3" /> Sage Analysis
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{aiResponse}</p>
                </div>
              )}
            </div>
            
            <div className="flex bg-white/5 border-t border-white/10 p-4 gap-4 overflow-x-auto whitespace-nowrap px-8 no-scrollbar">
              <button className="text-xs font-semibold px-4 py-2 rounded-full glass border-white/10 hover:bg-white/10 transition-all">Explain Dijkstra's</button>
              <button className="text-xs font-semibold px-4 py-2 rounded-full glass border-white/10 hover:bg-white/10 transition-all">Generate DBMS Flashcards</button>
              <button className="text-xs font-semibold px-4 py-2 rounded-full glass border-white/10 hover:bg-white/10 transition-all">Summarize CN Lecture</button>
            </div>
          </GlassCard>
        </section>

        {/* Tools Grid */}
        <section className="space-y-6">
          <h3 className="text-2xl font-headline font-bold">Student Toolkit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <GlassCard 
                key={tool.id} 
                className="group cursor-pointer hover:border-primary/50 transition-all relative overflow-hidden"
              >
                <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 w-fit mb-4 transition-transform group-hover:scale-110 ${tool.color}`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold mb-2 flex items-center gap-1">
                  {tool.title} <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              </GlassCard>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
