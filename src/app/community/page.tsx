'use client';
import useSWR from 'swr';
import { useState } from 'react';
import { Sparkles, User } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CommunityPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useSWR(`/api/community?page=${page}&limit=12`, fetcher);

    return (
        <div className="space-y-10">
            <div className="space-y-4 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold">Community Showcase</h1>
                <p className="text-gray-400">
                    Approved submissions from our talented community.
                    <br />
                    Want to see your work here? <a href="/submit" className="text-white hover:underline">Submit a prompt</a>.
                </p>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading community gallery...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.data?.map((item: any) => (
                        <div key={item.id} className="glass rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all flex flex-col">
                            {item.assetPath ? (
                                <div className="aspect-square bg-gray-800 relative overflow-hidden">
                                    <img src={item.assetPath} alt="Community Submission" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                item.link && (
                                    <div className="aspect-square bg-gray-800 flex items-center justify-center p-4 text-center">
                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-words max-w-full">
                                            External Image<br /><span className="text-xs text-gray-500 text-ellipsis overflow-hidden">{item.link}</span>
                                        </a>
                                    </div>
                                )
                            )}

                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                                    <User size={16} />
                                    <span>{item.name}</span>
                                    {item.handle && <span className="text-gray-600">({item.handle})</span>}
                                </div>

                                <div className="bg-black/30 p-3 rounded-lg text-xs text-gray-300 font-mono mb-4 flex-1 overflow-auto max-h-32">
                                    {item.promptText}
                                </div>

                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span className="flex items-center"><Sparkles size={12} className="mr-1" /> {item.tool}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {data?.data?.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl">
                            <p className="text-gray-400">No community submissions yet. Be the first!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
