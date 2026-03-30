import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { codeToHtml } from "shiki";
import CodeBlock from "@/components/CodeBlock";
import Lightbox from "@/components/Lightbox";

// Custom components for MDX
const components = {
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

    // ── Code handling ─────────────────────────────────────────────────────────
    // `pre` wraps fenced code blocks — strip it and let `code` handle rendering
    pre: ({ children }: any) => <>{children}</>,

    // `code` handles both inline and fenced blocks
    code: async ({ children, className }: any) => {
        const codeString = Array.isArray(children)
            ? children.join("")
            : typeof children === "string"
                ? children
                : "";

        // Inline code: no className → render as styled <code>
        if (!className) {
            return (
                <code className="bg-cyber-gray/30 text-cyber-pink px-1.5 py-0.5 text-sm font-mono border border-cyber-gray/20 rounded-sm">
                    {codeString}
                </code>
            );
        }

        // Fenced code block: has className like "language-bash"
        const lang = className.replace("language-", "") || "text";
        const trimmed = codeString.trim();

        try {
            const html = await codeToHtml(trimmed, {
                lang,
                theme: "tokyo-night",
            });
            return <CodeBlock html={html} code={trimmed} lang={lang.toUpperCase()} />;
        } catch {
            // Fallback if Shiki doesn't support the language
            const fallbackHtml = await codeToHtml(trimmed, {
                lang: "text",
                theme: "tokyo-night",
            });
            return <CodeBlock html={fallbackHtml} code={trimmed} lang="TEXT" />;
        }
    },

    // ── Tables ────────────────────────────────────────────────────────────────
    table: (props: any) => (
        <div className="overflow-x-auto my-6 border border-cyber-gray bg-cyber-black/50">
            <table className="w-full text-left font-mono text-sm border-collapse" {...props} />
        </div>
    ),
    th: (props: any) => <th className="bg-cyber-gray/50 px-4 py-2 text-cyber-green border-b border-cyber-gray" {...props} />,
    td: (props: any) => <td className="px-4 py-2 border-b border-cyber-gray/30 text-gray-400" {...props} />,
};

export async function renderMDX(content: string) {
    return await compileMDX({
        source: content,
        components,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remarkGfm],
            },
        },
    });
}

/**
 * Renders MDX content to a plain HTML string (for API responses).
 * Used by the password-verification endpoint to securely deliver
 * locked content ONLY after authentication succeeds.
 */
export async function renderMDXToHtml(content: string): Promise<string> {
    const ReactDOMServer = await import("react-dom/server");
    const { content: rendered } = await renderMDX(content);
    return ReactDOMServer.renderToStaticMarkup(rendered);
}
