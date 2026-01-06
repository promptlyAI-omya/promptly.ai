import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const blogUpdateSchema = z.object({
    title: z.string().min(1).optional(),
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
    content: z.string().min(1).optional(),
    excerpt: z.string().optional(),
    featuredImage: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role as string)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const post = await prisma.blogPost.findUnique({
            where: { id: params.id },
            include: { author: { select: { name: true } } }
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role as string)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const validatedData = blogUpdateSchema.parse(body);

        // Check availability if slug is being updated
        if (validatedData.slug) {
            const existing = await prisma.blogPost.findFirst({
                where: {
                    slug: validatedData.slug,
                    NOT: { id: params.id }
                }
            });
            if (existing) {
                return NextResponse.json({ error: 'Slug already taken' }, { status: 400 });
            }
        }

        const updateData: any = { ...validatedData };
        if (validatedData.status === 'PUBLISHED') {
            const current = await prisma.blogPost.findUnique({ where: { id: params.id } });
            if (!current?.publishedAt) {
                updateData.publishedAt = new Date();
            }
        }

        const post = await prisma.blogPost.update({
            where: { id: params.id },
            data: updateData
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        // Admin only for deletion
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await prisma.blogPost.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
