"use client";

import { useState } from "react";
import PasswordPrompt from "@/components/PasswordPrompt";

interface WriteupClientProps {
    id: string;
    slug: string;
    title: string;
    isProtected: boolean;
    content: React.ReactNode | null; // null when LOCKED (not shipped from server)
}

export default function WriteupClient({ id, slug, title, isProtected, content }: WriteupClientProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(!isProtected);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    // For locked posts, content is fetched as raw HTML after authentication
    const [fetchedHtml, setFetchedHtml] = useState<string | null>(null);

    const handlePasswordSubmit = async (password: string) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/content/verify-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, password }),
            });

            if (res.ok) {
                const data = await res.json();
                setIsAuthenticated(true);
                // The API now returns rendered content HTML after successful auth
                if (data.contentHtml) {
                    setFetchedHtml(data.contentHtml);
                }
            } else {
                setError("ACCESS_DENIED: INVALID_TOKEN");
            }
        } catch (err) {
            setError("SYSTEM_FAILURE: OFFLINE_MODE");
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-4xl mx-auto py-12">
                <PasswordPrompt onSuccess={handlePasswordSubmit} error={error} />
            </div>
        );
    }

    return (
        <article className="max-w-4xl mx-auto p-1 bg-cyber-gray/20 border border-cyber-gray">
            <div className="bg-cyber-black p-8 md:p-12">
                {isProtected && (
                    <div className="mb-8 p-3 border border-cyber-green/30 bg-cyber-green/5 flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse"></div>
                        <span className="font-mono text-[10px] text-cyber-green uppercase tracking-widest">
                            SESSION_SECURED // CONTENT_DECRYPTED_SUCCESSFULLY
                        </span>
                    </div>
                )}

                <div className="prose prose-invert max-w-none">
                    {/* Non-locked posts: render the server-provided React content */}
                    {content && content}

                    {/* Locked posts: render the fetched HTML after auth */}
                    {!content && fetchedHtml && (
                        <div dangerouslySetInnerHTML={{ __html: fetchedHtml }} />
                    )}

                    {/* Fallback if neither is available */}
                    {!content && !fetchedHtml && (
                        <p className="text-gray-500 font-mono text-sm italic">
                            {">"} Content buffer empty. Authentication may have failed.
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}
