"use client";

import { motion } from "framer-motion";

const skills = [
    "Cybersecurity Enthusiast",
    "CTF Player",
    "Web Exploitation (Learning)",
    "Privilege Escalation (Learning)",
];

export default function About() {
    return (
        <section className="py-20 border-t border-cyber-gray bg-cyber-black/20" id="about">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="font-mono text-3xl font-bold text-foreground mb-8">
                        <span className="text-cyber-green mr-2">{">"}</span>WHO_AM_I
                    </h2>

                    <div className="bg-cyber-black border border-cyber-green/30 p-8 relative group">
                        {/* Decorative corner */}
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-green opacity-40"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-green opacity-40"></div>

                        <p className="font-mono text-muted-foreground leading-relaxed mb-8">
                            I am Jonathan Immanuel Mazar Langelo, also known as SubzXD. I am a cybersecurity enthusiast with a strong
                            interest in learning and exploring system security. I enjoy solving CTF challenges, working on HackTheBox
                            machines, and continuously improving my skills through hands-on practice.
                        </p>

                        <div className="flex flex-wrap justify-center gap-3">
                            {skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1 text-xs font-mono bg-cyber-green/10 text-cyber-green border border-cyber-green/30 rounded-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>

                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-cyber-green/5 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
