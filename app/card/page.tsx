import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/images/image";

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category?: string;
    inStock: boolean;
}

interface ProductCardProps {
    product: Product;
    onRegisterNow?: (productId: string) => void;
}

export function ProductCard({ product, onRegisterNow }: ProductCardProps) {
    return (
        <Card className="h-full flex flex-col group hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden">
            <CardContent className="p-0 flex-1 flex flex-col">
                <div className="relative w-full h-64 overflow-hidden">
                    <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    {product.category && (
                        <Badge
                            variant="secondary"
                            className={`absolute top-3 left-3 text-white ${
                                product.category === 'Workshops'
                                    ? 'bg-primary hover:bg-primary/80'
                                    : 'bg-secondary hover:bg-secondary/80'
                            }`}
                        >
                            {product.category}
                        </Badge>
                    )}
                    {!product.inStock && (
                        <Badge
                            variant="destructive"
                            className="absolute top-3 right-3"
                        >
                            Sold Out
                        </Badge>
                    )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                    <h3 className="mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-3">
                        {product.description}
                    </p>
                    <div className="flex items-center justify-between">
            <span className="text-primary font-semibold text-lg">
              ${product.price.toFixed(2)}
            </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full"
                    onClick={() => onRegisterNow?.(product.id)}
                    disabled={!product.inStock}
                >
                    {product.inStock ? 'Register Now' : 'Sold Out'}
                </Button>
            </CardFooter>
        </Card>
    );
}
