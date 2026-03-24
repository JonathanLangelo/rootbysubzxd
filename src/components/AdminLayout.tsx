"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    FileText, 
    Award, 
    LogOut, 
    Menu, 
    X,
    Terminal
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Content", href: "/admin/content", icon: FileText },
        { name: "Certifications", href: "/admin/certifications", icon: Award },
    ];

    return (
        <div className="min-h-screen bg-cyber-black flex flex-col md:flex-row font-sans selection:bg-cyber-blue selection:text-black">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-cyber-black border-b border-cyber-gray sticky top-0 z-50">
                <Link href="/admin/dashboard" className="flex items-center space-x-2 group">
                    <Terminal className="w-6 h-6 text-cyber-green" />
                    <span className="font-mono text-xl font-bold tracking-tighter text-white uppercase">
                        SubzXD<span className="text-cyber-green">_</span>
                    </span>
                </Link>
                <button
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                    className="text-cyber-green p-2 border border-cyber-green/30 hover:bg-cyber-green/10 transition-all rounded"
                >
                    {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-cyber-black border-r border-cyber-gray 
                transform transition-transform duration-300 ease-in-out
                md:translate-x-0 md:static md:flex md:flex-col
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="hidden md:flex p-6 border-b border-cyber-gray items-center justify-center">
                    <Link href="/admin/dashboard" className="flex items-center space-x-3 group">
                        <Terminal className="w-8 h-8 text-cyber-green group-hover:drop-shadow-[0_0_8px_rgba(57,255,20,0.8)] transition-all" />
                        <span className="font-mono text-2xl font-bold tracking-tighter text-white uppercase group-hover:text-cyber-green transition-colors">
                            Admin<span className="text-cyber-green animate-[blink_1s_infinite]">_</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                    <div className="px-2 mb-4">
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{">"} SYSTEM_MODULES</p>
                    </div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center space-x-3 px-3 py-3 w-full border transition-all group font-mono text-sm uppercase tracking-widest ${
                                    isActive 
                                    ? "border-cyber-blue bg-cyber-blue/10 text-cyber-blue" 
                                    : "border-transparent text-gray-400 hover:border-cyber-gray hover:text-white"
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-cyber-blue" : "text-gray-500 group-hover:text-white"}`} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-cyber-gray shrink-0">
                    <Link
                        href="/admin/logout"
                        className="flex items-center justify-center space-x-2 w-full px-4 py-3 border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all font-mono text-xs font-bold uppercase tracking-widest"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>TERMINATE_SESSION</span>
                    </Link>
                    <div className="mt-4 text-center">
                        <Link href="/" className="text-xs font-mono text-gray-500 hover:text-cyber-green transition-colors underline decoration-dotted">
                            {">"} RETURN_TO_FRONTEND
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden w-full relative">
                <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 container mx-auto w-full max-w-7xl">
                    {children}
                </main>
            </div>
        </div>
    );
}
