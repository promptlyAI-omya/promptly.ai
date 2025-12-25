'use client';

import { motion } from 'framer-motion';
import { Video, Globe, Image, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const services = [
    {
        id: 'video_editing',
        icon: Video,
        title: 'Professional Video Editing',
        description: 'High-quality video editing services for content creators, businesses, and personal projects.',
        features: [
            'Color correction & grading',
            'Motion graphics & VFX',
            'Audio mixing & enhancement',
            'Custom transitions & effects',
        ],
        price: '₹249',
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        id: 'photo_editing',
        icon: Image,
        title: 'Premium Photo Editing',
        description: 'Professional photo retouching and enhancement for your personal or business needs.',
        features: [
            'Background removal & replacement',
            'Color correction & enhancement',
            'Portrait retouching',
            'Product photo editing',
        ],
        price: '₹99',
        gradient: 'from-orange-500 to-red-500',
    },
    {
        id: 'website_frontend',
        icon: Globe,
        title: 'Website Frontend Development',
        description: 'Beautiful, responsive frontend websites built with modern technologies.',
        features: [
            'Responsive UI/UX design',
            'Modern frontend development',
            'SEO optimization',
            'Mobile-friendly design',
        ],
        price: '₹999',
        gradient: 'from-cyan-500 to-blue-500',
    },
    {
        id: 'website_fullstack',
        icon: Globe,
        title: 'Full Stack Website Development',
        description: 'Complete web applications with frontend, backend, and database integration.',
        features: [
            'Responsive UI/UX design',
            'Frontend & backend development',
            'Database integration',
            'Deployment & hosting setup',
        ],
        price: '₹3,999',
        gradient: 'from-blue-500 to-indigo-500',
    },
];

export default function ServicesPage() {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                        Premium Creative Services
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Professional video editing, AI-powered website creation, and photo editing services
                        tailored for content creators and small businesses.
                    </p>
                </motion.div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="glass-card rounded-2xl p-8 hover:scale-105 transition-transform duration-300"
                            >
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-6`}>
                                    <Icon className="w-8 h-8 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                                <p className="text-gray-400 mb-6">{service.description}</p>

                                <ul className="space-y-3 mb-8">
                                    {service.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="border-t border-white/10 pt-6">
                                    <p className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                        {service.price}
                                    </p>
                                    <Link
                                        href={session ? `/services/request?service=${service.id}` : '/login?redirect=/services'}
                                        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r ${service.gradient} text-white font-semibold hover:opacity-90 transition-opacity`}
                                    >
                                        Get Started
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* How It Works Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="glass-card rounded-2xl p-8 md:p-12"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: '1', title: 'Choose Service', desc: 'Select the service that fits your needs' },
                            { step: '2', title: 'Fill Requirements', desc: 'Provide detailed information about your project' },
                            { step: '3', title: 'Make Payment', desc: 'Complete secure payment via UPI' },
                            { step: '4', title: 'Get Delivered', desc: 'Receive your professionally crafted output' },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h3 className="font-bold mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-12 text-center"
                >
                    <div className="flex flex-wrap justify-center gap-8 text-gray-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span>100% Satisfaction Guarantee</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span>Secure Payment</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span>On-Time Delivery</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
