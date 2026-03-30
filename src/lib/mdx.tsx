import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { codeToHtml } from "shiki";
import CodeBlock from "@/components/CodeBlock";
import Lightbox from "@/components/Lightbox";
import { Search, Code2, ShieldAlert, Info, Lightbulb } from "lucide-react";

// Helper to get heading icon
const getHeadingIcon = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("scan") || lower.includes("nmap")) return <Search className="w-5 h-5 text-cyber-green" />;
    if (lower.includes("exploit")) return <Code2 className="w-5 h-5 text-cyber-green" />;
    if (lower.includes("post") || lower.includes("security")) return <ShieldAlert className="w-5 h-5 text-cyber-green" />;
    return null;
};

// Custom components for MDX
const components = {
    img: (props: any) => <Lightbox {...props} />,
    h1: (props: any) => (
        <h1 className="text-4xl md:text-5xl font-sans font-bold text-white mt-16 mb-8 tracking-tight" {...props} />
    ),
    h2: (props: any) => {
        const text = props.children?.toString() || "";
        const icon = getHeadingIcon(text);
        return (
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white mt-12 mb-6 flex items-center gap-3" {...props}>
                {icon}
                <span>{props.children}</span>
            </h2>
        );
    },
    h3: (props: any) => (
        <h3 className="text-xl font-sans font-bold text-cyber-green mt-10 mb-4 uppercase tracking-widest" {...props} />
    ),
    p: (props: any) => <p className="text-gray-100 leading-[1.8] mb-8 font-sans text-base md:text-lg tracking-normal opacity-90" {...props} />,
    a: (props: any) => (
        <a className="text-cyber-green hover:underline underline-offset-4 decoration-cyber-green/50 transition-all font-bold" target="_blank" rel="noopener noreferrer" {...props} />
    ),
    ul: (props: any) => <ul className="list-disc space-y-4 mb-8 ml-8 text-gray-200" {...props} />,
    ol: (props: any) => <ol className="list-decimal space-y-4 mb-8 ml-10 text-gray-200 font-sans text-base" {...props} />,
    li: (props: any) => (
        <li className="text-gray-200 text-base md:text-lg leading-relaxed pl-2" {...props}>
            {props.children}
        </li>
    ),
    blockquote: (props: any) => (
        <div className="my-10 p-6 bg-[#0a1a0a]/30 border border-cyber-green/20 rounded-lg relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-3">
                <Lightbulb className="w-5 h-5 text-cyber-green" />
                <span className="font-bold text-cyber-green text-sm uppercase tracking-widest">HINT // PRO_TIP</span>
            </div>
            <div className="text-gray-300 font-sans text-base leading-relaxed italic">
                {props.children}
            </div>
        </div>
    ),
    hr: () => <hr className="my-20 border-white/5" />,

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
                <code className="bg-white/10 text-white px-1.5 py-0.5 text-sm font-mono rounded-sm">
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
