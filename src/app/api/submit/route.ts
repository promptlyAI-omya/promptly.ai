import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Note: In a real serverless env (Vercel), writing to local FS does not persist.
// This is for "local runnable" requirement. Vercel users would need S3/Cloudinary.
// We will add a warning in README.

const schema = z.object({
    name: z.string().min(1),
    handle: z.string().optional(),
    email: z.string().email(),
    tool: z.string(),
    promptText: z.string().min(5),
    link: z.string().url().optional().or(z.literal('')),
    consent: z.string().transform(val => val === 'true'), // FormData comes as string
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

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
            // Handle local upload
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Ensure uploads directory
            const uploadDir = join(process.cwd(), 'public', 'uploads');
            await mkdir(uploadDir, { recursive: true });

            const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);
            assetPath = `/uploads/${filename}`;
        }

        const submission = await prisma.submission.create({
            data: {
                ...validatedData,
                assetPath,
                status: 'pending' // Default status
            }
        });

        return NextResponse.json({ message: 'Submission received', id: submission.id }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error or validation failed' }, { status: 500 });
    }
}
