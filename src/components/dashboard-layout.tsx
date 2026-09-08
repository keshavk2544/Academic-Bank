
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

      {/* Floating Wave Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 flex justify-center items-center z-[100] pointer-events-none">
        <div className="navigation relative w-[360px] h-16 bg-[#111111] rounded-[25px] flex justify-center items-center px-2 shadow-2xl pointer-events-auto">
          <ul className="relative flex w-full">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href;
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
                className="indicator absolute top-[-32px] w-[65px] h-[65px] bg-[#111111] rounded-full border-[6px] border-black transition-transform duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] z-0"
                style={{ 
                  transform: `translateX(calc(${activeIndex * (100 / navItems.length)}% + ${(100 / navItems.length / 2)}% - 32.5px))`,
                  left: 0
                }}
              >
                {/* Wavy side curves */}
                <div className="before absolute top-[21px] left-[-23px] w-5 h-5 bg-transparent rounded-tr-[20px] shadow-[5px_-10px_0_0_black]" />
                <div className="after absolute top-[21px] right-[-23px] w-5 h-5 bg-transparent rounded-tl-[20px] shadow-[-5px_-10px_0_0_black]" />
              </div>
            )}
          </ul>
        </div>
      </nav>

      <style jsx>{`
        .navigation {
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
        }
        .list.active .icon {
          color: #ffaa00;
        }
        .indicator::before {
          content: '';
        }
        .indicator::after {
          content: '';
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
