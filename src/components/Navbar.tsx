"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/writeups" },
    { name: "Tools", href: "/tools" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 w-full z-50 bg-cyber-black/80 backdrop-blur-md border-b border-cyber-green/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3 group relative">
                            <Terminal className="w-8 h-8 text-cyber-green group-hover:drop-shadow-[0_0_8px_rgba(57,255,20,0.8)] transition-all" />
                            <span className="font-mono text-2xl font-bold tracking-tighter text-white group-hover:text-cyber-green transition-colors">
                                SubzXD<span className="text-cyber-green animate-[blink_1s_infinite]">_</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-12">
                        <div className="flex items-center space-x-8">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`relative px-2 py-1 font-mono text-base uppercase tracking-widest transition-all duration-300 group ${isActive
                                            ? "text-cyber-green"
                                            : "text-gray-400 hover:text-white"
                                            }`}
                                    >
                                        <motion.span
                                            whileHover={{ scale: 1.05 }}
                                            className="relative z-10"
                                        >
                                            {link.name}
                                        </motion.span>

                                        {isActive && (
                                            <motion.div
                                                layoutId="activeNav"
                                                className="absolute -bottom-2 left-0 w-full h-0.5 bg-cyber-green shadow-[0_0_10px_rgba(57,255,20,0.8)] px-2"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}

                                        <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-cyber-blue opacity-0 group-hover:w-full group-hover:opacity-50 transition-all duration-300"></span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Status Indicator */}
                        <div className="hidden lg:flex items-center space-x-4 border-l border-cyber-gray pl-12 h-8">
                            <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.2em]">
                                <span className="w-2 h-2 bg-cyber-green rounded-full animate-pulse shadow-[0_0_8px_rgba(57,255,20,0.8)]"></span>
                                <span className="text-gray-500">SYSTEM_STATUS:</span>
                                <span className="text-cyber-green font-bold">ACTIVE</span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-cyber-green p-2 border border-cyber-green/20 hover:bg-cyber-green/10 transition-all"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-cyber-black border-b border-cyber-green/20"
                    >
                        <div className="px-4 pt-4 pb-8 space-y-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-4 py-3 font-mono text-lg uppercase tracking-widest border-l-2 transition-all ${isActive
                                            ? "text-cyber-green border-cyber-green bg-cyber-green/5"
                                            : "text-gray-400 border-transparent hover:text-white hover:border-cyber-blue hover:bg-cyber-blue/5"
                                            }`}
                                    >
                                        <span className="mr-3 opacity-50">{isActive ? ">" : "#"}</span>
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
