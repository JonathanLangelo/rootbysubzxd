import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, FileText, LogOut, Activity, Clock, Globe } from "lucide-react";

export default async function AdminDashboard() {
    const session = await getSession();
    if (!session) redirect("/admin/login");

    const [totalPosts, draftPosts, publishedPosts, lockedPosts, recentPosts] = await Promise.all([
        prisma.post.count(),
        prisma.post.count({ where: { status: "DRAFT" } }),
        prisma.post.count({ where: { status: "PUBLISHED" } }),
        prisma.post.count({ where: { status: "LOCKED" } }),
        prisma.post.findMany({
            orderBy: { updatedAt: "desc" },
            take: 5,
            select: { id: true, title: true, type: true, status: true, updatedAt: true },
        }),
    ]);

    const statusColor = (s: string) => {
        switch (s) {
            case "PUBLISHED": return "text-cyber-green";
            case "LOCKED": return "text-cyber-pink";
            default: return "text-gray-500";
        }
    };

    return (
        <main className="min-h-screen bg-cyber-black flex flex-col">
            <Navbar />

            <div className="flex-grow pt-32 pb-20 container mx-auto px-4 max-w-5xl">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 border-b border-cyber-gray pb-8">
                    <div>
                        <h1 className="font-mono text-2xl md:text-3xl font-bold text-white uppercase tracking-tighter">
                            ADMIN_PANEL
                        </h1>
                        <p className="text-cyber-blue font-mono text-sm uppercase tracking-widest mt-2 flex items-center">
                            <span className="opacity-50 mr-2">{">"}</span> SESSION: ACTIVE // <span className="text-white ml-2">{String(session.user)}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/content/new"
                            className="flex items-center gap-2 px-5 py-2 bg-cyber-blue text-black font-mono text-sm font-bold hover:opacity-90 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            NEW_POST
                        </Link>
                        <Link
                            href="/admin/logout"
                            className="flex items-center gap-2 px-4 py-2 text-red-500 font-mono text-xs border border-red-500/20 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            LOGOUT
                        </Link>
                    </div>
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: "Total Posts", value: totalPosts, color: "text-white", icon: FileText },
                        { label: "Published", value: publishedPosts, color: "text-cyber-green", icon: Globe },
                        { label: "Drafts", value: draftPosts, color: "text-cyber-blue", icon: Clock },
                        { label: "Locked", value: lockedPosts, color: "text-cyber-pink", icon: Activity },
                    ].map(({ label, value, color, icon: Icon }) => (
                        <div
                            key={label}
                            className="p-5 border border-cyber-gray bg-cyber-black/40 hover:border-cyber-blue/30 transition-colors group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-mono text-[10px] text-gray-500 uppercase">{label}</h3>
                                <Icon className="w-3.5 h-3.5 text-gray-700 group-hover:text-cyber-blue/50 transition-colors" />
                            </div>
                            <div className={`text-3xl font-mono font-bold ${color}`}>{value}</div>
                        </div>
                    ))}
                </div>

                {/* ── Content Management Card ── */}
                <div className="border border-cyber-gray bg-cyber-black/20 p-7 hover:border-cyber-blue/40 transition-all mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            <FileText className="w-6 h-6 text-cyber-blue" />
                            <h2 className="font-mono text-xl font-bold text-white uppercase tracking-widest">CONTENT</h2>
                        </div>
                        <Link
                            href="/admin/content"
                            className="px-5 py-1.5 border border-cyber-blue text-cyber-blue font-mono text-xs font-bold hover:bg-cyber-blue hover:text-black transition-all"
                        >
                            [ MANAGE_ALL ]
                        </Link>
                    </div>
                    <p className="text-sm text-gray-500 font-mono mb-5 max-w-xl">
                        Create and manage Writeups, CVEs, OWASP analyses, and Security Insights.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-cyber-gray/20">
                        {[
                            { label: "WRITEUPS", type: "WRITEUP", color: "hover:text-cyber-green" },
                            { label: "CVE_POSTS", type: "CVE", color: "hover:text-cyber-pink" },
                            { label: "OWASP", type: "OWASP", color: "hover:text-cyber-blue" },
                            { label: "INSIGHTS", type: "INSIGHT", color: "hover:text-white" },
                            { label: "PROJECTS", type: "PROJECT", color: "hover:text-cyber-blue" },
                        ].map(({ label, type, color }) => (
                            <Link
                                key={type}
                                href={`/admin/content?type=${type}`}
                                className={`text-[10px] font-mono text-gray-600 ${color} transition-colors underline underline-offset-4 decoration-dotted`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── Certifications Card ── */}
                <div className="border border-cyber-gray bg-cyber-black/20 p-8 hover:border-cyber-green/40 transition-all mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <Activity className="w-6 h-6 text-cyber-green" />
                            <h2 className="font-mono text-xl font-bold text-white uppercase tracking-widest">CERTIFICATIONS</h2>
                        </div>
                        <Link
                            href="/admin/certifications"
                            className="px-6 py-2 border border-cyber-green text-cyber-green font-mono text-xs font-bold hover:bg-cyber-green hover:text-black transition-all uppercase tracking-widest"
                        >
                            [ MANAGE_CERTS ]
                        </Link>
                    </div>
                    <p className="text-base text-gray-400 font-sans leading-relaxed mb-6 max-w-2xl">
                        Manage your learning achievements, certifications, and academic progress for the public profile.
                    </p>
                </div>

                {/* ── Recent Activity ── */}
                {recentPosts.length > 0 && (
                    <div>
                        <h3 className="font-mono text-[10px] text-gray-600 uppercase mb-3 tracking-wider">
                            RECENTLY_UPDATED
                        </h3>
                        <div className="space-y-1">
                            {recentPosts.map((p: { id: string; title: string; type: string; status: string; updatedAt: Date }) => (
                                <Link
                                    key={p.id}
                                    href={`/admin/content/${p.id}`}
                                    className="flex items-center justify-between px-4 py-3 border border-cyber-gray/20 hover:border-cyber-gray hover:bg-cyber-gray/5 transition-all group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className={`font-mono text-[9px] uppercase ${statusColor(p.status)} shrink-0`}>{p.status}</span>
                                        <span className="font-mono text-xs text-gray-300 truncate group-hover:text-white transition-colors">{p.title}</span>
                                        <span className="font-mono text-[9px] text-gray-700 shrink-0">{p.type}</span>
                                    </div>
                                    <span className="font-mono text-[9px] text-gray-700 shrink-0">
                                        {new Date(p.updatedAt).toLocaleDateString()}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
