'use client';
import useSWR from 'swr';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LibraryPage() {
    const [page, setPage] = useState(1);
    const [category, setCategory] = useState('All');
    const [search, setSearch] = useState('');

    // Debounce search in real app, basic here
    const { data, isLoading } = useSWR(
        `/api/prompts?page=${page}&limit=12&category=${category}&search=${search}`,
        fetcher
    );

    const categories = ['All', 'Midjourney', 'DALL-E 3', 'Stable Diffusion'];

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Prompt copied to clipboard!');
    };

    return (
        <div className="space-y-10">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold">Prompt Library</h1>
                <p className="text-gray-400">Discover inspiring prompts for your next creation.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search prompts..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg glass-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {categories.map(c => (
                        <button
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${category === c
                                    ? 'bg-white text-black font-medium'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading prompts...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.data?.map((prompt: any) => (
                        <div key={prompt.id} className="glass rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all group flex flex-col h-full">
                            {/* Image Placeholder or Actual Image */}
                            <div className="aspect-video bg-gray-800 relative overflow-hidden">
                                {prompt.imageUrl ? (
                                    <img src={prompt.imageUrl} alt={prompt.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">No Preview</div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                                    {prompt.category}
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-lg font-semibold mb-2">{prompt.title}</h3>
                                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{prompt.desc}</p>

                                <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                                    <Link href={`/prompt/${prompt.id}`} className="flex-1 text-center py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors">
                                        View Details
                                    </Link>
                                    <button
                                        onClick={() => handleCopy(prompt.fullPrompt)}
                                        className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                        aria-label="Copy prompt"
                                    >
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center gap-4 mt-8">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-4 py-2 rounded-lg glass disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="py-2 text-gray-400">Page {page}</span>
                <button
                    disabled={!data?.meta || page >= data.meta.totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 rounded-lg glass disabled:opacity-50"
                >
                    Next
                </button>
            </div>

        </div>
    );
}
