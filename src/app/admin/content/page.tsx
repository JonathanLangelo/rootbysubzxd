import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    Edit,
    ChevronLeft,
    ExternalLink,
    Plus,
    Shield,
    Globe,
    Lock,
    Code,
} from "lucide-react";
import DeleteButton from "./_components/DeleteButton";

// This page intentionally receives searchParams from Next.js routing
export default async function AdminContentList({
    searchParams,
}: {
    searchParams: Promise<{ type?: string; status?: string; q?: string }>;
}) {
    const session = await getSession();
    if (!session) redirect("/admin/login");

    const { type, status, q } = await searchParams;

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (status) where.status = status;
    const or = [];
    if (q) {
        or.push({ title: { contains: q } }, { tags: { contains: q } });
        (where as Record<string, unknown>).OR = or;
    }

    // Type the posts explicitly
    interface PostRow {
        id: string;
        title: string;
        slug: string;
        type: string;
        status: string;
        platform: string;
        updatedAt: Date;
    }

    const posts = await prisma.post.findMany({
        where,
        orderBy: { updatedAt: "desc" },
    });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "PROJECT": return <Code className="w-3 h-3 text-cyber-blue" />;
            case "CVE": return <Shield className="w-3 h-3 text-cyber-pink" />;
            case "LOCKED": return <Lock className="w-3 h-3 text-red-500" />;
            default: return <Globe className="w-3 h-3 text-gray-500" />;
        }
    };

    const getStatusStyle = (s: string) => {
        switch (s) {
            case "DRAFT": return "border-gray-600/50 text-gray-500 bg-gray-900/30";
            case "LOCKED": return "border-red-900/50 text-red-500 bg-red-900/10";
            case "PUBLISHED": return "border-cyber-green/40 text-cyber-green bg-cyber-green/5";
            default: return "border-cyber-gray text-gray-500";
        }
    };

    const TYPES = ["WRITEUP", "CVE", "OWASP", "INSIGHT", "PROJECT"];
    const STATUSES = ["DRAFT", "PUBLISHED", "LOCKED"];

    const buildHref = (overrides: Record<string, string | undefined>) => {
        const params = new URLSearchParams();
        if (type && overrides.type !== "") params.set("type", overrides.type ?? type);
        if (status && overrides.status !== "") params.set("status", overrides.status ?? status);
        if (q && overrides.q !== "") params.set("q", overrides.q ?? q);
        Object.entries(overrides).forEach(([k, v]) => {
            if (v !== undefined && v !== "") params.set(k, v);
        });
        return `/admin/content?${params.toString()}`;
    };

    return (
        <div className="w-full flex-col font-mono selection:bg-cyber-blue selection:text-black mt-6 md:mt-0">
            {/* Header / Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <Link
                        href="/admin/dashboard"
                        className="flex w-full md:w-auto justify-center items-center gap-1.5 px-4 py-2 border border-cyber-gray text-cyber-blue font-mono text-xs hover:opacity-70 transition-opacity shrink-0"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        DASHBOARD
                    </Link>
                    <div className="hidden md:block h-px flex-grow bg-cyber-gray/40" />
                    <Link
                        href="/admin/content/new"
                        className="flex w-full md:w-auto justify-center items-center gap-2 px-5 py-2 bg-cyber-blue text-black font-mono text-sm font-bold hover:opacity-90 transition-all shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        NEW_POST
                    </Link>
                </div>

                <div className="mb-8">
                    <h1 className="font-mono text-2xl font-bold text-white uppercase">
                        CONTENT <span className="text-gray-600">({posts.length})</span>
                    </h1>
                </div>

                {/* ── Filter bar ── */}
                <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-cyber-gray/20">
                    {/* Search */}
                    <form method="GET" className="flex-grow max-w-xs">
                        <input
                            type="search"
                            name="q"
                            defaultValue={q}
                            placeholder="Search title or tags…"
                            className="w-full bg-cyber-black border border-cyber-gray px-3 py-1.5 text-white font-mono text-xs outline-none focus:border-cyber-blue transition-colors"
                        />
                    </form>

                    {/* Type filter */}
                    <div className="flex gap-1.5 flex-wrap">
                        <Link
                            href="/admin/content"
                            className={`px-2.5 py-1 font-mono text-[10px] border transition-all ${!type ? "bg-cyber-gray/20 border-cyber-gray text-white" : "border-cyber-gray/30 text-gray-600 hover:border-cyber-gray hover:text-gray-400"}`}
                        >
                            ALL
                        </Link>
                        {TYPES.map((t) => (
                            <Link
                                key={t}
                                href={buildHref({ type: t })}
                                className={`px-2.5 py-1 font-mono text-xs border transition-all ${type === t ? "bg-cyber-blue/10 border-cyber-blue text-cyber-blue" : "border-cyber-gray/30 text-gray-600 hover:border-cyber-gray hover:text-gray-400"}`}
                            >
                                {t}
                            </Link>
                        ))}
                    </div>

                    {/* Status filter */}
                    <div className="flex gap-1.5">
                        {STATUSES.map((s) => (
                            <Link
                                key={s}
                                href={buildHref({ status: status === s ? "" : s })}
                                className={`px-2.5 py-1 font-mono text-xs border transition-all ${status === s
                                    ? s === "PUBLISHED"
                                        ? "bg-cyber-green/10 border-cyber-green text-cyber-green"
                                        : s === "LOCKED"
                                            ? "bg-red-500/10 border-red-500 text-red-400"
                                            : "bg-gray-700/10 border-gray-500 text-gray-400"
                                    : "border-cyber-gray/30 text-gray-600 hover:border-cyber-gray hover:text-gray-400"
                                    }`}
                            >
                                {s}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="overflow-x-auto border border-cyber-gray/50 bg-cyber-black/20">
                    <table className="w-full text-left font-mono text-xs">
                        <thead>
                            <tr className="bg-cyber-gray/10 text-gray-500 border-b border-cyber-gray/40">
                                <th className="px-5 py-3 uppercase tracking-wider">Title</th>
                                <th className="px-5 py-3 uppercase tracking-wider">Type</th>
                                <th className="px-5 py-3 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 uppercase tracking-wider hidden md:table-cell">Updated</th>
                                <th className="px-5 py-3 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cyber-gray/10">
                            {posts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-16 text-center text-gray-700 font-mono italic">
                                        [!] NO_RECORDS_FOUND — try clearing the filters
                                    </td>
                                </tr>
                            ) : (
                                posts.map((p: PostRow) => (
                                    <tr key={p.id} className="hover:bg-cyber-blue/3 transition-colors group">
                                        <td className="px-5 py-3.5">
                                            <div className="text-white font-semibold truncate max-w-xs">{p.title}</div>
                                            <div className="text-[9px] text-gray-700 mt-0.5">/{p.slug}</div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-1.5">
                                                {getTypeIcon(p.type)}
                                                <span className="text-gray-500">{p.type}</span>
                                                {p.platform && p.platform !== "N/A" && (
                                                    <span className="text-[9px] text-gray-700 ml-1">({p.platform})</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`px-2 py-0.5 text-[9px] border ${getStatusStyle(p.status)}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 hidden md:table-cell text-gray-700 text-[10px]">
                                            {new Date(p.updatedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex justify-end items-center gap-3">
                                                <Link
                                                    href={`/admin/content/${p.id}`}
                                                    className="text-gray-600 hover:text-cyber-blue transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <DeleteButton id={p.id} title={p.title} />
                                                <Link
                                                    href={`/${p.type === "PROJECT" ? "projects" : "writeups"}/${p.slug}`}
                                                    className="text-gray-700 hover:text-white transition-colors"
                                                    title="View"
                                                    target="_blank"
                                                    rel="noopener"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
        </div>
    );
}
