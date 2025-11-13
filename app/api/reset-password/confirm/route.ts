import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (userError || !user) {
            return NextResponse.json(
                { error: "Invalid reset token" },
                { status: 400 }
            );
        }

        // Find valid reset token
        const { data: resetToken, error: tokenError } = await supabase
            .from('password_reset_tokens')
            .select('*')
            .eq('token', token)
            .eq('user_id', user.id)
            .eq('used', false)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (tokenError || !resetToken) {
            return NextResponse.json(
                { error: "Invalid or expired reset token" },
                { status: 400 }
            );
        }

        // Hash new password
        const passwordHash = await hashPassword(newPassword);

        // Update user password
        const { error: updateError } = await supabase
            .from('users')
            .update({ password_hash: passwordHash })
            .eq('id', user.id);

        if (updateError) {
            return NextResponse.json(
                { error: "Failed to update password" },
                { status: 500 }
            );
        }

        // Mark token as used
        await supabase
            .from('password_reset_tokens')
            .update({ used: true })
            .eq('id', resetToken.id);

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