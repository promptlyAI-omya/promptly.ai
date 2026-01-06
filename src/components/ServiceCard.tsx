"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";

interface ServiceProps {
    id: string;
    title: string;
    description: string;
    price: string;
    features?: string[];
    delay?: number;
}

export default function ServiceCard({
    id,
    title,
    description,
    price,
    features = [],
    delay = 0,
}: ServiceProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay * 0.1 }}
            className="group relative flex flex-col justify-between rounded-2xl bg-white/5 p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all hover:bg-white/10"
        >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10" />

            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-purple-200/80 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                        Starting from ${price}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                    {title}
                </h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {description}
                </p>

                {features.length > 0 && (
                    <ul className="mb-6 space-y-2">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-start text-sm text-gray-300">
                                <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <Link
                href={`/services/request?serviceId=${id}`}
                className="w-full mt-auto inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 rounded-xl transition-all group-hover:scale-[1.02]"
            >
                Request Service
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
        </motion.div>
    );
}
