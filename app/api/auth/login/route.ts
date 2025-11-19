import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { comparePassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
        }

        // Find user by username using Prisma
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await comparePassword(password, user.passwordHash);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                message: "Login successful",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "An error occurred during login" },
            { status: 500 }
        );
    }
}