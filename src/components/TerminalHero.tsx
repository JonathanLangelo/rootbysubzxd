"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const lines = [
    "Initializing neural interface...",
    "Bypassing security protocols...",
    "Accessing encrypted database...",
    "Permission granted: ROOT_ACCESS",
    "Welcome, Operative SubzXD.",
];

export default function TerminalHero() {
    const [currentLine, setCurrentLine] = useState(0);
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        if (finished) return;

        const currentFullText = lines[currentLine];
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                setText(currentFullText.substring(0, text.length + 1));
                if (text === currentFullText) {
                    setIsDeleting(true);
                    setTimeout(() => { }, 1000); // Pause at end
                }
            } else {
                setText(currentFullText.substring(0, text.length - 1));
                if (text === "") {
                    setIsDeleting(false);
                    if (currentLine === lines.length - 1) {
                        setFinished(true);
                    } else {
                        setCurrentLine((prev) => prev + 1);
                    }
                }
            }
        }, isDeleting ? 30 : 50);

        return () => clearTimeout(timeout);
    }, [text, isDeleting, currentLine, finished]);

    if (finished) {
        return (
            <div className="font-mono text-xs md:text-sm text-cyber-green mb-4">
                <span className="opacity-50">{"> "}</span>
                WELCOME_OPERATIVE_SUBZXD // SESSION_ESTABLISHED
            </div>
        );
    }

    return (
        <div className="font-mono text-xs md:text-sm text-cyber-green mb-4 h-6">
            <span className="opacity-50">{"> "}</span>
            {text}
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-cyber-green ml-1 align-middle"
            />
        </div>
    );
}
