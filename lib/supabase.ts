import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions
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