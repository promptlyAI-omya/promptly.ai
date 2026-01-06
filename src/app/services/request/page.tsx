"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

function RequestFormContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session, status } = useSession();

    const initialServiceId = searchParams.get("serviceId") || "";

    const [formData, setFormData] = useState({
        serviceId: initialServiceId,
        budget: "",
        deadline: "",
        requirements: "", // General description
        // Conditional fields
        websiteName: "",
        brandColors: "",
        niche: "",
        referenceLinks: ""
    });

    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState<any[]>([]);

    useEffect(() => {
        // Redirect if guest
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/services/request");
        }

        // Fetch services to populate dropdown
        fetch("/api/services").then(res => res.json()).then(data => {
            if (Array.isArray(data)) setServices(data);
        });
    }, [status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Pack specific fields into requirements object
        const requirementsObj = {
            description: formData.requirements,
            websiteName: formData.websiteName,
            brandColors: formData.brandColors,
            niche: formData.niche,
            referenceLinks: formData.referenceLinks
        };

        try {
            const res = await fetch("/api/services/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    serviceId: formData.serviceId,
                    budget: formData.budget,
                    deadline: formData.deadline,
                    requirements: JSON.stringify(requirementsObj)
                })
            });

            if (!res.ok) throw new Error("Failed to submit request");

            toast.success("Request submitted successfully!");
            router.push("/services/success"); // Create this or redirect to services
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") return <div className="min-h-screen flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-black text-white px-4 py-24">
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black -z-10" />

            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold mb-2">Request a Project</h1>
                    <p className="text-gray-400 mb-8">Tell us what you need, and we'll handle the rest.</p>

                    <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-md">

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Service Type</label>
                            <select
                                required
                                value={formData.serviceId}
                                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            >
                                <option value="" disabled>Select a service</option>
                                {services.length > 0 ? services.map(s => (
                                    <option key={s.id} value={s.id}>{s.title}</option>
                                )) : (
                                    // Fallback if no services from API, just to show UI works
                                    <>
                                        <option value="video-editing-id">AI Short-Form Video Editing</option>
                                        <option value="visual-design-id">AI Visual Design</option>
                                        <option value="website-creation-id">AI Website Creation</option>
                                    </>
                                )}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Budget Range</label>
                                <select
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                >
                                    <option value="">Select budget</option>
                                    <option value="<$100">&lt; $100</option>
                                    <option value="$100 - $500">$100 - $500</option>
                                    <option value="$500 - $1000">$500 - $1000</option>
                                    <option value="$1000+">$1000+</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Deadline</label>
                                <input
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Main Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Project Requirements</label>
                            <textarea
                                required
                                rows={5}
                                value={formData.requirements}
                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                placeholder="Describe your project in detail..."
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>

                        {/* Conditional Fields usually go here. For simplicity, showing them all as optional or grouped */}
                        <div className="pt-4 border-t border-white/10">
                            <h3 className="text-sm font-semibold text-gray-400 mb-4">Additional Details (Optional)</h3>

                            <div className="grid grid-cols-1 gap-4">
                                <input
                                    type="text"
                                    placeholder="Reference Links (Unlisted Youtube, Drive, etc.)"
                                    value={formData.referenceLinks}
                                    onChange={(e) => setFormData({ ...formData, referenceLinks: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Brand Colors / Style"
                                    value={formData.brandColors}
                                    onChange={(e) => setFormData({ ...formData, brandColors: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Submit Request"}
                        </button>

                    </form>
                </motion.div>
            </div>
        </div>
    );
}

export default function RequestPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>}>
            <RequestFormContent />
        </Suspense>
    );
}
