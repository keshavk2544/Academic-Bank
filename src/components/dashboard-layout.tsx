
"use client"

import { ReactNode, useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Library, 
  BrainCircuit, 
  User, 
  ShieldCheck,
  Plus,
  Heart,
  HelpCircle,
  Hexagon,
  Hourglass,
  MessageCircleQuestion
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  icon: any;
  label: string;
  href: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { icon: Hourglass, label: "Dashboard", href: "/dashboard" },
  { icon: Heart, label: "Profile", href: "/profile" },
  { icon: Hexagon, label: "Repo", href: "/academics" },
  { icon: MessageCircleQuestion, label: "Quiz", href: "/tools" },
]

function NavigationContent({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string>("student")

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole") || "student")
  }, [])

  const filteredNavItems = navItems.filter(item => !item.adminOnly || userRole === "admin")

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card hidden md:flex flex-col border-r border-white/5 z-50">
        <div className="p-8">
          <span className="text-3xl font-headline font-bold text-primary italic">PreRP</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-[2rem] transition-all",
                pathname === item.href 
                  ? "bg-primary text-black font-bold" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
          {userRole === "admin" && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-[2rem] transition-all",
                pathname === "/admin" 
                  ? "bg-primary text-black font-bold" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Admin</span>
            </Link>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 w-full">
        {children}
      </main>

      {/* Inspiration Bottom Navigation */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-card/90 backdrop-blur-3xl rounded-[2.5rem] h-20 border border-white/10 px-8 flex justify-between items-center z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <Link href="/dashboard" className={cn("transition-all", pathname === "/dashboard" ? "text-primary" : "text-white/30")}>
          <Hourglass className="w-6 h-6" />
        </Link>
        <Link href="/profile" className={cn("transition-all", pathname === "/profile" ? "text-primary" : "text-white/30")}>
          <Heart className="w-6 h-6" />
        </Link>
        
        {/* Central Plus Button */}
        <div className="w-16 h-16 bg-white rounded-full -translate-y-8 flex items-center justify-center shadow-xl shadow-white/20 cursor-pointer hover:scale-110 active:scale-95 transition-transform">
          <Plus className="w-8 h-8 text-black" />
        </div>

        <Link href="/academics" className={cn("transition-all", pathname === "/academics" ? "text-primary" : "text-white/30")}>
          <Hexagon className="w-6 h-6" />
        </Link>
        <Link href="/tools" className={cn("transition-all", pathname === "/tools" ? "text-primary" : "text-white/30")}>
          <MessageCircleQuestion className="w-6 h-6" />
        </Link>
      </nav>
    </div>
  )
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <NavigationContent>{children}</NavigationContent>
    </Suspense>
  )
}
