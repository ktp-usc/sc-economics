import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Save } from 'lucide-react';
import { toast } from 'sonner';

type DonationOption = {
    id: string;
    name: string;
    amount: number;
};

const initialDonationOptions: DonationOption[] = [
    { id: '1', name: 'Small Donation', amount: 25 },
    { id: '2', name: 'Medium Donation', amount: 50 },
    { id: '3', name: 'Large Donation', amount: 100 },
    { id: '4', name: 'Major Donation', amount: 250 }
];

export function DonationSettings() {
    const [donationOptions, setDonationOptions] = useState<DonationOption[]>(initialDonationOptions);

    const handleOptionUpdate = (id: string, field: keyof DonationOption, value: string | number) => {
        setDonationOptions(donationOptions.map(option =>
            option.id === id ? { ...option, [field]: value } : option
        ));
    };

    const saveSettings = () => {
        // In a real app, this would save to the backend
        toast('Donation options saved successfully!');
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Default Donation Options
                    </CardTitle>
                    <CardDescription>
                        Set the four default donation amounts that will be available to donors
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6">
                        {donationOptions.map((option, index) => (
                            <div key={option.id} className="border rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`name-${option.id}`}>
                                            Option {index + 1} Name
                                        </Label>
                                        <Input
                                            id={`name-${option.id}`}
                                            value={option.name}
                                            onChange={(e) => handleOptionUpdate(option.id, 'name', e.target.value)}
                                            placeholder="e.g., Small Donation"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`amount-${option.id}`}>
                                            Amount ($)
                                        </Label>
                                        <Input
                                            id={`amount-${option.id}`}
                                            type="number"
                                            step="0.01"
                                            value={option.amount}
                                            onChange={(e) => handleOptionUpdate(option.id, 'amount', parseFloat(e.target.value) || 0)}
                                            placeholder="25.00"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                        <h4 className="mb-2">Preview</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            These are the donation options that will be displayed to donors:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {donationOptions.map((option) => (
                                <div key={option.id} className="bg-background border rounded-md p-3 text-center">
                                    <div className="font-medium">${option.amount}</div>
                                    <div className="text-xs text-muted-foreground">{option.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={saveSettings} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Donation Options
                </Button>
            </div>
        </div>
    );
}