'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import Link from 'next/link';

type FormData = {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    published: boolean;
};

export default function NewBlogPostPage() {
    const router = useRouter();
    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>();
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const titleValue = watch('title');

    // Auto-generate slug from title
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        setValue('slug', slug);
    };

    const onSubmit = async (data: FormData) => {
        try {
            const res = await fetch('/api/admin/blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || 'Failed to create post');
            }

            toast.success('Blog post created successfully!');
            router.push('/admin/blog');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create local preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);

        // NOTE: In a real app, you would upload to Cloudinary right here
        // and set the URL in the form.
        // For simplicity in this demo, we might just store the base64 or implement upload endpoint reuse.
        // Let's reuse our implementation pattern: usually we'd want a separate upload endpoint
        // but for now let's just assume we want user to input URL or we implement upload logic.
        // Wait, for this feature user asked for blog. Let's make it robust.
        // We will just basic URL input for now or Base64 if small.
        // Better: Let's let them input a URL for now to keep it simple, or paste a Cloudinary URL.
        // Actually, we can use the same pattern as submit page but that was form data.
        // Let's stick to URL input for cover image for iteration 1 to save complexity.
    };

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 max-w-4xl mx-auto">
            <Link href="/admin/blog" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Title</label>
                        <input
                            {...register('title', { required: 'Title is required' })}
                            onChange={(e) => {
                                register('title').onChange(e);
                                handleTitleChange(e);
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                            placeholder="Enter post title"
                        />
                        {errors.title && <span className="text-red-400 text-sm">{errors.title.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Slug</label>
                        <input
                            {...register('slug', { required: 'Slug is required' })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
                            placeholder="url-friendly-slug"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Cover Image URL</label>
                    <input
                        {...register('coverImage')}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                        placeholder="https://..."
                    />
                    <p className="text-xs text-gray-500">Paste a direct image link (e.g. from Cloudinary or Unsplash).</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Excerpt</label>
                    <textarea
                        {...register('excerpt')}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 h-20"
                        placeholder="Short summary for SEO and cards..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Content (Markdown)</label>
                    <textarea
                        {...register('content', { required: 'Content is required' })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 font-mono h-[500px]"
                        placeholder="# Heading\n\nWrite your content here..."
                    />
                    {errors.content && <span className="text-red-400 text-sm">{errors.content.message}</span>}
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            {...register('published')}
                            className="w-5 h-5 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-300 group-hover:text-white transition-colors">Publish immediately</span>
                    </label>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? 'Saving...' : <><Save size={20} /> Create Post</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
