import { useState, useRef } from 'react';
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

type Item = {
    id: string;
    name: string;
    type: 'workshop' | 'event' | 'merchandise' | 'other';
    description: string;
    price: number;
    capacity?: number;
    available: number;
    status: 'active' | 'inactive';
    createdAt: string;
    image?: string;
};

const mockItems: Item[] = [
    {
        id: '1',
        name: 'Web Development Workshop',
        type: 'workshop',
        description: 'Learn the fundamentals of web development with HTML, CSS, and JavaScript',
        price: 99.99,
        capacity: 20,
        available: 15,
        status: 'active',
        createdAt: '2024-01-15'
    },
    {
        id: '2',
        name: 'UX Design Masterclass',
        type: 'workshop',
        description: 'Advanced UX design principles and hands-on practice',
        price: 149.99,
        capacity: 15,
        available: 8,
        status: 'active',
        createdAt: '2024-01-20'
    },
    {
        id: '3',
        name: 'Annual Conference Ticket',
        type: 'event',
        description: 'Full access to our annual tech conference',
        price: 299.99,
        capacity: 100,
        available: 45,
        status: 'active',
        createdAt: '2024-02-01'
    },
    {
        id: '4',
        name: 'Organization T-Shirt',
        type: 'merchandise',
        description: 'High-quality cotton t-shirt with organization logo',
        price: 25.00,
        available: 50,
        status: 'active',
        createdAt: '2024-01-10'
    }
];

export function ItemsManagement() {
    const [items, setItems] = useState<Item[]>(mockItems);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'workshop' as Item['type'],
        description: '',
        price: '',
        capacity: '',
        available: '',
        status: 'active' as Item['status'],
        image: ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'workshop',
            description: '',
            price: '',
            capacity: '',
            available: '',
            status: 'active',
            image: ''
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (editFileInputRef.current) {
            editFileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const itemData: Item = {
            id: editingItem?.id || Date.now().toString(),
            name: formData.name,
            type: formData.type,
            description: formData.description,
            price: parseFloat(formData.price),
            capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
            available: parseInt(formData.available),
            status: formData.status,
            createdAt: editingItem?.createdAt || new Date().toISOString().split('T')[0],
            image: formData.image || undefined
        };

        if (editingItem) {
            setItems(items.map(item => item.id === editingItem.id ? itemData : item));
        } else {
            setItems([...items, itemData]);
        }

        resetForm();
        setIsAddDialogOpen(false);
        setEditingItem(null);
    };

    const handleEdit = (item: Item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            type: item.type,
            description: item.description,
            price: item.price.toString(),
            capacity: item.capacity?.toString() || '',
            available: item.available.toString(),
            status: item.status,
            image: item.image || ''
        });
    };

    const handleDelete = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const getTypeColor = (type: Item['type']) => {
        switch (type) {
            case 'workshop': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'event': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'merchandise': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size must be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target?.result as string;
                setFormData({ ...formData, image: imageData });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, image: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (editFileInputRef.current) {
            editFileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3>Current Items</h3>
                    <p className="text-muted-foreground">Manage your available items for purchase</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add New Item</DialogTitle>
                            <DialogDescription>
                                Create a new item for purchase. Fill in all the required information.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Item Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Web Development Workshop"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select value={formData.type} onValueChange={(value: Item['type']) => setFormData({ ...formData, type: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="workshop">Workshop</SelectItem>
                                            <SelectItem value="event">Event</SelectItem>
                                            <SelectItem value="merchandise">Merchandise</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe what this item includes..."
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Item Image (optional)</Label>
                                <div className="space-y-3">
                                    {formData.image ? (
                                        <div className="relative inline-block">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-32 h-32 rounded-md object-cover border"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                                onClick={removeImage}
                                            >
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
                                        <Input
                                            ref={fileInputRef}
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e)}
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            {formData.image ? 'Change Image' : 'Upload Image'}
                                        </Button>
                                        {formData.image && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={removeImage}
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Supports JPG, PNG, GIF up to 5MB
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="99.99"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Capacity (optional)</Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                        placeholder="20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="available">Available</Label>
                                    <Input
                                        id="available"
                                        type="number"
                                        value={formData.available}
                                        onChange={(e) => setFormData({ ...formData, available: e.target.value })}
                                        placeholder="15"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={(value: Item['status']) => setFormData({ ...formData, status: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
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
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                                                <Upload className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <div>{item.name}</div>
                                            <div className="text-sm text-muted-foreground truncate">
                                                {item.description}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={getTypeColor(item.type)}>
                                        {item.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>${item.price.toFixed(2)}</TableCell>
                                <TableCell>
                                    {item.available}
                                    {item.capacity && ` / ${item.capacity}`}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{item.createdAt}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[600px]">
                                                <DialogHeader>
                                                    <DialogTitle>Edit Item</DialogTitle>
                                                    <DialogDescription>
                                                        Update the item information below.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-name">Item Name</Label>
                                                            <Input
                                                                id="edit-name"
                                                                value={formData.name}
                                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-type">Type</Label>
                                                            <Select value={formData.type} onValueChange={(value: Item['type']) => setFormData({ ...formData, type: value })}>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="workshop">Workshop</SelectItem>
                                                                    <SelectItem value="event">Event</SelectItem>
                                                                    <SelectItem value="merchandise">Merchandise</SelectItem>
                                                                    <SelectItem value="other">Other</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit-description">Description</Label>
                                                        <Textarea
                                                            id="edit-description"
                                                            value={formData.description}
                                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit-image">Item Image (optional)</Label>
                                                        <div className="space-y-3">
                                                            {formData.image ? (
                                                                <div className="relative inline-block">
                                                                    <img
                                                                        src={formData.image}
                                                                        alt="Preview"
                                                                        className="w-32 h-32 rounded-md object-cover border"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                                                        onClick={removeImage}
                                                                    >
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
                                                                <Input
                                                                    ref={editFileInputRef}
                                                                    id="edit-image"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleImageUpload(e, true)}
                                                                    className="hidden"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    onClick={() => editFileInputRef.current?.click()}
                                                                >
                                                                    <Upload className="h-4 w-4 mr-2" />
                                                                    {formData.image ? 'Change Image' : 'Upload Image'}
                                                                </Button>
                                                                {formData.image && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={removeImage}
                                                                    >
                                                                        <X className="h-4 w-4 mr-2" />
                                                                        Remove
                                                                    </Button>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                Supports JPG, PNG, GIF up to 5MB
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-price">Price ($)</Label>
                                                            <Input
                                                                id="edit-price"
                                                                type="number"
                                                                step="0.01"
                                                                value={formData.price}
                                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-capacity">Capacity</Label>
                                                            <Input
                                                                id="edit-capacity"
                                                                type="number"
                                                                value={formData.capacity}
                                                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-available">Available</Label>
                                                            <Input
                                                                id="edit-available"
                                                                type="number"
                                                                value={formData.available}
                                                                onChange={(e) => setFormData({ ...formData, available: e.target.value })}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit-status">Status</Label>
                                                        <Select value={formData.status} onValueChange={(value: Item['status']) => setFormData({ ...formData, status: value })}>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="active">Active</SelectItem>
                                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <DialogFooter>
                                                        <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button type="submit">Update Item</Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Item</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete {item.name}? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(item.id)}>
                                                        Delete
                                                    </AlertDialogAction>
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
        </div>
    );
}