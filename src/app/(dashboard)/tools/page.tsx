
"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { 
  Sparkles, 
  BrainCircuit, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  BookOpen, 
  Trophy,
  History
} from "lucide-react"
import { aiQuizFlashcardGenerator, type AiQuizFlashcardGeneratorOutput } from "@/ai/flows/ai-quiz-flashcard-generator-flow"
import { cn } from "@/lib/utils"

export default function QuizPage() {
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
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
        <header className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">AI Study Engine</h2>
          </div>
          <h1 className="text-3xl font-headline font-bold">Quiz & Flashcard Generator</h1>
          <p className="text-sm text-muted-foreground">Transform your lecture notes into interactive learning tools.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="space-y-6 border-white/10">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Study Material</Label>
                <Textarea 
                  placeholder="Paste your notes, transcript, or textbook snippets here..." 
                  className="min-h-[300px] glass bg-white/5 border-white/10 rounded-2xl resize-none focus:border-primary"
                  value={studyMaterial}
                  onChange={(e) => setStudyMaterial(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Output Preferences</Label>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setOutputFormat('quiz_questions')}
                    className={cn(
                      "p-4 rounded-2xl border transition-all text-left flex flex-col gap-2",
                      outputFormat === 'quiz_questions' 
                        ? "bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10" 
                        : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                    )}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-tighter">Multiple Choice</span>
                  </button>
                  <button 
                    onClick={() => setOutputFormat('flashcards')}
                    className={cn(
                      "p-4 rounded-2xl border transition-all text-left flex flex-col gap-2",
                      outputFormat === 'flashcards' 
                        ? "bg-accent/20 border-accent text-accent shadow-lg shadow-accent/10" 
                        : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                    )}
                  >
                    <History className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-tighter">Flashcards</span>
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Difficulty Level</Label>
                  <RadioGroup 
                    value={difficulty} 
                    onValueChange={(v: any) => setDifficulty(v)}
                    className="flex gap-4"
                  >
                    {['easy', 'medium', 'hard'].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <RadioGroupItem value={level} id={level} className="border-white/20" />
                        <Label htmlFor={level} className="text-xs capitalize cursor-pointer">{level}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !studyMaterial}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-xl shadow-primary/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Study Aids
                  </>
                )}
              </Button>
            </GlassCard>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7">
            {result ? (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    Generated Material
                  </h3>
                  <Button variant="outline" className="glass border-white/10 text-xs h-9" onClick={() => setResult(null)}>
                    Clear Results
                  </Button>
                </div>

                <ScrollArea className="h-[700px] pr-4">
                  {result.quizQuestions && (
                    <div className="space-y-4">
                      {result.quizQuestions.map((q, idx) => (
                        <GlassCard key={idx} className="p-6 border-white/5">
                          <div className="flex items-start gap-4">
                            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                              {idx + 1}
                            </span>
                            <div className="space-y-4 flex-1">
                              <p className="font-bold text-sm leading-relaxed">{q.question}</p>
                              <div className="grid gap-2">
                                {q.options.map((opt, oIdx) => (
                                  <div 
                                    key={oIdx} 
                                    className={cn(
                                      "p-3 rounded-xl border text-xs transition-all",
                                      opt === q.correctAnswer 
                                        ? "bg-green-500/10 border-green-500/30 text-green-400" 
                                        : "bg-white/5 border-white/5 text-muted-foreground"
                                    )}
                                  >
                                    <span className="font-bold mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                                    {opt}
                                    {opt === q.correctAnswer && <CheckCircle2 className="w-3 h-3 inline ml-2" />}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      ))}
                    </div>
                  )}

                  {result.flashcards && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.flashcards.map((f, idx) => (
                        <div key={idx} className="group h-48 [perspective:1000px]">
                          <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] cursor-pointer">
                            {/* Front */}
                            <div className="absolute inset-0 p-6 glass border-white/10 rounded-3xl flex flex-col items-center justify-center text-center [backface-visibility:hidden]">
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Front</span>
                              <p className="text-sm font-bold">{f.front}</p>
                            </div>
                            {/* Back */}
                            <div className="absolute inset-0 p-6 glass border-primary/20 bg-primary/5 rounded-3xl flex flex-col items-center justify-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                              <span className="text-[10px] font-black text-accent uppercase tracking-widest mb-2">Back</span>
                              <p className="text-sm text-white/80">{f.back}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            ) : (
              <GlassCard className="h-[750px] border-white/5 bg-white/5 flex flex-col items-center justify-center text-center p-12 opacity-50">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <FileText className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-headline font-bold mb-2">Ready for Analysis</h3>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                  Input your study notes on the left and select a format to begin generating AI-powered academic aids.
                </p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
