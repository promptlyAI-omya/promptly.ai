'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Video, Globe, Image, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const serviceDetails = {
    video_editing: {
        icon: Video,
        title: 'Video Editing',
        amount: 249,
        gradient: 'from-purple-500 to-pink-500',
    },
    photo_editing: {
        icon: Image,
        title: 'Photo Editing',
        amount: 99,
        gradient: 'from-orange-500 to-red-500',
    },
    website_frontend: {
        icon: Globe,
        title: 'Website Frontend',
        amount: 999,
        gradient: 'from-cyan-500 to-blue-500',
    },
    website_fullstack: {
        icon: Globe,
        title: 'Full Stack Website',
        amount: 3999,
        gradient: 'from-blue-500 to-indigo-500',
    },
};

type ServiceType = keyof typeof serviceDetails;

function RequestFormContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const serviceParam = searchParams.get('service') as ServiceType | null;

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        serviceType: serviceParam || 'website_frontend',
        websiteName: '',
        uiUxDetails: '',
        businessDetails: '',
        colorPalette: '',
        editDetails: '',
        contactEmail: session?.user?.email || '',
        contactPhone: '',
        transactionId: '',
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?redirect=/services');
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.email) {
            setFormData((prev) => ({ ...prev, contactEmail: session.user.email || '' }));
        }
    }, [session]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const selectedService = serviceDetails[formData.serviceType as ServiceType];
    const ServiceIcon = selectedService.icon;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        if (currentStep === 1 && !formData.serviceType) {
            toast.error('Please select a service');
            return;
        }
        setCurrentStep((prev) => Math.min(prev + 1, 4));
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.contactEmail || !formData.transactionId) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.serviceType === 'website_frontend' || formData.serviceType === 'website_fullstack') {
            if (!formData.websiteName || !formData.businessDetails) {
                toast.error('Please provide website name and business details');
                return;
            }
        }

        if (formData.serviceType === 'video_editing' || formData.serviceType === 'photo_editing') {
            if (!formData.editDetails) {
                toast.error('Please provide editing requirements');
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/services/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: selectedService.amount,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit request');
            }

            toast.success('Service request submitted successfully!');
            router.push('/services?success=true');
        } catch (error: any) {
            toast.error(error.message || 'Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${selectedService.gradient} flex items-center justify-center`}>
                        <ServiceIcon className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">{selectedService.title} Request</h1>
                    <p className="text-gray-400">Fill in the details to get started</p>
                </motion.div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        {['Service', 'Details', 'Contact', 'Payment'].map((step, index) => (
                            <div
                                key={step}
                                className={`text-sm font-medium ${index + 1 <= currentStep ? 'text-purple-400' : 'text-gray-600'
                                    }`}
                            >
                                {step}
                            </div>
                        ))}
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(currentStep / 4) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="glass-card rounded-2xl p-8">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Service Selection */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold mb-6">Select Service</h2>
                                    <div className="space-y-4">
                                        {Object.entries(serviceDetails).map(([key, service]) => {
                                            const Icon = service.icon;
                                            return (
                                                <label
                                                    key={key}
                                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.serviceType === key
                                                        ? 'border-purple-500 bg-purple-500/10'
                                                        : 'border-white/10 hover:border-white/20'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="serviceType"
                                                        value={key}
                                                        checked={formData.serviceType === key}
                                                        onChange={handleChange}
                                                        className="sr-only"
                                                    />
                                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.gradient} flex items-center justify-center flex-shrink-0`}>
                                                        <Icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold">{service.title}</div>
                                                        <div className="text-sm text-gray-400">₹{service.amount}</div>
                                                    </div>
                                                    {formData.serviceType === key && (
                                                        <CheckCircle className="w-6 h-6 text-purple-500" />
                                                    )}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Requirements */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold mb-6">Project Requirements</h2>

                                    {(formData.serviceType === 'website_frontend' || formData.serviceType === 'website_fullstack') && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Website Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="websiteName"
                                                    value={formData.websiteName}
                                                    onChange={handleChange}
                                                    className="glass-input w-full px-4 py-3 rounded-lg"
                                                    placeholder="e.g., MyAwesomeBusiness"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    UI/UX Preferences
                                                </label>
                                                <textarea
                                                    name="uiUxDetails"
                                                    value={formData.uiUxDetails}
                                                    onChange={handleChange}
                                                    className="glass-input w-full px-4 py-3 rounded-lg min-h-[100px]"
                                                    placeholder="Describe your design preferences, layout ideas, etc."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Business Details <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    name="businessDetails"
                                                    value={formData.businessDetails}
                                                    onChange={handleChange}
                                                    className="glass-input w-full px-4 py-3 rounded-lg min-h-[120px]"
                                                    placeholder="Tell us about your business, target audience, goals, etc."
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Color Palette (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    name="colorPalette"
                                                    value={formData.colorPalette}
                                                    onChange={handleChange}
                                                    className="glass-input w-full px-4 py-3 rounded-lg"
                                                    placeholder="e.g., Blue and White, Modern Dark Theme"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {(formData.serviceType === 'video_editing' || formData.serviceType === 'photo_editing') && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Editing Requirements <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="editDetails"
                                                value={formData.editDetails}
                                                onChange={handleChange}
                                                className="glass-input w-full px-4 py-3 rounded-lg min-h-[150px]"
                                                placeholder="Describe what you need edited, style preferences, specific requests, etc."
                                                required
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Step 3: Contact Info */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={formData.contactEmail}
                                            onChange={handleChange}
                                            className="glass-input w-full px-4 py-3 rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Phone Number (Optional)
                                        </label>
                                        <input
                                            type="tel"
                                            name="contactPhone"
                                            value={formData.contactPhone}
                                            onChange={handleChange}
                                            className="glass-input w-full px-4 py-3 rounded-lg"
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Payment */}
                            {currentStep === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold mb-6">Payment</h2>

                                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-gray-400">Total Amount:</span>
                                            <span className="text-3xl font-bold">₹{selectedService.amount}</span>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                                        <p className="text-sm text-yellow-200">
                                            <strong>Payment Instructions:</strong> Please make the payment via UPI and enter your transaction ID below.
                                            Our UPI ID: <span className="font-mono">promptly@upi</span>
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            UPI Transaction ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="transactionId"
                                            value={formData.transactionId}
                                            onChange={handleChange}
                                            className="glass-input w-full px-4 py-3 rounded-lg"
                                            placeholder="Enter your UPI transaction ID"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            We will verify your payment and start working on your request
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Previous
                                </button>
                            )}

                            {currentStep < 4 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r ${selectedService.gradient} text-white font-semibold hover:opacity-90 transition-opacity ${currentStep === 1 ? 'ml-auto' : ''
                                        }`}
                                >
                                    Next
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r ${selectedService.gradient} text-white font-semibold hover:opacity-90 transition-opacity ml-auto disabled:opacity-50`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Request
                                            <CheckCircle className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ServiceRequestPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
            }
        >
            <RequestFormContent />
        </Suspense>
    );
}
