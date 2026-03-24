"use client";

import { motion } from "framer-motion";
import { Shield, Award, Terminal, Code } from "lucide-react";

const events = [
    {
        date: "Current",
        title: "Blue Team Fundamentals",
        description: "Exploring defensive strategies and SOC fundamentals.",
        icon: Shield,
        badge: "🔍 Exploring",
        color: "text-cyber-blue"
    },
    {
        date: "2026-03",
        title: "Web & PrivEsc Focus",
        description: "Learning Web Exploitation and Privilege Escalation.",
        icon: Terminal,
        badge: "🛠️ Learning",
        color: "text-cyber-green"
    },
    {
        date: "2026-02",
        title: "CTF Participation",
        description: "Participated in various CTF competitions.",
        icon: Award,
        badge: "🏆 Active",
        color: "text-cyber-pink"
    },
    {
        date: "2025-12",
        title: "HackTheBox",
        description: "Over 19+ machines solved to date.",
        icon: Shield,
        badge: "🔥 19+ Solved",
        color: "text-cyber-blue"
    }
];

export default function CompactTimeline() {
    return (
        <div className="space-y-4">
            {events.map((event, i) => (
                <motion.div
                    key={event.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start space-x-4 p-3 border border-cyber-gray/30 bg-cyber-black/40 hover:border-cyber-blue/30 transition-all group"
                >
                    <div className={`mt-1 p-2 bg-cyber-black border border-cyber-gray group-hover:border-cyber-blue/50 transition-colors ${event.color}`}>
                        <event.icon size={16} />
                    </div>
                    <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[10px] text-gray-500 uppercase">{event.date}</span>
                            <span className={`px-1.5 py-0.5 border text-[8px] font-mono uppercase tracking-tighter ${event.color === 'text-cyber-blue' ? 'border-cyber-blue/50 text-cyber-blue bg-cyber-blue/5' :
                                    event.color === 'text-cyber-green' ? 'border-cyber-green/50 text-cyber-green bg-cyber-green/5' :
                                        'border-cyber-pink/50 text-cyber-pink bg-cyber-pink/5'
                                }`}>
                                {event.badge}
                            </span>
                        </div>
                        <h4 className="font-mono text-xs font-bold text-white uppercase group-hover:text-cyber-blue transition-colors">
                            {event.title}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-sans mt-0.5 leading-tight">
                            {event.description}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
