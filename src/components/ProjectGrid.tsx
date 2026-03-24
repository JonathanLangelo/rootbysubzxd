"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, ExternalLink, Github, X, Box } from "lucide-react";
import type { Post } from "@prisma/client";

interface ProjectGridProps {
    initialProjects: Post[];
}

export default function ProjectGrid({ initialProjects }: ProjectGridProps) {
    const [filter, setFilter] = useState("ALL");
    const [selectedProject, setSelectedProject] = useState<Post | null>(null);

    const categories = ["ALL", ...Array.from(new Set(initialProjects.map(p => p.type || "OTHER")))];

    const filteredProjects = filter === "ALL"
        ? initialProjects
        : initialProjects.filter(p => p.type === filter);

    return (
        <div>
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 mb-12">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-1 font-mono text-xs uppercase tracking-widest transition-all ${filter === cat
                            ? "bg-cyber-green text-black font-bold shadow-[0_0_15px_rgba(0,255,0,0.5)]"
                            : "border border-cyber-gray text-gray-500 hover:text-white"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                            onClick={() => setSelectedProject(project)}
                            className="group relative border border-cyber-gray bg-cyber-black/40 hover:border-cyber-green/50 transition-all cursor-pointer overflow-hidden p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <Box className="w-5 h-5 text-cyber-green" />
                                <span className="text-[8px] font-mono text-cyber-green border border-cyber-green/30 px-2 uppercase">
                                    {project.type || "OTHER"}
                                </span>
                            </div>

                            <h3 className="font-mono text-xl font-bold text-foreground mb-2 group-hover:text-cyber-green transition-colors">
                                {project.title}
                            </h3>

                            <p className="text-sm text-muted-foreground font-sans line-clamp-2 mb-4">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {project.tags?.split(",").map(tag => (
                                    <span key={tag} className="text-[10px] font-mono text-gray-400 bg-cyber-gray/20 px-2 py-0.5">
                                        #{tag.trim()}
                                    </span>
                                ))}
                            </div>

                            {/* Neon Glow Hover */}
                            <div className="absolute inset-0 bg-cyber-green/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-cyber-black border border-cyber-green p-8 md:p-12 overflow-y-auto max-h-[90vh]"
                        >
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="flex items-center space-x-3 mb-6">
                                <span className="text-xs font-mono text-cyber-green border border-cyber-green/30 px-4 py-1">
                                    {selectedProject.type?.toUpperCase() || "OTHER"}
                                </span>
                                <span className="text-[10px] font-mono text-gray-500">
                                    STAMP: {new Date(selectedProject.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h2 className="font-mono text-3xl font-bold text-foreground mb-6 uppercase tracking-tighter shadow-green-sm">
                                {selectedProject.title}
                            </h2>

                            <div className="prose prose-invert max-w-none mb-10 text-muted-foreground font-sans">
                                {selectedProject.description}
                            </div>

                            <div className="flex flex-wrap gap-6 border-t border-cyber-gray pt-8">
                                {selectedProject.githubUrl && (
                                    <a
                                        href={selectedProject.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 text-cyber-green hover:glow-green font-mono text-sm underline underline-offset-4"
                                    >
                                        <Github className="w-4 h-4" />
                                        <span>RESOURCES</span>
                                    </a>
                                )}
                                {selectedProject.demoUrl && (
                                    <a
                                        href={selectedProject.demoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 text-cyber-blue hover:glow-blue font-mono text-sm underline underline-offset-4"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>LIVE_DEMO</span>
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
