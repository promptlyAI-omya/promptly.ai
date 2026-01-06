'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import { ArrowLeft, Save, Plus, Trash } from 'lucide-react';
import Link from 'next/link';

type FormData = {
    title: string;
    desc: string;
    category: string;
    fullPrompt: string;
    tags: string;
    imageUrl?: string;

    // New Fields
    showExecutionBreakdown: boolean;
    aiPercentage: number;
    manualSteps: { value: string }[];
    aiTools: { value: string }[];
    manualTools: { value: string }[];
};

export default function NewPromptPage() {
    const router = useRouter();
    const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
        defaultValues: {
            showExecutionBreakdown: false,
            aiPercentage: 100,
            manualSteps: [],
            aiTools: [],
            manualTools: []
        }
    });

    const { fields: manualStepFields, append: appendStep, remove: removeStep } = useFieldArray({
        control,
        name: "manualSteps"
    });

    const { fields: aiToolFields, append: appendAiTool, remove: removeAiTool } = useFieldArray({
        control,
        name: "aiTools"
    });

    const { fields: manualToolFields, append: appendManualTool, remove: removeManualTool } = useFieldArray({
        control,
        name: "manualTools"
    });

    const categories = ['Midjourney', 'DALL-E 3', 'Stable Diffusion', 'GPT-4', 'Other'];
    const showBreakdown = watch('showExecutionBreakdown');
    const aiPercent = watch('aiPercentage');

    const onSubmit = async (data: FormData) => {
        try {
            // Transform array of objects back to string[]
            const payload = {
                ...data,
                manualSteps: data.manualSteps.map(s => s.value),
                aiTools: data.aiTools.map(t => t.value),
                manualTools: data.manualTools.map(t => t.value)
            };

            const res = await fetch('/api/admin/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || 'Failed to create prompt');
            }

            toast.success('Prompt added to Library successfully!');
            router.push('/library');
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-neutral-900/50 p-6 rounded-xl border border-white/10 space-y-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Title</label>
                            <input
                                {...register('title', { required: 'Title is required' })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                                placeholder="e.g. Cyberpunk City"
                            />
                            {errors.title && <span className="text-red-400 text-sm">{errors.title.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Category</label>
                            <select
                                {...register('category', { required: 'Category is required' })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                            >
                                {categories.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Description</label>
                        <textarea
                            {...register('desc', { required: 'Description is required' })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 h-20"
                            placeholder="Short description..."
                        />
                    </div>
                </div>

                {/* Prompt & Assets */}
                <div className="bg-neutral-900/50 p-6 rounded-xl border border-white/10 space-y-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">Prompt Content</h2>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Full Prompt</label>
                        <textarea
                            {...register('fullPrompt', { required: 'Prompt text is required' })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 font-mono h-32"
                            placeholder="The actual prompt text..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Image URL</label>
                            <input
                                {...register('imageUrl')}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Tags</label>
                            <input
                                {...register('tags')}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                                placeholder="comma, separated, tags"
                            />
                        </div>
                    </div>
                </div>

                {/* Execution Breakdown */}
                <div className="bg-neutral-900/50 p-6 rounded-xl border border-white/10 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-200">Execution Breakdown</h2>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="showBreakdown"
                                {...register('showExecutionBreakdown')}
                                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600"
                            />
                            <label htmlFor="showBreakdown" className="text-sm text-gray-300">Show on Card</label>
                        </div>
                    </div>

                    {showBreakdown && (
                        <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                            {/* AI Percentage */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex justify-between">
                                    <span>AI vs Manual Ratio</span>
                                    <span>{aiPercent}% AI / {100 - aiPercent}% Manual</span>
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    {...register('aiPercentage', { valueAsNumber: true })}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>

                            {/* Manual Steps */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Manual Steps</label>
                                {manualStepFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <input
                                            {...register(`manualSteps.${index}.value` as const)}
                                            placeholder="Step description..."
                                            className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                                        />
                                        <button type="button" onClick={() => removeStep(index)} className="p-2 text-red-500 hover:text-red-400">
                                            <Trash size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => appendStep({ value: "" })} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                    <Plus size={16} /> Add Step
                                </button>
                            </div>

                            {/* Tools Used */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">AI Tools</label>
                                    {aiToolFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2">
                                            <input
                                                {...register(`aiTools.${index}.value` as const)}
                                                placeholder="e.g. Midjourney"
                                                className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                                            />
                                            <button type="button" onClick={() => removeAiTool(index)} className="p-2 text-red-500 hover:text-red-400">
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => appendAiTool({ value: "" })} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                        <Plus size={16} /> Add AI Tool
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Manual Tools</label>
                                    {manualToolFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2">
                                            <input
                                                {...register(`manualTools.${index}.value` as const)}
                                                placeholder="e.g. Photoshop"
                                                className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                                            />
                                            <button type="button" onClick={() => removeManualTool(index)} className="p-2 text-red-500 hover:text-red-400">
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => appendManualTool({ value: "" })} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                        <Plus size={16} /> Add Manual Tool
                                    </button>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                <div className="pt-4 pb-20">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                    >
                        {isSubmitting ? 'Saving...' : <><Save size={20} /> Save Prompt</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
