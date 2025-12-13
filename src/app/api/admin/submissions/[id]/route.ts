import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    try {
        // If approved, create a formal Prompt entry (optional, depends on logic)
        // For now, we just update the status.

        const updated = await prisma.submission.update({
            where: { id },
            data: {
                status,
                moderatedBy: session.user.email,
                moderatedAt: new Date()
            }
        });

        if (status === 'approved') {
            await prisma.prompt.create({
                data: {
                    title: updated.name + "'s Prompt",
                    desc: "Community Submission",
                    category: updated.tool,
                    imageUrl: updated.assetPath,
                    fullPrompt: updated.promptText,
                    tags: "community",
                    previewImage: updated.assetPath
                }
            });
        }

        return NextResponse.json(updated);
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Internal Error' }), { status: 500 });
    }
}
