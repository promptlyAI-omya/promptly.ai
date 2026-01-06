"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, Save, ArrowLeft, Image as ImageIcon, Eye, FileText, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import RichTextEditor from "./editor/RichTextEditor";

interface BlogPostData {
    id?: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    seoTitle?: string;
    seoDescription?: string;
}

interface BlogEditorProps {
    post?: BlogPostData;
    isEditing?: boolean;
}

export default function BlogEditor({ post, isEditing = false }: BlogEditorProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
    const [showSettings, setShowSettings] = useState(true);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BlogPostData>({
        defaultValues: post || {
            title: "",
            slug: "",
            content: "",
            status: "DRAFT",
        }
    });

    // Watch title to auto-generate slug if new
    const title = watch("title");
    useEffect(() => {
        if (!isEditing && title) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            setValue("slug", slug);
        }
    }, [title, isEditing, setValue]);

    const onSubmit = async (data: BlogPostData) => {
        setIsSaving(true);
        try {
            const url = isEditing ? `/api/admin/blog/${post?.id}` : "/api/admin/blog";
            const method = isEditing ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to save post");
            }

            const savedPost = await res.json();
            toast.success(isEditing ? "Post updated successfully" : "Post created successfully");

            if (!isEditing) {
                router.push(`/admin/blog/${savedPost.id}`);
            } else {
                router.refresh();
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const content = watch("content");

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between border-b border-gray-800 bg-gray-950 px-6 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="text-gray-400 hover:text-white">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-lg font-semibold text-white">
                        {isEditing ? "Edit Post" : "New Post"}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowSettings(!showSettings)}
                        className={cn(
                            "rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white",
                            showSettings && "bg-gray-800 text-white"
                        )}
                        title="Toggle Settings"
                    >
                        <SettingsIcon className="h-5 w-5" />
                    </button>
                    <div className="h-6 w-px bg-gray-800" />
                    <button
                        type="button"
                        onClick={() => setActiveTab("write")}
                        className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                            activeTab === "write" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
                        )}
                    >
                        <FileText className="h-4 w-4" />
                        Write
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("preview")}
                        className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                            activeTab === "preview" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
                        )}
                    >
                        <Eye className="h-4 w-4" />
                        Preview
                    </button>
                    <div className="h-6 w-px bg-gray-800" />
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isEditing ? "Update" : "Publish"}
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Editor Area */}
                <div className="flex-1 overflow-y-auto bg-gray-950 p-8">
                    <div className="mx-auto max-w-3xl space-y-6">
                        <div className="space-y-4">
                            <input
                                {...register("title", { required: "Title is required" })}
                                placeholder="Post Title"
                                className="w-full bg-transparent text-4xl font-bold tracking-tight text-white placeholder-gray-600 focus:outline-none"
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                        </div>

                        {activeTab === "write" ? (
                            <div className="min-h-[500px]">
                                <RichTextEditor
                                    content={content}
                                    onChange={(html) => setValue("content", html, { shouldDirty: true })}
                                />
                            </div>
                        ) : (
                            <div className="prose prose-invert prose-lg max-w-none border border-gray-800 rounded-lg p-6 bg-gray-950/50">
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Settings */}
                {showSettings && (
                    <div className="w-80 overflow-y-auto border-l border-gray-800 bg-gray-900/30 p-6">
                        <h3 className="mb-4 text-sm font-semibold text-white">Post Settings</h3>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400">Status</label>
                                <select
                                    {...register("status")}
                                    className="w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="DRAFT">Draft</option>
                                    <option value="PUBLISHED">Published</option>
                                    <option value="ARCHIVED">Archived</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400">URL Slug</label>
                                <input
                                    {...register("slug", { required: "Slug is required" })}
                                    className="w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                />
                                {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400">Excerpt</label>
                                <textarea
                                    {...register("excerpt")}
                                    rows={3}
                                    className="w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400">Featured Image URL</label>
                                <div className="flex gap-2">
                                    <input
                                        {...register("featuredImage")}
                                        placeholder="https://..."
                                        className="w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                    />
                                    {/* Placeholder for Image Upload Button - to be implemented */}
                                    <button type="button" className="rounded-md border border-gray-800 p-2 hover:bg-gray-800">
                                        <ImageIcon className="h-4 w-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-6">
                                <h3 className="mb-4 text-sm font-semibold text-white">SEO</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-400">SEO Title</label>
                                        <input
                                            {...register("seoTitle")}
                                            placeholder={title}
                                            className="w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-400">SEO Description</label>
                                        <textarea
                                            {...register("seoDescription")}
                                            rows={3}
                                            className="w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
}
