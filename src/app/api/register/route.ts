import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return new NextResponse(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
        }

        const exist = await prisma.user.findUnique({
            where: { email: email }
        });

        if (exist) {
            return new NextResponse(JSON.stringify({ error: 'Email already exists' }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
