
"use client"

import { ReactNode, Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Hourglass, 
  Heart, 
  Hexagon, 
  MessageCircleQuestion,
  ShieldCheck,
  Home,
  Flame,
  Settings,
  Archive,
  BookOpen
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  icon: any
  label: string
  href: string
  adminOnly?: boolean
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

  // Find the index of the active nav item for the custom curve positioning
  const activeIndex = navItems.findIndex(item => item.href === pathname)
  const leftPosition = activeIndex === -1 ? 0 : (activeIndex * 100) / navItems.length

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Main Content Area */}
      <main className="flex-1 w-full pb-32">
        {children}
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-transparent z-[100] px-4 flex justify-center pointer-events-none">
        <div className="relative w-full max-w-lg h-20 bg-black rounded-[2.5rem] border border-white/10 flex items-center justify-around pointer-events-auto">
          
          {/* Custom Curve for Active Item */}
          {activeIndex !== -1 && (
            <div 
              className="absolute top-0 transition-all duration-300 ease-in-out -translate-y-1/2"
              style={{ left: `calc(${activeIndex * 25 + 12.5}% - 3rem)` }}
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* The "Cutout" background mimic */}
                <div className="absolute inset-0 bg-black rounded-full border-4 border-black" />
                <div className="z-10 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                  {/* Icon of the active item */}
                  {(() => {
                    const ActiveIcon = navItems[activeIndex].icon;
                    return <ActiveIcon className="w-8 h-8 text-black font-black" />;
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Nav Items Mapper */}
          {navItems.map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative z-20 flex flex-col items-center justify-center w-20 h-full transition-all",
                pathname === item.href ? "opacity-0 scale-50" : "opacity-40 hover:opacity-100"
              )}
            >
              <item.icon className="w-6 h-6 text-white" />
            </Link>
          ))}
        </div>
      </nav>
      
      {/* Style for the cutout curve corners */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(-50%); }
          50% { transform: translateY(-55%); }
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
