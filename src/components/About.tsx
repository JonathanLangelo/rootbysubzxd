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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-cyber-black border border-cyber-green/30 p-6 sm:p-8 relative group">
                        {/* Decorative corner */}
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-green opacity-40"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-green opacity-40"></div>

                        <div className="text-left">
                            <h3 className="text-cyber-green font-mono text-sm mb-4 uppercase tracking-widest">{">"} SYSTEM_PROFILE</h3>
                            <p className="font-sans text-gray-300 leading-relaxed text-sm sm:text-base selection:bg-cyber-blue/30 selection:text-white">
                                I am Jonathan Immanuel Mazar Langelo, also known as SubzXD. I am a cybersecurity enthusiast with a strong
                                interest in learning and exploring system security. I enjoy solving CTF challenges, working on HackTheBox
                                machines, and continuously improving my skills through hands-on practice.
                            </p>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <h3 className="text-cyber-green font-mono text-sm uppercase tracking-widest text-left md:text-right">{">"} ACTIVE_MODULES</h3>
                            <div className="flex flex-wrap justify-start md:justify-end gap-2 sm:gap-3">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-mono bg-cyber-green/5 text-cyber-green border border-cyber-green/30 hover:bg-cyber-green/20 hover:border-cyber-green transition-all"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-cyber-green/5 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
