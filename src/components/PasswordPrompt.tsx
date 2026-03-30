"use client";

import { useState } from "react";
import { Lock, ShieldAlert, Terminal } from "lucide-react";

interface PasswordPromptProps {
    onSuccess: (password: string) => void;
    error?: string;
}

export default function PasswordPrompt({ onSuccess, error }: PasswordPromptProps) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSuccess(password.trim());
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md p-8 border border-red-900/50 bg-cyber-black relative overflow-hidden">
                {/* Warning pattern */}
                <div className="absolute top-0 left-0 w-full h-1 bg-repeating-linear-gradient-red-yellow"></div>
                <style jsx>{`
            .bg-repeating-linear-gradient-red-yellow {
                background: repeating-linear-gradient(45deg, #7f1d1d, #7f1d1d 10px, #450a0a 10px, #450a0a 20px);
            }
        `}</style>

                <div className="flex flex-col items-center text-center">
                    <ShieldAlert className="w-16 h-16 text-red-600 mb-6 animate-pulse" />
                    <h2 className="font-mono text-2xl font-bold text-white mb-2 tracking-tighter">
                        ACCESS_DENIED: ENCRYPTED_CONTENT
                    </h2>
                    <p className="text-gray-500 font-mono text-xs mb-8 uppercase">
                        This writeup is for an active machine. Unauthorized viewing is prohibited.
                    </p>

                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="relative mb-6">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-red-900" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="ENTER_AUTHENTICATION_KEY..."
                                className="block w-full pl-10 pr-10 py-3 border border-red-900/50 bg-black text-red-500 font-mono text-sm placeholder-red-900 focus:outline-none focus:border-red-600 focus:glow-red transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-red-900 hover:text-red-500 transition-colors"
                            >
                                <Lock className={`h-4 w-4 ${showPassword ? "opacity-30" : "opacity-100"}`} />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-6 text-red-600 font-mono text-[10px] animate-bounce uppercase">
                                {"> ERROR: "} {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 bg-red-900/20 border border-red-600 text-red-500 font-mono font-bold hover:bg-red-600 hover:text-white transition-all duration-300"
                        >
                            [ DECRYPT_PAYLOAD ]
                        </button>
                    </form>

                    <div className="mt-8 flex items-center space-x-2 text-[10px] text-gray-700 font-mono">
                        <Terminal className="w-3 h-3" />
                        <span>SYSTEM_AUTH: ENCRYPTED_CHANNEL</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
