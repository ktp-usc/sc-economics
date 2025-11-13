import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

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

        // Check if user already exists
        const existingUsers = await sql`
            SELECT * FROM users 
            WHERE username = ${username} OR email = ${email}
            LIMIT 1
        `;

        if (existingUsers && existingUsers.length > 0) {
            return NextResponse.json(
                { error: "Username or email already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const newUser = await sql`
            INSERT INTO users (username, email, password_hash)
            VALUES (${username}, ${email}, ${passwordHash})
            RETURNING id, username, email, created_at
        `;

        if (!newUser || newUser.length === 0) {
            return NextResponse.json(
                { error: "Failed to create user" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                message: "User created successfully",
                user: {
                    id: newUser[0].id,
                    username: newUser[0].username,
                    email: newUser[0].email
                }
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error:", error);

        // Handle unique constraint violations
        if (error.code === '23505') {
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