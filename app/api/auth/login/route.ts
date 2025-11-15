import {NextRequest, NextResponse} from "next/server";
import {sql} from "@/lib/db";
import {compare} from "bcryptjs";
import {error} from "@smithy/core/schema";

export async function POST(req: NextRequest) {
    try {
        const {username, password} = await req.json();

        if (!username || !password) {
            return NextResponse.json({error: "Missing credentials"}, {status: 400});
        }

        const rows = await sql`
            SELECT id, username, password_hash
            FROM users
            WHERE username = ${username} LIMIT 1;
        `;

        if (!rows.length) {
            return NextResponse.json({error: "Invalid username or password"}, {status: 401});
        }

        const user = rows[0];
        const valid = await compare(password, user.password_hash);

        if (!valid) {
            return NextResponse.json({error: "Invalid username or password"}, {status: 401});
        }

        // Issue a session token or store a flag in sessionStorage as you had
        return NextResponse.json({message: "Login ok", user: {id: user.id, username: user.username}});
    } catch (error) {
        console.error("Login error", error);
        return NextResponse.json({error: "Server error"}, {status: 500});
    }

}