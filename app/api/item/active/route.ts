import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET(){
    const items = await prisma.item.findMany({
        where: { status: 'Active'},
        orderBy: { createdAt: 'desc'}
    })
    return NextResponse.json(items);
}