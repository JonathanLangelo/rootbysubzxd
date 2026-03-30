"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
    html: string;
    code: string;
    lang?: string;
}

export default function CodeBlock({ html, code, lang }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-12 relative group bg-[#08080a] border border-white/5 rounded-md overflow-hidden font-mono shadow-2xl transition-all hover:border-cyber-blue/30">
            {/* ── Minimal Terminal Header ── */}
            <div className="px-5 py-2.5 bg-white/[0.03] border-b border-white/5 flex items-center justify-between select-none">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5 items-center">
                        <div className="w-2 h-2 rounded-full bg-cyber-blue opacity-40"></div>
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium">
                        {lang || "SYSTEM_LOG"} <span className="opacity-30 mx-2">//</span> <span className="opacity-50">PROT_V.2</span>
                    </span>
                </div>
                
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 group/btn"
                >
                    <span className="text-[9px] font-bold text-gray-500 group-hover/btn:text-cyber-blue transition-colors uppercase tracking-widest">
                        {copied ? "COPIED_TO_CLIPBOARD" : "COPY_CONTENT"}
                    </span>
                    {copied ? (
                        <Check className="w-3 h-3 text-cyber-green" />
                    ) : (
                        <Copy className="w-3 h-3 text-gray-600 group-hover/btn:text-cyber-blue transition-all" />
                    )}
                </button>
            </div>

            {/* ── Subtler CRT Effect ── */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%]"></div>

            {/* ── Code Content ── */}
            <div
                className="p-6 md:p-8 overflow-x-auto text-[13px] md:text-[15px] leading-[1.7] selection:bg-cyber-blue/20 scrollbar-thin scrollbar-thumb-white/10 [&>pre]:!bg-transparent [&>pre]:!p-0 font-mono"
                dangerouslySetInnerHTML={{ __html: html }}
            />
            
            {/* ── Subtle Tag ── */}
            <div className="absolute bottom-2 right-4 pointer-events-none">
                <span className="text-[8px] text-white/5 uppercase tracking-[0.3em] font-bold">NODE_0x241_STABLE</span>
            </div>
        </div>
    );
}
