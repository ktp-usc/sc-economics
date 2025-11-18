export async function createItem(item: {
    name: string;
    type: string;
    description: string;
    price: number;
    available: number;
    status: string;
    image: string
}) {
    const res = await fetch("/api/item", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(item),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create item");
    return data.item ?? data;
}

export async function deleteItem(id: string) {
    const res = await fetch(`/api/item`, {
        method: 'DELETE',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(id),
    });
    if (!res.ok) throw new Error('Failed to delete item');
    return res.json();
}

export async function editItem(item: {
    id: string;
    name: string;
    type: string;
    description: string;
    price: number;
    status: string;
    available: number;
    image: string
}) {
    const res = await fetch("/api/item", {
        method: "Put",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(item),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create item");
    return data.item ?? data;
}
