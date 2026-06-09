
"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { 
  FileText, 
  Calculator, 
  Scan, 
  FileStack,
  ArrowRight
} from "lucide-react"

export default function ToolsPage() {
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
          <h1 className="text-3xl font-headline font-bold">Toolbox & Utilities</h1>
        </header>

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
