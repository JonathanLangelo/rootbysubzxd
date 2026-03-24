"use client";

import { usePathname } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Do not show sidebar for login pages or logout handling page
    const noSidebarRoutes = ["/admin/login", "/admin/logout"];
    const isNoSidebarRoute = pathname && noSidebarRoutes.some(route => pathname.startsWith(route));

    if (isNoSidebarRoute) {
        return <>{children}</>;
    }

    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    );
}
