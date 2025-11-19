import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const purchases = await prisma.purchase.findMany({
        orderBy: { date: "desc" },
        include: {
            address: true, // <-- important if address is a related table
        },
    });
    console.log(purchases[0])
    return NextResponse.json(purchases);
}

export async function POST(req: Request) {
    const data = await req.json();
    const purchase = await prisma.purchase.create({ data });
    return NextResponse.json(purchase, { status: 201 });
}

export async function DELETE(req: Request) {
    const data = await req.json();
    await prisma.purchase.delete({ where: { id: data } });
    return NextResponse.json({ success: true });
}