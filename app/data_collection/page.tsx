"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import svgPaths from "@/components/svg-b3ps3eyihg";

interface InfoGatheringPageProps {
    donationAmount?: number;
    donationType?: string;
    registrationData?: { productId: string; productName: string } | null;
    onBack: () => void;
    onSubmit: (data: any) => void;
}

export function InfoGatheringPage({ donationAmount, donationType, registrationData, onBack, onSubmit }: InfoGatheringPageProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address1: '',
        address2: '',
        city: '',
        zipCode: '',
        state: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    const isFormValid = formData.firstName && formData.lastName && formData.email &&
        formData.phone && formData.address1 && formData.city &&
        formData.zipCode && formData.state;

    const states = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 max-w-lg">
                {/* Header with Back Button */}
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="flex items-center gap-2 p-0 h-8"
                    >
                        <div className="w-4 h-4">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                                <path
                                    d={svgPaths.p203476e0}
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.33333"
                                />
                                <path
                                    d="M12.6667 8H3.33333"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.33333"
                                />
                            </svg>
                        </div>
                        Back
                    </Button>

                    <div className="flex-1">
                        <h1 className="text-2xl text-primary">
                            {registrationData ? 'Registration Details' : 'Donation Details'}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {registrationData
                                ? `Registering for: ${registrationData.productName}`
                                : `Donating ${donationAmount ? `${donationAmount.toFixed(2)}` : '$0.00'}`
                            }
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-medium">Your Information</h2>
                        <p className="text-muted-foreground text-sm">
                            Please provide your details to complete the {registrationData ? 'registration' : 'donation'}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-foreground block mb-2">
                                    First Name *
                                </label>
                                <Input
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground block mb-2">
                                    Last Name *
                                </label>
                                <Input
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    placeholder="Enter last name"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-2">
                                Email *
                            </label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Enter email address"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-2">
                                Phone Number *
                            </label>
                            <Input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="Enter phone number"
                            />
                        </div>

                        {/* Address 1 */}
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-2">
                                Address Line 1 *
                            </label>
                            <Input
                                value={formData.address1}
                                onChange={(e) => handleInputChange('address1', e.target.value)}
                                placeholder="Enter street address"
                            />
                        </div>

                        {/* Address 2 */}
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-2">
                                Address Line 2
                            </label>
                            <Input
                                value={formData.address2}
                                onChange={(e) => handleInputChange('address2', e.target.value)}
                                placeholder="Apartment, suite, etc."
                            />
                        </div>

                        {/* City and ZIP */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-foreground block mb-2">
                                    City *
                                </label>
                                <Input
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    placeholder="Enter city"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground block mb-2">
                                    ZIP Code *
                                </label>
                                <Input
                                    value={formData.zipCode}
                                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                    placeholder="Enter ZIP code"
                                />
                            </div>
                        </div>

                        {/* State */}
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-2">
                                State *
                            </label>
                            <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                    {states.map(state => (
                                        <SelectItem key={state} value={state}>
                                            {state}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Submit Button */}
                        <Button
                            onClick={handleSubmit}
                            disabled={!isFormValid}
                            className="w-full h-12 mt-6"
                        >
                            {registrationData ? 'Complete Registration' : 'Proceed to Payment'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
