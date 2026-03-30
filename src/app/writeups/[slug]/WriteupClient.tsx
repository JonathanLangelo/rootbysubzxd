"use client";

import { useState } from "react";
import PasswordPrompt from "@/components/PasswordPrompt";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Lightbox from "@/components/Lightbox";

const mdxComponents = {
    img: (props: any) => <Lightbox {...props} />,
    h1: (props: any) => (
        <h1 className="text-3xl font-mono font-bold text-cyber-green mt-12 mb-6 border-l-4 border-cyber-green pl-4 uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(0,255,0,0.2)]" {...props} />
    ),
    h2: (props: any) => (
        <h2 className="text-2xl font-mono font-bold text-cyber-blue mt-10 mb-5 border-l-4 border-cyber-blue pl-4 uppercase tracking-tighter" {...props} />
    ),
    h3: (props: any) => (
        <h3 className="text-xl font-mono font-bold text-cyber-pink mt-8 mb-4 border-l-4 border-cyber-pink pl-4 uppercase tracking-tighter" {...props} />
    ),
    p: (props: any) => <p className="text-gray-300 leading-relaxed mb-6 font-sans text-base tracking-wide" {...props} />,
    a: (props: any) => (
        <a className="text-cyber-blue hover:text-cyber-green underline underline-offset-4 decoration-cyber-blue/30 hover:decoration-cyber-green/50 transition-all duration-300" target="_blank" rel="noopener noreferrer" {...props} />
    ),
    ul: (props: any) => <ul className="list-none space-y-3 mb-6 ml-2" {...props} />,
    ol: (props: any) => <ol className="list-decimal space-y-3 mb-6 ml-6 text-gray-300 marker:text-cyber-blue font-mono" {...props} />,
    li: (props: any) => (
        <li className="relative pl-6 text-gray-300" {...props}>
            <span className="absolute left-0 text-cyber-green font-bold select-none">{">_"}</span>
            <span className="flex-grow">{props.children}</span>
        </li>
    ),
    blockquote: (props: any) => (
        <blockquote className="border-l-4 border-cyber-blue bg-cyber-blue/5 p-6 my-8 text-gray-400 italic font-mono text-sm leading-6 relative overflow-hidden" {...props}>
            <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none select-none">
                <span className="text-4xl text-cyber-blue">"</span>
            </div>
            {props.children}
        </blockquote>
    ),
    hr: () => (
        <div className="my-12 flex items-center gap-4">
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-cyber-gray to-transparent opacity-30"></div>
            <div className="w-2 h-2 rotate-45 border border-cyber-blue/50 bg-cyber-black"></div>
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-cyber-gray to-transparent opacity-30"></div>
        </div>
    ),
    pre: ({ children }: any) => <pre className="bg-cyber-gray/10 p-4 border border-cyber-gray/30 my-4 overflow-x-auto">{children}</pre>,
    code: ({ children, className }: any) => <code className={className || "bg-cyber-gray/30 text-cyber-pink px-1.5 py-0.5 text-sm font-mono border border-cyber-gray/20 rounded-sm"}>{children}</code>,
};

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
    const [fetchedMdx, setFetchedMdx] = useState<string | null>(null);

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
                } else if (data.contentMdx) {
                    setFetchedMdx(data.contentMdx);
                }
            } else {
                const data = await res.json().catch(() => ({}));
                switch (res.status) {
                    case 401: setError("INVALID_ACCESS_KEY"); break;
                    case 429: setError("TOO_MANY_ATTEMPTS: PLEASE_WAIT"); break;
                    case 404: setError("RESOURCE_NOT_FOUND"); break;
                    default: setError(`ACCESS_DENIED: ${data.error || "UNKNOWN_ERROR"}`);
                }
            }
        } catch (err) {
            setError("SYSTEM_FAILURE: OFFLINE_MODE");
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-3xl mx-auto py-12 px-4">
                <PasswordPrompt onSuccess={handlePasswordSubmit} error={error} />
            </div>
        );
    }

    return (
        <article className="max-w-3xl mx-auto p-1 border border-cyber-gray/50 bg-cyber-gray/10">
            <div className="bg-cyber-black p-4 md:p-8 w-full overflow-hidden">
                {isProtected && (
                    <div className="mb-8 p-3 border border-cyber-green/30 bg-cyber-green/5 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse"></div>
                            <span className="font-mono text-xs text-cyber-green uppercase tracking-widest break-all">
                                SESSION_SECURED // CONTENT_DECRYPTED
                            </span>
                        </div>
                    </div>
                )}

                <div className="prose prose-invert max-w-none">
                    {/* Non-locked posts: render the server-provided React content */}
                    {content && content}

                    {/* Locked posts: render the fetched HTML after auth */}
                    {!content && fetchedHtml && (
                        <div dangerouslySetInnerHTML={{ __html: fetchedHtml }} />
                    )}

                    {/* Fallback to MDX if HTML failed to render on server */}
                    {!content && !fetchedHtml && fetchedMdx && (
                        <div className="font-sans leading-relaxed">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={mdxComponents as any}
                            >
                                {fetchedMdx}
                            </ReactMarkdown>
                        </div>
                    )}

                    {/* Fallback if neither is available */}
                    {!content && !fetchedHtml && !fetchedMdx && (
                        <p className="text-gray-500 font-mono text-sm italic">
                            {">"} Content buffer empty. Authentication may have failed.
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}
