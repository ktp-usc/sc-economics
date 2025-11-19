import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const itemId = body.itemId;

        if (!itemId) {
            return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
        }

        // Check if item exists and get current availability
        const item = await prisma.item.findUnique({
            where: { id: itemId },
            select: { available: true }
        });

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        // Only decrement if available > 0 to prevent negative values
        if (item.available > 0) {
            const updatedItem = await prisma.item.update({
                where: { id: itemId },
                data: {
                    available: {
                        decrement: 1
                    }
                },
                select: { id: true, available: true }
            });

            return NextResponse.json({ 
                success: true, 
                itemId: updatedItem.id, 
                newAvailable: updatedItem.available 
            });
        } else {
            // Item already at 0, return success but log warning
            console.warn(`Item ${itemId} already at 0 availability, skipping decrement`);
            return NextResponse.json({ 
                success: true, 
                itemId: itemId, 
                newAvailable: 0,
                warning: 'Item already at 0 availability' 
            });
        }
    } catch (error) {
        console.error('Error decrementing item availability:', error);
        return NextResponse.json(
            { error: 'Failed to decrement item availability' },
            { status: 500 }
        );
    }
}

