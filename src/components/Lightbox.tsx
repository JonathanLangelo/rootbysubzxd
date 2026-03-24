"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

interface LightboxProps {
    src: string;
    alt?: string;
}

export default function Lightbox({ src, alt }: LightboxProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="my-8 group relative overflow-hidden border border-cyber-gray bg-cyber-black flex flex-col items-center">
            {/* Image Preview */}
            <div
                className="cursor-zoom-in relative w-full h-full flex justify-center"
                onClick={() => setIsOpen(true)}
            >
                <img
                    src={src}
                    alt={alt || "Evidence Image"}
                    className="max-h-[500px] w-auto transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-cyber-blue/0 group-hover:bg-cyber-blue/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-cyber-black/80 p-2 border border-cyber-blue text-cyber-blue flex items-center space-x-2 font-mono text-xs">
                        <ZoomIn className="w-4 h-4" />
                        <span>ENLARGE_EVIDENCE</span>
                    </div>
                </div>
            </div>

            {alt && (
                <div className="w-full p-3 border-t border-cyber-gray bg-cyber-black/80 font-mono text-[10px] text-gray-500 uppercase tracking-widest text-center">
                    [ IMG_REF: {alt} ]
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-md"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative max-w-7xl max-h-[90vh] z-10"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute -top-12 right-0 p-2 text-white hover:text-cyber-pink transition-colors font-mono text-sm flex items-center space-x-2"
                            >
                                <X className="w-5 h-5" />
                                <span>CLOSE_VIEW</span>
                            </button>

                            <img
                                src={src}
                                alt={alt || "Enlarged Evidence"}
                                className="w-full h-full object-contain border border-cyber-blue shadow-[0_0_30px_rgba(0,255,255,0.3)]"
                            />

                            {alt && (
                                <div className="absolute -bottom-10 left-0 text-white font-mono text-xs uppercase tracking-widest bg-cyber-black/50 px-4 py-1 border-l-2 border-cyber-blue">
                                    {alt}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
