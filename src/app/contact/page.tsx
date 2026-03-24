import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MessageSquare, ShieldCheck, Terminal } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-cyber-black">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4 max-w-3xl">
                <div className="mb-12 border-l-4 border-cyber-pink pl-6">
                    <h1 className="font-mono text-4xl font-bold text-white mb-2">
                        ESTABLISH_COMM_LINK
                    </h1>
                    <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">
                        [ ENCRYPTION: RSA_4096_BIT // STATUS: LISTENING ]
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="border border-cyber-gray p-8 bg-cyber-gray/5 group hover:border-cyber-pink/50 transition-all">
                        <Mail className="w-10 h-10 text-cyber-pink mb-4 group-hover:glow-pink" />
                        <h3 className="font-mono text-lg font-bold text-white mb-2 underline decoration-cyber-pink/30">SECURE_EMAIL</h3>
                        <p className="text-gray-500 font-mono text-xs mb-4">PGP_KEY: 0x1337BEEF</p>
                        <a href="mailto:admin@subzxd.node" className="text-cyber-pink font-mono text-sm hover:underline">
                            admin@subzxd.node
                        </a>
                    </div>

                    <div className="border border-cyber-gray p-8 bg-cyber-gray/5 group hover:border-cyber-blue/50 transition-all">
                        <MessageSquare className="w-10 h-10 text-cyber-blue mb-4 transition-all" />
                        <h3 className="font-mono text-lg font-bold text-white mb-2 underline decoration-cyber-blue/30">MATRIX_SIGNAL</h3>
                        <p className="text-gray-500 font-mono text-xs mb-4">HANDLE: @antigravity:matrix.org</p>
                        <a href="#" className="text-cyber-blue font-mono text-sm hover:underline">
                            JOIN_CHANNEL
                        </a>
                    </div>
                </div>

                <div className="border border-cyber-gray p-8 bg-black relative">
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                        <ShieldCheck className="w-12 h-12 text-cyber-green" />
                    </div>

                    <h2 className="font-mono font-bold text-white mb-6 flex items-center">
                        <Terminal className="w-4 h-4 mr-2" /> SEND_ENCRYPTED_MESSAGE
                    </h2>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block font-mono text-[10px] text-gray-500 uppercase">Identity</label>
                                <input type="text" className="w-full bg-cyber-gray/20 border border-cyber-gray px-4 py-2 text-white font-mono text-sm outline-none focus:border-cyber-pink" placeholder="ANONYMOUS" />
                            </div>
                            <div className="space-y-2">
                                <label className="block font-mono text-[10px] text-gray-500 uppercase">Source_Endpoint</label>
                                <input type="email" className="w-full bg-cyber-gray/20 border border-cyber-gray px-4 py-2 text-white font-mono text-sm outline-none focus:border-cyber-pink" placeholder="USER@HOST.LOCAL" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block font-mono text-[10px] text-gray-500 uppercase">Payload_Body</label>
                            <textarea rows={4} className="w-full bg-cyber-gray/20 border border-cyber-gray px-4 py-2 text-white font-mono text-sm outline-none focus:border-cyber-pink resize-none" placeholder="---BEGIN PGP MESSAGE---"></textarea>
                        </div>

                        <button className="w-full py-4 bg-cyber-pink/10 border border-cyber-pink text-cyber-pink font-mono font-bold hover:bg-cyber-pink hover:text-black transition-all">
                            TRANSMIT_DATAPACKET
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </main>
    );
}
