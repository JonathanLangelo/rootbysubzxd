"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCertification() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [title, setTitle] = useState("");
    const [issuer, setIssuer] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [verificationUrl, setVerificationUrl] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isThumbnail: boolean = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "certifications"); // Target specific directory

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Upload failed");
            } else {
                if (isThumbnail) {
                    setThumbnailUrl(data.url);
                } else {
                    setFileUrl(data.url);
                    // Automatically use image as thumbnail if no thumbnail has been set
                    if (file.type.startsWith("image/") && !thumbnailUrl) {
                        setThumbnailUrl(data.url);
                    }
                }
            }
        } catch (error) {
            alert("Upload failed: Network error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/admin/certifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify({
                    title,
                    issuer,
                    date,
                    description,
                    verificationUrl,
                    fileUrl,
                    thumbnailUrl,
                }),
            });

            if (res.ok) {
                router.push("/admin/certifications");
                router.refresh();
            } else {
                const data = await res.json();
                alert(`Error: ${data.error}`);
                setIsSubmitting(false);
            }
        } catch (error) {
            alert("Failed to submit");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full flex-col font-mono selection:bg-cyber-blue selection:text-black mt-6 md:mt-0 max-w-3xl mx-auto">
            <div className="mb-8 border-b border-cyber-gray pb-6 flex justify-between items-center">
                    <div>
                        <h1 className="font-mono text-2xl font-bold text-white uppercase tracking-tighter">
                            ADD_CERTIFICATION
                        </h1>
                        <p className="text-cyber-blue font-mono text-xs uppercase tracking-tighter mt-1 opacity-70">
                            {"> "} NEW_LEARNING_ACHIEVEMENT
                        </p>
                    </div>
                    <Link
                        href="/admin/certifications"
                        className="px-4 py-2 border border-cyber-gray text-gray-400 font-mono text-xs hover:text-white transition-all"
                    >
                        CANCEL
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-cyber-black/40 border border-cyber-gray p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-mono text-cyber-blue uppercase">TITLE *</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-cyber-black border border-cyber-gray text-white p-3 font-mono text-sm focus:border-cyber-blue focus:outline-none transition-colors"
                                placeholder="e.g. Certified Ethical Hacker"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-mono text-cyber-blue uppercase">ISSUER *</label>
                            <input
                                type="text"
                                required
                                value={issuer}
                                onChange={(e) => setIssuer(e.target.value)}
                                className="w-full bg-cyber-black border border-cyber-gray text-white p-3 font-mono text-sm focus:border-cyber-blue focus:outline-none transition-colors"
                                placeholder="e.g. EC-Council"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-mono text-cyber-blue uppercase">DATE *</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-cyber-black border border-cyber-gray text-white p-3 font-mono text-sm focus:border-cyber-blue focus:outline-none transition-colors style-scheme-dark"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-mono text-cyber-blue uppercase">VERIFICATION URL (Optional)</label>
                            <input
                                type="url"
                                value={verificationUrl}
                                onChange={(e) => setVerificationUrl(e.target.value)}
                                className="w-full bg-cyber-black border border-cyber-gray text-white p-3 font-mono text-sm focus:border-cyber-blue focus:outline-none transition-colors"
                                placeholder="https://credly.com/..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-mono text-cyber-blue uppercase">DESCRIPTION (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-cyber-black border border-cyber-gray text-white p-3 font-mono text-sm focus:border-cyber-blue focus:outline-none transition-colors resize-y"
                            placeholder="Brief description of the certification..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-mono text-cyber-blue uppercase">CERTIFICATE FILE (Optional PDF/PNG/JPG)</label>
                            <input
                                type="file"
                                accept=".pdf,image/png,image/jpeg,image/webp"
                                onChange={(e) => handleFileUpload(e, false)}
                                disabled={isUploading}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-cyber-blue/10 file:text-cyber-blue hover:file:bg-cyber-blue/20 transition-all font-mono border border-cyber-gray p-2 bg-cyber-black"
                            />
                            {isUploading && !thumbnailUrl && <p className="text-xs text-cyber-green font-mono mt-2 flex items-center gap-2"><span className="animate-pulse">●</span> UPLOADING...</p>}
                            {fileUrl && (
                                <p className="text-xs text-cyber-blue font-mono mt-2 truncate">
                                    UPLOAD_SUCCESS: {fileUrl.split('/').pop()}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-mono text-cyber-blue uppercase">THUMBNAIL (Auto-generated if image)</label>
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={(e) => handleFileUpload(e, true)}
                                disabled={isUploading}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-cyber-blue/10 file:text-cyber-blue hover:file:bg-cyber-blue/20 transition-all font-mono border border-cyber-gray p-2 bg-cyber-black"
                            />
                            {thumbnailUrl && (
                                <div className="mt-2">
                                    <img src={thumbnailUrl} alt="Thumbnail preview" className="h-16 w-auto border border-cyber-gray" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-cyber-gray/50">
                        <button
                            type="submit"
                            disabled={isSubmitting || isUploading}
                            className="w-full bg-cyber-blue text-black font-mono font-bold py-3 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "SAVING..." : "SAVE_CERTIFICATION"}
                        </button>
                    </div>
                </form>
            </div>
    );
}
