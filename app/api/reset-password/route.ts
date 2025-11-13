import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { generateResetToken } from "@/lib/auth";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        // Find user by email
        const users = await sql`
            SELECT * FROM users 
            WHERE email = ${email}
            LIMIT 1
        `;

        // Don't reveal if email exists (security best practice)
        if (!users || users.length === 0) {
            return NextResponse.json(
                { message: "If the email exists, a reset link has been sent." },
                { status: 200 }
            );
        }

        const user = users[0];

        // Generate reset token
        const resetToken = generateResetToken();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

        // Store token in database
        await sql`
            INSERT INTO password_reset_tokens (user_id, token, expires_at, used)
            VALUES (${user.id}, ${resetToken}, ${expiresAt.toISOString()}, false)
        `;

        // Send email
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            return NextResponse.json(
                { error: "Email service not configured" },
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reset-password/confirm?token=${resetToken}&email=${encodeURIComponent(email)}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request - SC Economics Admin",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>You requested to reset your password for the SC Economics Admin account.</p>
                    <p>Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" 
                           style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; font-weight: 500;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">Or copy and paste this link:</p>
                    <p style="word-break: break-all; color: #0070f3; font-size: 12px; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${resetLink}</p>
                    <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                        This link will expire in 24 hours. If you didn't request this, please ignore this email.
                    </p>
                </div>
            `,
        });

        return NextResponse.json(
            { message: "If the email exists, a reset link has been sent." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending reset email:", error);
        return NextResponse.json(
            { error: "Failed to send reset email" },
            { status: 500 }
        );
    }
}