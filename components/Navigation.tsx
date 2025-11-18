import { Button } from "@/components/ui/button";

interface NavigationProps {
    currentPage: 'fees' | 'donation' | 'info';
    onNavigate: (page: 'fees' | 'donation' | 'info') => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
    return (
        <nav className="border-b bg-white shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center space-x-2 py-3">
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
                    <Button
                        variant={currentPage === 'info' ? 'default' : 'ghost'}
                        onClick={() => onNavigate('info')}
                        className="px-6"
                        disabled={currentPage !== 'info'}
                    >
                        Contact Info
                    </Button>
                </div>
            </div>
        </nav>
    );
}
