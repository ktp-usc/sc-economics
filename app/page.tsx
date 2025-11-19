"use client";

import { useState } from "react";
import AdminPage from "@/app/admin/page";
import { toast } from "sonner";
import {ProductCatalog} from "@/components/ProductCatalog";
import {DonationPage} from "@/components/DonationPage";
import {InfoGatheringPage} from "@/components/InfoGatheringPage";
import {Header} from "@/components/Header";


type PageType = "fees" | "donation" | "info" | "admin";

export default function Home() {
    const [currentPage, setCurrentPage] = useState<PageType>("fees");
    const [donationData, setDonationData] = useState<{ amount: number; type: string } | null>(null);
    const [registrationData, setRegistrationData] = useState<{ productId: string; productName: string } | null>(null);

    type Product = {
        id: string;
        name: string;
        price: number;
        description: string;
        image: string;
        category?: string;
        inStock: boolean;
    };

    const handleRegisterNow = async (product: Product) => {
        try {
            toast.loading('Redirecting to checkout...');
            const res = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: product.price,
                    currency: 'usd',
                    name: product.name,
                    description: product.description,
                    // No tax-specific source is sent
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                const msg = data?.error || 'Failed to create checkout session';
                toast.error(msg);
                return;
            }

            if (data?.url) {
                // redirect the browser to Stripe Checkout
                window.location.href = data.url;
            } else {
                toast.error('No checkout URL returned');
            }
        } catch (err) {
            console.error('Checkout error', err);
            toast.error('Unexpected error creating checkout');
        }
    };

    const handleNavigate = (page: PageType) => {
        setCurrentPage(page);
    };

    const handleDonationContinue = (amount: number, type: string) => {
        setDonationData({ amount, type });
        setCurrentPage("info");
    };

    const handleInfoBack = () => {
        if (registrationData) {
            setCurrentPage("fees");
            setRegistrationData(null);
        } else {
            setCurrentPage("donation");
        }
    };

    const handleInfoSubmit = () => {
        if (registrationData) {
            toast.success("Processing workshop registration...");
            console.log("Workshop registration:", {
                ...registrationData,
            });
            setRegistrationData(null);
        } else {
            toast.success("Processing donation...");
            console.log("Donation submission:", {
                ...donationData,
            });
            setDonationData(null);
        }

        setCurrentPage("fees");
    };



    const renderCurrentPage = () => {
        switch (currentPage) {
            case "fees":
                return <ProductCatalog onRegisterNow={handleRegisterNow} />;
            case "donation":
                return <DonationPage onContinue={handleDonationContinue} />;
            case "info":
                return (
                    <InfoGatheringPage
                        donationAmount={donationData?.amount}
                        donationType={donationData?.type}
                        registrationData={registrationData}
                        onBack={handleInfoBack}
                        onSubmit={handleInfoSubmit}
                    />
                );
            case "admin":
                return <AdminPage />; // ⬅️ displays your admin dashboard
            default:
                return <ProductCatalog onRegisterNow={handleRegisterNow} />;
        }
    };
    //Purely for testing
    return (
        <div className="min-h-screen bg-background">
            <Header currentPage={currentPage} onNavigate={handleNavigate} />

            <main>{renderCurrentPage()}</main>
        </div>
    );
}