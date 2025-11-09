"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ItemsManagement } from '@/components/ItemsManagement';
import { DonationSettings } from '@/components/DonationSettings';
import { CustomerData } from '@/components/CustomerData';
import { Package, DollarSign, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function App() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is authenticated
        const authStatus = sessionStorage.getItem("isAuthenticated");
        if (authStatus === "true") {
            setIsAuthenticated(true);
        } else {
            router.push("/login");
        }
        setIsLoading(false);
    }, [router]);

    const handleLogout = () => {
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("username");
        router.push("/login");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="mb-2">Admin Dashboard</h1>
                        <p className="text-muted-foreground">
                            Manage your items, donations, and view customer information
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>

                <Tabs defaultValue="items" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="items" className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Items Management
                        </TabsTrigger>
                        <TabsTrigger value="donations" className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Donation Settings
                        </TabsTrigger>
                        <TabsTrigger value="customers" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Customer Data
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="items">
                        <Card>
                            <CardHeader>
                                <CardTitle>Items Management</CardTitle>
                                <CardDescription>
                                    Add new items for purchase, edit existing items, or remove old ones
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ItemsManagement />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="donations">
                        <Card>
                            <CardHeader>
                                <CardTitle>Donation Settings</CardTitle>
                                <CardDescription>
                                    Configure donation amounts and settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DonationSettings />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="customers">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Data</CardTitle>
                                <CardDescription>
                                    View information about customers and their purchases
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CustomerData />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}