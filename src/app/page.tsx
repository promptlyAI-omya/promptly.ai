import Link from 'next/link';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import NewsletterForm from '@/components/NewsletterForm';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center space-y-20">

            {/* Hero Section */}
            <section className="w-full text-center space-y-8 pt-10 md:pt-20 px-4">
                <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300 mb-4 backdrop-blur-md">
                    ✨ Over 10,000+ Curated Prompts
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 max-w-4xl mx-auto">
                    Unlock the full potential of Generative AI
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    The ultimate library for Midjourney, DALL-E 3, and Stable Diffusion prompts.
                    Verified for quality.
                </p>

                <div className="pt-8 w-full">
                    <SearchBar />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 text-sm text-gray-500">
                    <span>Popular:</span>
                    <div className="flex gap-2 flex-wrap justify-center">
                        {['Portrait', 'Logo', 'Anime', 'Cyberpunk', '3D Icon'].map(tag => (
                            <Link key={tag} href={`/library?search=${tag}`} className="hover:text-white hover:underline transition-colors">
                                #{tag}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4">
                {[
                    { icon: Sparkles, title: "Curated Quality", desc: "Every prompt is tested and verified by our team." },
                    { icon: Search, title: "Easy Search", desc: "Find exactly what you need with powerful filters." },
                    { icon: ArrowRight, title: "Copy & Paste", desc: "One-click copy to clipboard for instant use." }
                ].map((feature, i) => (
                    <div key={i} className="glass p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <feature.icon className="w-10 h-10 text-white mb-4 opacity-80" />
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-400">{feature.desc}</p>
                    </div>
                ))}
            </section>

            {/* Newsletter Section */}
            <section className="w-full glass-card p-8 md:p-16 rounded-3xl text-center space-y-6 relative overflow-hidden mx-4">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
                <h2 className="text-3xl font-bold">Join the Community</h2>
                <p className="text-gray-400 max-w-lg mx-auto">
                    Get the latest trending prompts and AI tips delivered weekly. No spam, ever.
                </p>
                <NewsletterForm />
            </section>

        </div>
    );
}
