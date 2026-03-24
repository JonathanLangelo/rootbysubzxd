import { Metadata } from "next";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
    title: "Admin",
};

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ClientLayout>{children}</ClientLayout>;
}
