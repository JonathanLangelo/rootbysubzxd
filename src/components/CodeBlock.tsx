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
        <div className="my-10 relative group border border-cyber-gray/50 bg-[#0a0a0c]/80 rounded-lg overflow-hidden font-mono shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-sm">
            {/* ── Terminal Header ── */}
            <div className="px-4 py-2 bg-cyber-gray/10 border-b border-cyber-gray/30 flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 h-full items-center mr-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-900/50 border border-red-500/30"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-900/50 border border-yellow-500/30"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-900/50 border border-green-500/30"></div>
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        {lang || "TERMINAL"} // SESSION_LOG
                    </span>
                </div>
                
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 hover:text-cyber-blue transition-colors uppercase tracking-tight"
                >
                    {copied ? (
                        <>
                            <Check className="w-3 h-3 text-cyber-green" />
                            <span className="text-cyber-green">COPIED</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3" />
                            <span>CLIPBOARD_COPY</span>
                        </>
                    )}
                </button>
            </div>

            {/* ── Scanline/Grid Overlay (Subtle) ── */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

            {/* ── Code Content ── */}
            <div
                className="p-6 overflow-x-auto text-sm md:text-base leading-relaxed selection:bg-cyber-blue/30 scrollbar-thin scrollbar-thumb-cyber-gray [&>pre]:!bg-transparent [&>pre]:!p-0"
                dangerouslySetInnerHTML={{ __html: html }}
            />
            
            {/* ── Status Footer (Subtle) ── */}
            <div className="px-4 py-1.5 border-t border-cyber-gray/10 flex justify-end">
                <span className="text-[9px] text-gray-700 uppercase italic">
                    {"// READ_ONLY_BUFFER //"}
                </span>
            </div>
        </div>
    );
}
