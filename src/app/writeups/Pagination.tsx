"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    postsPerPage: number;
    baseUrl: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalPosts,
    postsPerPage,
    baseUrl
}: PaginationProps) {
    const searchParams = useSearchParams();

    const createPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", pageNumber.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    const startPost = (currentPage - 1) * postsPerPage + 1;
    const endPost = Math.min(currentPage * postsPerPage, totalPosts);

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, start + maxVisiblePages - 1);

            if (end === totalPages) {
                start = Math.max(1, end - maxVisiblePages + 1);
            }

            for (let i = start; i <= end; i++) pages.push(i);
        }
        return pages;
    };

    return (
        <div className="mt-16 space-y-6">
            {/* Post Count Info */}
            <div className="text-center font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                Showing <span className="text-cyber-blue font-bold">{startPost}-{endPost}</span> of <span className="text-white font-bold">{totalPosts}</span> mission logs
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-2">
                    {/* First Page */}
                    <Link
                        href={createPageUrl(1)}
                        className={`p-2 border border-cyber-gray hover:border-cyber-blue transition-all ${currentPage === 1 ? "opacity-30 pointer-events-none" : ""
                            }`}
                    >
                        <ChevronsLeft size={16} />
                    </Link>

                    {/* Previous Page */}
                    <Link
                        href={createPageUrl(currentPage - 1)}
                        className={`p-2 border border-cyber-gray hover:border-cyber-blue flex items-center space-x-2 px-4 group transition-all ${currentPage === 1 ? "opacity-30 pointer-events-none" : ""
                            }`}
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-mono text-[10px] uppercase hidden sm:inline">PREV</span>
                    </Link>

                    {/* Page Numbers - Grid for Mobile compatibility */}
                    <div className="hidden sm:flex items-center space-x-2">
                        {getPageNumbers().map((page) => (
                            <Link
                                key={page}
                                href={createPageUrl(page)}
                                className={`w-10 h-10 flex items-center justify-center font-mono text-xs border transition-all ${currentPage === page
                                        ? "bg-cyber-blue/10 border-cyber-blue text-cyber-blue shadow-[0_0_10px_rgba(0,243,255,0.2)]"
                                        : "border-cyber-gray hover:border-cyber-blue/50 text-gray-500"
                                    }`}
                            >
                                {page.toString().padStart(2, '0')}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Page Indicator */}
                    <div className="sm:hidden w-10 h-10 flex items-center justify-center font-mono text-xs border border-cyber-blue bg-cyber-blue/10 text-cyber-blue">
                        {currentPage.toString().padStart(2, '0')}
                    </div>

                    {/* Next Page */}
                    <Link
                        href={createPageUrl(currentPage + 1)}
                        className={`p-2 border border-cyber-gray hover:border-cyber-blue flex items-center space-x-2 px-4 group transition-all ${currentPage === totalPages ? "opacity-30 pointer-events-none" : ""
                            }`}
                    >
                        <span className="font-mono text-[10px] uppercase hidden sm:inline">NEXT</span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* Last Page */}
                    <Link
                        href={createPageUrl(totalPages)}
                        className={`p-2 border border-cyber-gray hover:border-cyber-blue transition-all ${currentPage === totalPages ? "opacity-30 pointer-events-none" : ""
                            }`}
                    >
                        <ChevronsRight size={16} />
                    </Link>
                </div>

                {/* Cyberpunk Decorative Line */}
                <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-cyber-blue/30 to-transparent"></div>
            </div>
        </div>
    );
}
