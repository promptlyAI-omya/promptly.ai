import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        console.log('Register attempt:', { name, email }); // Log attempt

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
    } catch (error: any) {
        console.error('Registration Error:', error); // Log full error to Vercel logs
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
    }
}
