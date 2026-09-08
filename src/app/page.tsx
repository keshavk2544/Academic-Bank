"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/glass-card"
import { LogIn } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<"student" | "admin">("student")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login logic
    localStorage.setItem("userRole", role)
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md space-y-8 z-10">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h1 className="text-4xl font-headline font-bold tracking-tight text-glow" data-ai-hint="futuristic logo">PreRP</h1>
          </div>
          <p className="text-muted-foreground font-body">The futuristic campus ecosystem.</p>
        </div>

        <GlassCard className="p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
              {(["student", "admin"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg capitalize transition-all ${
                    role === r ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="id" className="text-xs text-muted-foreground uppercase tracking-wider">
                {role === "student" ? "Student ID" : "Administrator ID"}
              </Label>
              <Input
                id="id"
                placeholder="Enter your ID"
                className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-primary focus:border-primary transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pass" className="text-xs text-muted-foreground uppercase tracking-wider">Password</Label>
              <Input
                id="pass"
                type="password"
                placeholder="••••••••"
                className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-primary focus:border-primary transition-all"
                required
              />
            </div>

            <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 rounded-xl font-semibold shadow-[0_0_20px_rgba(139,92,246,0.4)] group">
              Initialize Portal
              <LogIn className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </GlassCard>

        <p className="text-center text-xs text-muted-foreground">
          &copy; 2025 PreRP Technologies. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}
