"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Bot, Zap, ArrowRight, Sparkles, Shield, Cpu, MessageSquare, 
  Globe, Database, Layers, BarChart3, Rocket, Check, Terminal,
  Activity, Fingerprint, Lock, Network, Share2, Search, FileText, 
  Box, Link2, Server, Settings, Code, Scale, GraduationCap, Briefcase
} from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

// --- HELPERS ---
const FloatingChip = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.div 
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute px-4 py-2 glass-panel rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 z-20 ${className}`}
  >
    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
    {children}
  </motion.div>
);

// --- COMPONENTS ---

const NeuralCoreShowcase = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { id: "ingest", title: "PDF Ingestion", icon: FileText, log: "CHUNK_SERVICE: Processing structural_docs.pdf" },
    { id: "chunk", title: "Neural Chunking", icon: Layers, log: "SEMANTIC_SPLIT: Created 142 contextual blocks" },
    { id: "embed", title: "Vector Synthesis", icon: Cpu, log: "EMBED_V4: Generated 384-dim embeddings" },
    { id: "db", title: "ChromaDB Sync", icon: Database, log: "COLLECTION_INDEX: 1,402 vectors committed" },
    { id: "search", title: "Semantic Search", icon: Search, log: "RETRIEVAL: Nearest neighbor recall in 12ms" },
    { id: "generate", title: "AI Cognition", icon: MessageSquare, log: "LLM_ORCHESTRATOR: Streaming grounded response" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch min-h-[700px]">
      {/* Left Pipeline */}
      <div className="lg:col-span-4 space-y-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            onClick={() => setActiveStep(i)}
            className={`cursor-pointer p-6 rounded-3xl border transition-all duration-500 flex items-center gap-6 ${
              activeStep === i 
                ? "bg-primary/10 border-primary shadow-[0_0_30px_rgba(0,87,255,0.1)]" 
                : "bg-white/[0.02] border-white/5 opacity-40 hover:opacity-100"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeStep === i ? "bg-primary text-white" : "bg-white/5 text-slate-500"}`}>
              <step.icon size={20} />
            </div>
            <div>
              <h5 className="text-xs font-black uppercase tracking-[0.2em]">{step.title}</h5>
              {activeStep === i && (
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="h-0.5 bg-cyan-400 mt-2" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Right Visualization */}
      <div className="lg:col-span-8 bento-card border-white/10 bg-bg-dark/60 overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-shimmer" />
        
        <div className="flex-1 p-10 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-full flex flex-col"
            >
              <div className="flex justify-between mb-10">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Process</div>
                  <h4 className="text-4xl font-black tracking-tighter uppercase">{steps[activeStep].title}</h4>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Latency</div>
                    <div className="text-xl font-black text-cyan-400 tracking-tighter">0.024ms</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Accuracy</div>
                    <div className="text-xl font-black text-emerald-400 tracking-tighter">99.8%</div>
                  </div>
                </div>
              </div>

              {/* Step Specific Visuals */}
              <div className="flex-1 glass-panel rounded-[2rem] border-white/5 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-grid-animate opacity-[0.05]" />
                
                {activeStep === 0 && (
                  <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                    <FileText size={80} className="text-primary animate-pulse" />
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <div className="flex gap-4">
                    {[1,2,3,4,5].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: [20, 100, 20] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        className="w-4 bg-primary/20 rounded-full"
                      />
                    ))}
                  </div>
                )}

                {activeStep === 2 && (
                   <div className="relative w-64 h-64 flex items-center justify-center">
                      <div className="absolute inset-0 border border-primary/20 rounded-full animate-spin-slow" />
                      <Cpu size={60} className="text-cyan-400" />
                      {[...Array(8)].map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.5] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
                          className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                          style={{ rotate: `${i * 45}deg`, translateY: -100 }}
                        />
                      ))}
                   </div>
                )}

                {activeStep === 3 && (
                  <div className="grid grid-cols-4 gap-4">
                    {[...Array(12)].map((_, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.5] }}
                        transition={{ delay: i * 0.1 }}
                        className="w-12 h-12 glass-panel border-white/10 rounded-xl flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeStep === 4 && (
                  <div className="relative">
                     <div className="w-48 h-48 border-2 border-dashed border-primary/30 rounded-full animate-spin-slow" />
                     <Search size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
                  </div>
                )}

                {activeStep === 5 && (
                  <div className="w-full max-w-md p-8 glass-panel rounded-2xl border-cyan-400/20 text-left">
                    <div className="flex items-center gap-3 mb-4">
                      <Bot size={20} className="text-cyan-400" />
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Retrieval_Finalized</div>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-bold text-slate-300 leading-relaxed"
                    >
                      "According to the ingested documentation, the system operates on a multi-modal retrieval-augmented generation framework with citation-grounded verification..."
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Live Terminal Log */}
        <div className="h-16 bg-black/40 border-t border-white/5 flex items-center px-8 justify-between font-mono">
           <div className="flex items-center gap-4 text-[10px] text-slate-500">
              <span className="text-cyan-400 font-bold">SYSTEM:</span>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {steps[activeStep].log}
                </motion.span>
              </AnimatePresence>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[8px] font-black text-slate-700 uppercase">Realtime_Feed</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="relative bg-bg neural-mesh min-h-screen">
      {/* HUD Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[99] border-[20px] border-white/[0.01] overflow-hidden">
        <div className="absolute top-10 left-10 text-[10px] font-black text-white/10 uppercase tracking-[0.5em] [writing-mode:vertical-lr]">System Protocol 8.4.2</div>
        <div className="absolute bottom-10 right-10 text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">RAG.AI NEURAL NETWORK ACTIVE</div>
      </div>

      <nav className="fixed top-0 left-0 w-full h-20 z-[100] border-b border-white/5 bg-bg/20 backdrop-blur-3xl px-8 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3 font-black text-2xl tracking-tighter hover:scale-105 transition-all">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center glow-blue">
              <Zap size={22} className="fill-white text-white" />
            </div>
            <span className="text-white hidden sm:block">RAG.AI</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
            {["Engine", "Protocol", "Network", "Matrix"].map((link) => (
              <Link key={link} href={`#${link.toLowerCase()}`} className="hover:text-cyan-400 transition-all">{link}</Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="hidden sm:block text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-all">Console Login</Link>
          <Link href="/dashboard">
            <button className="px-6 py-2.5 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-xl">
              Initialize Matrix
            </button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-8">
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-grid-animate opacity-[0.03]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(0,87,255,0.08)_0%,transparent_70%)] animate-pulse-slow" />
          </div>

          <div className="container mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="lg:col-span-7 space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 glass-panel rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 border-cyan-400/20">
                  <Activity size={14} className="animate-pulse" /> Unified Neural Intelligence v4.0
                </div>
                <h1 className="heading-insane text-[80px] md:text-[140px] leading-[0.78] text-white">
                  The Brain <br />
                  <span className="text-gradient-blue italic tracking-[-0.05em] lowercase">of your</span> <br />
                  <span className="text-glow-cyan">Data.</span>
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-medium leading-relaxed">
                Don't just search. <span className="text-white font-black underline decoration-cyan-400 underline-offset-8">Cognate.</span> <br /> 
                The world's most advanced RAG engine, engineered for zero-latency neural synthesis.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <button className="w-full px-12 py-6 bg-primary rounded-3xl font-black text-xl uppercase tracking-widest hover:bg-blue-500 transition-all glow-blue shimmer-btn flex items-center justify-center gap-4">
                    Deploy Intelligence <ArrowRight size={24} />
                  </button>
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5 relative">
              <div className="neural-card h-[600px] border-white/10 bg-bg-dark/80 backdrop-blur-3xl overflow-hidden shadow-2xl group">
                <div className="absolute top-0 left-0 w-full h-12 bg-white/[0.02] border-b border-white/5 flex items-center px-6 justify-between">
                  <div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-rose-500/50" /><div className="w-2 h-2 rounded-full bg-amber-500/50" /><div className="w-2 h-2 rounded-full bg-emerald-500/50" /></div>
                  <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Neural_Console.sys</div>
                </div>
                <div className="p-8 pt-20 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Query Performance</div>
                      <div className="text-3xl font-black text-white tracking-tighter">0.024ms</div>
                    </div>
                    <BarChart3 className="text-cyan-400" size={32} />
                  </div>
                  <div className="space-y-4">
                    <div className="h-px bg-white/5" />
                    <div className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.3em]">Live Vector Streams</div>
                    {[1,2,3].map(i => (
                      <div key={i} className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                        <Database size={16} className="text-slate-600" />
                        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity }} className="h-full w-1/3 bg-cyan-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <FloatingChip className="top-10 -right-10">Low Latency</FloatingChip>
              <FloatingChip className="bottom-20 -left-10">99.9% Recall</FloatingChip>
            </motion.div>
          </div>
        </section>

        {/* NEURAL CORE SHOWCASE (Replacing Pricing) */}
        <section id="engine" className="py-48 scroll-mt-24">
          <div className="text-center space-y-6 mb-32">
            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-primary">The Neural Core</h2>
            <h3 className="text-7xl md:text-9xl font-black tracking-tighter text-white uppercase leading-[0.8]">Intelligence <br /><span className="text-slate-500">In Motion.</span></h3>
          </div>
          <NeuralCoreShowcase />
        </section>

        {/* USE CASE MATRIX */}
        <section id="matrix" className="py-48 scroll-mt-24">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
             <div className="space-y-4">
                <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary">Deployment Scenarios</h2>
                <h3 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-[0.85]">Vertical <br /><span className="text-slate-500">Impact.</span></h3>
             </div>
             <p className="text-slate-400 max-w-sm text-lg font-medium">From high-stakes legal analysis to rapid engineering research.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[900px]">
             <div className="md:col-span-8 bento-card group">
                <div className="flex justify-between mb-20">
                   <div className="space-y-4">
                      <GraduationCap className="text-primary" size={40} />
                      <h4 className="text-4xl font-black tracking-tighter uppercase">Academic Research</h4>
                      <p className="text-slate-400 font-medium max-w-md">Index thousands of research papers and synthesize findings across journals with full citation grounding.</p>
                   </div>
                </div>
                <div className="flex gap-4 opacity-30 group-hover:opacity-100 transition-all">
                   {["Abstract", "Methodology", "Results", "Discussion"].map(t => (
                     <div key={t} className="px-4 py-2 glass-panel rounded-lg text-[8px] font-black uppercase tracking-widest">{t}</div>
                   ))}
                </div>
             </div>

             <div className="md:col-span-4 bento-card bg-cyan-400/5 border-cyan-400/20">
                <Scale className="text-cyan-400 mb-8" size={32} />
                <h4 className="text-3xl font-black tracking-tighter uppercase mb-4">Legal <br />Discovery</h4>
                <p className="text-xs text-slate-500 font-bold">Cross-reference case law, contracts, and filings instantly to find critical precedents.</p>
             </div>

             <div className="md:col-span-4 bento-card">
                <Code className="text-purple-400 mb-8" size={32} />
                <h4 className="text-3xl font-black tracking-tighter uppercase mb-4">Engineering <br />Docs</h4>
                <p className="text-xs text-slate-500 font-bold">Crawl entire documentation sites to provide developers with instant technical answers.</p>
             </div>

             <div className="md:col-span-8 bento-card bg-emerald-500/5 border-emerald-500/10 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-6">
                   <Briefcase className="text-emerald-400" size={40} />
                   <h4 className="text-4xl font-black tracking-tighter uppercase">Enterprise <br />Brain</h4>
                   <p className="text-slate-400 font-medium">Centralize all internal knowledge bases, Slack logs, and Notion pages into a single source of truth.</p>
                </div>
                <div className="w-full md:w-1/2 h-full glass-panel rounded-[2rem] border-white/5 bg-black/20" />
             </div>
          </div>
        </section>

        {/* TECH STACK FOOTER */}
        <footer className="relative bg-bg-dark border-t border-white/5 py-32 overflow-hidden">
          <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-20 relative z-10">
             <div className="lg:col-span-4 space-y-10">
                <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
                  <Zap size={24} className="text-primary fill-primary" />
                  <span className="text-white">RAG.AI</span>
                </div>
                <p className="text-sm text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
                  The world's first autonomous neural synthesis engine.
                </p>
                <div className="flex gap-4">
                   <div className="px-4 py-2 glass-panel rounded-xl text-[8px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> API_UPTIME: 99.98%
                   </div>
                </div>
             </div>
             <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                  { title: "Network", links: [
                    { label: "Neural Engine", href: "#engine" },
                    { label: "Matrix Protocol", href: "#protocol" },
                    { label: "Neural ID", href: "/docs" }
                  ] },
                  { title: "Matrix", links: [
                    { label: "Console", href: "/dashboard" },
                    { label: "Sigma Module", href: "#matrix" },
                    { label: "Omega Node", href: "#matrix" }
                  ] },
                  { title: "Manifest", links: [
                    { label: "Documentation", href: "/docs" },
                    { label: "API Spec", href: "/docs" },
                    { label: "Research", href: "/docs" }
                  ] },
                  { title: "Support", links: [
                    { label: "Status Node", href: "#" },
                    { label: "Security Matrix", href: "#" },
                    { label: "Contact Relay", href: "mailto:support@rag.ai" }
                  ] },
                ].map((group) => (
                  <div key={group.title} className="space-y-8">
                    <h6 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">{group.title}</h6>
                    <ul className="space-y-4">
                      {group.links.map((link) => (
                        <li key={link.label}>
                          <Link href={link.href} className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-cyan-400 transition-all flex items-center gap-2 group">
                            <div className="w-1 h-1 bg-slate-800 rounded-full group-hover:bg-cyan-400 transition-all" /> {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
             </div>
          </div>
          <div className="container mx-auto px-8 mt-32 pt-12 border-t border-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-10">
             <div className="flex gap-8 text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">
                <span>Privacy_Protocol</span>
                <span>Encryption_Terms</span>
             </div>
             <div className="flex items-center gap-3 text-slate-800">
                <Terminal size={14} />
                <span className="text-[8px] font-black uppercase tracking-[0.5em]">Session: 0x84A2...F91E</span>
             </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
