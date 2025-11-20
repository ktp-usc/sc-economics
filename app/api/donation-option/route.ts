import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const donationOptions = await prisma.donationOption.findMany({
        orderBy: { order: 'asc' },
    });
    return NextResponse.json(donationOptions);
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        
        // Delete all existing donation options
        await prisma.donationOption.deleteMany({});
        
        // Create new donation options
        const donationOptions = await prisma.donationOption.createMany({
            data: data.map((option: { name: string; amount: number; order: number }, index: number) => ({
                name: option.name,
                amount: option.amount,
                order: option.order !== undefined ? option.order : index,
            })),
        });
        
        // Fetch and return the created options
        const createdOptions = await prisma.donationOption.findMany({
            orderBy: { order: 'asc' },
        });
        
        return NextResponse.json(createdOptions, { status: 201 });
    } catch (error) {
        console.error('Error updating donation options:', error);
        return NextResponse.json({ error: 'Failed to update donation options' }, { status: 500 });
    }
}

