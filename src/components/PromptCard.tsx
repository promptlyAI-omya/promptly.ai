"use client";

import { motion } from "framer-motion";
import { Copy, Heart, Share2, Sparkles, Image as ImageIcon } from "lucide-react";
import ExecutionBreakdown from "./ExecutionBreakdown";
import ExpectationNote from "./ExpectationNote";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface PromptCardProps {
    id: string;
    title: string;
    description: string;
    promptText: string;
    tags?: string[]; // Assuming logic handles parsing
    imageUrl?: string;
    previewImage?: string;

    // New Execution Props
    showExecutionBreakdown?: boolean;
    aiPercentage?: number;
    manualSteps?: string[];
    aiTools?: string[];
    manualTools?: string[];
}

export default function PromptCard({
    id,
    title,
    description,
    promptText,
    tags = [],
    imageUrl,
    previewImage,
    showExecutionBreakdown = false,
    aiPercentage = 100,
    manualSteps = [],
    aiTools = [],
    manualTools = []
}: PromptCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(promptText);
        setCopied(true);
        toast.success("Prompt copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-md mx-auto bg-black border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all flex flex-col h-full">
            {/* 1. Header & Preview */}
            <div className="relative aspect-video bg-neutral-900 group overflow-hidden">
                {previewImage || imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={previewImage || imageUrl}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                        <ImageIcon size={48} />
                    </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute top-3 right-3 flex gap-2">
                    <button className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-white hover:text-black transition-colors">
                        <Heart size={16} />
                    </button>
                    <button className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-white hover:text-black transition-colors">
                        <Share2 size={16} />
                    </button>
                </div>

                {/* Category Chips */}
                {tags.length > 0 && (
                    <div className="absolute bottom-3 left-3 flex gap-1 flex-wrap">
                        {tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-medium uppercase tracking-wide border border-white/10">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* 2. Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1 leading-tight">{title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{description}</p>
                </div>

                {/* 3. Execution Breakdown (Conditionally Rendered) */}
                {showExecutionBreakdown && (
                    <div className="mb-4">
                        <ExecutionBreakdown
                            aiPercentage={aiPercentage}
                            manualSteps={manualSteps}
                            aiTools={aiTools}
                            manualTools={manualTools}
                        />
                        <ExpectationNote />
                    </div>
                )}

                {/* Spacer to push CTAs to bottom */}
                <div className="flex-grow" />

                {/* 4. CTA Zone */}
                <div className="mt-5 space-y-3">
                    <button
                        onClick={handleCopy}
                        className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                    >
                        {copied ? <Sparkles size={16} className="text-purple-600" /> : <Copy size={16} />}
                        {copied ? "Copied!" : "Copy Prompt"}
                    </button>

                    <Link
                        href="/services"
                        className="block w-full text-center py-2.5 rounded-xl border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Want this exact result? <span className="text-white underline decoration-purple-500/50 underline-offset-4">Hire Promptly.ai</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
