
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
  
  // Find the exact active index for stable movement
  const activeIndex = navItems.findIndex(item => {
    if (item.href === '/dashboard' && pathname === '/dashboard') return true;
    return pathname.startsWith(item.href) && item.href !== '/dashboard';
  }) || 0;

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-1 w-full pb-24">
        {children}
      </main>

      {/* Floating Wave Navigation - Compact & Bottom-Pinned */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 flex justify-center items-center z-[100] pointer-events-none">
        <div className="navigation relative w-full max-w-[360px] h-16 bg-[#111111] rounded-t-[2rem] flex justify-center items-center px-2 border-t border-x border-white/10 shadow-2xl pointer-events-auto">
          <ul className="relative flex w-full">
            {navItems.map((item, idx) => {
              const isActive = activeIndex === idx;
              const Icon = item.icon;
              
              return (
                <li 
                  key={item.href} 
                  className={cn("list relative list-none flex-1 h-16 z-10", isActive && "active")}
                >
                  <Link href={item.href} className="relative flex justify-center items-center w-full h-full">
                    <span className={cn(
                      "icon absolute block transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
                      isActive ? "translate-y-[-32px] text-[#ffaa00] drop-shadow-[0_5px_8px_rgba(255,170,0,0.4)]" : "text-[#d0d0d0]"
                    )}>
                      <Icon className="w-7 h-7" />
                    </span>
                  </Link>
                </li>
              )
            })}
            
            {/* The Moving Wave Cutout Indicator */}
            {activeIndex !== -1 && (
              <div 
                className="indicator absolute top-[-33px] w-[68px] h-[68px] bg-[#111111] rounded-full border-[6px] border-black transition-transform duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] z-0"
                style={{ 
                  left: "12.5%", // Initial center for 4 items (100 / 4 / 2)
                  transform: `translateX(calc(-50% + ${activeIndex * 25}% * (360/100)))`, // Percentage based movement
                  // More robust for fixed-width:
                  transitionProperty: 'transform',
                }}
              >
                {/* Wavy curve logic is handled via Styled JSX for absolute sync */}
              </div>
            )}
          </ul>
        </div>
      </nav>

      <style jsx>{`
        .navigation {
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
        }
        .indicator {
           /* Fixed calculation for 4 items in a relative flex container */
           left: 0;
           transform: translateX(${activeIndex * 25}%);
           margin-left: calc(12.5% - 34px);
        }
        .indicator::before {
          content: '';
          position: absolute;
          top: 22px;
          left: -22px;
          width: 20px;
          height: 20px;
          background: transparent;
          border-top-right-radius: 20px;
          box-shadow: 2px -10px 0 0 black;
        }
        .indicator::after {
          content: '';
          position: absolute;
          top: 22px;
          right: -22px;
          width: 20px;
          height: 20px;
          background: transparent;
          border-top-left-radius: 20px;
          box-shadow: -2px -10px 0 0 black;
        }
      `}</style>
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
