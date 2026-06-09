
"use client"

import { useState, useEffect, useRef, useMemo, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
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
  MessageSquare,
  Library,
  Sparkles,
  Lock,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock Data
const INITIAL_CHATS = [
  { id: 1, name: 'Deep Learning Group', type: 'group', category: 'academics', avatar: '🧠', color: 'text-primary', bg: 'bg-primary/20', preview: 'Alex: Check the new mockups!', time: '2m', unread: 5, members: 12, online: 8, bio: 'Discussion for Unit 4: Neural Networks' },
  { id: 2, name: 'Luna Park', type: 'personal', category: 'clubs', avatar: 'LP', color: 'text-accent', bg: 'bg-accent/20', preview: 'Sounds great, see you there!', time: '8m', online: true, bio: "Hey there, I'm using PreRP Aura" },
  { id: 3, name: 'Hackathon Squad', type: 'group', category: 'academics', avatar: '💻', color: 'text-pink-400', bg: 'bg-pink-400/20', preview: 'CI passed ✅', time: '14m', unread: 2, members: 8, online: 5, bio: 'Building the next big thing' },
  { id: 4, name: 'Marco Alvarez', type: 'personal', category: 'clubs', avatar: 'MA', color: 'text-orange-400', bg: 'bg-orange-400/20', preview: 'Did you see the game? 🔥', time: '1h', online: false, bio: 'CS Sophomore | Photography' },
  { id: 5, name: 'Placement 2026', type: 'group', category: 'academics', avatar: '🚀', color: 'text-emerald-400', bg: 'bg-emerald-400/20', preview: 'Google info session at 3 PM!', time: '2h', unread: 9, members: 450, online: 120, bio: 'Official placement updates' },
  { id: 6, name: 'Priya Sharma', type: 'personal', category: 'clubs', avatar: 'PS', color: 'text-blue-400', bg: 'bg-blue-400/20', preview: 'Thanks for the help! 🙏', time: '3h', online: true, bio: 'Web Dev | UI Enthusiast' },
];

const INITIAL_MESSAGES: Record<number, any[]> = {
  1: [
    { id: 1, from: 'Alex Rivera', avatar: 'A', color: 'text-primary', text: 'Hey team! Check out the new Unit 4 notes I just uploaded to the Vault 📚', time: '10:12', type: 'in' },
    { id: 2, from: 'Sarah L', avatar: 'S', color: 'text-pink-400', text: 'These look absolutely stunning! Really helps with the backprop concepts.', time: '10:14', type: 'in', reactions: [{ e: '😍', n: 3 }, { e: '🔥', n: 2 }] },
    { id: 3, from: 'me', text: 'Agreed! The diagrams are very clear.', time: '10:15', type: 'out', read: true },
    { id: 5, from: 'me', text: 'When is the group study session?', time: '10:18', type: 'out', read: true },
    { id: 6, from: 'Alex Rivera', avatar: 'A', color: 'text-primary', text: 'Friday at 3pm in LT-402. Be there!', time: '10:19', type: 'in' },
    { id: 7, sys: 'Alex Rivera added Emma to the group' },
  ],
  2: [
    { id: 1, from: 'Luna Park', text: 'Hey! Are we still on for the hackathon prep tonight? 👀', time: 'Yesterday, 9:15 PM', type: 'in' },
    { id: 2, from: 'me', text: 'Yes absolutely! Can\'t wait to start coding 😊', time: '9:18 PM', type: 'out', read: true },
  ]
};

export default function ChatPage(props: { params: Promise<any>; searchParams: Promise<any> }) {
  const unwrappedSearchParams = use(props.searchParams);
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTab, setCurrentTab] = useState<'academics' | 'clubs'>('academics')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [inputText, setInputText] = useState("")
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)

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
      const matchesCategory = c.category === currentTab
      return matchesSearch && matchesCategory
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
      <div className="fixed inset-0 md:left-64 flex z-0 overflow-hidden bg-background">
        
        {/* Sidebar */}
        <div className={cn(
          "flex flex-col w-full md:w-80 border-r border-white/5 transition-all duration-300",
          selectedChatId && "hidden md:flex"
        )}>
          {/* Header Section */}
          <div className="px-6 py-4 space-y-4">
            <div>
              <h2 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-1">E2E Encrypted</h2>
            </div>

            {/* Category Toggle */}
            <div className="flex gap-3">
              <button 
                onClick={() => setCurrentTab('academics')}
                className={cn(
                  "flex-1 p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border",
                  currentTab === 'academics' 
                    ? "bg-primary/20 border-primary/30 text-white shadow-lg shadow-primary/20" 
                    : "glass border-white/5 text-muted-foreground hover:bg-white/5"
                )}
              >
                <Library className={cn("w-4 h-4", currentTab === 'academics' ? "text-primary" : "text-muted-foreground")} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Academics</span>
              </button>
              <button 
                onClick={() => setCurrentTab('clubs')}
                className={cn(
                  "flex-1 p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border",
                  currentTab === 'clubs' 
                    ? "bg-accent/20 border-accent/30 text-white shadow-lg shadow-accent/20" 
                    : "glass border-white/5 text-muted-foreground hover:bg-white/5"
                )}
              >
                <Sparkles className={cn("w-4 h-4", currentTab === 'clubs' ? "text-accent" : "text-muted-foreground")} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Clubs</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input 
                placeholder="Search conversations..." 
                className="w-full h-10 glass border-white/5 rounded-xl pl-10 pr-4 text-xs outline-none focus:border-primary/50 transition-all text-white placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Chat List */}
          <ScrollArea className="flex-1">
            <div className="px-3 pb-20 md:pb-4 space-y-1">
              {filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={cn(
                    "flex items-center gap-4 p-4 cursor-pointer transition-all relative rounded-2xl border border-transparent",
                    selectedChatId === chat.id 
                      ? "bg-primary/10 border-primary/20 shadow-md" 
                      : "hover:bg-white/5"
                  )}
                >
                  <div className="relative shrink-0">
                    <div className={cn(
                      "w-12 h-12 flex items-center justify-center font-bold text-lg border border-white/10",
                      chat.bg, chat.color,
                      chat.type === 'group' ? "rounded-xl" : "rounded-full"
                    )}>
                      {chat.avatar}
                    </div>
                    {chat.online === true && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full shadow-lg" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-bold text-sm truncate text-white">{chat.name}</h4>
                      <span className="text-[10px] text-muted-foreground font-medium">{chat.time}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate leading-snug">{chat.preview}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="ml-2 bg-primary text-primary-foreground text-[10px] font-bold h-5 w-5 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                      {chat.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Conversation Area */}
        <div className={cn(
          "flex-1 flex flex-col relative",
          !selectedChatId && "hidden md:flex items-center justify-center text-center p-8"
        )}>
          {!selectedChatId ? (
            <div className="max-w-sm animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 rounded-[32px] bg-primary/10 flex items-center justify-center text-4xl mb-6 mx-auto border border-primary/20 shadow-2xl shadow-primary/10">
                🔮
              </div>
              <h2 className="text-2xl font-headline font-bold mb-3 text-white">Select a Pulse</h2>
              <p className="text-sm text-muted-foreground leading-relaxed px-8">
                Choose a campus group or direct message to start your secure academic interaction.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Area Header */}
              <div className="px-4 py-3 border-b border-white/5 bg-background/80 backdrop-blur-3xl flex items-center justify-between z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden rounded-xl h-9 w-9 text-muted-foreground"
                    onClick={handleGoBack}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div className={cn(
                    "w-10 h-10 flex items-center justify-center font-bold shrink-0 text-base border border-white/10",
                    selectedChat?.bg, selectedChat?.color,
                    selectedChat?.type === 'group' ? "rounded-xl" : "rounded-full"
                  )}>
                    {selectedChat?.avatar}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm truncate leading-tight text-white">{selectedChat?.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", selectedChat?.online === true ? "bg-green-500" : "bg-muted-foreground")} />
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        {selectedChat?.type === 'group' 
                          ? `${selectedChat.members} Pulsars`
                          : selectedChat?.online ? 'Active Now' : 'Disconnected'
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/5 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/5 text-muted-foreground">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("h-9 w-9 rounded-xl hover:bg-white/5", isProfileOpen ? "text-primary bg-primary/10" : "text-muted-foreground")}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Message List */}
              <ScrollArea className="flex-1 p-4 md:p-8" ref={scrollAreaRef}>
                <div className="flex flex-col gap-3 max-w-4xl mx-auto pb-8">
                  <div className="flex items-center justify-center gap-2 mb-8 opacity-40">
                    <div className="h-px w-12 bg-white/20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">End-to-End Encrypted</span>
                    <div className="h-px w-12 bg-white/20" />
                  </div>

                  {messages.map((msg, idx) => {
                    if (msg.sys) {
                      return (
                        <div key={idx} className="glass border-white/5 rounded-full px-5 py-2 mx-auto text-[9px] text-muted-foreground font-black my-4 uppercase tracking-[0.2em] shadow-sm">
                          {msg.sys}
                        </div>
                      )
                    }
                    const isOut = msg.type === 'out'
                    return (
                      <div key={idx} className={cn(
                        "flex gap-3 max-w-[85%] md:max-w-[75%] group animate-in slide-in-from-bottom-2 duration-300",
                        isOut ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}>
                        {!isOut && (
                          <div className={cn("w-8 h-8 self-end rounded-lg shrink-0 flex items-center justify-center text-[10px] font-black border border-white/5 bg-white/5", msg.color)}>
                            {msg.avatar || '?'}
                          </div>
                        )}
                        <div className="space-y-1.5">
                          <div className={cn(
                            "p-3.5 px-4 rounded-2xl relative transition-all shadow-lg",
                            isOut 
                              ? "bg-primary/20 border border-primary/30 rounded-br-none" 
                              : "glass border-white/10 rounded-bl-none"
                          )}>
                            {!isOut && selectedChat?.type === 'group' && (
                              <p className={cn("text-[10px] font-black mb-1.5 uppercase tracking-widest", msg.color)}>{msg.from}</p>
                            )}
                            <p className="text-sm leading-relaxed text-white/90">{msg.text}</p>
                            <div className="flex items-center gap-1.5 mt-2.5 justify-end opacity-50">
                              <Clock className="w-2.5 h-2.5" />
                              <span className="text-[9px] font-bold tracking-tight">{msg.time}</span>
                              {isOut && <CheckCheck className="w-3.5 h-3.5 text-blue-400" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 md:p-6 flex flex-col items-center">
                <div className="max-w-4xl w-full flex items-center gap-3 glass border-white/10 p-2 rounded-2xl shadow-2xl">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-white rounded-xl hover:bg-white/5">
                      <Smile className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-white rounded-xl hover:bg-white/5">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <input 
                    placeholder="Type a message…" 
                    className="flex-1 bg-transparent border-none outline-none text-sm py-2 text-white placeholder:text-muted-foreground"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />

                  <Button 
                    className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all p-0 shrink-0"
                    onClick={handleSendMessage}
                  >
                    <Send className="w-4 h-4 text-primary-foreground" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Panel */}
        <div className={cn(
          "bg-background/95 backdrop-blur-3xl border-l border-white/5 transition-all duration-300 overflow-hidden",
          isProfileOpen ? "w-full md:w-[320px]" : "w-0"
        )}>
          {selectedChat && (
            <div className="flex flex-col h-full min-w-[320px] p-8 text-center">
              <div className="flex flex-col items-center mb-10 pt-8">
                <div className={cn(
                  "w-28 h-28 border-2 border-white/10 mb-6 shadow-2xl shrink-0 flex items-center justify-center text-5xl font-black",
                  selectedChat?.bg, selectedChat?.color,
                  selectedChat?.type === 'group' ? "rounded-[32px]" : "rounded-full"
                )}>
                  {selectedChat?.avatar}
                </div>
                <h3 className="text-2xl font-headline font-bold truncate w-full">{selectedChat?.name}</h3>
                <p className="text-xs text-primary font-black mt-2 uppercase tracking-[0.2em]">
                  {selectedChat?.type === 'group' ? `${selectedChat.members} Members` : 'Verified Pulsar'}
                </p>
              </div>

              <ScrollArea className="flex-1 -mx-4 px-4">
                <div className="text-left space-y-8">
                  <div>
                    <h5 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Documented Bio</h5>
                    <div className="text-sm text-white/70 leading-relaxed italic glass p-5 rounded-2xl border border-white/5">
                      "{selectedChat?.bio}"
                    </div>
                  </div>

                  <div className="pt-6 space-y-3">
                    <Button variant="ghost" className="w-full justify-start text-xs font-bold gap-4 rounded-xl hover:bg-white/5 h-12 text-white">
                      <Pin className="w-4 h-4 text-primary" /> Starred Pulse
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-xs font-bold gap-4 rounded-xl hover:bg-red-500/10 text-red-400 h-12">
                      <Trash2 className="w-4 h-4" /> Terminate Session
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
