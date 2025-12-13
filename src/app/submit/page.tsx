'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SubmitPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { register, handleSubmit, reset, setValue } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/submit');
        }
        if (session?.user) {
            setValue('name', session.user.name);
            setValue('email', session.user.email);
        }
    }, [status, session, setValue, router]);

    if (status === 'loading') return <div className="text-center mt-20">Loading...</div>;
    if (!session) return null;

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('handle', data.handle);
        formData.append('email', data.email);
        formData.append('tool', data.tool);
        formData.append('promptText', data.promptText);
        formData.append('link', data.link);
        formData.append('consent', 'true'); // Implicit consent by submitting
        if (file) {
            formData.append('file', file);
        }

        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                toast.success('Submission received! Awaiting moderation.');
                reset();
                setFile(null);
            } else {
                const err = await res.json();
                toast.error(err.error || 'Submission failed');
            }
        } catch (e) {
            toast.error('Network error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">Submit a Prompt</h1>
                <p className="text-gray-400">Share your best creations with the community.</p>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Name</label>
                            <input {...register('name', { required: true })} className="w-full glass-input px-4 py-2 rounded-lg" placeholder="Jane Doe" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Handle / Social</label>
                            <input {...register('handle')} className="w-full glass-input px-4 py-2 rounded-lg" placeholder="@janedoe" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Email (Private)</label>
                        <input type="email" {...register('email', { required: true })} className="w-full glass-input px-4 py-2 rounded-lg" placeholder="jane@example.com" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">AI Tool Used</label>
                        <select {...register('tool')} className="w-full glass-input px-4 py-2 rounded-lg text-white bg-black/50">
                            <option value="Midjourney">Midjourney</option>
                            <option value="DALL-E 3">DALL-E 3</option>
                            <option value="Stable Diffusion">Stable Diffusion</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Prompt Text</label>
                        <textarea {...register('promptText', { required: true })} rows={6} className="w-full glass-input px-4 py-2 rounded-lg" placeholder="A futuristic city..." />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Link to Result (Optional)</label>
                        <input type="url" {...register('link')} className="w-full glass-input px-4 py-2 rounded-lg" placeholder="https://..." />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Upload Image (Optional, Max 5MB)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Prompt'}
                        </button>
                        <p className="text-xs text-center text-gray-500 mt-4">
                            By submitting, you agree to allow Promptly.ai to display your prompt and image.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
