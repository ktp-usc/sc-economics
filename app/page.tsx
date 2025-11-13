"use client";

import { useState } from "react";
import { Header } from "@/app/header/page";
import { ProductCatalog } from "@/app/catalog/page";
import { DonationPage } from "@/app/donations/page";
import { InfoGatheringPage } from "@/app/data_collection/page";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

type PageType = 'fees' | 'donation' | 'info';

export default function Home() {
    const [currentPage, setCurrentPage] = useState<PageType>('fees');
    const [donationData, setDonationData] = useState<{ amount: number; type: string } | null>(null);
    const [registrationData, setRegistrationData] = useState<{ productId: string; productName: string } | null>(null);

    const handleRegisterNow = async (product: { id: string; name: string; price: number }) => {
        // Create a Stripe Checkout session for this product and redirect the browser
        try {
            toast.loading('Creating checkout...')
            const res = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: product.price, currency: 'usd', description: product.name })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data?.error || 'Failed to create checkout session')

            // Redirect to Stripe Checkout
            if (data?.url) {
                window.location.href = data.url
            } else {
                throw new Error('Missing checkout URL')
            }
        } catch (err: any) {
            console.error(err)
            toast.error(err?.message || 'Could not start checkout')
        }
    };

    const handleNavigate = (page: PageType) => {
        setCurrentPage(page);
    };

    const handleDonationContinue = (amount: number, type: string) => {
        setDonationData({ amount, type });
        setCurrentPage('info');
    };

    const handleInfoBack = () => {
        if (registrationData) {
            // If coming from workshop registration, go back to fees page
            setCurrentPage('fees');
            setRegistrationData(null);
        } else {
            // If coming from donation, go back to donation page
            setCurrentPage('donation');
        }
    };

    const handleInfoSubmit = (formData: any) => {
        if (registrationData) {
            // Handle workshop registration
            toast.success("Processing workshop registration...");
            console.log('Workshop registration:', {
                ...registrationData,
                ...formData
            });
            setRegistrationData(null);
        } else {
            // Handle donation
            toast.success("Processing donation...");
            console.log('Donation submission:', {
                ...donationData,
                ...formData
            });
            setDonationData(null);
        }

        // Return to fees page
        setCurrentPage('fees');
    };

    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'fees':
                return <ProductCatalog onRegisterNow={handleRegisterNow} />;
            case 'donation':
                return <DonationPage onContinue={handleDonationContinue} />;
            case 'info':
                return (
                    <InfoGatheringPage
                        donationAmount={donationData?.amount}
                        donationType={donationData?.type}
                        registrationData={registrationData}
                        onBack={handleInfoBack}
                        onSubmit={handleInfoSubmit}
                    />
                );
            default:
                return <ProductCatalog onRegisterNow={handleRegisterNow} />;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header currentPage={currentPage} onNavigate={handleNavigate} />
            <main>
                {renderCurrentPage()}
            </main>
            <Toaster />
        </div>
    );
}