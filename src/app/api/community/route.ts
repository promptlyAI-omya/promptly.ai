import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    try {
        const [submissions, total] = await Promise.all([
            prisma.submission.findMany({
                where: { status: 'approved' },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.submission.count({ where: { status: 'approved' } }),
        ]);

        return NextResponse.json({
            data: submissions,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch community items' }, { status: 500 });
    }
}
