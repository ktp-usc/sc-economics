import {PurchaseStatus} from "@prisma/client";
import {DateTime} from "effect/DateTime";


export async function createPurchase(purchase: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    }
    customerId: string;
    itemName: string;
    amount: number;
    type: string;
    date: DateTime;
    status: PurchaseStatus;

}) {
    const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( purchase ),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create item");
    return data.item ?? data;
}