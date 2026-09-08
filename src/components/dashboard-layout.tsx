
"use client"

import { ReactNode, Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Hourglass, 
  Heart, 
  Hexagon, 
  MessageCircleQuestion,
  Home,
  Flame,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  icon: any
  label: string
  href: string
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Heart, label: "Profile", href: "/profile" },
  { icon: Flame, label: "Vault", href: "/academics" },
  { icon: Settings, label: "Tools", href: "/tools" },
]

function NavigationContent({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string>("student")

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole") || "student")
  }, [])

  const activeIndex = navItems.findIndex(item => item.href === pathname)

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-1 w-full pb-24">
        {children}
      </main>

      {/* Compact Sticky Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-transparent z-[100] flex justify-center pointer-events-none">
        <div className="relative w-full max-w-lg h-16 bg-black rounded-t-[2rem] border-t border-x border-white/10 flex items-center justify-around pointer-events-auto">
          
          {/* Active Indicator Cutout */}
          {activeIndex !== -1 && (
            <div 
              className="absolute top-0 transition-all duration-300 ease-in-out -translate-y-1/2"
              style={{ left: `calc(${activeIndex * 25 + 12.5}% - 2.5rem)` }}
            >
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 bg-black rounded-full border-[3px] border-black" />
                <div className="z-10 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                  {(() => {
                    const ActiveIcon = navItems[activeIndex].icon;
                    return <ActiveIcon className="w-7 h-7 text-black font-black" />;
                  })()}
                </div>
              </div>
            </div>
          )}

          {navItems.map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative z-20 flex flex-col items-center justify-center w-16 h-full transition-all",
                pathname === item.href ? "opacity-0 scale-50" : "opacity-40 hover:opacity-100"
              )}
            >
              <item.icon className="w-5 h-5 text-white" />
            </Link>
          ))}
        </div>
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
