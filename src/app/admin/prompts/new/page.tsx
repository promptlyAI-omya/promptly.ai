'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

type FormData = {
    title: string;
    desc: string;
    category: string;
    fullPrompt: string;
    tags: string;
    imageUrl?: string;
};

export default function NewPromptPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

    // Hardcoded Categories from submit page for consistency
    const categories = ['Midjourney', 'DALL-E 3', 'Stable Diffusion', 'GPT-4', 'Other'];

    const onSubmit = async (data: FormData) => {
        try {
            const res = await fetch('/api/admin/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || 'Failed to create prompt');
            }

            toast.success('Prompt added to Library successfully!');
            router.push('/library'); // Redirect to library to see it
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 max-w-4xl mx-auto">
            <Link href="/admin" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold mb-8">Add to Library</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Title</label>
                        <input
                            {...register('title', { required: 'Title is required' })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                            placeholder="e.g. Cyberpunk City"
                        />
                        {errors.title && <span className="text-red-400 text-sm">{errors.title.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Category / Tool</label>
                        <select
                            {...register('category', { required: 'Category is required' })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                        >
                            {categories.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Description</label>
                    <textarea
                        {...register('desc', { required: 'Description is required' })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 h-20"
                        placeholder="Short description for the card..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Full Prompt</label>
                    <textarea
                        {...register('fullPrompt', { required: 'Prompt text is required' })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 font-mono h-32"
                        placeholder="The actual prompt text..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Image URL</label>
                        <input
                            {...register('imageUrl')}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                            placeholder="https://..."
                        />
                        <p className="text-xs text-gray-500">Direct link to image.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Tags</label>
                        <input
                            {...register('tags')}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                            placeholder="comma, separated, tags"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? 'Saving...' : <><Save size={20} /> Add to Library</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
