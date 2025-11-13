import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {LogIn} from "lucide-react";
import logo from "../../public/SCEcon.png";

interface HeaderProps {
    currentPage: 'fees' | 'donation' | 'info';
    onNavigate: (page: 'fees' | 'donation' | 'info') => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
    return (
        <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-2">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col items-left space-x-3 -ml-3">
                        <div className="-mx-60">
                                <Image
                                    src={logo}   // adjust to your filename
                                    alt="SC Economics"
                                    width={200}           // choose a width that fits
                                    // height={400}            // keep aspect ratio consistent
                                    // className="h-40 w-auto object-contain my-0"
                                    priority
                                />
                        </div>

                        <div>
                            {/*<h1 className="text-xl font-medium text-primary">SC ECONOMICS</h1>*/}
                            <p className="text-sm text-muted-foreground static w-60 ml-3">Empowering teachers to integrate economics education</p>
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
                        <Link href="/login" className="hidden md:block">
                            <Button
                                variant="outline"
                                className="px-6 flex items-center gap-2"
                            >
                                <LogIn className="h-4 w-4" />
                                Admin Login
                            </Button>
                        </Link>

                        {/* Small button with stacked text - shown on small screens */}
                        <Link href="/login" className="md:hidden">
                            <Button
                                variant="outline"
                                className="px-3 py-2 h-auto flex flex-col items-center gap-0 text-xs leading-tight"
                            >
                                <span>Admin</span>
                                <span>Login</span>
                            </Button>
                        </Link>
                        {/*<Link href="/login">*/}
                        {/*    <Button*/}
                        {/*        variant="outline"*/}
                        {/*        className="px-6 flex items-center gap-2"*/}
                        {/*    >*/}
                        {/*        <LogIn className="h-4 w-4" />*/}
                        {/*        Admin Login*/}
                        {/*    </Button>*/}
                        {/*</Link>*/}
                    </div>
                </div>
                {/*<div className="absolute top-1.5 right-10">*/}
                {/*    <Link*/}
                {/*        href="/login"*/}
                {/*        className="text-xs text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"*/}
                {/*    >*/}
                {/*        Admin Login*/}
                {/*    </Link>*/}
                {/*</div>*/}
            </div>
        </header>
    );
}
