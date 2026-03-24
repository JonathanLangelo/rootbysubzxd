import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const latestWriteups = await prisma.post.findMany({
    take: 3,
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      type: {
        not: 'PROJECT'
      },
      status: {
        not: 'DRAFT'
      }
    }
  });

  return (
    <main className="min-h-screen bg-cyber-black">
      <Navbar />
      <Hero />
      <About />

      {/* Recent Writeups Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-mono text-xl md:text-2xl font-bold text-white uppercase tracking-widest">
            <span className="text-cyber-blue mr-3">{">"}</span>RECENT_WRITEUPS
          </h2>
          <Link href="/writeups" className="text-cyber-blue font-mono text-xs md:text-sm hover:underline tracking-widest uppercase">
            VIEW_ALL_LOGS
          </Link>
        </div>

        {latestWriteups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestWriteups.map((writeup) => (
              <Link
                key={writeup.id}
                href={`/writeups/${writeup.slug}`}
                className="p-1 bg-gradient-to-br from-cyber-blue/20 to-transparent border border-cyber-gray group hover:border-cyber-blue/50 transition-all block"
              >
                <div className="bg-cyber-black p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono text-cyber-blue border border-cyber-blue/30 px-2 py-0.5 uppercase">
                      {writeup.platform}: {writeup.status === 'LOCKED' ? 'ACTIVE_MISSION' : writeup.status}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 uppercase">
                      {new Date(writeup.createdAt).toISOString().split('T')[0]}
                    </span>
                  </div>
                  <h3 className="font-mono text-lg font-bold text-white mb-3 group-hover:text-cyber-blue transition-colors uppercase leading-tight">
                    {writeup.title}
                  </h3>
                  <p className="text-gray-400 text-base leading-relaxed mb-6 line-clamp-2 flex-grow font-sans">
                    {writeup.type === 'WRITEUP' ? `Exploiting vulnerabilities in the ${writeup.title} machine.` : `Security analysis and insights regarding ${writeup.title}.`}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 border ${writeup.difficulty === 'Hard' ? 'bg-red-900/20 text-red-500 border-red-900/50' :
                      writeup.difficulty === 'Medium' ? 'bg-yellow-900/20 text-yellow-500 border-yellow-900/50' :
                        'bg-green-900/20 text-green-500 border-green-900/50'
                      } uppercase`}>
                      {writeup.difficulty}
                    </span>
                    {writeup.tags?.split(',').slice(0, 2).map((tag: string) => (
                      <span key={tag} className="text-[10px] font-mono bg-blue-900/20 text-blue-500 px-2 py-0.5 border border-blue-900/50 uppercase">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-cyber-gray/20 bg-cyber-black/20 rounded-lg">
            <p className="font-mono text-gray-600 uppercase tracking-[0.2em] text-xs">
              {">"} Archive Buffer Empty: Awaiting security briefings...
            </p>
            <p className="text-[10px] text-gray-700 font-mono mt-2 uppercase">
              Check back for upcoming writeups
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
