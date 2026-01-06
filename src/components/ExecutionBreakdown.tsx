"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle, PenTool, Cpu } from "lucide-react";

interface ExecutionBreakdownProps {
    aiPercentage: number;
    manualSteps: string[];
    aiTools: string[];
    manualTools: string[];
}

export default function ExecutionBreakdown({
    aiPercentage,
    manualSteps,
    aiTools,
    manualTools
}: ExecutionBreakdownProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const manualPercentage = 100 - aiPercentage;

    return (
        <div className="mt-4 p-4 rounded-xl bg-neutral-900/50 border border-white/5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-200">Execution Breakdown</h3>
                <span className="text-xs text-gray-500">How this was made</span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-4 rounded-full bg-gray-800 overflow-hidden mb-3 md:mb-4">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${aiPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                />
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${manualPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="absolute right-0 top-0 h-full bg-gradient-to-l from-orange-500 to-amber-500"
                />
            </div>

            {/* Stats */}
            <div className="flex justify-between text-xs mb-4 md:mb-5 font-mono">
                <div className="flex items-center text-blue-400">
                    <Cpu size={12} className="mr-1.5" />
                    <span className="font-bold mr-1">{aiPercentage}%</span> AI Generation
                </div>
                <div className="flex items-center text-orange-400">
                    <PenTool size={12} className="mr-1.5" />
                    <span className="font-bold mr-1">{manualPercentage}%</span> Manual Polish
                </div>
            </div>

            {/* Tools Section */}
            {(aiTools.length > 0 || manualTools.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {aiTools.map((tool, i) => (
                        <span key={`ai-${i}`} className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-300 uppercase tracking-wider">
                            {tool}
                        </span>
                    ))}
                    {manualTools.map((tool, i) => (
                        <span key={`man-${i}`} className="px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-300 uppercase tracking-wider">
                            {tool}
                        </span>
                    ))}
                </div>
            )}

            {/* Manual Steps Details */}
            {manualSteps.length > 0 && (
                <div className="border-t border-white/10 pt-3">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center text-xs text-gray-400 hover:text-white transition-colors w-full justify-between"
                    >
                        <span>{isExpanded ? "Hide" : "View"} Manual Steps</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    <motion.div
                        initial={false}
                        animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <ul className="space-y-2 mt-3 pl-1">
                            {manualSteps.map((step, idx) => (
                                <li key={idx} className="flex items-start text-sm text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 shrink-0" />
                                    <span className="leading-snug">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
