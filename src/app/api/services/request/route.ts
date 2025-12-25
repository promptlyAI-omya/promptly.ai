import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const serviceRequestSchema = z.object({
    serviceType: z.enum(['video_editing', 'photo_editing', 'website_frontend', 'website_fullstack']),
    websiteName: z.string().optional(),
    uiUxDetails: z.string().optional(),
    businessDetails: z.string().optional(),
    colorPalette: z.string().optional(),
    editDetails: z.string().optional(),
    contactEmail: z.string().email(),
    contactPhone: z.string().optional(),
    transactionId: z.string().min(1, 'Transaction ID is required'),
    amount: z.number().positive(),
});

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized. Please log in.' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const validatedData = serviceRequestSchema.parse(body);

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Create service request
        const serviceRequest = await prisma.serviceRequest.create({
            data: {
                userId: user.id,
                serviceType: validatedData.serviceType,
                websiteName: validatedData.websiteName,
                uiUxDetails: validatedData.uiUxDetails,
                businessDetails: validatedData.businessDetails,
                colorPalette: validatedData.colorPalette,
                editDetails: validatedData.editDetails,
                contactEmail: validatedData.contactEmail,
                contactPhone: validatedData.contactPhone,
                transactionId: validatedData.transactionId,
                amount: validatedData.amount,
                paymentStatus: 'paid', // Assuming payment is made before submission
                status: 'pending',
            },
        });

        return NextResponse.json({
            success: true,
            data: serviceRequest,
            message: 'Service request submitted successfully!',
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error creating service request:', error);
        return NextResponse.json(
            { error: 'Failed to submit service request' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Get all service requests for the user
        const serviceRequests = await prisma.serviceRequest.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            success: true,
            data: serviceRequests,
        });
    } catch (error) {
        console.error('Error fetching service requests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch service requests' },
            { status: 500 }
        );
    }
}
