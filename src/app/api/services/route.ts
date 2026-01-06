import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const createServiceSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    startingPrice: z.number().min(0, "Price must be positive"),
    isActive: z.boolean().optional(),
});

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(services);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch services" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is admin
        if (!session || session.user.role !== "ADMIN") { // Assuming role is accessible like this based on auth.ts
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = createServiceSchema.parse(body);

        const service = await prisma.service.create({
            data: {
                title: validatedData.title,
                description: validatedData.description,
                startingPrice: validatedData.startingPrice,
                isActive: validatedData.isActive ?? true,
            },
        });

        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json(
            { error: "Failed to create service" },
            { status: 500 }
        );
    }
}
