import { cn, stripHtml } from '@/lib/utils';
// ... (rest of imports)

// Inside the component map loop:
<p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
    {post.excerpt || stripHtml(post.content).substring(0, 100) + '...'}
</p>
import { format } from 'date-fns';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog - Promptly.ai',
    description: 'Insights, tutorials, and updates from the Promptly.ai team regarding AI prompts and engineering.',
};

export const revalidate = 60; // Revalidate every minute

export default async function BlogPage() {
    const posts = await prisma.blogPost.findMany({
        where: {
            status: 'PUBLISHED'
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            author: {
                select: {
                    name: true,
                    image: true
                }
            }
        }
    });

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                    Our Blog
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Insights, tutorials, and updates from the Promptly.ai team.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                        <article className="glass h-full rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all hover:translate-y-[-5px]">
                            <div className="aspect-video bg-gray-800 relative overflow-hidden">
                                {post.featuredImage ? (
                                    <img
                                        src={post.featuredImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-black text-gray-600">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col h-[calc(100%-56.25%)]">
                                <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                                    {post.title}
                                </h2>

                                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                                    {post.excerpt || stripHtml(post.content).substring(0, 100) + '...'}
                                </p>

                                <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <User size={14} />
                                        <span>{post.author.name || 'Admin'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                    No posts published yet. Check back soon!
                </div>
            )}
        </div>
    );
}
