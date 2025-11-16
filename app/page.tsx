"use client";

import { useState } from "react";
import { Header } from "@/app/header/page";
import { ProductCatalog } from "@/app/catalog/page";
import { DonationPage } from "@/app/donations/page";
import { InfoGatheringPage } from "@/app/data_collection/page";
import AdminPage from "@/app/admin/page";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";


type PageType = "fees" | "donation" | "info" | "admin";

export default function Home() {
    const [currentPage, setCurrentPage] = useState<PageType>("fees");
    const [donationData, setDonationData] = useState<{ amount: number; type: string } | null>(null);
    const [registrationData, setRegistrationData] = useState<{ productId: string; productName: string } | null>(null);

    const handleRegisterNow = (productId: string) => {
        setRegistrationData({ productId, productName: `Workshop ${productId}` });
        setCurrentPage("info");
        toast.success("Proceeding to registration details...");
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

    const handleInfoSubmit = (formData: FormData) => {
        if (registrationData) {
            toast.success("Processing workshop registration...");
            console.log("Workshop registration:", {
                ...registrationData,
                ...formData,
            });
            setRegistrationData(null);
        } else {
            toast.success("Processing donation...");
            console.log("Donation submission:", {
                ...donationData,
                ...formData,
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

            {/* Example button to navigate to admin */}
            <div className="flex justify-end p-4">
                <button
                    onClick={() => setCurrentPage("admin")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Go to Admin Page
                </button>
            </div>

            <main>{renderCurrentPage()}</main>
            <Toaster />
        </div>
    );
}
