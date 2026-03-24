"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Shield, Terminal, Cpu, Info, AlertTriangle, Zap, Target, Hammer, Layers, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import CertificationsSection from "./_components/CertificationsSection";
import CompactTimeline from "./_components/CompactTimeline";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-cyber-black flex flex-col font-mono selection:bg-cyber-blue selection:text-black">
            <Navbar />

            <div className="flex-grow pt-32 pb-20 container mx-auto px-4">
                <div className="max-w-7xl mx-auto space-y-12">
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-10 border-l-4 border-cyber-blue pl-6"
                    >
                        <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tighter">
                            {">"} OPERATIVE_PROFILE<span className="text-cyber-blue">: </span>SUBZXD
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base mt-2 uppercase tracking-widest flex items-center">
                            <Info className="w-5 h-5 mr-3 text-cyber-blue" />
                            System identity verified // Status: ACTIVE_LEARNING_V2.0
                        </p>
                    </motion.div>

                    {/* Dashboard Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* TOP LEFT: PROFILE BIO (COL SPAN 7) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-7 bg-cyber-black border border-cyber-gray p-6 relative group overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(0,243,255,0.1)] transition-all duration-300 h-full hover:border-cyber-blue/50"
                        >
                            <div className="absolute top-0 right-0 w-32 h-1 bg-cyber-blue/50 group-hover:w-full transition-all duration-500"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-1 bg-cyber-blue/30"></div>

                            <h2 className="text-cyber-blue font-bold text-xl mb-8 flex items-center uppercase tracking-widest">
                                <User className="w-5 h-5 mr-3" />
                                BIOGRAPHY_MODULE
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                                <div className="md:col-span-1">
                                    <div className="aspect-square bg-cyber-gray border border-cyber-blue relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-cyber-blue/20 mix-blend-overlay group-hover:bg-transparent transition-all"></div>
                                        <div className="flex items-center justify-center h-full text-cyber-blue">
                                            <img src="/profile.jpeg" alt="SubzXD" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full p-2 bg-cyber-blue/80 text-black text-[9px] font-mono font-bold text-center uppercase tracking-tight">
                                            ID_VERIFIED: J.I.M.L
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                                            <span className="uppercase">Origin:</span>
                                            <span className="text-white">Bali, IDN</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                                            <span className="uppercase">Unit:</span>
                                            <span className="text-cyber-green uppercase">INSTIKI</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-5">
                                    <p className="text-gray-200 font-sans text-base md:text-lg leading-relaxed">
                                        Hello! My name is <span className="text-white font-bold">Jonathan Immanuel Mazar Langelo</span>, widely known in the digital realm as <span className="text-cyber-blue font-mono font-bold italic">SubzXD</span>.
                                    </p>
                                    <p className="text-gray-300 font-sans text-base leading-relaxed">
                                        I am a cybersecurity enthusiast currently pursuing my degree in <span className="text-cyber-pink font-semibold">Computer Systems Engineering</span> at <span className="text-foreground font-bold underline decoration-cyber-green decoration-2 underline-offset-4">INSTIKI</span>.
                                    </p>
                                    <p className="text-gray-300 font-sans text-base leading-relaxed">
                                        My journey is fueled by a profound fascination with system architectures, identifying vulnerabilities, and the art of exploitation.
                                        I spend my time dissecting complex systems, solving missions on <span className="text-cyber-blue font-bold">HackTheBox</span> & <span className="text-cyber-green font-bold">TryHackMe</span>,
                                        and contributing to the security community through documented writeups and PoC development.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* TOP RIGHT: LEARNING JOURNEY TIMELINE (COL SPAN 5) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-5 bg-cyber-black border border-cyber-gray p-6 relative group overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(57,255,20,0.1)] transition-all duration-300 h-full hover:border-cyber-green/50"
                        >
                            <div className="absolute top-0 right-0 w-32 h-1 bg-cyber-green/50 group-hover:w-full transition-all duration-500"></div>

                            <h2 className="text-cyber-green font-bold text-xl mb-8 flex items-center uppercase tracking-widest">
                                <Zap className="w-5 h-5 mr-3" />
                                PROGRESS_STREAM
                            </h2>

                            <CompactTimeline />

                            <div className="mt-6 pt-4 border-t border-cyber-gray/50 flex items-center justify-between">
                                <span className="text-[10px] text-gray-600 font-mono uppercase">Update_Frequency: WEEKLY</span>
                                <div className="flex space-x-1">
                                    <div className="w-1 h-1 bg-cyber-green rounded-full animate-pulse"></div>
                                    <div className="w-1 h-1 bg-cyber-green/60 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                    <div className="w-1 h-1 bg-cyber-green/30 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        </motion.div>

                        {/* MIDDLE LEFT: FOCUS AREAS (COL SPAN 6) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-6 bg-cyber-black border border-cyber-gray p-6 relative group overflow-hidden hover:shadow-[0_0_25px_rgba(255,0,255,0.1)] transition-all duration-300 hover:border-cyber-pink/50"
                        >
                            <div className="absolute top-0 left-0 w-32 h-1 bg-cyber-pink/50 group-hover:w-full transition-all duration-500"></div>

                            <h2 className="text-cyber-pink font-bold text-xl mb-8 flex items-center uppercase tracking-widest">
                                <Target className="w-5 h-5 mr-3" />
                                PRIMARY_DIRECTIVES
                            </h2>

                            <div className="flex flex-wrap gap-3">
                                {[
                                    { name: "Web Exploitation", level: "Beginner", color: "border-cyber-blue shadow-[0_0_5px_rgba(0,243,255,0.2)]" },
                                    { name: "Privilege Escalation", level: "Beginner", color: "border-cyber-green shadow-[0_0_5px_rgba(57,255,20,0.2)]" },
                                    { name: "Red Team Learning", level: "In_Progress", color: "border-cyber-pink shadow-[0_0_5px_rgba(255,0,255,0.2)]" },
                                    { name: "Blue Team Fundamentals", level: "Fundamentals", color: "border-cyber-blue" },
                                    { name: "CTF Challenges", level: "Active", color: "border-cyber-green" },
                                    { name: "System Exploration", level: "Core", color: "border-cyber-pink" }
                                ].map((area) => (
                                    <div key={area.name} className={`px-4 py-2 border border-cyber-gray bg-cyber-black/50 hover:${area.color} transition-all duration-300 group/tag`}>
                                        <div className="text-white text-xs font-bold uppercase mb-1">{area.name}</div>
                                        <div className="text-[9px] text-gray-500 font-mono group-hover/tag:text-gray-300 transition-colors uppercase flex items-center">
                                            <div className="w-1.5 h-1.5 bg-gray-800 group-hover/tag:bg-white mr-1.5 rounded-full transition-colors"></div>
                                            {area.level}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* MIDDLE RIGHT: TOOLS & STACK (COL SPAN 6) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-6 bg-cyber-black border border-cyber-gray p-6 relative group overflow-hidden hover:shadow-[0_0_25px_rgba(0,243,255,0.1)] transition-all duration-300 hover:border-cyber-blue/50"
                        >
                            <div className="absolute top-0 right-0 w-32 h-1 bg-cyber-blue/50 group-hover:w-full transition-all duration-500"></div>

                            <h2 className="text-cyber-blue font-bold text-xl mb-8 flex items-center uppercase tracking-widest">
                                <Hammer className="w-5 h-5 mr-3" />
                                TOOLSET_SPEC
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    { name: "Python", icon: Terminal },
                                    { name: "Nmap", icon: Shield },
                                    { name: "Burp Suite", icon: Cpu },
                                    { name: "Hashcat", icon: Terminal },
                                    { name: "John the Ripper", icon: Hammer },
                                    { name: "Metasploit", icon: Zap },
                                    { name: "Docker", icon: Layers },
                                    { name: "Linux", icon: Terminal },
                                    { name: "Wireshark", icon: Shield }
                                ].map((tool) => (
                                    <div key={tool.name} className="flex items-center space-x-3 p-3 border border-cyber-gray bg-cyber-gray/10 hover:border-cyber-blue/30 transition-all group/tool">
                                        <tool.icon className="w-4 h-4 text-cyber-blue group-hover/tool:animate-pulse" />
                                        <span className="text-[11px] text-gray-400 group-hover/tool:text-white transition-colors uppercase tracking-widest">
                                            {tool.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* BOTTOM: CERTIFICATIONS (COL SPAN 12 - FULL WIDTH) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-12"
                        >
                            <div className="bg-cyber-black border border-cyber-gray p-8 relative overflow-hidden h-full shadow-[0_0_25px_rgba(0,0,0,0.6)]">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-blue via-cyber-pink to-cyber-green"></div>
                                <h2 className="text-white font-bold text-xl mb-8 flex items-center uppercase tracking-widest border-b border-cyber-gray pb-4">
                                    <Zap className="w-5 h-5 mr-3 text-cyber-blue" />
                                    LEARNING_ACHIEVEMENTS
                                </h2>
                                <CertificationsSection />
                            </div>
                        </motion.div>

                        {/* MANIFESTO (COL SPAN 12) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-12 p-8 border border-cyber-gray bg-cyber-black/20"
                        >
                            <h2 className="font-mono text-xl font-bold text-white mb-10 border-b border-cyber-gray pb-6 flex items-center uppercase tracking-widest">
                                <Shield className="mr-4 text-cyber-pink w-6 h-6" /> {">"} MANIFESTO_PROTOCOL
                            </h2>
                            <p className="font-mono text-base md:text-lg text-gray-300 italic leading-relaxed text-center max-w-5xl mx-auto px-4">
                                "I am currently learning and exploring cybersecurity through hands-on practice. I focus on understanding how systems work, how vulnerabilities arise, and how they can be identified. My goal is to continuously improve my skills through CTF challenges, lab environments, and real-world simulations."
                            </p>
                            <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-8 md:gap-20">
                                <div className="text-[10px] font-mono text-gray-500 uppercase flex items-center">
                                    <LayoutGrid className="w-3 h-3 mr-2" />
                                    OPERATIONAL_STATUS: <span className="text-cyber-green ml-2">ACTIVE // LEARNING</span>
                                </div>
                                <div className="text-[10px] font-mono text-gray-500 uppercase flex items-center">
                                    <Target className="w-3 h-3 mr-2" />
                                    COORD: <span className="text-cyber-blue ml-2">8.6500° S, 115.2167° E [BALI]</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
