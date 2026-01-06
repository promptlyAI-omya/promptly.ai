import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const slug = params.slug;

        const post = await prisma.blogPost.findUnique({
            where: {
                slug: slug,
                // Prisma doesn't support filtering on findUnique directly if not part of unique constraint, 
                // but since slug is unique, we find it first then check status, OR use findFirst.
                // findUnique only accepts unique fields in where. 
                // So strictly speaking, doing `where: { slug, status }` works ONLY if there is a compound unique index.
                // There isn't one. So I must use findFirst or check status after fetch.
                // Let's use findFirst for safety or check after.
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

        if (!post || post.status !== 'PUBLISHED') {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);

    } catch (error) {
        console.error('Error fetching blog post:', error);
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}
