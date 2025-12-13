import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';

const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    message: z.string().min(10),
    honeypot: z.string().optional(), // Anti-spam
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, message, honeypot } = schema.parse(body);

        if (honeypot) {
            // Silently fail for bots
            return NextResponse.json({ message: 'Message received' });
        }

        await prisma.contactMessage.create({
            data: { name, email, message },
        });

        // Send Admin Notification
        // If ADMIN_EMAIL was env var we'd use it, otherwise send to self or just log
        await sendEmail({
            to: "admin@promptly.ai", // Caught by Ethereal
            subject: `New Contact Message from ${name}`,
            html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`
        });

        return NextResponse.json({ message: 'Message received' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
