
"use client"

import { ReactNode, Suspense } from "react"
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
  
  const activeIndex = navItems.findIndex(item => {
    if (item.href === '/dashboard' && pathname === '/dashboard') return true;
    return pathname.startsWith(item.href) && item.href !== '/dashboard';
  });

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-1 w-full pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-20 flex justify-center items-end z-[100] pointer-events-none pb-4">
        <div className="navigation relative w-[320px] h-20 bg-[#111111] rounded-[25px] flex justify-center items-center px-[10px] shadow-[0_15px_35px_rgba(0,0,0,0.5)] pointer-events-auto border border-white/5">
          <ul className="relative flex w-[300px]">
            {navItems.map((item, idx) => {
              const isActive = activeIndex === idx;
              const Icon = item.icon;
              
              return (
                <li 
                  key={item.href} 
                  className={cn("list relative list-none w-[75px] h-20 z-[2]", isActive && "active")}
                >
                  <Link href={item.href} className="relative flex justify-center items-center w-full h-full">
                    <span className={cn(
                      "icon absolute block transition-all duration-500 [transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)]",
                      isActive ? "translate-y-[-38px] text-[#ffaa00] drop-shadow-[0_5px_8px_rgba(255,170,0,0.4)]" : "text-[#d0d0d0]"
                    )}>
                      <Icon className="w-7 h-7" />
                    </span>
                  </Link>
                </li>
              )
            })}
            
            {activeIndex !== -1 && (
              <div 
                className="indicator absolute top-[-35px] w-[70px] h-[70px] bg-[#111111] rounded-full border-[8px] border-black transition-transform duration-500 [transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)] z-[1]"
                style={{ 
                  left: "2.5px", 
                  transform: `translateX(${activeIndex * 75}px)`,
                }}
              />
            )}
          </ul>
        </div>
      </nav>

      <style jsx>{`
        .indicator::before {
          content: '';
          position: absolute;
          top: 23px;
          left: -26px;
          width: 20px;
          height: 20px;
          background: transparent;
          border-top-right-radius: 20px;
          box-shadow: 5px -10px 0 0 black;
        }
        .indicator::after {
          content: '';
          position: absolute;
          top: 23px;
          right: -26px;
          width: 20px;
          height: 20px;
          background: transparent;
          border-top-left-radius: 20px;
          box-shadow: -5px -10px 0 0 black;
        }
      `}</style>
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
