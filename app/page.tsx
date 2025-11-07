"use client";

import { useState } from "react";
import { Header } from "@/app/header/page";
import { ProductCatalog } from "@/app/catalog/page";
import { DonationPage } from "@/app/donations/page";
import { InfoGatheringPage } from "@/app/data_collection/page";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import AdminPage from "@/app/admin/page";

type PageType = 'fees' | 'donation' | 'info' | 'admin';

export default function Home() {
    const [currentPage, setCurrentPage] = useState<PageType>('fees');
    const [donationData, setDonationData] = useState<{ amount: number; type: string } | null>(null);
    const [registrationData, setRegistrationData] = useState<{ productId: string; productName: string } | null>(null);

    const handleRegisterNow = (productId: string) => {
        // Store registration info and navigate to details page
        setRegistrationData({ productId, productName: `Workshop ${productId}` });
        setCurrentPage('info');
        toast.success("Proceeding to registration details...");
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
        return<AdminPage/>;

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