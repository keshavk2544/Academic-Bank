
"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  ArrowLeft, 
  Phone, 
  Video, 
  Info, 
  Smile, 
  Paperclip, 
  Send, 
  Play, 
  CheckCheck,
  Pin,
  Trash2,
  Shield,
  MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"

// Theme Constants
const COLORS = {
  bg1: '#0f0c29',
  bg2: '#302b63',
  bg3: '#24243e',
  glass: 'rgba(255,255,255,0.08)',
  accent: '#a855f7',
  accent2: '#7c3aed',
}

// Mock Data
const INITIAL_CHATS = [
  { id: 1, name: 'Design Team', type: 'group', avatar: '🎨', color: 'bg-purple-500', preview: 'Alex: Check the new mockups!', time: '2m', unread: 5, members: 12, online: 8, bio: 'UI/UX team workspace' },
  { id: 2, name: 'Luna Park', type: 'personal', avatar: 'L', color: 'bg-fuchsia-500', preview: 'Sounds great, see you there!', time: '8m', online: true, bio: "Hey there, I'm using Aura" },
  { id: 3, name: 'Dev Squad', type: 'group', avatar: '💻', color: 'bg-indigo-500', preview: 'CI passed ✅', time: '14m', unread: 2, members: 8, online: 5, bio: 'Building cool stuff together' },
  { id: 4, name: 'Marco Alvarez', type: 'personal', avatar: 'M', color: 'bg-blue-500', preview: 'Did you see the game? 🔥', time: '1h', online: false, bio: 'Photographer & traveler' },
  { id: 5, name: 'Launch 🚀', type: 'group', avatar: '🚀', color: 'bg-pink-500', preview: 'Product launch is on Friday!', time: '2h', unread: 9, members: 6, online: 3, bio: 'Product launch coordination' },
  { id: 6, name: 'Priya Sharma', type: 'personal', avatar: 'P', color: 'bg-emerald-500', preview: 'Thanks for the help! 🙏', time: '3h', online: true, bio: 'Coffee lover ☕ | Developer' },
  { id: 7, name: 'Family Group', type: 'group', avatar: '🏠', color: 'bg-orange-500', preview: 'Mom: Dinner at 7?', time: '5h', members: 5, online: 2, bio: 'Our little family' },
];

const INITIAL_MESSAGES: Record<number, any[]> = {
  1: [
    { id: 1, from: 'Alex Kim', avatar: 'A', color: 'bg-indigo-500', text: 'Hey team! Check out the new mockups I just uploaded 🎨', time: '10:12', type: 'in' },
    { id: 2, from: 'Sarah L', avatar: 'S', color: 'bg-pink-500', text: 'These look absolutely stunning! Love the glassmorphism vibe', time: '10:14', type: 'in', reactions: [{ e: '😍', n: 3 }, { e: '🔥', n: 2 }] },
    { id: 3, from: 'me', text: 'Agreed! The color palette is 🔥🔥', time: '10:15', type: 'out', read: true },
    { id: 4, from: 'Alex Kim', avatar: 'A', color: 'bg-indigo-500', text: '', type: 'media', time: '10:16' },
    { id: 5, from: 'me', text: 'When is the client presentation?', time: '10:18', type: 'out', read: true },
    { id: 6, from: 'Alex Kim', avatar: 'A', color: 'bg-indigo-500', text: 'Friday at 3pm. Make sure everyone reviews the deck before then!', time: '10:19', type: 'in' },
    { id: 7, sys: 'Alex Kim added Emma to the group' },
    { id: 8, from: 'me', text: '', type: 'voice', duration: '0:32', time: '10:22', read: true },
  ],
  2: [
    { id: 1, from: 'Luna Park', text: 'Hey! Are we still on for tonight? 👀', time: 'Yesterday, 9:15 PM', type: 'in' },
    { id: 2, from: 'me', text: 'Yes absolutely! Can\'t wait 😊', time: '9:18 PM', type: 'out', read: true },
    { id: 3, from: 'Luna Park', text: 'Where should we meet? The usual spot?', time: '9:20 PM', type: 'in' },
    { id: 4, from: 'me', text: 'How about that new rooftop place downtown? I heard it\'s gorgeous at night ✨', time: '9:22 PM', type: 'out', read: true },
  ]
};

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTab, setCurrentTab] = useState<'all' | 'personal' | 'groups' | 'unread'>('all')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [inputText, setInputText] = useState("")
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Sync state with URL to allow the layout to hide/show the mobile nav
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      setSelectedChatId(parseInt(id))
    } else {
      setSelectedChatId(null)
    }
  }, [searchParams])

  const selectedChat = useMemo(() => INITIAL_CHATS.find(c => c.id === selectedChatId), [selectedChatId])
  const messages = useMemo(() => (selectedChatId ? INITIAL_MESSAGES[selectedChatId] || [] : []), [selectedChatId])

  const filteredChats = useMemo(() => {
    return INITIAL_CHATS.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
      if (currentTab === 'personal') return matchesSearch && c.type === 'personal'
      if (currentTab === 'groups') return matchesSearch && c.type === 'group'
      if (currentTab === 'unread') return matchesSearch && (c.unread || 0) > 0
      return matchesSearch
    })
  }, [searchQuery, currentTab])

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages, selectedChatId])

  const handleSelectChat = (id: number) => {
    router.push(`?id=${id}`)
  }

  const handleGoBack = () => {
    router.push('/chats')
  }

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedChatId) return
    const newMessage = {
      id: Date.now(),
      from: 'me',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'out',
      read: false
    }
    
    if (!INITIAL_MESSAGES[selectedChatId]) INITIAL_MESSAGES[selectedChatId] = []
    INITIAL_MESSAGES[selectedChatId].push(newMessage)
    
    setInputText("")
  }

  return (
    <DashboardLayout>
      <div 
        className="fixed inset-0 md:left-64 flex z-0 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${COLORS.bg1} 0%, ${COLORS.bg2} 50%, ${COLORS.bg3} 100%)` }}
      >
        
        {/* Sidebar */}
        <div className={cn(
          "flex flex-col w-full md:w-56 border-r border-white/10 bg-black/40 backdrop-blur-3xl transition-all duration-300",
          selectedChatId && "hidden md:flex"
        )}>
          {/* Tabs */}
          <div className="flex gap-1 px-3 py-2">
            {(['all', 'personal', 'groups', 'unread'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={cn(
                  "flex-1 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all",
                  currentTab === tab 
                    ? "bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-white shadow-lg" 
                    : "text-white/50 hover:bg-white/5"
                )}
              >
                {tab === 'personal' ? 'DM' : tab === 'groups' ? 'Grp' : tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="px-3 pb-2 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40 pointer-events-none" />
            <input 
              placeholder="Search..." 
              className="w-full h-7 bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 text-[10px] outline-none focus:border-[#a855f7] transition-all text-white placeholder:text-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Chat List */}
          <ScrollArea className="flex-1 pb-20 md:pb-4">
            <div className="p-0">
              {filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={cn(
                    "flex items-center gap-2 p-2.5 cursor-pointer transition-all relative border-l-2",
                    selectedChatId === chat.id 
                      ? "bg-[#a855f7]/20 border-[#a855f7]" 
                      : "hover:bg-white/5 border-transparent"
                  )}
                >
                  <div className="relative shrink-0">
                    <div className={cn(
                      "w-8 h-8 flex items-center justify-center text-white font-bold transition-transform text-xs",
                      chat.color,
                      chat.type === 'group' ? "rounded-lg" : "rounded-full"
                    )}>
                      {chat.avatar}
                    </div>
                    {chat.online === true && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-[#0f0c29] rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-bold text-[11px] truncate text-white">{chat.name}</h4>
                      <span className="text-[9px] text-white/40">{chat.time}</span>
                    </div>
                    <p className="text-[10px] text-white/50 truncate">{chat.preview}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Conversation Area */}
        <div className={cn(
          "flex-1 flex flex-col bg-white/[0.01] relative",
          !selectedChatId && "hidden md:flex items-center justify-center text-center p-8"
        )}>
          {!selectedChatId ? (
            <div className="max-w-xs animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 rounded-[24px] bg-gradient-to-tr from-[#a855f7]/20 to-[#7c3aed]/20 flex items-center justify-center text-3xl mb-4 mx-auto border border-[#a855f7]/30 shadow-2xl">
                🔮
              </div>
              <h2 className="text-xl font-headline font-bold mb-2 text-white">Campus Aura</h2>
              <p className="text-xs text-white/40 leading-relaxed">
                Select a campus group or start a conversation to stay connected.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Area Header - Reduced Padding */}
              <div className="p-2 md:p-2.5 border-b border-white/10 bg-black/40 backdrop-blur-3xl flex items-center justify-between z-10 pt-2.5 md:pt-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden rounded-full h-7 w-7 text-white"
                    onClick={handleGoBack}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div className={cn(
                    "w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-white font-bold shrink-0 text-sm",
                    selectedChat?.color,
                    selectedChat?.type === 'group' ? "rounded-lg" : "rounded-full"
                  )}>
                    {selectedChat?.avatar}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs md:text-sm truncate leading-tight text-white">{selectedChat?.name}</h3>
                    <p className={cn(
                      "text-[9px] md:text-[10px] mt-0.5",
                      selectedChat?.online === true ? "text-green-400 font-medium" : "text-white/40"
                    )}>
                      {selectedChat?.type === 'group' 
                        ? `${selectedChat.members} members · ${selectedChat.online} online`
                        : selectedChat?.online ? 'Online' : 'Last seen recently'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/10 text-white/50">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/10 text-white/50">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("h-8 w-8 rounded-lg hover:bg-white/10", isProfileOpen ? "text-[#a855f7] bg-[#a855f7]/10" : "text-white/50")}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Message List */}
              <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollAreaRef}>
                <div className="flex flex-col gap-2 max-w-4xl mx-auto">
                  {messages.map((msg, idx) => {
                    if (msg.sys) {
                      return (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mx-auto text-[10px] text-white/40 font-bold my-6 uppercase tracking-widest">
                          {msg.sys}
                        </div>
                      )
                    }
                    const isOut = msg.type === 'out'
                    return (
                      <div key={idx} className={cn(
                        "flex gap-3 max-w-[85%] md:max-w-[70%] group animate-in slide-in-from-bottom-2 duration-300",
                        isOut ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}>
                        {!isOut && (
                          <div className={cn("w-7 h-7 self-end rounded-full shrink-0 flex items-center justify-center text-[9px] font-black text-white", msg.color)}>
                            {msg.avatar || '?'}
                          </div>
                        )}
                        <div className="space-y-1">
                          <div className={cn(
                            "p-3 px-4 rounded-2xl relative transition-all group-hover:shadow-2xl backdrop-blur-md",
                            isOut 
                              ? "bg-[#a855f7]/40 border border-[#a855f7]/20 rounded-br-none" 
                              : "bg-white/10 border border-white/10 rounded-bl-none"
                          )}>
                            {!isOut && selectedChat?.type === 'group' && (
                              <p className="text-[11px] font-black text-[#a855f7] mb-1.5 uppercase tracking-wider">{msg.from}</p>
                            )}
                            
                            {msg.type === 'media' ? (
                              <div className="w-56 h-40 rounded-xl bg-gradient-to-br from-[#a855f7]/20 to-[#7c3aed]/20 flex items-center justify-center text-5xl border border-white/10">
                                🖼️
                              </div>
                            ) : msg.type === 'voice' ? (
                              <div className="flex items-center gap-4 min-w-[180px]">
                                <Button size="icon" className="w-8 h-8 rounded-full bg-[#a855f7] hover:bg-[#7c3aed] transition-colors p-0 shadow-lg shadow-[#a855f7]/20">
                                  <Play className="w-3.5 h-3.5 fill-white" />
                                </Button>
                                <div className="flex-1 flex gap-0.5 items-center h-6">
                                  {[8,14,20,16,24,18,12,22,10,18,14,20].map((h, i) => (
                                    <div key={i} className="w-0.5 bg-[#a855f7]/60 rounded-full" style={{ height: `${h}px` }} />
                                  ))}
                                </div>
                                <span className="text-[10px] font-bold text-white/40">{msg.duration}</span>
                              </div>
                            ) : (
                              <p className="text-sm md:text-base leading-relaxed text-white/90">{msg.text}</p>
                            )}

                            <div className="flex items-center gap-1.5 mt-2 justify-end opacity-60">
                              <span className="text-[9px] md:text-[10px] font-bold tracking-tight text-white/40">{msg.time}</span>
                              {isOut && <CheckCheck className="w-3.5 h-3.5 text-blue-400" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>

              {/* Input Area - Optimized Padding */}
              <div className="p-3 md:p-4 bg-black/40 border-t border-white/10 backdrop-blur-3xl pb-6 md:pb-4">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-white/40 hover:text-white rounded-xl">
                      <Smile className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-white/40 hover:text-white rounded-xl">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 min-h-[44px] flex items-center focus-within:border-[#a855f7]/50 transition-all shadow-inner">
                    <input 
                      placeholder="Type a message…" 
                      className="w-full bg-transparent border-none outline-none text-sm md:text-base py-1 text-white placeholder:text-white/20"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                  </div>

                  <Button 
                    className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#a855f7] to-[#7c3aed] shadow-xl shadow-[#a855f7]/30 hover:scale-105 active:scale-95 transition-all p-0 shrink-0"
                    onClick={handleSendMessage}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Panel */}
        <div className={cn(
          "bg-black/60 backdrop-blur-3xl border-l border-white/10 transition-all duration-300 overflow-hidden",
          isProfileOpen ? "w-full md:w-[300px]" : "w-0"
        )}>
          {selectedChat && (
            <div className="flex flex-col h-full min-w-[300px] p-8 text-center pt-12 md:pt-8">
              <div className="flex flex-col items-center mb-8">
                <div className={cn(
                  "w-24 h-24 border-3 border-[#a855f7]/30 mb-5 shadow-2xl shrink-0 flex items-center justify-center text-4xl font-black text-white",
                  selectedChat?.color,
                  selectedChat?.type === 'group' ? "rounded-3xl" : "rounded-full"
                )}>
                  {selectedChat?.avatar}
                </div>
                <h3 className="text-xl font-headline font-bold truncate w-full text-white">{selectedChat?.name}</h3>
                <p className="text-sm text-green-400 font-bold mt-1 uppercase tracking-widest">
                  {selectedChat?.type === 'group' ? `${selectedChat.members} Members` : 'Online'}
                </p>
              </div>

              <ScrollArea className="flex-1 -mx-4 px-4">
                <div className="text-left space-y-8">
                  <div>
                    <h5 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">About</h5>
                    <p className="text-sm text-white/60 leading-relaxed italic bg-white/5 p-4 rounded-2xl border border-white/5">
                      "{selectedChat?.bio}"
                    </p>
                  </div>

                  <div className="pt-6 space-y-3">
                    <Button variant="ghost" className="w-full justify-start text-xs font-bold gap-4 rounded-2xl hover:bg-white/5 h-12 text-white">
                      <Pin className="w-4 h-4 text-[#a855f7]" /> Starred Items
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-xs font-bold gap-4 rounded-2xl hover:bg-red-500/10 text-red-400 h-12">
                      <Trash2 className="w-4 h-4" /> Block Account
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
