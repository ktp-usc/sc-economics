"use client"

import { useState } from "react";
import { ProductCard } from "@/app/card/page";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category?: string;
    inStock: boolean;
}

const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Economics in Elementary: Foundations Workshop",
        price: 125.00,
        description: "A comprehensive 6-hour workshop designed for K-5 teachers. Learn age-appropriate ways to introduce economic concepts like scarcity, choices, and trade through interactive activities and games.",
        image: "https://images.unsplash.com/photo-1562939651-9359f291c988?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVycyUyMHdvcmtzaG9wJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc1OTE3OTQ5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        category: "Workshops",
        inStock: true,
    },
    {
        id: "2",
        name: "Annual Economics Education Conference",
        price: 299.00,
        description: "Three-day conference featuring keynote speakers, breakout sessions, and networking opportunities. Includes materials, meals, and continuing education credits.",
        image: "https://images.unsplash.com/photo-1646579886135-068c73800308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29ub21pY3MlMjBlZHVjYXRpb24lMjBjb25mZXJlbmNlfGVufDF8fHx8MTc1OTE3OTQ5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        category: "Events",
        inStock: true,
    },
    {
        id: "3",
        name: "Financial Literacy for High School",
        price: 175.00,
        description: "Intensive workshop covering personal finance, budgeting, investing, and credit. Perfect for high school teachers wanting to integrate practical economics into their curriculum.",
        image: "https://images.unsplash.com/photo-1758691736722-cda1858056e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZXZlbG9wbWVudCUyMHNlbWluYXJ8ZW58MXx8fHwxNzU5MTc5NDk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        category: "Workshops",
        inStock: true,
    },
    {
        id: "4",
        name: "Virtual Economics Webinar Series",
        price: 89.00,
        description: "Four-part online series covering supply and demand, market structures, and economic systems. Flexible scheduling with recorded sessions available for one year.",
        image: "https://images.unsplash.com/photo-1587377838865-38ab492fdad3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZyUyMHdlYmluYXJ8ZW58MXx8fHwxNzU5MTMzNTQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        category: "Events",
        inStock: true,
    },
    {
        id: "5",
        name: "Middle School Economics Bootcamp",
        price: 150.00,
        description: "Two-day intensive workshop for grades 6-8 teachers. Focus on making abstract economic concepts concrete through simulations, role-plays, and hands-on activities.",
        image: "https://images.unsplash.com/photo-1561089489-f13d5e730d72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29ub21pY3MlMjBjbGFzc3Jvb20lMjB0ZWFjaGluZ3xlbnwxfHx8fDE3NTkxNzk1MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        category: "Workshops",
        inStock: false,
    },
    {
        id: "6",
        name: "Summer Institute: Advanced Economics Pedagogy",
        price: 450.00,
        description: "Week-long summer program for experienced educators. Deep dive into economic research, innovative teaching methods, and curriculum development. Graduate credit available.",
        image: "https://images.unsplash.com/photo-1733758283615-224f76ab0792?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXJyaWN1bHVtJTIwdHJhaW5pbmclMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NTkxNzk1MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        category: "Events",
        inStock: true,
    },
];

interface ProductCatalogProps {
    onRegisterNow?: (product: Product) => void;
}

export function ProductCatalog({ onRegisterNow }: ProductCatalogProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("name");

    const categories = ["all", ...new Set(MOCK_PRODUCTS.map(p => p.category).filter(Boolean))];

    const filteredProducts = MOCK_PRODUCTS
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
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
            <div className="text-center mb-12 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-xl p-8">
                <h2 className="text-3xl mb-4 text-primary">Professional Development Opportunities</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Transform your teaching with our expert-led workshops and events designed specifically
                    for educators. Build confidence and skills to integrate economics across all subjects.
                </p>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search workshops and events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => (
                                    <SelectItem key={category} value={category ?? "all"}>
                                        {category === "all" ? "All Categories" : category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No workshops or events found matching your criteria.</p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedCategory("all");
                        }}
                        className="mt-4"
                    >
                        Clear Filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onRegisterNow={onRegisterNow}
                        />
                    ))}
                </div>
            )}

            {/* Impact Statement */}
            <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-lg p-8 text-center text-white">
                <h3 className="text-xl mb-4">Transforming Education Together</h3>
                <p className="text-white/90 max-w-2xl mx-auto">
                    Join thousands of educators who have enhanced their teaching through our professional development programs.
                    Our workshops and events provide practical tools, research-based strategies, and ongoing support to help you
                    successfully integrate economics education into your classroom.
                </p>
            </div>
        </div>
    );
}
