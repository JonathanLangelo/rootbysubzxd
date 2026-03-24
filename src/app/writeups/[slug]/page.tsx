import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { renderMDX } from "@/lib/mdx";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WriteupClient from "./WriteupClient";

export const dynamic = "force-dynamic";

// ── C1 FIX: Dynamic SEO metadata per writeup (also fixes M7) ─────────────────
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const writeup = await prisma.post.findUnique({
        where: { slug },
        select: { title: true, description: true, status: true },
    });

    if (!writeup || writeup.status === "DRAFT") {
        return { title: "Not Found | SubzXD" };
    }

    return {
        title: `${writeup.title} | SubzXD`,
        description: writeup.description || `Writeup: ${writeup.title}`,
    };
}

export default async function WriteupPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const writeup = await prisma.post.findUnique({
        where: { slug },
    });

    if (!writeup || writeup.status === "DRAFT") {
        notFound();
    }

    // ── C1 FIX: Do NOT render or ship content to client if post is LOCKED ────
    // Content is only rendered server-side AFTER authentication is confirmed
    // via the API route. The client component will fetch it post-auth.
    const isLocked = writeup.status === "LOCKED";

    let renderedContent: React.ReactNode | null = null;
    if (!isLocked) {
        const { content } = await renderMDX(writeup.content);
        renderedContent = content;
    }

    return (
        <main className="min-h-screen bg-cyber-black">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4">
                {/* Header Metadata */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="flex flex-wrap items-center gap-6 mb-8 border-l-2 border-cyber-blue pl-6 py-2">
                        <span className="text-sm font-mono text-cyber-blue px-3 py-1 border border-cyber-blue/30 bg-cyber-blue/5 uppercase tracking-widest">
                            {writeup.platform}
                        </span>
                        <span className="text-sm font-mono text-gray-400 uppercase tracking-widest">
                            [ TARGET_LOG: {new Date(writeup.createdAt).toISOString().split('T')[0]} ]
                        </span>
                        <span className={`text-sm font-mono px-3 py-1 border ${writeup.status === 'LOCKED' ? 'border-red-600 font-bold text-red-500 bg-red-900/10' : 'border-cyber-green/30 text-cyber-green bg-cyber-green/5'
                            } uppercase tracking-widest`}>
                            {writeup.status === 'LOCKED' ? 'ACTIVE_MISSION' : writeup.status}
                        </span>
                    </div>

                    <h1 className="font-mono text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 uppercase tracking-tighter leading-tight">
                        {writeup.title}
                    </h1>

                    <div className="w-full h-px bg-gradient-to-r from-cyber-blue to-transparent"></div>
                </div>

                <WriteupClient
                    id={writeup.id}
                    slug={writeup.slug}
                    title={writeup.title}
                    isProtected={isLocked}
                    content={renderedContent}
                />
            </div>

            <Footer />
        </main>
    );
}
