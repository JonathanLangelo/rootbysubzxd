"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, ShieldCheck, Cpu, Code2, Terminal } from "lucide-react";
import TerminalHero from "./TerminalHero";

const profiles = [
    {
        name: "HackTheBox",
        href: "https://app.hackthebox.com/users/468404",
        icon: ShieldCheck,
        color: "text-cyber-green",
        borderColor: "border-cyber-green/30",
        desc: "Active machine exploitation & labs"
    },
    {
        name: "TryHackMe",
        href: "https://tryhackme.com/p/SubzXD",
        icon: Cpu,
        color: "text-cyber-blue",
        borderColor: "border-cyber-blue/30",
        desc: "Guided labs & pathway progression"
    },
    {
        name: "GitHub",
        href: "https://github.com/JonathanLangelo",
        icon: Github,
        color: "text-white",
        borderColor: "border-white/20",
        desc: "Code repositories & security tools"
    },
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/jonathan-langelo-803813310/",
        icon: Linkedin,
        color: "text-cyber-blue",
        borderColor: "border-cyber-blue/30",
        desc: "Professional outreach & networking"
    },
];

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-cyber-green/20 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyber-blue/20 blur-[120px] rounded-full"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center md:text-left">
                <div className="max-w-4xl mx-auto md:mx-0">
                    <TerminalHero />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <h1 className="font-mono text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tighter uppercase leading-[0.9] flex flex-col">
                            <span>Jonathan Immanuel</span>
                            <span className="text-cyber-green glow-green">Mazar Langelo</span>
                        </h1>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
                            <span className="px-3 py-1 bg-cyber-blue/10 border border-cyber-blue text-cyber-blue font-mono text-xs uppercase tracking-widest whitespace-nowrap">
                                [ ALIAS: SubzXD ]
                            </span>
                            <div className="h-px w-12 bg-cyber-gray hidden md:block"></div>
                            <p className="text-gray-400 font-sans text-lg md:text-xl leading-relaxed">
                                Cybersecurity Enthusiast | Exploring Systems & Exploits
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-12 py-4 border-t border-cyber-gray/20">
                            <span className="font-mono text-xs text-gray-600 uppercase tracking-[0.2em] mr-2">
                                {">"} PROFILES:
                            </span>
                            {profiles.map((profile, i) => (
                                <motion.a
                                    key={profile.name}
                                    href={profile.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`View ${profile.name} Profile`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 + (i * 0.1) }}
                                    className="group flex items-center space-x-2 font-mono text-sm text-gray-500 hover:text-white transition-colors py-1 relative"
                                >
                                    <profile.icon className={`w-3.5 h-3.5 ${profile.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                                    <span>{profile.name}</span>
                                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-cyber-blue group-hover:w-full transition-all duration-300"></span>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scanline decoration */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-green to-transparent opacity-30"></div>
        </section>
    );
}
