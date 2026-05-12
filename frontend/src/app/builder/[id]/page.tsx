"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Upload, Globe, Palette, Database, Check, Loader2, Sparkles, Cpu, Settings as SettingsIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";

const API_BASE_URL = "https://rag-project-1u47.onrender.com/api/v1";

export default function BotBuilder() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("sources");
  const [bot, setBot] = useState<any>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  
  // Bot settings state
  const [botName, setBotName] = useState("");
  const [botDesc, setBotDesc] = useState("");
  const [botTheme, setBotTheme] = useState("");
  const [botColor, setBotColor] = useState("");

  useEffect(() => {
    fetchBot();
    fetchSources();
  }, [id]);

  const fetchBot = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/bots/${id}`);
      setBot(res.data);
      setBotName(res.data.name);
      setBotDesc(res.data.description || "");
      setBotTheme(res.data.theme);
      setBotColor(res.data.primary_color);
    } catch (err) {
      console.error(err);
      router.push("/dashboard");
    }
  };

  const fetchSources = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/sources/${id}`);
      setSources(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBot = async () => {
    setLoading(true);
    setSuccess(null);
    try {
      const res = await axios.put(`${API_BASE_URL}/bots/${id}`, {
        name: botName,
        description: botDesc,
        theme: botTheme,
        primary_color: botColor
      });
      setBot(res.data);
      setSuccess("Bot configuration updated");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    setSuccess(null);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("bot_id", id as string);

    try {
      await axios.post(`${API_BASE_URL}/sources/upload-pdf`, formData);
      setSuccess("Document ingestion successful");
      fetchSources();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlIngest = async () => {
    if (!url) return;
    setLoading(true);
    setSuccess(null);
    const formData = new FormData();
    formData.append("url", url);
    formData.append("bot_id", id as string);

    try {
      await axios.post(`${API_BASE_URL}/sources/ingest-url`, formData);
      setSuccess("URL crawled and indexed");
      setUrl("");
      fetchSources();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSource = async (sourceName: string) => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/sources/${id}/${encodeURIComponent(sourceName)}`);
      fetchSources();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!bot) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <nav className="border-b border-white/5 bg-[#020617]/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="container mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="p-3 glass border-white/5 rounded-xl hover:bg-white/10 transition-all group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-0.5">Neural Configuration</span>
              <h1 className="font-black text-xl tracking-tight">{bot.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2 text-emerald-400 font-bold text-xs bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20"
                >
                  <Check size={14} /> {success}
                </motion.div>
              )}
            </AnimatePresence>
            <Link href={`/chat/${id}`}>
              <button className="px-6 py-2.5 bg-blue-600 rounded-xl text-sm font-black uppercase tracking-widest glow-blue shimmer-btn">
                Launch Chatbot
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-8 py-16 flex flex-col lg:flex-row gap-12">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-72 space-y-2">
          <button 
            onClick={() => setActiveTab("sources")}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'sources' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 glow-blue' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <Database size={20} /> Data Ingestion
          </button>
          <button 
            onClick={() => setActiveTab("appearance")}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'appearance' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 glow-blue' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <Palette size={20} /> Neural Branding
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'settings' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 glow-blue' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <SettingsIcon size={20} /> System Parameters
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 max-w-4xl">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {activeTab === "sources" && (
              <>
                <div className="premium-card">
                  <h2 className="text-3xl font-black mb-2 tracking-tighter">Knowledge Intake</h2>
                  <p className="text-slate-400 mb-10 font-medium">Supply the neural engine with raw data for synthesis.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* PDF Upload */}
                    <div className="p-8 rounded-[32px] bg-slate-900/50 border-2 border-dashed border-white/5 hover:border-blue-500/30 transition-all relative group overflow-hidden">
                      <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        disabled={loading}
                      />
                      <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/10 group-hover:scale-110 transition-transform duration-500">
                          <Upload className="text-blue-400" size={32} />
                        </div>
                        <h4 className="text-xl font-black mb-2">PDF Syndicate</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Drop neural packets here</p>
                      </div>
                    </div>

                    {/* URL Ingest */}
                    <div className="p-8 rounded-[32px] glass border border-white/5 flex flex-col justify-center">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6 border border-emerald-500/10">
                          <Globe className="text-emerald-400" size={32} />
                        </div>
                        <h4 className="text-xl font-black mb-6">Web Crawler</h4>
                        <div className="flex w-full gap-3">
                          <input 
                            type="text" 
                            placeholder="https://intelligence.io"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all"
                          />
                          <button 
                            onClick={handleUrlIngest}
                            disabled={loading || !url}
                            className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-500 transition-all disabled:opacity-50"
                          >
                            <Check size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {loading && (
                    <div className="mt-10 flex items-center justify-center gap-4 text-blue-400 bg-blue-500/5 py-4 rounded-2xl border border-blue-500/10">
                      <Loader2 className="animate-spin" size={20} />
                      <span className="font-black text-xs uppercase tracking-[0.2em]">Synthesizing Intelligence...</span>
                    </div>
                  )}
                </div>

                {/* Sources List */}
                <div className="premium-card">
                  <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                    <Sparkles size={24} className="text-blue-400" /> Active Knowledge Nodes
                  </h3>
                  {sources.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-[32px]">
                      <Database className="mx-auto text-slate-800 mb-4" size={40} />
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No active intelligence sources</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sources.map((source) => (
                        <div key={source} className="flex items-center justify-between p-6 glass rounded-2xl group hover:bg-white/[0.05] transition-all">
                          <div className="flex items-center gap-4 overflow-hidden">
                            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-white/5">
                              {source.startsWith('http') ? <Globe size={18} className="text-emerald-400" /> : <Database size={18} className="text-blue-400" />}
                            </div>
                            <span className="font-bold text-sm truncate text-slate-300">{source}</span>
                          </div>
                          <button 
                            onClick={() => deleteSource(source)}
                            className="p-3 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all bg-white/5 rounded-xl"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "appearance" && (
              <div className="premium-card">
                <h2 className="text-3xl font-black mb-10 tracking-tighter">Neural Branding</h2>
                
                <div className="space-y-12">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-6">Cognitive Interface Theme</label>
                    <div className="grid grid-cols-2 gap-6">
                      {['modern', 'glassmorphism', 'cyberpunk', 'minimal'].map((theme) => (
                        <button 
                          key={theme}
                          onClick={() => setBotTheme(theme)}
                          className={`p-6 rounded-3xl border-2 text-left transition-all capitalize group ${botTheme === theme ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-black text-lg">{theme}</span>
                            {botTheme === theme && <div className="w-3 h-3 bg-blue-500 rounded-full glow-blue" />}
                          </div>
                          <p className="text-xs text-slate-500 mt-2 font-medium">System defined preset</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-6">Core Frequency Color</label>
                    <div className="flex gap-4">
                      {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                        <button 
                          key={color}
                          onClick={() => setBotColor(color)}
                          className={`w-14 h-14 rounded-2xl border-4 transition-all ${botColor === color ? 'border-white scale-110 shadow-xl' : 'border-transparent opacity-40 hover:opacity-100'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={handleUpdateBot}
                    disabled={loading}
                    className="w-full py-6 bg-blue-600 rounded-[32px] font-black text-lg uppercase tracking-[0.2em] hover:bg-blue-500 transition-all glow-blue shimmer-btn"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : "Deploy Configuration"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="premium-card">
                <h2 className="text-3xl font-black mb-10 tracking-tighter">System Parameters</h2>
                <div className="space-y-8">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-4">Neural Node Name</label>
                    <input 
                      type="text" 
                      value={botName}
                      onChange={(e) => setBotName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 font-bold focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-4">Objective Protocol (Description)</label>
                    <textarea 
                      value={botDesc}
                      onChange={(e) => setBotDesc(e.target.value)}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 font-bold focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                  <button 
                    onClick={handleUpdateBot}
                    disabled={loading}
                    className="w-full py-6 glass border-white/5 rounded-[32px] font-black text-lg uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                  >
                    Update Protocol
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
