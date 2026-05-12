"use client";

import { motion } from "framer-motion";
import { 
  Zap, ArrowRight, Sparkles, Shield, Cpu, 
  Terminal, Activity, BookOpen, Code, 
  ChevronRight, Search, FileText, Globe, Database
} from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const categories = [
    {
      title: "Core Infrastructure",
      links: ["Neural Engine", "Matrix Protocol", "Vector Ingestion"]
    },
    {
      title: "API Reference",
      links: ["Authentication", "Retrieval Endpoints", "Webhooks"]
    },
    {
      title: "Deployment",
      links: ["Cloud Matrix", "On-Prem Nodes", "Edge Intelligence"]
    }
  ];

  return (
    <div className="min-h-screen bg-bg neural-mesh selection:bg-primary/30">
      {/* Background Grids */}
      <div className="fixed inset-0 bg-grid-animate opacity-[0.02] pointer-events-none" />
      
      <nav className="fixed top-0 left-0 w-full h-20 z-[100] border-b border-white/5 bg-bg/20 backdrop-blur-3xl px-8 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3 font-black text-2xl tracking-tighter hover:scale-105 transition-all">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center glow-blue">
              <Zap size={22} className="fill-white text-white" />
            </div>
            <span className="text-white">RAG.AI <span className="text-[10px] text-slate-500 font-bold ml-2">DOCS</span></span>
          </Link>
        </div>
        <Link href="/dashboard">
          <button className="px-6 py-2.5 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-xl">
            Console
          </button>
        </Link>
      </nav>

      <main className="container mx-auto px-8 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-12 h-fit sticky top-32">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search Manifest..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-white focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-10">
            {categories.map((cat) => (
              <div key={cat.title} className="space-y-4">
                <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{cat.title}</h6>
                <ul className="space-y-3">
                  {cat.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-all flex items-center gap-2 group">
                        <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-9 space-y-20">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 glass-panel rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 border-cyan-400/20">
              <BookOpen size={14} /> Documentation Manifest v1.0
            </div>
            <h1 className="text-7xl font-black tracking-tighter text-white uppercase leading-none">
              Neural Engine <br /><span className="text-slate-500">Architecture</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-3xl">
              RAG.AI is built on a high-concurrency neural retrieval pipeline. Every knowledge node you create is isolated, indexed, and grounded in real-time.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bento-card bg-primary/5 border-primary/20 p-8">
              <FileText className="text-primary mb-6" size={32} />
              <h4 className="text-2xl font-black tracking-tighter uppercase mb-4">Ingestion Flow</h4>
              <p className="text-sm text-slate-500 font-bold leading-relaxed">
                Learn how our structural parser handles PDF metadata and nested table hierarchies.
              </p>
              <Link href="#" className="mt-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:gap-4 transition-all">
                Read Spec <ArrowRight size={14} />
              </Link>
            </div>
            <div className="bento-card border-white/5 p-8">
              <Code className="text-cyan-400 mb-6" size={32} />
              <h4 className="text-2xl font-black tracking-tighter uppercase mb-4">REST Integration</h4>
              <p className="text-sm text-slate-500 font-bold leading-relaxed">
                Connect your custom bots to any third-party app via our low-latency JSON API.
              </p>
              <Link href="#" className="mt-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:gap-4 transition-all">
                API Docs <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <section className="glass-panel p-12 rounded-[2.5rem] border-white/5 space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-20"><Cpu size={120} className="text-primary" /></div>
             <h3 className="text-3xl font-black tracking-tighter uppercase">Quick Start Command</h3>
             <div className="bg-black/40 rounded-2xl p-6 font-mono text-sm border border-white/5 flex items-center justify-between group">
                <span className="text-emerald-400">curl -X POST https://api.rag.ai/v1/ingest -d @knowledge.pdf</span>
                <button className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-all">Copy</button>
             </div>
          </section>
        </div>
      </main>

      <footer className="container mx-auto px-8 py-20 border-t border-white/5 flex justify-between items-center text-slate-600 font-bold uppercase tracking-[0.3em] text-[8px]">
        <span>© 2024 RAG.AI LABS // MANIFEST_STABLE</span>
        <div className="flex gap-10">
          <Link href="/" className="hover:text-white transition-all">Engine Home</Link>
          <Link href="/dashboard" className="hover:text-white transition-all">Console Access</Link>
        </div>
      </footer>
    </div>
  );
}
