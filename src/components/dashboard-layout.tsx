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
    <div className="bg-black text-white selection:bg-primary selection:text-black min-h-screen flex flex-col">
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
