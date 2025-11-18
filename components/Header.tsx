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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shrink-0">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl font-medium text-primary">SC ECONOMICS</h1>
                            <p className="text-sm text-muted-foreground">Empowering teachers to integrate economics education</p>
                        </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                        <Button
                            variant={currentPage === 'fees' ? 'default' : 'ghost'}
                            onClick={() => onNavigate('fees')}
                            className="px-6 w-full sm:w-auto"
                        >
                            Workshop Fees
                        </Button>
                        <Button
                            variant={currentPage === 'donation' ? 'default' : 'ghost'}
                            onClick={() => onNavigate('donation')}
                            className="px-6 w-full sm:w-auto"
                        >
                            Make a Donation
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
