import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { comparePassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        // Find user by username
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (userError || !user) {
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await comparePassword(password, user.password_hash);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 }
            );
        }

        // Return success (in production, you might want to create a JWT token here)
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