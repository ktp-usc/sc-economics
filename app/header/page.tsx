import Image from "next/image";
import { Button } from "@/components/ui/button";

interface HeaderProps {
    currentPage: 'fees' | 'donation' | 'info';
    onNavigate: (page: 'fees' | 'donation' | 'info') => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
    return (
        <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start space-x-4 -ml-2">
                        <Image
                            src="/SCEcon.png"       // put your actual filename here
                            alt="SC Economics"
                            width={160}                // adjust to fit your design
                            height={48}                // keep same aspect ratio
                            className="h-15 w-auto object-contain"
                            priority
                        />
                        <div>
                            <p className="text-sm text-muted-foreground ml-4 w-60">
                                Empowering teachers to integrate economics education
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant={currentPage === 'fees' ? 'default' : 'ghost'}
                            onClick={() => onNavigate('fees')}
                            className="px-6"
                        >
                            Workshop Fees
                        </Button>
                        <Button
                            variant={currentPage === 'donation' ? 'default' : 'ghost'}
                            onClick={() => onNavigate('donation')}
                            className="px-6"
                        >
                            Make a Donation
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}