import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

export const sql = neon(process.env.DATABASE_URL);

export interface User {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    created_at: string;
    updated_at: string;
}

export interface PasswordResetToken {
    id: string;
    user_id: string;
    token: string;
    expires_at: string;
    used: boolean;
    created_at: string;
}