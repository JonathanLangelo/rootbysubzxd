"use client";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen bg-cyber-black flex flex-col items-center justify-center text-center px-4 font-mono">
            <div className="mb-8">
                <span className="text-[120px] md:text-[200px] font-bold text-red-900/20 leading-none select-none">
                    500
                </span>
            </div>

            <div className="space-y-4 max-w-lg">
                <h1 className="text-2xl md:text-3xl font-bold text-red-500 uppercase tracking-tighter">
                    {">"} SYSTEM_FAILURE
                </h1>
                <p className="text-gray-500 text-sm uppercase tracking-widest">
                    An unexpected error occurred during operation.
                </p>

                {/* Never expose error details to users */}
                {error.digest && (
                    <p className="text-[10px] text-gray-700 uppercase tracking-widest">
                        ERROR_DIGEST: {error.digest}
                    </p>
                )}

                <div className="pt-8">
                    <button
                        onClick={reset}
                        className="px-6 py-3 border border-red-600 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                    >
                        RETRY_OPERATION
                    </button>
                </div>
            </div>

            <div className="mt-16 text-[10px] text-gray-700 uppercase tracking-[0.3em]">
                {">"} ERROR_CODE: 500 // INTERNAL_SYSTEM_FAILURE
            </div>
        </div>
    );
}
