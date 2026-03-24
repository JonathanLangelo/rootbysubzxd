"use client";

import { useEffect, useState } from "react";
import { Award, ExternalLink, FileText, Image as ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Certification {
    id: string;
    title: string;
    issuer: string;
    date: string;
    description: string | null;
    fileUrl: string | null;
    thumbnail: string | null;
    verificationUrl: string | null;
}

export default function CertificationsSection() {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

    useEffect(() => {
        async function fetchCerts() {
            try {
                const res = await fetch("/api/admin/certifications");
                if (res.ok) {
                    const data = await res.json();
                    setCertifications(data);
                }
            } catch (error) {
                console.error("Failed to load certifications", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCerts();
    }, []);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (selectedCert) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => { document.body.style.overflow = "auto"; };
    }, [selectedCert]);

    if (isLoading) {
        return (
            <div className="p-8 border border-cyber-gray bg-cyber-black/20 animate-pulse text-center">
                <span className="font-mono text-sm text-cyber-blue">LOADING_CERTIFICATIONS...</span>
            </div>
        );
    }

    if (certifications.length === 0) {
        return null;
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certifications.map((cert) => (
                    <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 255, 255, 0.15)" }}
                        viewport={{ once: true }}
                        onClick={() => setSelectedCert(cert)}
                        className="group border border-cyber-gray/50 bg-cyber-black/40 transition-all cursor-pointer flex flex-col hover:border-cyber-blue/50"
                    >
                        {/* Thumbnail View */}
                        <div className="w-full aspect-[4/3] sm:aspect-video md:aspect-[4/3] bg-transparent flex items-center justify-center border-b border-cyber-gray/30 overflow-hidden relative p-4">
                            {cert.thumbnail ? (
                                <img
                                    src={cert.thumbnail}
                                    alt={cert.title}
                                    className="object-contain w-full h-full opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(0,255,255,0.4)] drop-shadow-md scale-100 group-hover:scale-105"
                                />
                            ) : cert.fileUrl && cert.fileUrl.endsWith('.pdf') ? (
                                <div className="flex flex-col items-center justify-center text-cyber-blue/50 group-hover:text-cyber-blue group-hover:scale-110 transition-all">
                                    <FileText size={40} className="mb-2" />
                                    <span className="font-mono text-[10px]">PDF_DOCUMENT</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-cyber-gray group-hover:text-cyber-blue/80 transition-all">
                                    <ImageIcon size={40} className="mb-2" />
                                    <span className="font-mono text-[10px]">NO_PREVIEW</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-cyber-blue/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>

                        {/* Text Content */}
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="font-mono text-lg font-bold text-white group-hover:text-cyber-green transition-colors mb-2">
                                {cert.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-gray-400 mb-3">
                                <span className="text-cyber-blue truncate max-w-[150px]">{cert.issuer}</span>
                                <span>//</span>
                                <span>{new Date(cert.date).toLocaleDateString()}</span>
                            </div>
                            {cert.description && (
                                <p className="text-xs font-sans text-muted-foreground line-clamp-2 mt-auto">
                                    {cert.description}
                                </p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox / Modal */}
            <AnimatePresence>
                {selectedCert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
                        onClick={() => setSelectedCert(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-cyber-black border border-cyber-blue/50 w-full max-w-5xl shadow-[0_0_30px_rgba(0,255,255,0.1)] flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-4 border-b border-cyber-gray/50 bg-cyber-black/90 shrink-0">
                                <div>
                                    <h3 className="font-mono font-bold text-white text-sm md:text-base uppercase">
                                        {selectedCert.title}
                                    </h3>
                                    <p className="font-mono text-[10px] text-cyber-blue mt-1">
                                        ISSUER: {selectedCert.issuer} // {new Date(selectedCert.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedCert(null)}
                                    className="text-gray-400 hover:text-red-500 hover:rotate-90 transition-all p-1"
                                    title="Close Preview"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Content / Preview Area */}
                            <div className="flex-grow w-full bg-black/50 overflow-hidden relative flex items-center justify-center p-0 md:p-2 min-h-[60vh] md:min-h-[75vh]">
                                {selectedCert.fileUrl ? (
                                    selectedCert.fileUrl.endsWith('.pdf') ? (
                                        <div className="absolute inset-0 w-full h-full p-2">
                                            <iframe
                                                src={`${selectedCert.fileUrl}#view=FitH`}
                                                className="w-full h-full border-0 rounded-sm"
                                                title="PDF Preview"
                                            />
                                        </div>
                                    ) : (
                                        <img
                                            src={selectedCert.fileUrl}
                                            alt={selectedCert.title}
                                            className="max-w-full max-h-[75vh] object-contain shadow-2xl"
                                        />
                                    )
                                ) : (
                                    <div className="text-center p-12 border border-cyber-gray/30 border-dashed rounded-sm">
                                        <FileText size={48} className="mx-auto text-gray-600 mb-4" />
                                        <p className="font-mono text-gray-500 text-xs uppercase tracking-wider">
                                            NO_DOCUMENT_AVAILABLE_FOR_PREVIEW
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer (Links & Description) */}
                            <div className="p-4 border-t border-cyber-gray/50 bg-cyber-black/90 shrink-0 flex flex-col md:flex-row gap-4 justify-between items-center">
                                <div className="flex-1">
                                    {selectedCert.description && (
                                        <p className="text-xs text-gray-400 font-sans max-w-2xl line-clamp-3 md:line-clamp-none">
                                            {selectedCert.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    {selectedCert.verificationUrl && (
                                        <a
                                            href={selectedCert.verificationUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 border border-cyber-green text-cyber-green font-mono text-[10px] hover:bg-cyber-green hover:text-black transition-colors uppercase font-bold tracking-wider"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink size={14} /> VERIFY_CREDENTIAL
                                        </a>
                                    )}
                                    {selectedCert.fileUrl && (
                                        <a
                                            href={selectedCert.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 border border-cyber-blue bg-cyber-blue/10 text-cyber-blue font-mono text-[10px] hover:bg-cyber-blue hover:text-black transition-colors uppercase font-bold tracking-wider"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink size={14} /> DOWNLOAD / OPEN
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
