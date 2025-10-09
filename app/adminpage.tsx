"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from './adminpageComponents/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './adminpageComponents/ui/card';
import { ItemsManagement } from './adminpageComponents/ItemsManagement';
import { DonationSettings } from './adminpageComponents/DonationSettings';
import { CustomerData } from './adminpageComponents/CustomerData';
import { Package, DollarSign, Users} from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your items, donations, and view customer information
          </p>
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
