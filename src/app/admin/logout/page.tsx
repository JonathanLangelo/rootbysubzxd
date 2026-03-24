"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const router = useRouter();
    const [error, setError] = useState(false);

    useEffect(() => {
        async function performLogout() {
            try {
                const res = await fetch("/api/logout", {
                    method: "POST",
                    headers: { "X-Requested-With": "XMLHttpRequest" },
                });

                if (res.ok) {
                    router.replace("/admin/login");
                } else {
                    setError(true);
                }
            } catch {
                setError(true);
            }
        }

        performLogout();
    }, [router]);

    if (error) {
        return (
            <div className="min-h-screen bg-cyber-black flex items-center justify-center">
                <div className="text-center font-mono">
                    <p className="text-red-500 text-sm mb-4">LOGOUT_FAILED: SESSION_ERROR</p>
                    <a href="/admin/login" className="text-cyber-blue underline text-xs">
                        RETURN_TO_LOGIN
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cyber-black flex items-center justify-center">
            <p className="text-gray-500 font-mono text-sm animate-pulse">
                {">"} TERMINATING_SESSION...
            </p>
        </div>
    );
}
