'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ContactPage() {
    const { register, handleSubmit, reset } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                toast.success('Message sent successfully!');
                reset();
            } else {
                toast.error('Failed to send message');
            }
        } catch {
            toast.error('Network error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-8 py-10">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">Contact Us</h1>
                <p className="text-gray-400">Questions? Feedback? Partnership inquiries?</p>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <input type="text" {...register('honeypot')} className="hidden" />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Name</label>
                        <input {...register('name', { required: true })} className="w-full glass-input px-4 py-2 rounded-lg" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Email</label>
                        <input type="email" {...register('email', { required: true })} className="w-full glass-input px-4 py-2 rounded-lg" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Message</label>
                        <textarea {...register('message', { required: true })} rows={6} className="w-full glass-input px-4 py-2 rounded-lg" />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
    );
}
