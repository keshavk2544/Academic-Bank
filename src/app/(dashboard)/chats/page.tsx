
"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GlassCard } from "@/components/glass-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Search, 
  MoreVertical, 
  UserPlus, 
  CircleDashed, 
  SquarePen, 
  ArrowLeft, 
  Phone, 
  Video, 
  Info, 
  Smile, 
  Paperclip, 
  Send, 
  Play, 
  ChevronDown,
  Reply,
  Copy,
  Share,
  Pin,
  Trash2,
  Ban,
  CheckCheck,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock Data
const INITIAL_CHATS = [
  { id: 1, name: 'Design Team', type: 'group', avatar: '🎨', color: 'bg-purple-500', preview: 'Alex: Check the new mockups!', time: '2m', unread: 5, members: 12, online: 8, bio: 'UI/UX team workspace' },
  { id: 2, name: 'Luna Park', type: 'personal', avatar: 'L', color: 'bg-fuchsia-500', preview: 'Sounds great, see you there!', time: '8m', online: true, bio: "Hey there, I'm using PreRP" },
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
    { id: 9, from: 'Sarah L', avatar: 'S', color: 'bg-pink-500', type: 'in', replyTo: 'Friday at 3pm...', replyFrom: 'Alex Kim', text: "I'll be there! Should I bring the printed storyboards too?", time: '10:25' },
  ],
  2: [
    { id: 1, from: 'Luna Park', text: 'Hey! Are we still on for tonight? 👀', time: 'Yesterday, 9:15 PM', type: 'in' },
    { id: 2, from: 'me', text: 'Yes absolutely! Can\'t wait 😊', time: '9:18 PM', type: 'out', read: true },
    { id: 3, from: 'Luna Park', text: 'Where should we meet? The usual spot?', time: '9:20 PM', type: 'in' },
    { id: 4, from: 'me', text: 'How about that new rooftop place downtown? I heard it\'s gorgeous at night ✨', time: '9:22 PM', type: 'out', read: true },
  ]
};

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTab, setCurrentTab] = useState<'all' | 'personal' | 'groups' | 'unread'>('all')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [inputText, setInputText] = useState("")
  const [replyingTo, setReplyingTo] = useState<any | null>(null)
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)

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

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedChatId) return
    // In a real app, this would update Firestore
    const newMessage = {
      id: Date.now(),
      from: 'me',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'out',
      read: false,
      replyTo: replyingTo ? replyingTo.text : undefined,
      replyFrom: replyingTo ? replyingTo.from : undefined
    }
    
    if (!INITIAL_MESSAGES[selectedChatId]) INITIAL_MESSAGES[selectedChatId] = []
    INITIAL_MESSAGES[selectedChatId].push(newMessage)
    
    setInputText("")
    setReplyingTo(null)
  }

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] overflow-hidden rounded-[32px] border border-white/10 shadow-2xl relative bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
        
        {/* Sidebar */}
        <div className={cn(
          "flex flex-col w-full md:w-[350px] border-r border-white/10 bg-black/20 backdrop-blur-2xl transition-all duration-300",
          selectedChatId && "hidden md:flex"
        )}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                💬
              </div>
              <h1 className="text-xl font-headline font-bold tracking-tight">Aura</h1>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-xl">
                <CircleDashed className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-xl">
                <UserPlus className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-xl">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search chats, groups..." 
                className="pl-10 h-11 bg-white/5 border-white/10 rounded-2xl focus:ring-purple-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 px-4 pb-2">
            {(['all', 'personal', 'groups', 'unread'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={cn(
                  "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                  currentTab === tab 
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30" 
                    : "text-muted-foreground hover:bg-white/5"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Chat List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all relative group",
                    selectedChatId === chat.id 
                      ? "bg-purple-500/20 border border-purple-500/30" 
                      : "hover:bg-white/5 border border-transparent"
                  )}
                >
                  {selectedChatId === chat.id && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-purple-500 rounded-r-full" />
                  )}
                  <div className="relative">
                    <Avatar className={cn(
                      "w-12 h-12 border-2 border-transparent transition-transform group-hover:scale-105",
                      chat.type === 'group' ? "rounded-2xl" : "rounded-full"
                    )}>
                      <AvatarFallback className={cn("text-white font-bold", chat.color)}>
                        {chat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {chat.online === true && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1a1640] rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-bold text-sm truncate">{chat.name}</h4>
                      <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{chat.preview}</p>
                  </div>
                  {chat.unread ? (
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-bold shadow-lg">
                      {chat.unread}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* New Chat Button */}
          <div className="p-4 border-t border-white/10 bg-black/40">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 rounded-xl font-bold gap-2">
              <SquarePen className="w-4 h-4" /> New Chat
            </Button>
          </div>
        </div>

        {/* Conversation Area */}
        <div className={cn(
          "flex-1 flex flex-col bg-white/[0.02] backdrop-blur-md relative",
          !selectedChatId && "hidden md:flex items-center justify-center text-center p-8"
        )}>
          {!selectedChatId ? (
            <div className="max-w-xs animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 rounded-3xl bg-purple-500/10 flex items-center justify-center text-4xl mb-6 mx-auto border border-purple-500/20">
                🔮
              </div>
              <h2 className="text-2xl font-headline font-bold mb-2">Welcome to Aura</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Select a campus group or direct message to start coordinating your next move.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-3 md:p-4 border-b border-white/10 bg-white/5 backdrop-blur-3xl flex items-center justify-between z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden rounded-full"
                    onClick={() => setSelectedChatId(null)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div className="relative">
                    <Avatar className={cn(
                      "w-10 h-10 border border-white/10",
                      selectedChat?.type === 'group' ? "rounded-xl" : "rounded-full"
                    )}>
                      <AvatarFallback className={cn("text-white font-bold", selectedChat?.color)}>
                        {selectedChat?.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {selectedChat?.online === true && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#1a1640] rounded-full" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm md:text-base truncate">{selectedChat?.name}</h3>
                    <p className={cn(
                      "text-[10px] md:text-xs",
                      selectedChat?.online === true ? "text-green-400 font-medium" : "text-muted-foreground"
                    )}>
                      {selectedChat?.type === 'group' 
                        ? `${selectedChat.members} members · ${selectedChat.online} online`
                        : selectedChat?.online ? 'Online' : 'Last seen recently'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="hidden sm:flex rounded-xl hover:bg-white/10 text-muted-foreground">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hidden sm:flex rounded-xl hover:bg-white/10 text-muted-foreground">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("rounded-xl hover:bg-white/10", isProfileOpen ? "text-purple-400 bg-purple-500/10" : "text-muted-foreground")}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <Info className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages List */}
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4 my-6 opacity-40">
                    <div className="h-px bg-white/10 flex-1" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Today</span>
                    <div className="h-px bg-white/10 flex-1" />
                  </div>

                  {messages.map((msg, idx) => {
                    if (msg.sys) {
                      return (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-full px-4 py-1 mx-auto text-[10px] text-muted-foreground font-medium mb-4">
                          {msg.sys}
                        </div>
                      )
                    }
                    const isOut = msg.type === 'out'
                    return (
                      <div key={idx} className={cn(
                        "flex gap-3 max-w-[85%] sm:max-w-[70%] group animate-in slide-in-from-bottom-1 duration-300",
                        isOut ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}>
                        {!isOut && (
                          <Avatar className="w-8 h-8 self-end rounded-full shrink-0">
                            <AvatarFallback className={cn("text-[10px] font-black text-white", msg.color)}>
                              {msg.avatar || '?'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="space-y-1">
                          {!isOut && selectedChat?.type === 'group' && (
                            <span className="text-[10px] font-bold text-purple-400 ml-2">{msg.from}</span>
                          )}
                          <div className={cn(
                            "p-3 rounded-2xl relative transition-all group-hover:shadow-lg",
                            isOut 
                              ? "bg-purple-600/40 border border-purple-500/30 rounded-br-none backdrop-blur-xl" 
                              : "bg-white/10 border border-white/10 rounded-bl-none backdrop-blur-xl"
                          )}>
                            {msg.replyTo && (
                              <div className="bg-black/20 border-l-2 border-purple-500 rounded-lg p-2 mb-2 text-[10px]">
                                <p className="font-bold text-purple-400 mb-1">{msg.replyFrom}</p>
                                <p className="text-muted-foreground line-clamp-1">{msg.replyTo}</p>
                              </div>
                            )}
                            
                            {msg.type === 'media' ? (
                              <div className="w-48 h-32 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center text-4xl">
                                🖼️
                              </div>
                            ) : msg.type === 'voice' ? (
                              <div className="flex items-center gap-3 min-w-[180px]">
                                <Button size="icon" className="w-8 h-8 rounded-full bg-purple-500 hover:bg-purple-600 shadow-md">
                                  <Play className="w-3 h-3 fill-white" />
                                </Button>
                                <div className="flex-1 flex gap-0.5 items-center h-6">
                                  {[8,14,20,16,24,18,12,22,10,18,14].map((h, i) => (
                                    <div key={i} className="w-1 bg-purple-500/50 rounded-full" style={{ height: `${h}px` }} />
                                  ))}
                                </div>
                                <span className="text-[10px] text-muted-foreground">{msg.duration}</span>
                              </div>
                            ) : (
                              <p className="text-sm leading-relaxed">{msg.text}</p>
                            )}

                            <div className={cn(
                              "flex items-center gap-1.5 mt-2 justify-end",
                              isOut ? "text-white/60" : "text-muted-foreground"
                            )}>
                              <span className="text-[9px] font-medium">{msg.time}</span>
                              {isOut && <CheckCheck className="w-3 h-3 text-blue-400" />}
                            </div>

                            {/* Reactions */}
                            {msg.reactions && (
                              <div className="flex gap-1 mt-2">
                                {msg.reactions.map((r: any, i: number) => (
                                  <div key={i} className="bg-white/10 border border-white/10 rounded-full px-2 py-0.5 text-[10px] flex items-center gap-1 cursor-pointer hover:bg-white/20 transition-colors">
                                    {r.e} <span className="opacity-60">{r.n}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {selectedChat?.online === true && selectedChat.type !== 'group' && (
                    <div className="flex gap-3 items-center ml-2">
                      <div className="flex gap-1 px-3 py-2 rounded-2xl bg-white/5 border border-white/10">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 bg-black/40 border-t border-white/10 backdrop-blur-3xl space-y-3">
                {replyingTo && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-purple-500/10 border-l-4 border-purple-500 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-3">
                      <Reply className="w-4 h-4 text-purple-400" />
                      <div className="text-xs">
                        <p className="font-bold text-purple-400 mb-0.5">{replyingTo.from}</p>
                        <p className="text-muted-foreground line-clamp-1">{replyingTo.text || 'Media message'}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setReplyingTo(null)}>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                <div className="flex items-end gap-3">
                  <div className="flex gap-1 mb-1">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-xl h-10 w-10">
                      <Smile className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-xl h-10 w-10">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 min-h-[44px] flex items-center focus-within:border-purple-500/50 transition-colors">
                    <textarea 
                      placeholder="Type a message..." 
                      className="w-full bg-transparent border-none outline-none resize-none text-sm py-1 custom-scrollbar max-h-32"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      rows={1}
                    />
                  </div>

                  <Button 
                    className="h-11 w-11 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all p-0"
                    onClick={handleSendMessage}
                  >
                    <Send className="w-5 h-5 text-white" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Info Panel */}
        {isProfileOpen && selectedChatId && (
          <div className="absolute inset-y-0 right-0 w-full sm:w-80 bg-[#0f0c29]/95 backdrop-blur-2xl border-l border-white/10 z-20 animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h4 className="font-bold">{selectedChat?.type === 'group' ? 'Group Info' : 'Contact Info'}</h4>
              <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsProfileOpen(false)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-6 text-center space-y-6">
                <div className="flex flex-col items-center">
                  <Avatar className={cn(
                    "w-24 h-24 border-4 border-purple-500/20 mb-4 shadow-2xl",
                    selectedChat?.type === 'group' ? "rounded-3xl" : "rounded-full"
                  )}>
                    <AvatarFallback className={cn("text-4xl font-black text-white", selectedChat?.color)}>
                      {selectedChat?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-headline font-bold">{selectedChat?.name}</h3>
                  <p className="text-sm text-green-400 font-medium">
                    {selectedChat?.type === 'group' ? `${selectedChat.members} Members` : 'Online'}
                  </p>
                </div>

                <div className="text-left space-y-6">
                  <div>
                    <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">About</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed italic bg-white/5 p-3 rounded-xl border border-white/5">
                      "{selectedChat?.bio}"
                    </p>
                  </div>

                  {selectedChat?.type === 'group' ? (
                    <div>
                      <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Stats</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                          <p className="text-[10px] text-muted-foreground font-bold mb-1">Messages</p>
                          <p className="text-lg font-bold">12.4k</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                          <p className="text-[10px] text-muted-foreground font-bold mb-1">Active Now</p>
                          <p className="text-lg font-bold text-purple-400">{selectedChat.online}</p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div>
                    <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Media Showcase</h5>
                    <div className="grid grid-cols-3 gap-2">
                      {['🖼️','📸','🎨','🌅','🏙️','🎭'].map((t, i) => (
                        <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-xl cursor-pointer">
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-xs font-bold gap-3 rounded-xl hover:bg-white/5">
                      <Pin className="w-4 h-4 text-purple-400" /> Starred Messages
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-xs font-bold gap-3 rounded-xl hover:bg-white/5">
                      <Users className="w-4 h-4 text-purple-400" /> View Participants
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-xs font-bold gap-3 rounded-xl hover:bg-red-500/10 text-red-400">
                      <Ban className="w-4 h-4" /> Block {selectedChat?.type === 'group' ? 'Group' : 'Contact'}
                    </Button>
                  </div>
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
