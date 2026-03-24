"use client";

import { Search, Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks";

export default function BlogFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get("q") || "");
    const debouncedQuery = useDebounce(query, 500);

    const [platform, setPlatform] = useState(searchParams.get("platform") || "");
    const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") || "");
    const [type, setType] = useState(searchParams.get("type") || "");

    const updateFilters = (updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        router.push(`/writeups?${params.toString()}`);
    };

    useEffect(() => {
        if (debouncedQuery !== (searchParams.get("q") || "")) {
            updateFilters({ q: debouncedQuery });
        }
    }, [debouncedQuery]);

    return (
        <div className="flex flex-wrap gap-4 mb-12">
            <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="SEARCH_LOGS..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-cyber-black border border-cyber-gray text-white font-mono text-sm focus:border-cyber-blue outline-none transition-colors"
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 border border-cyber-gray px-3 py-2 bg-cyber-black font-mono text-xs text-gray-400">
                    <Filter className="w-3 h-3" />
                    <span>TYPE:</span>
                    <select
                        value={type}
                        onChange={(e) => {
                            const val = e.target.value;
                            setType(val);
                            updateFilters({ type: val });
                        }}
                        className="bg-transparent text-cyber-blue outline-none cursor-pointer uppercase"
                    >
                        <option value="">ALL</option>
                        <option value="WRITEUP">WRITEUP</option>
                        <option value="CVE">CVE</option>
                        <option value="OWASP">OWASP</option>
                        <option value="INSIGHT">INSIGHT</option>
                    </select>
                </div>

                <div className="flex items-center space-x-2 border border-cyber-gray px-3 py-2 bg-cyber-black font-mono text-xs text-gray-400">
                    <Filter className="w-3 h-3" />
                    <span>PLATFORM:</span>
                    <select
                        value={platform}
                        onChange={(e) => {
                            const val = e.target.value;
                            setPlatform(val);
                            updateFilters({ platform: val });
                        }}
                        className="bg-transparent text-cyber-blue outline-none cursor-pointer"
                    >
                        <option value="">ALL</option>
                        <option value="HTB">HTB</option>
                        <option value="THM">THM</option>
                        <option value="CTF">CTF</option>
                        <option value="N/A">N/A</option>
                    </select>
                </div>

                <div className="flex items-center space-x-2 border border-cyber-gray px-3 py-2 bg-cyber-black font-mono text-xs text-gray-400">
                    <Filter className="w-3 h-3" />
                    <span>DIFF:</span>
                    <select
                        value={difficulty}
                        onChange={(e) => {
                            const val = e.target.value;
                            setDifficulty(val);
                            updateFilters({ difficulty: val });
                        }}
                        className="bg-transparent text-cyber-blue outline-none cursor-pointer"
                    >
                        <option value="">ALL</option>
                        <option value="Easy">EASY</option>
                        <option value="Medium">MEDIUM</option>
                        <option value="Hard">HARD</option>
                        <option value="Insane">INSANE</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
