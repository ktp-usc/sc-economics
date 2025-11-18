import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
    currentPage: 'fees' | 'donation' | 'info' | 'admin';
    onNavigate: (page: 'fees' | 'donation' | 'info' | 'admin') => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
    return (
        <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-medium text-primary">SC ECONOMICS</h1>
                            <p className="text-sm text-muted-foreground">Empowering teachers to integrate economics education</p>
                        </div>
                    </div>

                    {/* Navigation buttons */}
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
