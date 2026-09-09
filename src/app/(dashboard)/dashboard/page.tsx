
"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard(props: { params: Promise<any>; searchParams: Promise<any> }) {
  use(props.params);
  use(props.searchParams);

  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<string>("--:--");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <header className="px-6 pt-4 flex flex-col items-center">
        <div className="relative z-10 -mb-12">
          <div className="w-32 h-32 rounded-full border-[6px] border-black overflow-hidden shadow-2xl">
            <img 
              src="https://picsum.photos/seed/keshav/200" 
              alt="Profile" 
              className="w-full h-full object-cover"
              data-ai-hint="student profile"
            />
          </div>
        </div>
        
        <div className="bg-primary w-full rounded-[3.5rem] pt-16 pb-8 text-center text-black px-6 shadow-xl relative overflow-hidden">
           <h1 className="text-3xl font-headline font-black tracking-tighter leading-none mb-1">Keshav Krishan</h1>
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Admin</p>
        </div>
      </header>

      <div className="px-6 mt-16 space-y-10">
        {/* Hub content would go here */}
      </div>
    </div>
  )
}
