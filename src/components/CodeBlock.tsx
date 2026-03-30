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
        <div className="my-8 relative group bg-[#000000] border border-white/5 rounded-lg overflow-hidden font-mono shadow-xl transition-all hover:border-cyber-green/30">
            {/* ── Copy Button ── */}
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={copyToClipboard}
                    className="p-2 bg-cyber-black/80 border border-white/10 rounded-md text-gray-500 hover:text-cyber-green hover:border-cyber-green/50 transition-all backdrop-blur-sm"
                    title="Copy to clipboard"
                >
                    {copied ? <Check className="w-4 h-4 text-cyber-green" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>

            {/* ── HTB Style Content ── */}
            <div
                className="p-6 md:p-8 overflow-x-auto text-[14px] md:text-[16px] leading-[1.6] selection:bg-cyber-green/20 scrollbar-thin scrollbar-thumb-white/5 [&>pre]:!bg-transparent [&>pre]:!p-0 font-mono text-gray-100"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}
