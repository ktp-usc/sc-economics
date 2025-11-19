"use client";

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Search, Filter} from "lucide-react";
import {ProductCard} from "@/components/ProductCard";

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category?: string;
    inStock: boolean;
}

interface ProductCatalogProps {
    onRegisterNow?: (productId: string) => void;
}

export function ProductCatalog({onRegisterNow}: ProductCatalogProps) {
    // component state (hooks MUST be inside component)
    const [productList, setProductList] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("name");

    // fetch items on mount
    useEffect(() => {
        let mounted = true;

        async function fetchItems() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("/api/item/active");
                if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
                const data = await res.json();

                const mapped: Product[] = (data || []).map((it: Product) => ({
                    id: String(it.id),
                    name: String(it.name ?? "Untitled"),
                    price: Number(it.price ?? 0),
                    description: String(it.description ?? ""),
                    image: String(it.image ?? ""),
                    category: it.category ? String(it.category) : "Uncategorized",
                    inStock: Number(it.inStock ?? 0) > 0,
                }));

                if (mounted) setProductList(mapped);
            } catch (err: unknown) {
                console.error("Error fetching items", err);
                if (mounted) {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else if (typeof err === "string") {
                        setError(err);
                    } else {
                        setError("Unknown error");
                    }
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchItems();
        return () => {
            mounted = false;
        };
    }, []);

    // derive categories from the fetched product list
    const categories = [
        "all",
        ...Array.from(new Set(
            productList
                .map((p) => p.category)
                .filter((c): c is string => Boolean(c))  // added line to remove undefined elements
        )),
    ];

    const filteredProducts = productList
        .filter((product) => {
            const q = searchTerm.trim().toLowerCase();
            const matchesSearch =
                q === "" ||
                product.name.toLowerCase().includes(q) ||
                product.description.toLowerCase().includes(q);
            const matchesCategory =
                selectedCategory === "all" || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "price-low":
                    return a.price - b.price;
                case "price-high":
                    return b.price - a.price;
                case "name":
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div
                className="text-center mb-12 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-xl p-8">
                <h2 className="text-3xl mb-4 text-primary">Professional Development Opportunities</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Transform your teaching with our expert-led workshops and events designed specifically
                    for educators. Build confidence and skills to integrate economics across all subjects.
                </p>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                    <Input
                        placeholder="Search workshops and events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground"/>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Category"/>
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category === "all" ? "All Categories" : category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Sort by"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Loading / Error / Grid */}
            {loading ? (
                <div className="text-center py-12">Loading workshops...</div>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-red-500 mb-4">Error: {error}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No workshops or events found matching your
                        criteria.</p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedCategory("all");
                            setSortBy("name");
                        }}
                        className="mt-4"
                    >
                        Clear Filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} onRegisterNow={onRegisterNow}/>
                    ))}
                </div>
            )}

            {/* Impact Statement */}
            <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-lg p-8 text-center text-white">
                <h3 className="text-xl mb-4">Transforming Education Together</h3>
                <p className="text-white/90 max-w-2xl mx-auto">
                    Join thousands of educators who have enhanced their teaching through our professional development
                    programs.
                    Our workshops and events provide practical tools, research-based strategies, and ongoing support to
                    help you
                    successfully integrate economics education into your classroom.
                </p>
            </div>
        </div>
    );
}