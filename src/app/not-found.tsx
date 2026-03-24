import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-cyber-black flex flex-col items-center justify-center text-center px-4 font-mono">
            <div className="mb-8">
                <span className="text-[120px] md:text-[200px] font-bold text-cyber-gray/20 leading-none select-none">
                    404
                </span>
            </div>

            <div className="space-y-4 max-w-lg">
                <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tighter">
                    {">"} TARGET_NOT_FOUND
                </h1>
                <p className="text-gray-500 text-sm uppercase tracking-widest">
                    The requested resource does not exist in this sector.
                </p>

                <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 border border-cyber-blue text-cyber-blue text-xs font-bold uppercase tracking-widest hover:bg-cyber-blue hover:text-black transition-all"
                    >
                        RETURN_TO_BASE
                    </Link>
                    <Link
                        href="/writeups"
                        className="px-6 py-3 border border-cyber-gray text-gray-400 text-xs font-bold uppercase tracking-widest hover:border-white hover:text-white transition-all"
                    >
                        VIEW_MISSION_LOGS
                    </Link>
                </div>
            </div>

            <div className="mt-16 text-[10px] text-gray-700 uppercase tracking-[0.3em]">
                {">"} ERROR_CODE: 404 // RESOURCE_UNAVAILABLE
            </div>
        </div>
    );
}
