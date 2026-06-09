
"use client"

import { ReactNode, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  MessageSquare, 
  BookOpen, 
  Wrench, 
  User, 
  Bell, 
  Menu,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  icon: any;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: MessageSquare, label: "Chats", href: "/chats" },
  { icon: BookOpen, label: "Academics", href: "/academics" },
  { icon: Wrench, label: "Tools", href: "/tools" },
  { icon: User, label: "Profile", href: "/profile" },
]

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string>("student")

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole") || "student")
  }, [])

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0 md:pl-64">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glass hidden md:flex flex-col border-r border-white/10 z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20 border border-primary/30">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-headline font-bold tracking-tight">PreRP</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                pathname === item.href 
                  ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              {userRole[0]?.toUpperCase() || "S"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">Alex Rivera</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{userRole}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header - Reduced Size */}
      <header className="md:hidden flex items-center justify-between px-4 py-2.5 glass sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="text-lg font-headline font-bold">PreRP</span>
        </div>
        <div className="flex items-center gap-3">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <User className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full glass border-t border-white/10 px-6 py-3 flex justify-between items-center z-50 rounded-t-[32px]">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              pathname === item.href ? "text-primary scale-110" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn("w-6 h-6", pathname === item.href && "drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]")} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
