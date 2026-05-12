"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, ArrowLeft, MoreHorizontal, Sparkles, Zap, Shield, Share2 } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

const API_BASE_URL = "https://rag-project-1u47.onrender.com/api/v1";

export default function ChatInterface() {
  const { id } = useParams();
  const [bot, setBot] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBot();
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchBot = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/bots/${id}`);
      setBot(res.data);
      setMessages([{
        role: "assistant",
        content: `Neural connection established. I am ${res.data.name}. System ready for queries.`
      }]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/chat/`, {
        bot_id: id,
        message: input,
        history: messages.slice(-5),
        provider: "groq"
      });

      setMessages((prev) => [...prev, {
        role: "assistant",
        content: res.data.answer,
        sources: res.data.sources
      }]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Core processing error. Please re-initiate query."
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!bot) return null;

  return (
    <div className={cn(
      "min-h-screen flex flex-col selection:bg-blue-500/30",
      bot.theme === 'cyberpunk' ? 'bg-[#050505] text-[#00ff41]' : 'bg-[#020617] text-white'
    )}>
      {/* Premium Chat Header */}
      <header className="px-8 h-24 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-3xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href={`/builder/${id}`} className="p-3 glass border-white/5 rounded-xl hover:bg-white/10 transition-all">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center glow-blue border border-white/10 shadow-xl">
              <Bot size={24} className="text-white fill-white" />
            </div>
            <div>
              <h2 className="font-black text-lg tracking-tight leading-tight">{bot.name}</h2>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Neural Node Active</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 glass border-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
            <Share2 size={18} />
          </button>
          <button className="p-3 glass border-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>

      {/* Modern Chat Surface */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-10">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-6",
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 border border-white/5 shadow-lg",
                  msg.role === 'user' ? 'bg-slate-800 text-slate-400' : 'bg-blue-600 text-white'
                )}>
                  {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
                </div>
                <div className={cn(
                  "max-w-[85%] rounded-[32px] px-8 py-6 text-[16px] font-medium leading-relaxed shadow-2xl transition-all",
                  msg.role === 'user' 
                    ? 'bg-slate-800/50 text-slate-100 border border-white/5' 
                    : bot.theme === 'cyberpunk' 
                      ? 'border-2 border-[#00ff41] bg-[#00ff41]/5 text-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.2)]' 
                      : 'glass border border-white/10 text-slate-200'
                )}>
                  {msg.content}
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                        <Shield size={12} className="text-blue-500" /> Evidence Synthesis
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {msg.sources.map((s: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-default">
                            <Zap size={10} className="text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              {s.source}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-6"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0 animate-pulse glow-blue">
                <Sparkles size={20} className="text-white" />
              </div>
              <div className="glass border border-white/10 rounded-[32px] px-8 py-6 flex gap-2 items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Floating Premium Input */}
      <footer className="p-10 bg-gradient-to-t from-[#020617] to-transparent">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 -z-10" />
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Interrogate neural node..."
            className={cn(
              "w-full px-10 py-6 rounded-[32px] bg-slate-900/80 backdrop-blur-3xl border border-white/10 focus:outline-none transition-all pr-24 font-bold text-lg placeholder:text-slate-600 shadow-2xl",
              bot.theme === 'cyberpunk' ? 'border-[#00ff41]/50 focus:border-[#00ff41]' : 'focus:border-blue-500/50'
            )}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-4 top-4 bottom-4 w-14 bg-blue-600 rounded-[20px] flex items-center justify-center hover:bg-blue-500 transition-all disabled:opacity-50 glow-blue shimmer-btn shadow-lg"
          >
            <Send size={24} className="text-white" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-8 font-black uppercase tracking-[0.4em]">
          RAG.AI NEURAL ENGINE — SECURED NODE
        </p>
      </footer>
    </div>
  );
}
