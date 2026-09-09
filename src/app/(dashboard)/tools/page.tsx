
"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { LoadingOverlay } from "@/components/loading-overlay"
import { 
  Sparkles, 
  BookOpen, 
  History,
  ChevronLeft
} from "lucide-react"
import { aiQuizFlashcardGenerator, type AiQuizFlashcardGeneratorOutput } from "@/ai/flows/ai-quiz-flashcard-generator-flow"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function QuizPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [studyMaterial, setStudyMaterial] = useState("")
  const [outputFormat, setOutputFormat] = useState<'quiz_questions' | 'flashcards'>('quiz_questions')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<AiQuizFlashcardGeneratorOutput | null>(null)

  const handleGenerate = async () => {
    if (!studyMaterial.trim()) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please provide some study material to generate content.",
      })
      return
    }

    setIsGenerating(true)
    setResult(null)

    try {
      const output = await aiQuizFlashcardGenerator({
        studyMaterial,
        outputFormat,
        difficulty
      })
      setResult(output)
      toast({
        title: "Generation successful",
        description: `Successfully generated ${outputFormat === 'quiz_questions' ? 'quiz questions' : 'flashcards'}.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Something went wrong while generating your study material.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-black text-white pb-32">
        {isGenerating && <LoadingOverlay status="Processing Intelligence" />}
        
        <header className="yellow-header">
           <div className="flex items-center justify-between mb-8">
            <ChevronLeft className="w-8 h-8 cursor-pointer" onClick={() => router.back()} />
            <h2 className="text-xl font-headline font-bold">Quiz Engine</h2>
            <div className="w-8 h-8" /> 
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-headline font-bold">AI Study Aid</h1>
            <p className="text-black/60 text-sm">Convert notes into interactive tools.</p>
          </div>
        </header>

        <div className="px-6 -mt-6 space-y-8">
          <div className="bg-card rounded-[2.5rem] p-8 border border-white/5 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Study Material</Label>
              <Textarea 
                placeholder="Paste your notes here..." 
                className="bg-black/50 border-none rounded-2xl min-h-[200px] resize-none focus:ring-1 focus:ring-primary"
                value={studyMaterial}
                onChange={(e) => setStudyMaterial(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button 
                onClick={() => setOutputFormat('quiz_questions')}
                className={cn(
                  "p-5 rounded-[2rem] border transition-all text-left flex flex-col gap-2",
                  outputFormat === 'quiz_questions' 
                    ? "bg-primary text-black border-primary" 
                    : "bg-black/40 border-white/10 text-muted-foreground"
                )}
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase">Quiz</span>
              </button>
              <button 
                onClick={() => setOutputFormat('flashcards')}
                className={cn(
                  "p-5 rounded-[2rem] border transition-all text-left flex flex-col gap-2",
                  outputFormat === 'flashcards' 
                    ? "bg-primary text-black border-primary" 
                    : "bg-black/40 border-white/10 text-muted-foreground"
                )}
              >
                <History className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase">Cards</span>
              </button>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Difficulty</Label>
              <div className="flex gap-4">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level as any)}
                    className={cn(
                      "px-6 py-2 rounded-full text-[10px] font-bold uppercase border transition-all",
                      difficulty === level 
                        ? "bg-primary border-primary text-black" 
                        : "bg-black/40 border-white/10 text-muted-foreground"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !studyMaterial}
              className="w-full h-16 rounded-full bg-primary hover:bg-primary/90 text-black font-bold text-lg"
            >
              <Sparkles className="mr-2" />
              Generate Aids
            </Button>
          </div>

          {result && (
            <section className="animate-in slide-in-from-bottom-10 duration-500">
               <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-headline font-bold">Results</h3>
                <button onClick={() => setResult(null)} className="text-[10px] font-black uppercase text-red-500">Clear</button>
              </div>
              <ScrollArea className="h-[500px] space-y-4">
                {result.quizQuestions?.map((q, i) => (
                  <div key={i} className="card-item mb-3 flex-col items-start gap-4">
                    <div className="flex gap-4 w-full">
                       <div className="icon-box shrink-0">{i+1}</div>
                       <p className="text-sm font-bold leading-relaxed">{q.question}</p>
                    </div>
                    <div className="grid gap-2 w-full">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className={cn(
                          "p-4 rounded-2xl text-xs font-medium",
                          opt === q.correctAnswer ? "bg-primary/20 text-primary border border-primary/20" : "bg-black/40 text-muted-foreground"
                        )}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </section>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
