'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

interface Submission {
    id: string;
    name: string;
    promptText: string;
    tool: string;
    status: string;
    createdAt: string;
}

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            toast.error('Unauthorized access');
            router.push('/');
        } else if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
            fetchSubmissions();
        }
    }, [status, session]);

    const fetchSubmissions = async () => {
        try {
            const res = await fetch('/api/admin/submissions');
            const data = await res.json();
            setSubmissions(data);
        } catch (error) {
            toast.error('Failed to load submissions');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'approved' | 'rejected') => {
        try {
            const res = await fetch(`/api/admin/submissions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: action })
            });
            if (res.ok) {
                toast.success(`Submission ${action}`);
                fetchSubmissions();
            } else {
                toast.error('Action failed');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    if (loading || status === 'loading') return <div className="text-center mt-20">Loading Dashboard...</div>;

    if (session?.user?.role !== 'ADMIN') return null;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <div className="flex gap-4">
                    <Link
                        href="/admin/prompts/new"
                        className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                    >
                        + Add to Library
                    </Link>
                    <Link
                        href="/admin/blog"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                    >
                        Manage Blog
                    </Link>
                </div>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/5">
                <h2 className="text-2xl font-bold mb-6">Pending Submissions</h2>

                {submissions.length === 0 ? (
                    <p className="text-gray-400">No pending submissions.</p>
                ) : (
                    <div className="space-y-4">
                        {submissions.map((sub) => (
                            <div key={sub.id} className="p-6 bg-white/5 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg">{sub.name} <span className="text-xs font-normal text-gray-400 bg-white/10 px-2 py-1 rounded ml-2">{sub.tool}</span></h3>
                                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{sub.promptText}</p>
                                    <p className="text-xs text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2 items-start min-w-[200px] justify-end">
                                    <button
                                        onClick={() => handleAction(sub.id, 'approved')}
                                        className="px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-sm font-bold transition"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(sub.id, 'rejected')}
                                        className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm font-bold transition"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
