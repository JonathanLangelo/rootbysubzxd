"use client";

import { Box, Code2, Calculator, Shield, Hammer, AlertTriangle, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const tools = [
    {
        name: "Base64 Encoder/Decoder",
        description: "Standard data encoding for binary-to-text conversion. Essential for payload obfuscation.",
        icon: Code2,
        status: "ONLINE",
        color: "text-cyber-blue",
        href: "/tools/base64",
    },
    {
        name: "Hash Calculator",
        description: "MD5, SHA1, SHA256 integrity verification and password identifier tool.",
        icon: Calculator,
        status: "ONLINE",
        color: "text-cyber-green",
        href: "/tools/hash",
    },
    {
        name: "IP / Port Scanner",
        description: "Simple web-based connectivity check for common security ports.",
        icon: Zap,
        status: "COMING_SOON",
        color: "text-cyber-pink",
        href: "/tools/scanner",
    },
    {
        name: "RevShell Reference",
        description: "Educational reference for understanding shell redirection, network sockets, and CTF concepts.",
        icon: Shield,
        status: "ONLINE",
        color: "text-cyber-blue",
        href: "/tools/revshell",
    },
    {
        name: "JWT Debugger",
        description: "Decode and inspect JSON Web Tokens for identity and access management testing.",
        icon: Box,
        status: "ONLINE",
        color: "text-cyber-green",
        href: "/tools/jwt",
    },
];

export default function ToolsClient() {
    return (
        <div className="flex-grow pt-32 pb-20 container mx-auto px-4">
            <div className="mb-12">
                <h1 className="font-mono text-2xl md:text-3xl font-bold text-white mb-4 uppercase tracking-tighter">
                    CYBER_TOOLKIT<span className="text-cyber-pink">: </span>STATION
                </h1>
                <p className="text-gray-400 font-mono text-sm md:text-base uppercase tracking-widest flex items-center">
                    <Zap className="w-5 h-5 mr-3 text-cyber-green animate-pulse" />
                    [!] SYSTEM_ONLINE: CORE_UTILITIES_ESTABLISHED
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool, i) => (
                    <Link
                        key={tool.name}
                        href={tool.status === "ONLINE" ? tool.href : "#"}
                        className={tool.status === "COMING_SOON" ? "cursor-default" : "cursor-pointer"}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`h-full p-6 border border-cyber-gray bg-cyber-black/40 relative group overflow-hidden transition-all duration-300 ${tool.status === "ONLINE" ? "hover:border-cyber-blue/50 hover:bg-cyber-blue/5" : ""
                                }`}
                        >
                            <div className={`p-3 bg-cyber-gray/20 rounded-lg w-fit mb-4 ${tool.color}`}>
                                <tool.icon className="w-6 h-6" />
                            </div>

                            <h3 className={`font-mono text-lg font-bold text-white mb-3 uppercase transition-colors ${tool.status === "ONLINE" ? "group-hover:text-cyber-blue" : ""
                                }`}>
                                {tool.name}
                            </h3>

                            <p className="text-gray-400 text-sm md:text-base font-sans leading-relaxed mb-8 flex-grow">
                                {tool.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className={`text-xs font-mono font-bold uppercase tracking-widest px-2 py-0.5 border ${tool.status === "ONLINE"
                                    ? "text-cyber-blue border-cyber-blue/50 bg-cyber-blue/10"
                                    : "text-gray-700 border-gray-900"
                                    }`}>
                                    {tool.status}
                                </span>
                                <div className={`h-0.5 w-12 hidden sm:block ${tool.status === "ONLINE" ? "bg-cyber-blue" : "bg-cyber-gray/50"}`}></div>
                            </div>

                            {/* Decoration */}
                            <div className={`absolute top-0 right-0 w-8 h-8 border-t border-r border-cyber-gray opacity-20 transition-opacity ${tool.status === "ONLINE" ? "group-hover:opacity-100 group-hover:border-cyber-blue" : ""
                                }`}></div>
                        </motion.div>
                    </Link>
                ))}

                {/* Main coming soon card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="p-6 border-2 border-dashed border-cyber-gray flex flex-center items-center justify-center text-center opacity-40 hover:opacity-100 transition-all cursor-pointer"
                >
                    <div>
                        <Hammer className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="font-mono text-xs uppercase tracking-widest text-gray-600">
                            REQUEST_NEW_UTILITY // PROTOCOL_V1.2
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
