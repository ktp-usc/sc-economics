import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const items = await prisma.item.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
}

export async function POST(req: Request) {
    const data = await req.json();
    const item = await prisma.item.create({ data });
    return NextResponse.json(item, { status: 201 });
}

export async function DELETE(req: Request) {
    const data = await req.json();
    await prisma.item.delete({ where: { id: data } });
    return NextResponse.json({ success: true });
}