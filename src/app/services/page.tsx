'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ServicesPage() {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        // Show popup when component mounts
        setShowPopup(true);
    }, []);

    return (
        <>
            <div className="min-h-screen pt-24 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Placeholder content - will be developed later */}
                </div>
            </div>

            {/* Coming Soon Popup */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowPopup(false)}
                    >
                        {/* Blur Background */}
                        <motion.div
                            initial={{ backdropFilter: 'blur(0px)' }}
                            animate={{ backdropFilter: 'blur(12px)' }}
                            exit={{ backdropFilter: 'blur(0px)' }}
                            className="absolute inset-0 bg-black/60"
                        />

                        {/* Popup Card */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="relative glass-card rounded-3xl p-8 md:p-12 max-w-md w-full text-center overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Gradient Border Animation */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-20 animate-pulse" />

                            {/* Close Button */}
                            <button
                                onClick={() => setShowPopup(false)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>

                            {/* Content */}
                            <div className="relative z-10 space-y-6">
                                {/* Animated Icon */}
                                <motion.div
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="inline-block"
                                >
                                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center">
                                        <span className="text-4xl">🚀</span>
                                    </div>
                                </motion.div>

                                {/* Title */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
                                >
                                    Coming Soon
                                </motion.h2>

                                {/* Description */}
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-gray-400 text-lg"
                                >
                                    We're working hard to bring you amazing services. Stay tuned for updates!
                                </motion.p>

                                {/* Decorative Elements */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex justify-center gap-2 pt-4"
                                >
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                y: [0, -10, 0],
                                            }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                            }}
                                            className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                                        />
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
