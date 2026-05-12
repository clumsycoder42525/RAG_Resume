"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Bot, Settings, Trash2, MessageSquare, LayoutDashboard, Search, Bell } from "lucide-react";
import Link from "next/link";
import axios from "axios";

const API_BASE_URL = "https://rag-project-1u47.onrender.com/api/v1";

interface Bot {
  id: string;
  name: string;
  description: string;
  theme: string;
  primary_color: string;
}

export default function Dashboard() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBotName, setNewBotName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/bots/`);
      setBots(res.data);
    } catch (err) {
      console.error("Failed to fetch bots", err);
    } finally {
      setLoading(false);
    }
  };

  const createBot = async () => {
    if (!newBotName) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/bots/`, {
        name: newBotName,
        theme: "modern",
        primary_color: "#3b82f6"
      });
      setBots([...bots, res.data]);
      setIsModalOpen(false);
      setNewBotName("");
    } catch (err) {
      console.error("Failed to create bot", err);
    }
  };

  const deleteBot = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/bots/${id}`);
      setBots(bots.filter(b => b.id !== id));
    } catch (err) {
      console.error("Failed to delete bot", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Premium Sidebar / Topbar */}
      <nav className="border-b border-white/5 bg-[#020617]/80 backdrop-blur-2xl sticky top-0 z-[100]">
        <div className="container mx-auto px-8 h-24 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-3 font-black text-2xl tracking-tighter">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center glow-blue">
                <Bot size={24} className="text-white fill-white" />
              </div>
              <span>RAG.AI</span>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              <Link href="/dashboard" className="text-blue-400">Inventory</Link>
              <Link href="#" className="hover:text-white transition-colors">Analytics</Link>
              <Link href="#" className="hover:text-white transition-colors">API Keys</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search Knowledge..."
                className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 w-64 transition-all"
              />
            </div>
            <button className="w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
              <Bell size={18} className="text-slate-400" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-2 border-white/10 shadow-lg" />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <LayoutDashboard size={24} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Management Console</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter">My Knowledge Base</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-blue-600 rounded-[24px] font-black flex items-center gap-3 hover:bg-blue-500 transition-all glow-blue shimmer-btn"
          >
            <Plus size={24} /> Create Neural Bot
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="h-64 glass rounded-[32px] animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {bots.map((bot) => (
              <motion.div
                key={bot.id}
                layoutId={bot.id}
                className="premium-card group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-[20px] flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
                    <Bot className="text-blue-400" size={32} />
                  </div>
                  <button 
                    onClick={() => deleteBot(bot.id)}
                    className="p-3 text-slate-500 hover:text-rose-400 transition-colors bg-white/5 rounded-xl"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <h3 className="text-2xl font-black mb-2 tracking-tight group-hover:text-blue-400 transition-colors">{bot.name}</h3>
                <p className="text-slate-400 text-sm mb-8 font-medium line-clamp-2 leading-relaxed">
                  {bot.description || "Synthesizing intelligence from provided data sources."}
                </p>
                
                <div className="flex gap-4">
                  <Link href={`/builder/${bot.id}`} className="flex-1">
                    <button className="w-full py-4 glass border-white/5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                      <Settings size={18} /> Config
                    </button>
                  </Link>
                  <Link href={`/chat/${bot.id}`} className="flex-1">
                    <button className="w-full py-4 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-600/20 transition-all flex items-center justify-center gap-2">
                      <MessageSquare size={18} /> Live
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && bots.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 glass rounded-[40px] border-dashed border-white/10"
          >
            <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
              <Plus size={40} className="text-slate-700" />
            </div>
            <h3 className="text-2xl font-black mb-2">Initialize Your First Bot</h3>
            <p className="text-slate-500 font-medium">Start by adding a data source to begin training.</p>
          </motion.div>
        )}
      </main>

      {/* Premium Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-xl glass border-white/10 rounded-[40px] p-12 relative z-10 overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
              <h2 className="text-4xl font-black mb-4 tracking-tighter">Build New Agent</h2>
              <p className="text-slate-400 mb-10 font-medium">Define your custom intelligence parameters.</p>
              
              <div className="space-y-8 mb-12">
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-4">Neural Identity Name</label>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="e.g. Research Assistant Alpha"
                    value={newBotName}
                    onChange={(e) => setNewBotName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-lg font-bold focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 glass border-white/5 rounded-3xl font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Discard
                </button>
                <button 
                  onClick={createBot}
                  className="flex-1 py-5 bg-blue-600 rounded-3xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all glow-blue shimmer-btn"
                >
                  Initialize
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
