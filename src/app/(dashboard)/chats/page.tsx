"use client"

import { DashboardLayout } from "@/components/dashboard-layout"

export default function ChatPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <div className="w-8 h-8 rounded-lg bg-primary/20" />
        </div>
        <div>
          <h2 className="text-2xl font-headline font-bold">Chat Section Cleared</h2>
          <p className="text-muted-foreground text-sm">Ready for your new design implementation.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
