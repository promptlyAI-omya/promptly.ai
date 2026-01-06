import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Basic validation
        if (!body.serviceId || !body.requirements) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // specific validation for requirements being valid json if it's a string, or object
        let requirementsStr = "";
        if (typeof body.requirements === 'object') {
            requirementsStr = JSON.stringify(body.requirements);
        } else {
            requirementsStr = String(body.requirements);
        }

        const serviceRequest = await prisma.serviceRequest.create({
            data: {
                userId: session.user.id,
                serviceId: body.serviceId,
                budget: body.budget,
                deadline: body.deadline,
                requirements: requirementsStr,
                status: "NEW",
            },
        });

        return NextResponse.json(serviceRequest, { status: 201 });
    } catch (error) {
        console.error("Error creating service request:", error);
        return NextResponse.json(
            { error: "Failed to create service request" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const requests = await prisma.serviceRequest.findMany({
            where: { userId: session.user.id },
            include: {
                service: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, data: requests });
    } catch (error) {
        console.error("Error fetching requests:", error);
        return NextResponse.json(
            { error: "Failed to fetch requests" },
            { status: 500 }
        );
    }
}
