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
                        <h1 className="font-mono text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tighter uppercase leading-[1.1] sm:leading-[0.9] flex flex-col">
                            <span>Jonathan Immanuel</span>
                            <span className="text-cyber-green glow-green">Mazar Langelo</span>
                        </h1>

                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-8">
                            <span className="px-3 py-1 bg-cyber-blue/10 border border-cyber-blue text-cyber-blue font-mono text-xs uppercase tracking-widest whitespace-nowrap w-full sm:w-auto text-center">
                                [ ALIAS: SubzXD ]
                            </span>
                            <div className="h-px w-12 bg-cyber-gray hidden sm:block"></div>
                            <p className="text-gray-400 font-sans text-sm sm:text-lg md:text-xl leading-relaxed text-center sm:text-left selection:bg-cyber-blue/30 selection:text-white">
                                Cybersecurity Enthusiast | Exploring Systems & Exploits
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8 sm:mt-12 py-6 border-t border-cyber-gray/20">
                            <div className="col-span-2 md:col-span-2 lg:col-span-4 mb-2 text-center md:text-left">
                                <span className="font-mono text-xs text-cyber-green uppercase tracking-[0.2em]">
                                    {">"} TERMINAL_ACCESS // PROFILES:
                                </span>
                            </div>
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
                                    className="group flex flex-col items-center justify-center font-mono text-sm md:text-base text-gray-400 hover:text-white transition-all duration-200 p-4 md:p-5 border border-cyber-gray/20 hover:border-green-500 hover:bg-cyber-green/5 rounded-xl w-full h-full text-center"
                                >
                                    <profile.icon className={`w-6 h-6 md:w-8 md:h-8 mb-3 ${profile.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                                    <span className="whitespace-nowrap font-bold">{profile.name}</span>
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
