import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import {Prisma} from ".prisma/client";

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "Username, email, and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user using Prisma
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash,
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            {
                message: "User created successfully",
                user: newUser,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);

        // Handle unique constraint violations
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return NextResponse.json(
                { error: "Username or email already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "An error occurred during registration" },
            { status: 500 }
        );
    }
}