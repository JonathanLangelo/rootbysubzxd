import { Metadata } from "next";
import ToolsClient from "./ToolsClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "Tools | Coming Soon",
    description: "Cybersecurity toolkit and resources by SubzXD. Protocol update pending.",
};

export default function ToolsPage() {
    return (
        <main className="min-h-screen bg-cyber-black flex flex-col">
            <Navbar />
            <ToolsClient />
            <Footer />
        </main>
    );
}
