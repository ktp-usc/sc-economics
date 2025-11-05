import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export type Item = {
    name: string;
    type: string;
    description: string;
    price: number;
    capacity: number;
    available: number;
    imageUrl: string;
}


export async function createItem(item: Item) {
    const res = await fetch("/api/item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create item");
    return data.item ?? data;
}
