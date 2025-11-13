import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .or(`username.eq.${username},email.eq.${email}`)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: "Username or email already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const { data: user, error: userError } = await supabase
            .from('users')
            .insert({
                username,
                email,
                password_hash: passwordHash
            })
            .select()
            .single();

        if (userError || !user) {
            console.error("Registration error:", userError);
            return NextResponse.json(
                { error: "Failed to create user" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                message: "User created successfully",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "An error occurred during registration" },
            { status: 500 }
        );
    }
}