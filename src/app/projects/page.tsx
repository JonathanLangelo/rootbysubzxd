import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectGrid from "@/components/ProjectGrid";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Projects | SubzXD Repositories",
    description: "Cybersecurity tools, scripts, and software developed by Jonathan Immanuel Mazar Langelo (SubzXD).",
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

            <div className="pt-32 pb-20 container mx-auto px-4">
                <div className="mb-12">
                    <h1 className="font-mono text-4xl font-bold text-white mb-2 underline decoration-cyber-green decoration-4 underline-offset-8 uppercase tracking-tighter">
                        CODE_REPOSITORY
                    </h1>
                    <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">
                        [ REPO_STATUS: LIVE // PROJECTS_LISTED: {projects.length} ]
                    </p>
                </div>

                <ProjectGrid initialProjects={projects} />
            </div>

            <Footer />
        </main>
    );
}
