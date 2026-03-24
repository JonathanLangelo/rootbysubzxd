"use client";

import { Github, Linkedin, Twitter, ShieldCheck, Cpu } from "lucide-react";
import Link from "next/link";

const socialLinks = [
    { name: "GitHub", href: "https://github.com/JonathanLangelo", icon: Github, color: "hover:text-white" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/jonathan-langelo-803813310/", icon: Linkedin, color: "hover:text-cyber-blue" },
    { name: "HackTheBox", href: "https://app.hackthebox.com/users/468404", icon: ShieldCheck, color: "hover:text-cyber-green" },
    { name: "TryHackMe", href: "https://tryhackme.com/p/SubzXD", icon: Cpu, color: "hover:text-cyber-pink" },
];

export default function Footer() {
    return (
        <footer className="bg-cyber-black border-t border-cyber-gray py-8 md:py-12 px-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12 text-center md:text-left">
                    <div className="space-y-4">
                        <Link href="/" className="font-mono text-xl font-bold text-white tracking-widest uppercase">
                            SUBZXD<span className="text-cyber-green">_</span>
                        </Link>
                        <p className="text-gray-400 font-mono text-sm leading-relaxed max-w-xs">
                            {"[ OPERATIONAL_PROFILE: J.I.M.L ]"} <br />
                            Cybersecurity enthusiast, actively learning offensive and defensive security.
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <h4 className="font-mono text-xs md:text-sm font-bold text-white uppercase tracking-widest border-b-2 md:border-b-0 md:border-l-2 border-cyber-green pb-2 md:pb-0 md:pl-4">
                            Connect_Log
                        </h4>
                        <div className="flex justify-center md:justify-start space-x-4">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-2 border border-cyber-gray bg-cyber-black/50 transition-all ${link.color} hover:border-current hover:glow-current`}
                                    title={link.name}
                                >
                                    <link.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <h4 className="font-mono text-xs md:text-sm font-bold text-white uppercase tracking-widest border-b-2 md:border-b-0 md:border-l-2 border-cyber-blue pb-2 md:pb-0 md:pl-4">
                            Operational_Status
                        </h4>
                        <div className="font-mono text-xs text-gray-400 space-y-2 uppercase tracking-widest text-center md:text-left">
                            <div className="flex flex-col md:flex-row items-center md:items-start">
                                <span className="text-cyber-blue md:mr-3 mb-1 md:mb-0">{">"}</span>
                                STATUS: <span className="text-cyber-green ml-2">LEARNING / ACTIVE</span>
                            </div>
                            <div className="flex flex-col md:flex-row items-center md:items-start mt-4 md:mt-2">
                                <span className="text-cyber-blue md:mr-3 mb-1 md:mb-0 md:mt-1">{">"}</span>
                                <span>CURRENT_FOCUS: <span className="text-white ml-2">Web Exploitation & PrivEsc</span></span>
                            </div>
                            <div className="pt-4 text-gray-600 italic">
                                {">"} Learning. Practicing. Understanding.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-cyber-gray/30 gap-6 md:gap-4 text-center">
                    <div className="text-xs font-mono text-gray-700 uppercase tracking-widest">
                        © {new Date().getFullYear()} // DIGITAL_DOMAIN_OF_SUBZXD // NO_RIGHTS_RESERVED
                    </div>
                    <div className="flex space-x-6 text-xs font-mono text-gray-700 uppercase">
                        <Link href="/privacy" className="hover:text-white transition-colors underline decoration-dotted">Privacy_Protocol</Link>
                        <Link href="/terms" className="hover:text-white transition-colors underline decoration-dotted">TOS_Handshake</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
