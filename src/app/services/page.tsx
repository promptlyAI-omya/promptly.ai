"use client";

import { useState, useEffect } from "react";
import ServiceCard from "@/components/ServiceCard";
import { motion } from "framer-motion";
import { Loader2, Zap, Layout, Video } from "lucide-react";

// Fallback hardcoded services if API fails or is empty initially (for better UX)
const INITIAL_SERVICES = [
    {
        id: "video-editing-id", // In real app, this would be UUID from DB
        title: "AI Short-Form Video Editing",
        description: "Transform your raw footage into viral Reels & Shorts using our AI-driven workflow.",
        startingPrice: 49,
        features: ["Script to Video", "AI Captions & Effects", "Trend Analysis", "48h Delivery"],
        icon: Video
    },
    {
        id: "visual-design-id",
        title: "AI Visual Design",
        description: "Stunning thumbnails, posters, and ads generated & refined by expert designers.",
        startingPrice: 29,
        features: ["High CTR Thumbnails", "Brand Consistent", "Multiple Variations", "Source Files Included"],
        icon: Layout
    },
    {
        id: "website-creation-id",
        title: "AI Website Creation",
        description: "Lightning fast website builds for creators and small businesses.",
        startingPrice: 199,
        features: ["Next.js & Tailwind", "SEO Optimized", "Mobile Responsive", "Copywriting Included"],
        icon: Zap
    }
];

export default function ServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchServices() {
            try {
                const res = await fetch("/api/services");
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    // Map DB fields to UI fields if necessary, or just use data
                    // For now, let's merge with features which might not be in DB yet
                    const mapped = data.map(s => ({
                        ...s,
                        price: s.startingPrice,
                        features: ["AI-Powered Workflow", "Founder-Led Quality", "Fast Turnaround"] // Generic features if not in DB
                    }));
                    setServices(mapped);
                } else {
                    setServices(INITIAL_SERVICES.map(s => ({
                        id: s.id, // We'll need to handle IDs carefully if using request form
                        title: s.title,
                        description: s.description,
                        startingPrice: s.startingPrice,
                        features: s.features
                    })));
                }
            } catch (e) {
                console.error("Failed to fetch services", e);
                setServices(INITIAL_SERVICES.map(s => ({
                    ...s,
                    price: s.startingPrice
                })));
            } finally {
                setLoading(false);
            }
        }
        fetchServices();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black -z-10" />

            <main className="container mx-auto px-4 py-24">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">
                            Done-For-You{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                AI Services
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Founder-led execution. No templates. We combine human expertise with
                            advanced AI pipelines to deliver premium results at speed.
                        </p>

                        <button
                            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                        >
                            Request a Project
                        </button>
                    </motion.div>
                </div>

                {/* Services Grid */}
                <div id="services" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {loading ? (
                        <div className="col-span-3 flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                        </div>
                    ) : (
                        services.map((service, index) => (
                            <ServiceCard
                                key={service.id || index}
                                id={service.id || "manual-id"}
                                title={service.title}
                                description={service.description}
                                price={service.startingPrice || service.price}
                                features={service.features || ["Fast Delivery", "Premium Quality"]}
                                delay={index}
                            />
                        ))
                    )}
                </div>

                {/* Why Promptly Section */}
                <div className="rounded-3xl bg-neutral-900/50 border border-white/5 p-8 md:p-16 mb-32 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-900/10 to-transparent -z-10" />

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Prompty.ai?</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                                        <Zap className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Prompt-Driven Workflows</h3>
                                        <p className="text-gray-400">We don&apos;t just use tools; we build custom AI pipelines tailored to your specific needs.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
                                        <Layout className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Creator-First Mindset</h3>
                                        <p className="text-gray-400">Built by creators, for creators. We understand engagement, retention, and aesthetics.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-[300px] rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center backdrop-blur-3xl">
                            <p className="font-mono text-sm text-purple-300">
                                {`{ execution_mode: "expert_human_in_loop" }`}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
