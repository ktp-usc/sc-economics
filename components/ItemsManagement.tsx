'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, Upload, X } from 'lucide-react';
import { createItem, deleteItem, editItem } from '@/lib/item';
import { Item, PurchaseType, Status } from '@prisma/client';

type ListedItem = {
    id: string;
    name: string;
    type: PurchaseType;
    description: string;
    price: number;
    available: number;
    status: 'Active' | 'Inactive';
    createdAt: string;
    image?: string;
};

export function ItemsManagement() {
    const [items, setItems] = useState<ListedItem[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ListedItem | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        type: 'workshop' as ListedItem['type'],
        description: '',
        price: '',
        available: '',
        status: 'Active' as ListedItem['status'],
        image: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let mounted = true;
        async function fetchItems() {
            try {
                const res = await fetch('/api/item');
                if (!res.ok) throw new Error(`Failed to fetch items: ${res.status}`);
                const data = await res.json();

                const mapped: ListedItem[] = (data || []).map((it: any) => ({
                    id: String(it.id),
                    name: String(it.name ?? ''),
                    type: it.type as PurchaseType,
                    description: String(it.description ?? ''),
                    price: typeof it.price === 'string' ? parseFloat(it.price) : Number(it.price ?? 0),
                    available: Number(it.available ?? 0),
                    status: it.status === 'Active' ? 'Active' : 'Inactive',
                    createdAt: it.createdAt ? new Date(it.createdAt).toISOString().split('T')[0] : '',
                    image: it.image ?? undefined
                }));

                if (mounted) setItems(mapped);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Error fetching items', err);
            }
        }

        fetchItems();
        return () => { mounted = false; };
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'workshop',
            description: '',
            price: '',
            available: '',
            status: 'Active',
            image: ''
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (editFileInputRef.current) editFileInputRef.current.value = '';
    };

    const openAddDialog = () => {
        resetForm();
        setEditingItem(null);
        setIsAddDialogOpen(true);
    };

    const openEditDialog = (item: ListedItem) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            type: item.type,
            description: item.description,
            price: item.price.toString(),
            available: item.available.toString(),
            status: item.status,
            image: item.image ?? ''
        });
        setIsEditDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent, isEdit = false) => {
        e.preventDefault();

        // basic validation & normalization
        const price = parseFloat(formData.price || '0');
        const available = parseInt(formData.available || '0', 10);

        if (!formData.name.trim()) {
            alert('Name is required');
            return;
        }

        if (Number.isNaN(price) || price < 0) {
            alert('Enter a valid non-negative price');
            return;
        }

        if (Number.isNaN(available) || available < 0) {
            alert('Enter a valid non-negative availability');
            return;
        }

        if (isEdit && editingItem) {
            // prepare payload to send to API (adjust to your API shape)
            const payload = {
                id: editingItem.id,
                name: formData.name.trim(),
                type: formData.type,
                description: formData.description.trim(),
                status: formData.status,
                price,
                available,
                image: formData.image ?? ''
            };

            try {
                const updated = await editItem(payload); // assume API returns the updated item
                // map returned or fallback to local updated object
                const updatedItem: ListedItem = {
                    id: String(updated?.id ?? editingItem.id),
                    name: updated?.name ?? payload.name,
                    type: updated?.type ?? payload.type,
                    description: updated?.description ?? payload.description,
                    price: typeof updated?.price === 'string' ? parseFloat(updated.price) : (updated?.price ?? payload.price),
                    available: updated?.available ?? payload.available,
                    status: editingItem.status,
                    createdAt: editingItem.createdAt,
                    image: updated?.image ?? payload.image
                };

                setItems(prev => prev.map(it => it.id === editingItem.id ? updatedItem : it));
            } catch (err) {
                console.error('Failed to edit item', err);
                // Optimistic update already handled above? we chose to wait for API response.
                alert('Failed to update item.');
                return;
            }

            // close & reset
            setIsEditDialogOpen(false);
            setEditingItem(null);
            resetForm();
        } else {
            // create new item
            const payload: Partial<Item> = {
                name: formData.name.trim(),
                type: formData.type,
                description: formData.description.trim(),
                status: formData.status,
                price,
                available,
                image: formData.image ?? ''
            };

            try {
                const created = await createItem(payload as Item); // your createItem likely returns created object including id/createdAt
                // map response (fallback to local)
                const newItem: ListedItem = {
                    id: String(created?.id ?? Date.now().toString()),
                    name: created?.name ?? payload.name ?? '',
                    type: created?.type ?? (payload.type as PurchaseType),
                    description: created?.description ?? payload.description ?? '',
                    price: typeof created?.price === 'string' ? parseFloat(created.price) : (created?.price ?? payload.price ?? 0),
                    available: created?.available ?? (payload.available ?? 0),
                    status: created.status??(payload.status as Status)??'Active',
                    createdAt: created?.createdAt ? new Date(created.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    image: created?.image ?? payload.image ?? ''
                };

                setItems(prev => [...prev, newItem]);
            } catch (err) {
                console.error('Failed to create item', err);
                alert('Failed to create item.');
                return;
            }

            setIsAddDialogOpen(false);
            resetForm();
        }
    };

    const handleDelete = async (id: string) => {
        // optional: confirm already handled by AlertDialog
        // Optimistically remove from UI then call API
        const old = items;
        setItems(prev => prev.filter(i => i.id !== id));
        try {
            await deleteItem(id);
        } catch (err) {
            console.error('Failed to delete item', err);
            alert('Failed to delete item. Reverting.');
            setItems(old);
        }
    };

    const getTypeColor = (type: ListedItem['type']) => {
        switch (type) {
            case 'workshop': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'event': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'merchandise': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageData = event.target?.result as string;
            setFormData(prev => ({ ...prev, image: imageData }));
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (editFileInputRef.current) editFileInputRef.current.value = '';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3>Current Items</h3>
                    <p className="text-muted-foreground">Manage your available items for purchase</p>
                </div>

                {/* Add dialog */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openAddDialog}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add New Item</DialogTitle>
                            <DialogDescription>Create a new item for purchase. Fill in all the required information.</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Item Name</Label>
                                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Web Development Workshop" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select value={formData.type} onValueChange={(value: ListedItem['type']) => setFormData({ ...formData, type: value })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="workshop">Workshop</SelectItem>
                                            <SelectItem value="event">Event</SelectItem>
                                            <SelectItem value="merchandise">Merchandise</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe what this item includes..." required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Item Image (optional)</Label>
                                <div className="space-y-3">
                                    {formData.image ? (
                                        <div className="relative inline-block">
                                            <img src={formData.image} alt="Preview" className="w-32 h-32 rounded-md object-cover border" />
                                            <Button type="button" variant="destructive" size="sm" className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0" onClick={removeImage}>
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="w-32 h-32 rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                                            <div className="text-center">
                                                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                                <p className="text-sm text-muted-foreground">No image</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <Input ref={fileInputRef} id="image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                            <Upload className="h-4 w-4 mr-2" />
                                            {formData.image ? 'Change Image' : 'Upload Image'}
                                        </Button>
                                        {formData.image && (
                                            <Button type="button" variant="outline" onClick={removeImage}><X className="h-4 w-4 mr-2" />Remove</Button>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">Supports JPG, PNG, GIF up to 5MB</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="99.99" required />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="available">Available</Label>
                                    <Input id="available" type="number" value={formData.available} onChange={(e) => setFormData({ ...formData, available: e.target.value })} placeholder="15" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={(value: ListedItem['status']) => setFormData({ ...formData, status: value })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Create Item</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Available</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                                                <Upload className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <div>{item.name}</div>
                                            <div className="text-sm text-muted-foreground truncate">{item.description}</div>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Badge variant="secondary" className={getTypeColor(item.type)}>{item.type}</Badge>
                                </TableCell>
                                <TableCell>${item.price.toFixed(2)}</TableCell>
                                <TableCell>{item.available}</TableCell>
                                <TableCell><Badge variant={item.status === 'Active' ? 'default' : 'secondary'}>{item.status}</Badge></TableCell>
                                <TableCell>{item.createdAt}</TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {/* Edit - uses controlled edit dialog */}
                                        <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                                            <Edit2 className="h-4 w-4" />
                                        </Button>

                                        {/* Delete */}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="sm"><Trash2 className="h-4 w-4" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Item</AlertDialogTitle>
                                                    <AlertDialogDescription>Are you sure you want to delete {item.name}? This action cannot be undone.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog (controlled) */}
            <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
                setIsEditDialogOpen(open);
                if (!open) {
                    setEditingItem(null);
                    resetForm();
                }
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Item</DialogTitle>
                        <DialogDescription>Update the item information below.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Item Name</Label>
                                <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-type">Type</Label>
                                <Select value={formData.type} onValueChange={(value: ListedItem['type']) => setFormData({ ...formData, type: value })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="workshop">Workshop</SelectItem>
                                        <SelectItem value="event">Event</SelectItem>
                                        <SelectItem value="merchandise">Merchandise</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea id="edit-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-image">Item Image (optional)</Label>
                            <div className="space-y-3">
                                {formData.image ? (
                                    <div className="relative inline-block">
                                        <img src={formData.image} alt="Preview" className="w-32 h-32 rounded-md object-cover border" />
                                        <Button type="button" variant="destructive" size="sm" className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0" onClick={removeImage}>
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                                        <div className="text-center">
                                            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground">No image</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Input ref={editFileInputRef} id="edit-image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    <Button type="button" variant="outline" onClick={() => editFileInputRef.current?.click()}>
                                        <Upload className="h-4 w-4 mr-2" />
                                        {formData.image ? 'Change Image' : 'Upload Image'}
                                    </Button>
                                    {formData.image && <Button type="button" variant="outline" onClick={removeImage}><X className="h-4 w-4 mr-2" />Remove</Button>}
                                </div>
                                <p className="text-sm text-muted-foreground">Supports JPG, PNG, GIF up to 5MB</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-price">Price ($)</Label>
                                <Input id="edit-price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-available">Available</Label>
                                <Input id="edit-available" type="number" value={formData.available} onChange={(e) => setFormData({ ...formData, available: e.target.value })} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select value={formData.status} onValueChange={(value: ListedItem['status']) => setFormData({ ...formData, status: value })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => { setIsEditDialogOpen(false); setEditingItem(null); resetForm(); }}>Cancel</Button>
                            <Button type="submit">Update Item</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
