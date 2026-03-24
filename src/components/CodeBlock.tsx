"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
    html: string;
    code: string;
}

export default function CodeBlock({ html, code }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-6 relative group border border-cyber-gray bg-cyber-black/50 rounded-xl overflow-hidden font-mono text-sm md:text-base">
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={copyToClipboard}
                    className="p-1.5 bg-cyber-black border border-cyber-gray text-gray-500 hover:text-cyber-blue hover:border-cyber-blue transition-all"
                    title="Copy to clipboard"
                >
                    {copied ? <Check className="w-4 h-4 text-cyber-green" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
            <div
                className="p-4 overflow-x-auto [&>pre]:!bg-transparent [&>pre]:!p-0"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}
