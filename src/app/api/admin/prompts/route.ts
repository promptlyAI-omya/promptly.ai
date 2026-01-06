import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createPromptSchema = z.object({
    title: z.string().min(1),
    desc: z.string().min(1),
    category: z.string().min(1),
    fullPrompt: z.string().min(1),
    tags: z.string(), // comma separated
    imageUrl: z.string().optional(),

    // New Fields
    aiPercentage: z.number().min(0).max(100).optional(),
    manualSteps: z.array(z.string()).optional(),
    aiTools: z.array(z.string()).optional(),
    manualTools: z.array(z.string()).optional(),
    showExecutionBreakdown: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = createPromptSchema.parse(body);

        const prompt = await prisma.prompt.create({
            data: {
                title: validatedData.title,
                desc: validatedData.desc,
                category: validatedData.category,
                fullPrompt: validatedData.fullPrompt,
                tags: validatedData.tags,
                imageUrl: validatedData.imageUrl,
                previewImage: validatedData.imageUrl, // Map same for now

                aiPercentage: validatedData.aiPercentage ?? 0,
                manualSteps: validatedData.manualSteps ?? [],
                aiTools: validatedData.aiTools ?? [],
                manualTools: validatedData.manualTools ?? [],
                showExecutionBreakdown: validatedData.showExecutionBreakdown ?? false,
            },
        });

        return NextResponse.json(prompt, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json(
            { error: "Failed to create prompt" },
            { status: 500 }
        );
    }
}
