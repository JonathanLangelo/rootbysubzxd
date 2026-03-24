import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import DeleteButton from "./_components/DeleteButton"; // We will create this or use existing

export default async function AdminCertifications() {
    const session = await getSession();
    if (!session) redirect("/admin/login");

    const certifications = await prisma.certification.findMany({
        orderBy: { date: "desc" },
    });

    return (
        <main className="min-h-screen bg-cyber-black flex flex-col">
            <Navbar />

            <div className="flex-grow pt-32 pb-20 container mx-auto px-4 max-w-5xl">
                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 border-b border-cyber-gray pb-8">
                    <div>
                        <h1 className="font-mono text-3xl font-bold text-white uppercase tracking-tighter">
                            CERTIFICATIONS
                        </h1>
                        <p className="text-cyber-blue font-mono text-[10px] uppercase tracking-tighter mt-1 opacity-70">
                            {"> "} MANAGE_LEARNING_ACHIEVEMENTS
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/certifications/new"
                            className="flex items-center gap-2 px-5 py-2 bg-cyber-blue text-black font-mono text-sm font-bold hover:opacity-90 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            NEW_CERT
                        </Link>
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-2 px-4 py-2 border border-cyber-gray text-gray-400 font-mono text-xs hover:text-white transition-all"
                        >
                            DASHBOARD
                        </Link>
                    </div>
                </div>

                {/* ── Certifications List ── */}
                <div className="grid grid-cols-1 gap-4">
                    {certifications.length === 0 ? (
                        <div className="text-center py-12 border border-cyber-gray border-dashed">
                            <p className="text-gray-500 font-mono text-sm">NO_CERTIFICATIONS_FOUND</p>
                        </div>
                    ) : (
                        certifications.map((cert: any) => (
                            <div key={cert.id} className="border border-cyber-gray bg-cyber-black/40 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-cyber-blue/50 transition-colors">
                                <div>
                                    <h3 className="font-mono text-lg font-bold text-white mb-1">
                                        {cert.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-500">
                                        <span className="text-cyber-green">{cert.issuer}</span>
                                        <span>//</span>
                                        <span>{new Date(cert.date).toISOString().split('T')[0]}</span>
                                        {cert.verificationUrl && (
                                            <>
                                                <span>//</span>
                                                <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-cyber-blue hover:underline">
                                                    Verify <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </>
                                        )}
                                        {cert.fileUrl && (
                                            <>
                                                <span>//</span>
                                                <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-cyber-blue hover:underline">
                                                    View File <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DeleteButton id={cert.id} title={cert.title} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
