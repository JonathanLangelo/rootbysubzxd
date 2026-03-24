"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Terminal, Lock, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                router.push("/admin/dashboard");
            } else {
                setError("AUTHENTICATION_FAILED: ACCESS_DENIED");
                setLoading(false);
            }
        } catch {
            setError("NETWORK_ERROR: LINK_FAILURE");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cyber-black flex items-center justify-center p-4">
            <div className="w-full max-w-md border border-cyber-blue/50 bg-cyber-black p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 font-mono text-[10px] text-cyber-blue opacity-30">
                    NODE: ADMIN_AUTH_V4
                </div>

                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 border-2 border-cyber-blue flex items-center justify-center mb-6 group">
                        <Terminal className="w-8 h-8 text-cyber-blue group-hover:glow-blue transition-all" />
                    </div>
                    <h1 className="font-mono text-2xl font-bold text-white tracking-widest text-center">
                        {"SYSTEM_ROOT_LOGIN"}
                    </h1>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block font-mono text-xs text-cyber-blue mb-2 uppercase tracking-tighter">
                            Ident Username
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-cyber-gray/40 border-b-2 border-cyber-blue/30 px-4 py-3 text-white font-mono focus:outline-none focus:border-cyber-blue transition-colors"
                                placeholder="ADMIN_UID"
                                autoComplete="off"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-mono text-xs text-cyber-blue mb-2 uppercase tracking-tighter">
                            Root Authentication Key
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-cyber-gray/40 border-b-2 border-cyber-blue/30 px-4 py-3 text-white font-mono focus:outline-none focus:border-cyber-blue transition-colors"
                                placeholder="********"
                                autoComplete="off"
                                required
                            />
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-blue/50" />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 font-mono text-xs uppercase text-center animate-pulse tracking-widest">
                            {"> "} {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-cyber-blue/10 border border-cyber-blue text-cyber-blue font-mono font-bold hover:bg-cyber-blue hover:text-black transition-all flex items-center justify-center space-x-2"
                    >
                        <span>{loading ? "INITIALIZING_SESSION..." : "LOGIN_TO_ROOT"}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="font-mono text-[8px] text-gray-700 uppercase leading-relaxed">
                        By accessing this system, you agree to the usage of encrypted cookies.
                        <br />Unauthorized entry is punishable by local cybersec laws.
                    </p>
                </div>
            </div>
        </div>
    );
}
