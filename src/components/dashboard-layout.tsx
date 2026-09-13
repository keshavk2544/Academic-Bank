"use client"

import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home,
  BookOpen,
  Sparkles,
  User,
  Bell
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  icon: any
  label: string
  href: string
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: BookOpen, label: "Repo", href: "/academics" },
  { icon: Sparkles, label: "Tools", href: "/tools" },
  { icon: User, label: "Profile", href: "/profile" },
]

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="bg-black text-white selection:bg-primary selection:text-black">
      {/* Top Navigation Bar */}
      <header className="max-w-[1013px] mx-auto px-6 pt-7 flex items-center justify-between">
        <div className="w-14 h-14 rounded-full border-2 border-white/10 flex items-center justify-center text-2xl font-bold bg-gradient-to-b from-[#171717] to-[#050505] shadow-[0_0_20px_rgba(255,204,0,0.1)]">
          P
        </div>
        <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-[0.5em] text-center">
          Verified Student Pulse
        </div>
        <button className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center relative bg-gradient-to-br from-[#0e0e0e] to-[#050505]">
          <Bell className="w-7 h-7 text-white/90" />
          <span className="absolute top-3 right-3 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(255,210,26,0.4)]" />
        </button>
      </header>

      <main className="flex-1">
        {children}
      </main>

      {/* Floating Bottom Nav Dock */}
      {mounted && (
        <nav className="nav-dock">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex-1 h-[80%] rounded-[2rem] flex flex-col items-center justify-center gap-1 transition-all duration-300",
                  isActive ? "nav-item-active" : "text-muted-foreground hover:text-white"
                )}
              >
                <Icon className={cn("w-6 h-6 md:w-8 md:h-8", isActive ? "stroke-[2.5]" : "stroke-[1.5]")} />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      )}
    </div>
  )
}
