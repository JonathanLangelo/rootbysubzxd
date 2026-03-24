"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Box,
    Copy,
    Check,
    Zap,
    ShieldAlert,
    Terminal,
    AlertTriangle,
    Eye,
    EyeOff
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Utility for safe base64url decoding
function base64UrlDecode(str: string) {
    try {
        // Replace base64url characters with base64 standard characters
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding if needed
        while (str.length % 4) {
            str += '=';
        }
        return decodeURIComponent(
            atob(str)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
    } catch (e) {
        throw new Error("Decoding failed");
    }
}

export default function JwtDebuggerPage() {
    const [token, setToken] = useState("");
    const [header, setHeader] = useState("");
    const [payload, setPayload] = useState("");
    const [signature, setSignature] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const decodeJwt = (jwt: string) => {
        if (!jwt.trim()) {
            setHeader("");
            setPayload("");
            setSignature("");
            setError(null);
            return;
        }

        const parts = jwt.split('.');
        if (parts.length !== 3) {
            setError("INVALID_JWT_FORMAT: A valid JWT must have 3 segments separated by dots.");
            setHeader("");
            setPayload("");
            setSignature("");
            return;
        }

        try {
            setError(null);
            const decodedHeader = JSON.parse(base64UrlDecode(parts[0]));
            const decodedPayload = JSON.parse(base64UrlDecode(parts[1]));

            setHeader(JSON.stringify(decodedHeader, null, 2));
            setPayload(JSON.stringify(decodedPayload, null, 2));
            setSignature(parts[2] || "UNSET");
        } catch (e) {
            setError("JWT_DECODE_ERROR: Failed to parse header or payload. Ensure the token is a valid Base64Url structure.");
            setHeader("");
            setPayload("");
            setSignature("");
        }
    };

    useEffect(() => {
        decodeJwt(token);
    }, [token]);

    const handleCopy = (text: string, type: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <main className="min-h-screen bg-cyber-black flex flex-col font-mono selection:bg-cyber-blue selection:text-black">
            <Navbar />

            <div className="flex-grow pt-32 pb-20 container mx-auto px-4">
                {/* Header */}
                <div className="mb-10 border-l-4 border-cyber-pink pl-6">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tighter"
                    >
                        {">"} JWT_DEBUGGER
                    </motion.h1>
                    <p className="text-gray-400 text-sm md:text-base mt-2 uppercase tracking-widest flex items-center">
                        <Box className="w-5 h-5 mr-3 text-cyber-pink" />
                        JSON Web Token inspection and decoding module
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Input Field (Col Span 5) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-5 bg-cyber-black border border-cyber-gray p-6 relative group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-1 bg-cyber-pink/50 group-hover:w-full transition-all duration-500"></div>

                        <h2 className="text-cyber-pink font-bold text-lg mb-6 flex items-center uppercase tracking-widest">
                            <Terminal className="w-5 h-5 mr-3" />
                            TOKEN_STREAM
                        </h2>

                        <textarea
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Enter JWT (Header.Payload.Signature)..."
                            className="w-full h-96 bg-black border border-cyber-gray text-white p-5 focus:border-cyber-pink outline-none transition-colors scrollbar-hide font-mono text-base leading-relaxed resize-none break-all"
                        />

                        {error && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] uppercase flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {!error && token && (
                            <div className="mt-4 p-3 bg-cyber-pink/10 border border-cyber-pink/30 text-cyber-pink text-[10px] uppercase flex items-center animate-pulse">
                                <Eye className="w-4 h-4 mr-2 flex-shrink-0" />
                                TOKEN_PARSED // READY_FOR_INSPECTION
                            </div>
                        )}

                        <div className="mt-6 p-4 border border-cyber-gray/30 bg-cyber-gray/5">
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center">
                                <ShieldAlert className="w-3 h-3 mr-2" /> WARNING: SIGNATURE_NOT_VERIFIED
                            </h3>
                            <p className="text-[9px] text-gray-600 font-sans leading-relaxed italic">
                                This tool only decodes the token structure. It does not verify the signature or trust the claims.
                                NEVER trust an unverified JWT in production systems.
                            </p>
                        </div>
                    </motion.div>

                    {/* Results (Col Span 7) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Header Block */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-cyber-black border border-cyber-gray p-6 relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-16 h-1 bg-cyber-blue/50 group-hover:w-full transition-all duration-500"></div>

                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-cyber-blue font-bold text-base flex items-center uppercase tracking-widest">
                                    <Zap className="w-4 h-4 mr-2" /> HEADER<span className="text-gray-400 font-normal ml-3 italic text-xs"> // ALGO & TOKEN_TYPE</span>
                                </h2>
                                {header && (
                                    <button
                                        onClick={() => handleCopy(header, "header")}
                                        className="text-gray-600 hover:text-cyber-blue transition-colors"
                                    >
                                        {copied === "header" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                )}
                            </div>

                            <pre className="bg-black/50 p-5 font-mono text-base border border-cyber-gray/20 min-h-[120px] overflow-auto scrollbar-hide text-cyber-blue leading-relaxed">
                                {header || "// Waiting for token..."}
                            </pre>
                        </motion.div>

                        {/* Payload Block */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-cyber-black border border-cyber-gray p-6 relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-16 h-1 bg-cyber-green/50 group-hover:w-full transition-all duration-500"></div>

                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-cyber-green font-bold text-base flex items-center uppercase tracking-widest">
                                    <Zap className="w-4 h-4 mr-2" /> PAYLOAD<span className="text-gray-400 font-normal ml-3 italic text-xs"> // DATA & CLAIMS</span>
                                </h2>
                                {payload && (
                                    <button
                                        onClick={() => handleCopy(payload, "payload")}
                                        className="text-gray-600 hover:text-cyber-green transition-colors"
                                    >
                                        {copied === "payload" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                )}
                            </div>

                            <pre className="bg-black/50 p-5 font-mono text-base border border-cyber-gray/20 min-h-[180px] overflow-auto scrollbar-hide text-cyber-green leading-relaxed">
                                {payload || "// Waiting for token..."}
                            </pre>
                        </motion.div>

                        {/* Signature Block (Hidden/Obfuscated) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-cyber-black border border-cyber-gray p-6 relative group overflow-hidden opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-gray-400 font-bold text-sm flex items-center uppercase tracking-widest">
                                    <EyeOff className="w-4 h-4 mr-2" /> SIGNATURE<span className="text-gray-600 font-normal ml-2 italic"> // VERIFICATION</span>
                                </h2>
                                {signature && (
                                    <button
                                        onClick={() => handleCopy(signature, "signature")}
                                        className="text-gray-600 hover:text-white transition-colors"
                                    >
                                        {copied === "signature" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                )}
                            </div>

                            <div className="bg-black/50 p-2 font-mono text-[10px] break-all border border-cyber-gray/20 min-h-[40px] flex items-center text-gray-500 italic">
                                {signature || "// Waiting for token..."}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
