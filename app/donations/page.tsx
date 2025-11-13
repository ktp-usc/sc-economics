"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DonationPageProps {
    onContinue: (amount: number, type: string) => void;
}

export function DonationPage({ onContinue }: DonationPageProps) {
    const [donationType, setDonationType] = useState('one-time');
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    

    const presetAmounts = [25, 50, 100, 250];

    const handleContinue = async () => {
        const amount = selectedAmount ?? parseFloat(customAmount || '0');
        if (!(amount > 0)) return;

        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency: 'usd', description: 'Donation' })
            });

            // Defensive handling in case the server returns non-JSON (HTML error page etc.)
            const contentType = res.headers.get('content-type') || '';
            let data: any = null;
            if (contentType.includes('application/json')) {
                data = await res.json();
            } else {
                const text = await res.text();
                throw new Error(`Unexpected server response (status ${res.status}): ${text}`);
            }

            if (!res.ok) throw new Error(data?.error || 'Failed to create checkout session');

            // Optional callback for parent tracking
            try { if (onContinue) onContinue(amount, donationType); } catch (e) { console.warn(e); }

            // Redirect browser to Stripe Checkout page
            if (data?.url) {
                window.location.href = data.url;
            } else {
                throw new Error('Missing checkout URL from server');
            }
        } catch (err: any) {
            console.error(err);
            setError(err?.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const isAmountSelected = selectedAmount !== null || (customAmount && parseFloat(customAmount) > 0);

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 max-w-lg">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl mb-2 text-primary">Make a Donation</h1>
                    <p className="text-muted-foreground">
                        Your generous donation helps us continue our important work in the community.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-medium">Select Amount</h2>
                        <p className="text-muted-foreground text-sm">
                            Choose a preset amount or enter your own donation amount
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Donation Type */}
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-3">
                                Donation Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant={donationType === 'one-time' ? 'default' : 'outline'}
                                    onClick={() => setDonationType('one-time')}
                                    className="w-full"
                                >
                                    One-time
                                </Button>
                                <Button
                                    variant={donationType === 'monthly' ? 'default' : 'outline'}
                                    onClick={() => setDonationType('monthly')}
                                    className="w-full"
                                >
                                    Monthly
                                </Button>
                                <Button
                                    variant={donationType === 'quarterly' ? 'default' : 'outline'}
                                    onClick={() => setDonationType('quarterly')}
                                    className="w-full"
                                >
                                    Quarterly
                                </Button>
                                <Button
                                    variant={donationType === 'yearly' ? 'default' : 'outline'}
                                    onClick={() => setDonationType('yearly')}
                                    className="w-full"
                                >
                                    Yearly
                                </Button>
                            </div>
                        </div>

                        {/* Preset Amounts */}
                        <div className="grid grid-cols-2 gap-3">
                            {presetAmounts.map((amount) => (
                                <Button
                                    key={amount}
                                    variant={selectedAmount === amount ? 'default' : 'outline'}
                                    onClick={() => {
                                        setSelectedAmount(amount);
                                        setCustomAmount('');
                                    }}
                                    className="h-16 text-lg"
                                >
                                    ${amount}
                                </Button>
                            ))}
                        </div>

                        {/* Custom Amount */}
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-2">
                                Or enter your own amount
                            </label>
                            <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={customAmount}
                                    onChange={(e) => {
                                        setCustomAmount(e.target.value);
                                        setSelectedAmount(null);
                                    }}
                                    className="pl-8"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        {/* Continue Button */}
                        <div>
                            {error && <p className="text-sm text-destructive mb-2">{error}</p>}
                            <Button
                                onClick={handleContinue}
                                disabled={!isAmountSelected || loading}
                                className="w-full h-12"
                            >
                                {loading ? 'Redirecting…' : 'Continue to Details'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}