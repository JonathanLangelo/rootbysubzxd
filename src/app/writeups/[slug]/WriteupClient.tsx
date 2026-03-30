"use client";

import { useState } from "react";
import PasswordPrompt from "@/components/PasswordPrompt";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Lightbox from "@/components/Lightbox";
import { Search, Code2, ShieldAlert, Lightbulb } from "lucide-react";

const mdxComponents = {
    img: (props: any) => <Lightbox {...props} />,
    h1: (props: any) => (
        <h1 className="text-2xl font-mono font-bold text-white mt-10 mb-6 uppercase tracking-tighter border-b border-white/10 pb-2" {...props} />
    ),
    h2: (props: any) => (
        <h2 className="text-xl font-mono font-bold text-white mt-8 mb-4 uppercase tracking-tight" {...props} />
    ),
    h3: (props: any) => (
        <h3 className="text-lg font-mono font-bold text-white/70 mt-6 mb-3 uppercase border-l-2 border-white/20 pl-3" {...props} />
    ),
    p: (props: any) => <p className="text-gray-300 leading-relaxed mb-6 text-sm md:text-base font-sans" {...props} />,
    a: (props: any) => (
        <a className="text-white underline underline-offset-4 transition-all text-sm" target="_blank" rel="noopener noreferrer" {...props} />
    ),
    ul: (props: any) => <ul className="list-disc space-y-3 mb-6 ml-6 text-sm md:text-base text-gray-300" {...props} />,
    li: (props: any) => (
        <li className="text-gray-300 pl-1" {...props}>
            {props.children}
        </li>
    ),
    blockquote: (props: any) => (
        <blockquote className="border-l-2 border-white/20 bg-white/[0.02] p-5 my-8 text-gray-400 italic font-sans text-sm leading-6" {...props} />
    ),
    hr: () => <hr className="my-12 border-white/10" />,
    pre: ({ children }: any) => (
        <div className="my-8 border border-white/10 bg-[#050505] rounded-sm overflow-hidden shadow-xl">
            <div className="px-4 py-2 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
                <span className="text-[8px] text-gray-500 font-mono tracking-widest uppercase text-center w-full">SOURCE_BUFFER // READ_ONLY</span>
            </div>
            <pre className="p-5 overflow-x-auto text-[11px] sm:text-xs text-gray-300 font-mono leading-relaxed">{children}</pre>
        </div>
    ),
    code: ({ children, className }: any) => (
        <code className={className ? "text-inherit" : "bg-white/[0.1] px-1.5 py-0.5 rounded text-white font-mono text-[11px]"}>
            {children}
        </code>
    ),
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
