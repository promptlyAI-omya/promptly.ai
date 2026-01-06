"use client";

import { useEffect, useState } from "react";
import BlogEditor from "@/components/BlogEditor";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditBlogPage({ params }: { params: { id: string } }) {
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/admin/blog/${params.id}`);
                if (!res.ok) throw new Error("Failed to fetch post");
                const data = await res.json();
                setPost(data);
            } catch (error) {
                toast.error("Failed to load post");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (!post) {
        return <div className="p-8 text-center text-gray-500">Post not found</div>;
    }

    return <BlogEditor post={post} isEditing={true} />;
}
