"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Calculator,
    Copy,
    Check,
    Zap,
    ShieldAlert,
    Terminal,
    RefreshCcw
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Standalone MD5 implementation (compact version for browser)
function md5(string: string) {
    function md5cycle(x: any, k: any) {
        let a = x[0], b = x[1], c = x[2], d = x[3];

        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);

        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);

        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);

        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -112021037);
        c = ii(c, d, a, b, k[2], 15, 718787281);
        b = ii(b, c, d, a, k[9], 21, -343485551);

        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3]);
    }

    function add32(a: any, b: any) {
        return (a + b) & 0xFFFFFFFF;
    }

    function ff(a: any, b: any, c: any, d: any, x: any, s: any, t: any) {
        return add32(rotateLeft(add32(a, add32(add32(f(b, c, d), x), t)), s), b);
    }
    function gg(a: any, b: any, c: any, d: any, x: any, s: any, t: any) {
        return add32(rotateLeft(add32(a, add32(add32(g(b, c, d), x), t)), s), b);
    }
    function hh(a: any, b: any, c: any, d: any, x: any, s: any, t: any) {
        return add32(rotateLeft(add32(a, add32(add32(h(b, c, d), x), t)), s), b);
    }
    function ii(a: any, b: any, c: any, d: any, x: any, s: any, t: any) {
        return add32(rotateLeft(add32(a, add32(add32(i(b, c, d), x), t)), s), b);
    }

    function f(x: any, y: any, z: any) {
        return (x & y) | (~x & z);
    }
    function g(x: any, y: any, z: any) {
        return (x & z) | (y & ~z);
    }
    function h(x: any, y: any, z: any) {
        return x ^ y ^ z;
    }
    function i(x: any, y: any, z: any) {
        return y ^ (x | ~z);
    }

    function rotateLeft(x: any, n: any) {
        return (x << n) | (x >>> (32 - n));
    }

    function md51(s: any) {
        let n = s.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i;
        for (i = 64; i <= s.length; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        let tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < s.length; i++)
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i++) tail[i] = 0;
        }
        tail[14] = n * 8;
        md5cycle(state, tail);
        return state;
    }

    function md5blk(s: any) {
        let md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i) +
                (s.charCodeAt(i + 1) << 8) +
                (s.charCodeAt(i + 2) << 16) +
                (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    }

    let hex_chr = "0123456789abcdef".split("");

    function rhex(n: any) {
        let s = "", j;
        for (j = 0; j < 4; j++)
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] +
                hex_chr[(n >> (j * 8)) & 0x0F];
        return s;
    }

    function hex(x: any) {
        for (let i = 0; i < x.length; i++)
            x[i] = rhex(x[i]);
        return x.join("");
    }

    return hex(md51(string));
}

export default function HashPage() {
    const [input, setInput] = useState("");
    const [hashes, setHashes] = useState({
        md5: "",
        sha1: "",
        sha256: ""
    });
    const [copied, setCopied] = useState<string | null>(null);

    const calculateHashes = async (text: string) => {
        if (!text) {
            setHashes({ md5: "", sha1: "", sha256: "" });
            return;
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(text);

        // Crypto Subtle for SHA
        const generateHash = async (algo: string) => {
            const hashBuffer = await crypto.subtle.digest(algo, data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        };

        try {
            const [s1, s256] = await Promise.all([
                generateHash("SHA-1"),
                generateHash("SHA-256")
            ]);

            setHashes({
                md5: md5(text),
                sha1: s1,
                sha256: s256
            });
        } catch (e) {
            console.error("Hash calculation failed", e);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            calculateHashes(input);
        }, 100);
        return () => clearTimeout(timer);
    }, [input]);

    const handleCopy = (hash: string, type: string) => {
        if (!hash) return;
        navigator.clipboard.writeText(hash);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <main className="min-h-screen bg-cyber-black flex flex-col font-mono selection:bg-cyber-blue selection:text-black">
            <Navbar />

            <div className="flex-grow pt-32 pb-20 container mx-auto px-4">
                {/* Header */}
                <div className="mb-10 border-l-4 border-cyber-green pl-6">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tighter"
                    >
                        {">"} HASH_CALCULATOR
                    </motion.h1>
                    <p className="text-gray-400 text-sm md:text-base mt-2 uppercase tracking-widest flex items-center">
                        <Terminal className="w-5 h-5 mr-3 text-cyber-green" />
                        Data integrity and identifier generation module
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Input Field (Col Span 5) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-5 bg-cyber-black border border-cyber-gray p-6 relative group"
                    >
                        <div className="absolute top-0 left-0 w-32 h-1 bg-cyber-green/50 group-hover:w-full transition-all duration-500"></div>

                        <h2 className="text-cyber-green font-bold text-lg mb-6 flex items-center uppercase tracking-widest">
                            <Zap className="w-5 h-5 mr-3" />
                            INPUT_BUFFER
                        </h2>

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter plaintext to hash..."
                            className="w-full h-48 bg-black border border-cyber-gray text-white p-5 focus:border-cyber-green outline-none transition-colors scrollbar-hide font-mono text-base leading-relaxed resize-none"
                        />

                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-[10px] text-gray-700 uppercase font-mono tracking-tighter">Status: ANALYZING_STREAM</span>
                            <div className="flex space-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyber-green/50 animate-pulse"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-cyber-green/30 animate-pulse [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-cyber-green/10 animate-pulse [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Results (Col Span 7) */}
                    <div className="lg:col-span-7 space-y-4">
                        {[
                            { label: "MD5", value: hashes.md5, id: "md5", description: "128-bit hash value. Legally compromised for collision resistance, used for diagnostics." },
                            { label: "SHA-1", value: hashes.sha1, id: "sha1", description: "160-bit hash. Historically significant, now considered vulnerable to collision attacks." },
                            { label: "SHA-256", value: hashes.sha256, id: "sha256", description: "256-bit secure hash. Standard for modern data integrity and cryptographic verification." }
                        ].map((hash) => (
                            <motion.div
                                key={hash.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-cyber-black border border-cyber-gray/40 p-4 hover:border-cyber-green/30 transition-all group relative"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center">
                                        <span className="text-xs font-bold text-cyber-green uppercase tracking-widest mr-4">{hash.label}</span>
                                        <span className="text-[10px] text-gray-400 font-sans italic opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                                            {hash.description}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(hash.value, hash.id)}
                                        className="text-gray-600 hover:text-cyber-green transition-colors"
                                    >
                                        {copied === hash.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                                <div className="bg-black/50 p-3 font-mono text-sm md:text-base break-all border border-cyber-gray/20 min-h-[44px] flex items-center">
                                    {hash.value ? (
                                        <span className="text-gray-100">{hash.value}</span>
                                    ) : (
                                        <span className="text-gray-700 text-xs uppercase tracking-widest">Waiting for input...</span>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        <div className="p-4 bg-cyber-gray/5 border border-cyber-gray italic">
                            <div className="flex items-start">
                                <ShieldAlert className="w-4 h-4 text-cyber-green mr-3 mt-1 flex-shrink-0" />
                                <div className="text-[10px] text-gray-500 font-sans leading-relaxed">
                                    <span className="text-cyber-green font-bold uppercase block mb-1">Security Notice</span>
                                    All hash calculations are performed locally using the browser's Native Crypto API.
                                    For educational and CTF use only. Do not use for production password storage without salting/stretching.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
