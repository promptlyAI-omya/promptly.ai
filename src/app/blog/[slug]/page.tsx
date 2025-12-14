'use client';
import useSWR from 'swr';
import { notFound } from 'next/navigation';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const fetcher = (url: string) => fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
});

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const { data: post, error, isLoading } = useSWR(`/api/blog/${params.slug}`, fetcher);

    if (error) return notFound();
    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading post...</div>;

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 max-w-4xl mx-auto">
            <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Blog
            </Link>

            <article>
                <header className="mb-10 text-center">
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mb-6 font-mono">
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                            <Calendar size={14} />
                            {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                            <User size={14} />
                            {post.author.name}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-8 leading-tight">
                        {post.title}
                    </h1>

                    {post.coverImage && (
                        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                    )}
                </header>

                <div className="prose prose-invert prose-lg max-w-none prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-white prose-headings:to-gray-400 prose-a:text-blue-400 prose-img:rounded-xl">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.content}
                    </ReactMarkdown>
                </div>
            </article>
        </div>
    );
}
