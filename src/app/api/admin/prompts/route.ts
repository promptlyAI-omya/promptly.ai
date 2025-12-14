import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const promptSchema = z.object({
    title: z.string().min(1),
    desc: z.string().min(1),
    category: z.string().min(1),
    fullPrompt: z.string().min(1),
    tags: z.string().optional(),
    imageUrl: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const validatedData = promptSchema.parse(body);

        const prompt = await prisma.prompt.create({
            data: {
                ...validatedData,
                previewImage: validatedData.imageUrl, // Map imageUrl to previewImage as well if needed, or keep generic
                tags: validatedData.tags || '',
            }
        });

        return NextResponse.json(prompt, { status: 201 });

    } catch (error) {
        console.error('Error creating prompt:', error);
        return NextResponse.json({ error: 'Failed to create prompt' }, { status: 500 });
    }
}
