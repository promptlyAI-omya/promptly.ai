'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/library?search=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-lg mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative flex items-center bg-black/80 backdrop-blur-xl border border-white/10 rounded-full p-2 pl-3 sm:pl-6 focus-within:border-white/20 transition-colors shadow-2xl">
                <Search className="w-5 h-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for prompts..."
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-500 text-base sm:text-lg min-w-0 overflow-hidden text-ellipsis"
                />
                <button
                    type="submit"
                    className="flex-shrink-0 p-2 sm:px-6 sm:py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                    <Search className="w-5 h-5 sm:hidden" />
                    <span className="hidden sm:inline">Search</span>
                </button>
            </div>
        </form>
    );
}
