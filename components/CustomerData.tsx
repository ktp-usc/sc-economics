import {useEffect, useState} from "react";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "./ui/table";
import {Badge} from "./ui/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "./ui/card";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,} from "./ui/dialog";
import {Download, Eye, Search} from "lucide-react";
import {Separator} from "./ui/separator";

type customerPurchase = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    address: {
        id?: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    itemName: string;
    amount: number;
    type: "donation" | "workshop" | "event" | "merchandise";
    reason: string;
    date: string; // ISO or formatted date
    status: "completed" | "pending" | "refunded";
};

export function CustomerData() {
    const [purchases, setPurchases] = useState<customerPurchase[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPurchase, setSelectedPurchase] = useState<
        customerPurchase | null
    >(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        let mounted = true;

        async function fetchItems() {
            try {
                const res = await fetch("/api/purchase", {signal: controller.signal});
                if (!res.ok)
                    throw new Error(`Failed to fetch purchases: ${res.status}`);
                const data = await res.json();

                const mapped: customerPurchase[] = (data || []).map((it: customerPurchase) => ({
                    id: String(it.id),
                    firstName: String(it.firstName ?? ""),
                    lastName: String(it.lastName ?? ""),

                    // email
                    email: String(it.email ?? ""),

                    // address: ensure the nested address exists; provide safe defaults
                    address: {
                        id: it.address?.id ?? undefined,
                        street: String(it.address?.street ?? ""),
                        city: String(it.address?.city ?? ""),
                        state: String(it.address?.state ?? ""),
                        zipCode: String(it.address?.zipCode ?? ""),
                        country: String(it.address?.country ?? ""),
                    },

                    itemName: String(it.itemName ?? ""),
                    amount:
                        Number(it.amount ?? 0),
                    type: (it.type ?? "donation") as customerPurchase["type"],
                    reason: String(it.reason ?? ""),
                    date: it.date ? new Date(it.date).toLocaleDateString() : "",
                    status: (it.status ?? "pending") as customerPurchase["status"],
                }));

                if (mounted) setPurchases(mapped);
            } catch (err: unknown) {
                if (err instanceof Error && err.name === 'AbortError') return;
                console.error("Error fetching purchases", err);
            }
        }

        fetchItems();
        return () => {
            mounted = false;
            controller.abort();
        };
    }, []);

    const filteredPurchases = purchases.filter((purchase) => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return true;
        return (
            purchase.firstName.toLowerCase().includes(q) ||
            purchase.lastName.toLowerCase().includes(q) ||
            purchase.email.toLowerCase().includes(q) ||
            purchase.itemName.toLowerCase().includes(q) ||
            purchase.reason.toLowerCase().includes(q)
        );
    });

    const exportData = () => {
        // quick CSV export: header + rows
        const header = [
            "id",
            "firstName",
            "lastName",
            "email",
            "street",
            "city",
            "state",
            "zipCode",
            "country",
            "itemName",
            "amount",
            "type",
            "reason",
            "date",
            "status",
        ];
        const rows = filteredPurchases.map((p) =>
            [
                p.id,
                p.firstName,
                p.lastName,
                p.email,
                p.address.street,
                p.address.city,
                p.address.state,
                p.address.zipCode,
                p.address.country,
                p.itemName,
                p.amount.toFixed(2),
                p.type,
                p.reason,
                p.date,
                p.status,
            ]
                .map((v) =>
                    (v.includes(",") || v.includes('"'))
                        ? `"${String(v).replace(/"/g, '""')}"`
                        : String(v)
                )
                .join(",")
        );
        const csv = [header.join(","), ...rows].join("\n");

        // create a download link
        const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `purchases_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    function openDialogWithPurchase(p: customerPurchase) {
        setSelectedPurchase(p);
        setIsDialogOpen(true);
    }

    function closeDialog() {
        setIsDialogOpen(false);
        // small delay to avoid instant content unmount race (optional)
        setTimeout(() => setSelectedPurchase(null), 150);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Individual Purchase Records</CardTitle>
                    <CardDescription>
                        View detailed information about each individual purchase and customer
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    placeholder="Search by name, email, item, or reason..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Button onClick={exportData} variant="outline">
                            <Download className="h-4 w-4 mr-2"/>
                            Export
                        </Button>
                    </div>

                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Reason for Purchase</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredPurchases.map((purchase) => (
                                    <TableRow key={purchase.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {purchase.firstName} {purchase.lastName}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {purchase.address.city}, {purchase.address.state}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>{purchase.email}</TableCell>

                                        <TableCell>${purchase.amount.toFixed(2)}</TableCell>

                                        <TableCell className="font-medium">{purchase.reason}</TableCell>

                                        <TableCell>{purchase.date}</TableCell>

                                        <TableCell>
                                            <Badge
                                                variant={purchase.status === "completed" ? "default" : "secondary"}
                                            >
                                                {purchase.status}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            {/* we open our dialog manually so selectedPurchase is set synchronously */}
                                            <Dialog open={isDialogOpen} onOpenChange={(open) => !open && closeDialog()}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openDialogWithPurchase(purchase)}
                                                    >
                                                        <Eye className="h-4 w-4"/>
                                                    </Button>
                                                </DialogTrigger>

                                                <DialogContent className="sm:max-w-[600px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Purchase Details</DialogTitle>
                                                        <DialogDescription>
                                                            Complete information about this purchase and customer
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    {selectedPurchase ? (
                                                        <div className="space-y-6">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label className="text-sm font-medium">
                                                                        Purchase Information
                                                                    </Label>
                                                                    <div className="mt-1 space-y-1 text-sm">
                                                                        <div>
                                                                            <span
                                                                                className="font-medium">Amount:</span>{" "}
                                                                            ${selectedPurchase.amount.toFixed(2)}
                                                                        </div>
                                                                        <div>
                                                                            <span
                                                                                className="font-medium">Date:</span>{" "}
                                                                            {selectedPurchase.date}
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-medium">Status:</span>
                                                                            <Badge
                                                                                variant={
                                                                                    selectedPurchase.status === "completed"
                                                                                        ? "default"
                                                                                        : "secondary"
                                                                                }
                                                                                className="ml-2"
                                                                            >
                                                                                {selectedPurchase.status}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <Label className="text-sm font-medium">
                                                                        Customer Information
                                                                    </Label>
                                                                    <div className="mt-1 space-y-1 text-sm">
                                                                        <div>
                                                                            <span
                                                                                className="font-medium">Name:</span>{" "}
                                                                            {selectedPurchase.firstName} {selectedPurchase.lastName}
                                                                        </div>
                                                                        <div>
                                                                            <span
                                                                                className="font-medium">Email:</span>{" "}
                                                                            {selectedPurchase.email}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <Separator/>

                                                            <div>
                                                                <Label className="text-sm font-medium">Customer
                                                                    Address</Label>
                                                                <div className="mt-1 space-y-1 text-sm">
                                                                    <div>{selectedPurchase.address.street}</div>
                                                                    <div>
                                                                        {selectedPurchase.address.city}, {selectedPurchase.address.state}{" "}
                                                                        {selectedPurchase.address.zipCode}
                                                                    </div>
                                                                    <div>{selectedPurchase.address.country}</div>
                                                                </div>
                                                            </div>

                                                            <Separator/>

                                                            <div>
                                                                <Label className="text-sm font-medium">Item
                                                                    Purchased</Label>
                                                                <div className="mt-1 text-sm p-3 bg-muted rounded-md">
                                                                    {selectedPurchase.itemName} — {selectedPurchase.reason}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>Loading…</div>
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
