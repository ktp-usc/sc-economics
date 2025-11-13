import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const { token, email, newPassword } = await request.json();

        if (!token || !email || !newPassword) {
            return NextResponse.json(
                { error: "Token, email, and new password are required" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Find user by email
        const users = await sql`
            SELECT * FROM users 
            WHERE email = ${email}
            LIMIT 1
        `;

        if (!users || users.length === 0) {
            return NextResponse.json(
                { error: "Invalid reset token" },
                { status: 400 }
            );
        }

        const user = users[0];

        // Find valid reset token
        const tokens = await sql`
            SELECT * FROM password_reset_tokens 
            WHERE token = ${token}
            AND user_id = ${user.id}
            AND used = false
            AND expires_at > NOW()
            LIMIT 1
        `;

        if (!tokens || tokens.length === 0) {
            return NextResponse.json(
                { error: "Invalid or expired reset token" },
                { status: 400 }
            );
        }

        const resetToken = tokens[0];

        // Hash new password
        const passwordHash = await hashPassword(newPassword);

        // Update user password
        await sql`
            UPDATE users 
            SET password_hash = ${passwordHash}, updated_at = NOW()
            WHERE id = ${user.id}
        `;

        // Mark token as used
        await sql`
            UPDATE password_reset_tokens 
            SET used = true
            WHERE id = ${resetToken.id}
        `;

        return NextResponse.json(
            { message: "Password reset successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Password reset error:", error);
        return NextResponse.json(
            { error: "Failed to reset password" },
            { status: 500 }
        );
    }
}