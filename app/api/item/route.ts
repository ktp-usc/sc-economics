import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const items = await prisma.item.findMany();
    return NextResponse.json(todos);
}

export async function POST(req: Request) {
    const data = await req.json();
    const item = await prisma.item.create({ data });
    return NextResponse.json(item, { status: 201 });
}
