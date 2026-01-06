import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const updateStatusSchema = z.object({
    status: z.enum(["NEW", "IN_PROGRESS", "COMPLETED", "REJECTED"]),
});

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        const where = status ? { status } : {};

        const requests = await prisma.serviceRequest.findMany({
            where,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                service: {
                    select: {
                        title: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(requests);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch requests" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Validate status
        const validation = updateStatusSchema.safeParse({ status });
        if (!validation.success) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const updatedRequest = await prisma.serviceRequest.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(updatedRequest);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update request" },
            { status: 500 }
        );
    }
}
