'use client';
import useSWR from 'swr';
import Link from 'next/link';
import { Plus, Edit, Eye, Trash, FileText } from 'lucide-react';
import { format } from 'date-fns';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminBlogPage() {
    const { data, mutate, isLoading } = useSWR('/api/admin/blog', fetcher);

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
                <Link
                    href="/admin/blog/new"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus size={18} /> New Post
                </Link>
            </div>

            {isLoading ? (
                <div className="text-gray-400">Loading posts...</div>
            ) : (
                <div className="glass rounded-xl overflow-hidden border border-white/5">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="p-4 font-medium text-gray-300">Title</th>
                                <th className="p-4 font-medium text-gray-300">Status</th>
                                <th className="p-4 font-medium text-gray-300">Date</th>
                                <th className="p-4 font-medium text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data?.map((post: any) => (
                                <tr key={post.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-white">{post.title}</div>
                                        <div className="text-xs text-gray-500 font-mono">/{post.slug}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {post.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">
                                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                target="_blank"
                                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                                title="View"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <button
                                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                                                title="Delete (Coming Soon)"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {data?.data?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        No blog posts yet. Create your first one!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
