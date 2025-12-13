import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (category && category !== 'All') {
        whereClause.category = category;
    }
    if (search) {
        whereClause.OR = [
            { title: { contains: search } }, // SQLite contains is case-sensitive usually? Prisma handles it better differently
            { tags: { contains: search } },
            { fullPrompt: { contains: search } }
        ];
    }

    try {
        const [prompts, total] = await Promise.all([
            prisma.prompt.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.prompt.count({ where: whereClause }),
        ]);

        return NextResponse.json({
            data: prompts,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 });
    }
}
