import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { uploadImage } from '@/lib/cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const schema = z.object({
    name: z.string().min(1),
    handle: z.string().optional(),
    email: z.string().email(),
    tool: z.string(),
    promptText: z.string().min(5),
    link: z.string().url().optional().or(z.literal('')),
    consent: z.string().transform(val => val === 'true'),
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const session = await getServerSession(authOptions);

        // Extract fields
        const validatedData = schema.parse({
            name: formData.get('name'),
            handle: formData.get('handle'),
            email: formData.get('email'),
            tool: formData.get('tool'),
            promptText: formData.get('promptText'),
            link: formData.get('link'),
            consent: formData.get('consent'),
        });

        const file = formData.get('file') as File | null;
        let assetPath = null;

        if (file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const base64 = buffer.toString('base64');
                const dataURI = `data:${file.type};base64,${base64}`;

                const uploadResult = await uploadImage(dataURI, 'prompty-ai-submissions');
                assetPath = uploadResult.secure_url;
            } catch (uploadError) {
                console.error('Image Upload Failed:', uploadError);
                // Return 500 but detail it
                throw new Error('Image upload failed');
            }
        }

        const submission = await prisma.submission.create({
            data: {
                ...validatedData,
                assetPath,
                status: 'pending',
                userId: session?.user?.id
            }
        });

        return NextResponse.json({ message: 'Submission received', id: submission.id }, { status: 201 });

    } catch (error: any) {
        console.error('Submit API Error:', error);
        return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
    }
}
