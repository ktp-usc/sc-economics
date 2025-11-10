import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Search, Download, Eye } from 'lucide-react';
import { Separator } from './ui/separator';

type Purchase = {
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
    };
    itemName: string;
    amount: number;
    type: 'donation' | 'workshop' | 'event' | 'merchandise';
    reason: string;
    date: string;
    status: 'completed' | 'pending' | 'refunded';
};

const mockPurchases: Purchase[] = [
    {
        id: 'p1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        address: {
            street: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94105',
            country: 'USA'
        },
        itemName: 'Web Development Workshop',
        amount: 99.99,
        type: 'workshop',
        reason: 'Web Development Workshop',
        date: '2024-01-15',
        status: 'completed'
    },
    {
        id: 'p2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        address: {
            street: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94105',
            country: 'USA'
        },
        itemName: 'General Donation',
        amount: 50.00,
        type: 'donation',
        reason: 'General Donation',
        date: '2024-02-01',
        status: 'completed'
    },
    {
        id: 'p3',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@email.com',
        address: {
            street: '456 Oak Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
        },
        itemName: 'UX Design Masterclass',
        amount: 149.99,
        type: 'workshop',
        reason: 'UX Design Masterclass',
        date: '2024-01-20',
        status: 'completed'
    },
    {
        id: 'p4',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@email.com',
        address: {
            street: '456 Oak Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
        },
        itemName: 'Annual Conference Ticket',
        amount: 299.99,
        type: 'event',
        reason: 'Annual Conference Ticket',
        date: '2024-02-05',
        status: 'completed'
    },
    {
        id: 'p5',
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily.rodriguez@email.com',
        address: {
            street: '789 Pine St',
            city: 'Austin',
            state: 'TX',
            zipCode: '73301',
            country: 'USA'
        },
        itemName: 'Organization T-Shirt',
        amount: 25.00,
        type: 'merchandise',
        reason: 'Organization T-Shirt',
        date: '2024-01-25',
        status: 'completed'
    },
    {
        id: 'p6',
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily.rodriguez@email.com',
        address: {
            street: '789 Pine St',
            city: 'Austin',
            state: 'TX',
            zipCode: '73301',
            country: 'USA'
        },
        itemName: 'Champion Donation',
        amount: 100.00,
        type: 'donation',
        reason: 'Champion Donation',
        date: '2024-02-10',
        status: 'completed'
    },
    {
        id: 'p7',
        firstName: 'David',
        lastName: 'Kim',
        email: 'david.kim@email.com',
        address: {
            street: '321 Elm Dr',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101',
            country: 'USA'
        },
        itemName: 'Patron Donation',
        amount: 250.00,
        type: 'donation',
        reason: 'Patron Donation',
        date: '2024-02-15',
        status: 'completed'
    }
];

export function CustomerData() {
    const [purchases] = useState<Purchase[]>(mockPurchases);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

    const filteredPurchases = purchases.filter(purchase => {
        const matchesSearch = purchase.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            purchase.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            purchase.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            purchase.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            purchase.reason.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    const exportData = () => {
        // In a real app, this would generate a CSV or Excel file
        console.log('Exporting purchase data...', filteredPurchases);
        alert('Export functionality would be implemented here');
    };

    return (
        <div className="space-y-6">
            {/* Filters and Search */}
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
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email, item, or reason..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Button onClick={exportData} variant="outline">
                            <Download className="h-4 w-4 mr-2" />
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
                                            <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'}>
                                                {purchase.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedPurchase(purchase)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[600px]">
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Purchase Details
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Complete information about this purchase and customer
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    {selectedPurchase && (
                                                        <div className="space-y-6">
                                                            {/* Purchase Info */}
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label className="text-sm font-medium">Purchase Information</Label>
                                                                    <div className="mt-1 space-y-1 text-sm">
                                                                        <div><span className="font-medium">Amount:</span> ${selectedPurchase.amount.toFixed(2)}</div>
                                                                        <div><span className="font-medium">Date:</span> {selectedPurchase.date}</div>
                                                                        <div><span className="font-medium">Status:</span>
                                                                            <Badge variant={selectedPurchase.status === 'completed' ? 'default' : 'secondary'} className="ml-2">
                                                                                {selectedPurchase.status}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <Label className="text-sm font-medium">Customer Information</Label>
                                                                    <div className="mt-1 space-y-1 text-sm">
                                                                        <div><span className="font-medium">Name:</span> {selectedPurchase.firstName} {selectedPurchase.lastName}</div>
                                                                        <div><span className="font-medium">Email:</span> {selectedPurchase.email}</div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <Separator />

                                                            <div>
                                                                <Label className="text-sm font-medium">Customer Address</Label>
                                                                <div className="mt-1 space-y-1 text-sm">
                                                                    <div>{selectedPurchase.address.street}</div>
                                                                    <div>
                                                                        {selectedPurchase.address.city}, {selectedPurchase.address.state} {selectedPurchase.address.zipCode}
                                                                    </div>
                                                                    <div>{selectedPurchase.address.country}</div>
                                                                </div>
                                                            </div>

                                                            <Separator />

                                                            <div>
                                                                <Label className="text-sm font-medium">Item Purchased</Label>
                                                                <div className="mt-1 text-sm p-3 bg-muted rounded-md">
                                                                    {selectedPurchase.reason}
                                                                </div>
                                                            </div>
                                                        </div>
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