import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { codeToHtml } from "shiki";
import CodeBlock from "@/components/CodeBlock";
import Lightbox from "@/components/Lightbox";

// Custom components for MDX
const components = {
    img: (props: any) => <Lightbox {...props} />,
    h1: (props: any) => (
        <h1 className="text-3xl md:text-4xl font-mono font-bold text-white mt-16 mb-8 tracking-tighter uppercase relative inline-block" {...props}>
            <span className="relative z-10">{props.children}</span>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-cyber-blue drop-shadow-[0_0_8px_var(--cyber-blue)] opacity-40"></div>
        </h1>
    ),
    h2: (props: any) => (
        <h2 className="text-2xl md:text-3xl font-mono font-bold text-white mt-12 mb-6 tracking-tight uppercase relative inline-block border-b-2 border-cyber-blue/20 pb-2" {...props} />
    ),
    h3: (props: any) => (
        <h3 className="text-xl font-mono font-bold text-cyber-blue mt-10 mb-4 tracking-wide uppercase" {...props} />
    ),
    p: (props: any) => <p className="text-gray-200 leading-[1.8] mb-8 font-sans text-base md:text-lg tracking-normal opacity-90" {...props} />,
    a: (props: any) => (
        <a className="text-cyber-green hover:brightness-125 underline underline-offset-8 decoration-cyber-green/30 hover:decoration-cyber-green transition-all duration-300 font-medium" target="_blank" rel="noopener noreferrer" {...props} />
    ),
    ul: (props: any) => <ul className="list-none space-y-4 mb-8 ml-2" {...props} />,
    ol: (props: any) => <ol className="list-decimal space-y-4 mb-8 ml-8 text-gray-200 marker:text-cyber-blue font-mono text-base" {...props} />,
    li: (props: any) => (
        <li className="relative pl-8 text-gray-200 text-base md:text-lg leading-relaxed" {...props}>
            <span className="absolute left-0 text-cyber-blue font-bold select-none opacity-60">{"//"}</span>
            <span className="flex-grow">{props.children}</span>
        </li>
    ),
    blockquote: (props: any) => (
        <blockquote className="border-l-2 border-cyber-blue/50 bg-[#0d0d0f] p-8 my-10 text-gray-300 font-sans text-lg italic leading-relaxed shadow-xl ring-1 ring-white/5 relative overflow-hidden" {...props}>
            <div className="absolute -top-4 -right-2 opacity-5 pointer-events-none select-none">
                <span className="text-[120px] font-serif font-bold text-cyber-blue">"</span>
            </div>
            <div className="relative z-10">{props.children}</div>
        </blockquote>
    ),
    hr: () => (
        <div className="my-16 py-4 flex items-center justify-center opacity-30">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-cyber-blue"></div>
            <div className="mx-4 text-cyber-blue font-mono text-[10px] tracking-widest uppercase">EOF_SIGNAL_DISCONNECT</div>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-cyber-blue"></div>
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
