
"use client"

import { ReactNode, Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home,
  Heart,
  Flame,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LoadingOverlay } from "@/components/loading-overlay"

interface NavItem {
  icon: any
  label: string
  href: string
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Flame, label: "Vault", href: "/academics" },
  { icon: Settings, label: "Tools", href: "/tools" },
  { icon: Heart, label: "Profile", href: "/profile" },
]

function NavigationContent({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const activeIndex = navItems.findIndex(item => {
    if (item.href === '/dashboard' && pathname === '/dashboard') return true;
    return pathname?.startsWith(item.href) && item.href !== '/dashboard';
  });

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-1 w-full pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-16 flex justify-center items-end z-[100] pointer-events-none">
        <div className="navigation relative w-[280px] h-16 bg-[#111111] rounded-t-[2rem] flex justify-center items-center px-[10px] shadow-[0_15px_35px_rgba(0,0,0,0.5)] pointer-events-auto border-t border-x border-white/5">
          <ul className="relative flex w-[260px]">
            {navItems.map((item, idx) => {
              const isActive = activeIndex === idx;
              const Icon = item.icon;
              
              return (
                <li 
                  key={item.href} 
                  className={cn("list relative list-none w-[65px] h-16 z-[2]", isActive && "active")}
                >
                  <Link href={item.href} className="relative flex justify-center items-center w-full h-full">
                    <span className={cn(
                      "icon absolute block transition-all duration-500 [transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)]",
                      isActive ? "translate-y-[-30px] text-[#ffaa00] drop-shadow-[0_5px_8px_rgba(255,170,0,0.4)]" : "text-[#d0d0d0]"
                    )}>
                      <Icon className="w-6 h-6" />
                    </span>
                  </Link>
                </li>
              )
            })}
            
            {mounted && activeIndex !== -1 && (
              <div 
                className={cn(
                  "indicator absolute top-[-30px] w-[60px] h-[60px] bg-[#111111] rounded-full border-[6px] border-black transition-transform duration-500 [transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)] z-[1]",
                  "before:content-[''] before:absolute before:top-[18px] before:left-[-22px] before:w-[20px] before:h-[20px] before:bg-transparent before:rounded-tr-[20px] before:[box-shadow:4px_-8px_0_0_black]",
                  "after:content-[''] after:absolute after:top-[18px] after:right-[-22px] after:w-[20px] after:h-[20px] after:bg-transparent after:rounded-tl-[20px] after:[box-shadow:-4px_-8px_0_0_black]"
                )}
                style={{ 
                  left: "2.5px", 
                  transform: `translateX(${activeIndex * 65}px)`,
                }}
              />
            )}
          </ul>
        </div>
      </nav>
    </div>
  )
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LoadingOverlay status="Synchronizing Repository" />}>
      <NavigationContent>{children}</NavigationContent>
    </Suspense>
  )
}
