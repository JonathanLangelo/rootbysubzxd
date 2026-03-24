import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import BlogFilters from "./BlogFilters";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Suspense } from "react";
import type { Post } from "@prisma/client";
import Pagination from "./Pagination";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const POSTS_PER_PAGE = 6;

export const metadata: Metadata = {
    title: "Mission Logs | SubzXD",
    description: "Archives awaiting decryption. No writeups published yet. Check back for future security briefings.",
};

export default async function WriteupsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; platform?: string; difficulty?: string; type?: string; page?: string }>;
}) {
    const { q, platform, difficulty, type, page } = await searchParams;
    const session = await getSession();

    // Validate page
    const currentPage = parseInt(page || "1");
    const validPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

    const where = {
        AND: [
            { type: { not: "PROJECT" } },
            { status: { not: "DRAFT" } },
            q ? {
                OR: [
                    { title: { contains: q } },
                    { content: { contains: q } },
                    { tags: { contains: q } }
                ]
            } : {},
            platform ? { platform } : {},
            difficulty ? { difficulty } : {},
            type ? { type } : {},
        ],
    };

    const totalPosts = await prisma.post.count({ where });
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

    // Redirect to last page if requested more than available
    if (totalPages > 0 && validPage > totalPages) {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (platform) params.set("platform", platform);
        if (difficulty) params.set("difficulty", difficulty);
        if (type) params.set("type", type);
        params.set("page", totalPages.toString());
        redirect(`/writeups?${params.toString()}`);
    }

    const writeups = await prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (validPage - 1) * POSTS_PER_PAGE,
        take: POSTS_PER_PAGE,
    });

    return (
        <main className="min-h-screen bg-cyber-black">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4">
                <div className="mb-12">
                    <h1 className="font-mono text-2xl md:text-3xl font-bold text-white mb-4 underline decoration-cyber-blue decoration-4 underline-offset-8 uppercase tracking-tighter">
                        DATABASE_LOGS
                    </h1>
                    <p className="text-gray-400 font-mono text-sm md:text-base uppercase tracking-widest flex items-center">
                        <span className="text-cyber-blue mr-3">[ SEC_INTEL ]</span> MISSION_REPORTS
                    </p>
                </div>

                <Suspense fallback={<div className="h-20 animate-pulse bg-cyber-gray/10 mb-12"></div>}>
                    <BlogFilters />
                </Suspense>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {writeups.length > 0 ? (
                        writeups.map((writeup: Post) => (
                            <Link
                                key={writeup.id}
                                href={`/writeups/${writeup.slug}`}
                                className="group relative overflow-hidden border border-cyber-gray bg-cyber-black hover:border-cyber-blue/50 transition-all block"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-[10px] font-mono border px-2 py-0.5 ${writeup.status === 'LOCKED' ? 'border-red-900/50 text-red-500' : 'border-cyber-blue/30 text-cyber-blue'
                                            }`}>
                                            {writeup.platform}: {writeup.status === 'LOCKED' ? 'ACTIVE_MISSION' : writeup.status}
                                        </span>
                                        <span className="text-[10px] font-mono text-gray-500">
                                            {new Date(writeup.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h3 className="font-mono text-xl font-bold text-white mb-3 group-hover:text-cyber-blue transition-colors">
                                        {writeup.title}
                                    </h3>

                                    <div className="flex items-center space-x-2">
                                        <span className={`text-[10px] font-mono px-2 py-0.5 border ${writeup.difficulty === 'Insane' ? 'border-red-600/50 text-red-600 bg-red-900/10' :
                                            writeup.difficulty === 'Hard' ? 'border-orange-600/50 text-orange-600 bg-orange-900/10' :
                                                'border-green-600/50 text-green-600 bg-green-900/10'
                                            }`}>
                                            {writeup.difficulty?.toUpperCase() || 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                {/* Animated scanline effect on hover */}
                                <div className="absolute inset-0 bg-cyber-blue/5 opacity-0 group-hover:opacity-10 pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyber-blue scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-32 border border-dashed border-cyber-gray/30 bg-cyber-black/20">
                            <div className="text-center space-y-4">
                                <p className="font-mono text-lg text-gray-500 uppercase tracking-widest animate-pulse">
                                    {">"} NO_ENTRIES_FOUND_IN_BUFFER
                                </p>
                                <p className="text-sm text-gray-600 font-mono italic">
                                    Archives awaiting first mission report...
                                </p>
                                {session && (
                                    <Link
                                        href="/admin/content/new"
                                        className="inline-block mt-8 px-6 py-2 border border-cyber-blue text-cyber-blue font-mono text-xs font-bold hover:bg-cyber-blue hover:text-black transition-all"
                                    >
                                        + CREATE_FIRST_WRITEUP
                                    </Link>
                                )}
                                {!session && (
                                    <p className="text-[10px] text-gray-700 font-mono pt-4 uppercase tracking-[0.2em]">
                                        [ CHECK_BACK_LATER ]
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {totalPages > 0 && (
                    <Pagination
                        currentPage={validPage}
                        totalPages={totalPages}
                        totalPosts={totalPosts}
                        postsPerPage={POSTS_PER_PAGE}
                        baseUrl="/writeups"
                    />
                )}
            </div>

            <Footer />
        </main>
    );
}
