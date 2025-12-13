import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';

const schema = z.object({
    email: z.string().email(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = schema.parse(body);

        // Dedupe
        const existing = await prisma.newsletterSubscriber.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
        }

        await prisma.newsletterSubscriber.create({
            data: { email },
        });

        // Send confirmation (Optional but requested behavior)
        // Fire and forget to not block response
        sendEmail({
            to: email,
            subject: "Welcome to Promptly.ai Newsletter!",
            html: "<h1>Welcome!</h1><p>You have successfully subscribed to our newsletter.</p>"
        }).catch(console.error);

        return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
