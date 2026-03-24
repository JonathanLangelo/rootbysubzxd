import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectGrid from "@/components/ProjectGrid";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Projects",
    description: "Cybersecurity tools, scripts, and software developed by SubzXD.",
};

export default async function ProjectsPage() {
    const projects = await prisma.post.findMany({
        where: {
            type: "PROJECT",
            status: "PUBLISHED",
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="min-h-screen bg-cyber-black flex flex-col">
            <Navbar />

            <div className="flex-grow pt-24 md:pt-32 pb-16 md:pb-20 w-full max-w-6xl mx-auto px-4 md:px-6">
                <div className="mb-8 md:mb-12">
                    <h1 className="font-mono text-3xl md:text-4xl font-bold text-white mb-2 md:mb-4 underline decoration-cyber-green decoration-4 underline-offset-8 uppercase tracking-tighter mix-blend-screen">
                        CODE_REPOSITORY
                    </h1>
                    <p className="text-gray-500 font-mono text-xs md:text-sm uppercase tracking-widest break-words">
                        [ REPO_STATUS: LIVE // PROJECTS_LISTED: {projects.length} ]
                    </p>
                </div>

                <ProjectGrid initialProjects={projects} />
            </div>

            <Footer />
        </main>
    );
}
