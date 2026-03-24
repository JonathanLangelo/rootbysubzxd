"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Code2,
    Link as LinkIcon,
    Check,
    Copy,
    ShieldAlert,
    ArrowRightLeft,
    RotateCcw
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Base64Page() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleEncode = () => {
        try {
            setError(null);
            const encoded = btoa(input);
            setOutput(encoded);
        } catch (e: any) {
            setError("Invalid input for Base64 encoding. Ensure input is standard string.");
        }
    };

    const handleDecode = () => {
        try {
            setError(null);
            const decoded = atob(input.trim());
            setOutput(decoded);
        } catch (e: any) {
            setError("INVALID_BASE64_SOURCE: Decoding failed. Check input padding and characters.");
        }
    };

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setInput("");
        setOutput("");
        setError(null);
    };

    return (
        <main className="min-h-screen bg-cyber-black flex flex-col font-mono selection:bg-cyber-blue selection:text-black">
            <Navbar />

            <div className="flex-grow pt-32 pb-20 container mx-auto px-4">
                {/* Header */}
                <div className="mb-10 border-l-4 border-cyber-blue pl-6">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tighter"
                    >
                        {">"} BASE64_PROCESSOR
                    </motion.h1>
                    <p className="text-gray-400 text-sm md:text-base mt-2 uppercase tracking-widest flex items-center">
                        <Code2 className="w-5 h-5 mr-3 text-cyber-blue" />
                        Standard binary-to-text encoding conversion module
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                    {/* Input Field */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-cyber-black border border-cyber-gray p-6 relative group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-1 bg-cyber-blue/30 group-hover:bg-cyber-blue/60 transition-all duration-500"></div>

                        <h2 className="text-cyber-blue font-bold text-lg mb-4 flex items-center uppercase tracking-widest">
                            <ArrowRightLeft className="w-5 h-5 mr-3" />
                            INPUT_STREAM
                        </h2>

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter plaintext or Base64 data here..."
                            className="w-full h-64 bg-black border border-cyber-gray text-cyber-green p-5 focus:border-cyber-blue outline-none transition-colors scrollbar-hide font-mono text-base leading-relaxed resize-none"
                        />

                        <div className="mt-6 flex flex-wrap gap-4">
                            <button
                                onClick={handleEncode}
                                className="px-6 py-2 bg-cyber-blue/10 border border-cyber-blue text-cyber-blue hover:bg-cyber-blue hover:text-black transition-all font-bold uppercase tracking-widest text-xs"
                            >
                                ENCODE
                            </button>
                            <button
                                onClick={handleDecode}
                                className="px-6 py-2 bg-cyber-pink/10 border border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black transition-all font-bold uppercase tracking-widest text-xs"
                            >
                                DECODE
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 border border-cyber-gray text-gray-500 hover:text-white hover:border-white transition-all font-bold uppercase tracking-widest text-xs ml-auto flex items-center"
                            >
                                <RotateCcw className="w-3 h-3 mr-2" /> RESET
                            </button>
                        </div>
                    </motion.div>

                    {/* Output Field */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-cyber-black border border-cyber-gray p-6 relative group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-1 bg-cyber-pink/30 group-hover:bg-cyber-pink/60 transition-all duration-500"></div>

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-cyber-pink font-bold text-lg flex items-center uppercase tracking-widest">
                                <LinkIcon className="w-5 h-5 mr-3" />
                                PROCESSED_RESULT
                            </h2>
                            {output && (
                                <button
                                    onClick={handleCopy}
                                    className="p-2 border border-cyber-gray hover:border-cyber-blue hover:text-cyber-blue transition-all"
                                    title="Copy Result"
                                >
                                    {copied ? <Check className="w-4 h-4 text-cyber-green" /> : <Copy className="w-4 h-4" />}
                                </button>
                            )}
                        </div>

                        <div className={`w-full h-64 bg-black border border-cyber-gray p-5 font-mono text-base leading-relaxed overflow-auto scrollbar-hide break-all relative ${error ? 'border-red-500/50 bg-red-500/5' : ''}`}>
                            {error ? (
                                <div className="text-red-400 flex items-start space-x-2">
                                    <ShieldAlert className="w-5 h-5 mt-1 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            ) : output ? (
                                <span className="text-gray-100">{output}</span>
                            ) : (
                                <span className="text-gray-700 italic uppercase tracking-tighter opacity-30">RESULT_PENDING...</span>
                            )}
                        </div>

                        <div className="mt-6 flex flex-col space-y-4">
                            <div className="flex items-center text-[10px] text-gray-500 font-mono uppercase tracking-widest bg-cyber-gray/10 p-2 border border-cyber-gray/30">
                                <div className="w-1.5 h-1.5 bg-cyber-pink mr-2 animate-pulse"></div>
                                SECURE_CLIENT_SIDE_ONLY // NO_DATA_TRANSMITTED
                            </div>
                            <p className="text-[10px] text-gray-500 font-sans italic opacity-60">
                                For educational and CTF use only. Base64 is not encryption, it is a transformation protocol.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
