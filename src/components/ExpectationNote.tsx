"use client";

import { Info } from "lucide-react";

export default function ExpectationNote() {
    return (
        <div className="mt-3 flex gap-3 p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-400">
            <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
                <p className="font-semibold text-gray-300 mb-1">Results may vary</p>
                <p>Final output depends on AI model version, specific settings used, and optional manual refinement steps applied by the creator.</p>
            </div>
        </div>
    );
}
