import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../../lib/stripe'
import Stripe from 'stripe'

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const body = await req.json()
        // Expect amount in dollars
        const rawAmount = body.amount
        const currency = (body.currency || 'usd').toLowerCase()
        // interval: 'one-time' | 'monthly' | 'quarterly' | 'yearly'
        const interval = (body.interval || 'one-time').toString();

        // Validation
        if (rawAmount == null) {
            return NextResponse.json({ error: 'Missing amount' }, { status: 400 })
        }

        // Convert to integer cents
        const amountInCents = Math.round(Number(rawAmount) * 100)
   
        if (!Number.isFinite(amountInCents) || amountInCents <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
        }

        // Enforce min/max 
        const MIN = 100   // $1.00
        const MAX = 1_000_000 // $10,000.00 dollars
        if (amountInCents < MIN || amountInCents > MAX) {
            return NextResponse.json(
                { error: `Amount must be between ${MIN/100} and ${MAX/100} ${currency}` },
                { status: 400 }
            )
        }

        const headersList = await headers()
        const origin = headersList.get('origin') || `${process.env.NEXT_PUBLIC_APP_URL}`

        // Build price_data.recurring for subscription modes
        let recurring: Stripe.Price.Recurring | undefined = undefined;
        let mode: 'payment' | 'subscription' = 'payment';
        if (interval && interval !== 'one-time') {
            mode = 'subscription';
            if (interval === 'monthly') {
                recurring = { interval: 'month', interval_count: 1 } as Stripe.Price.Recurring;
            } else if (interval === 'quarterly') {
                recurring = { interval: 'month', interval_count: 3 } as Stripe.Price.Recurring;
            } else if (interval === 'yearly') {
                recurring = { interval: 'year', interval_count: 1 } as Stripe.Price.Recurring;
            } else {
                // fallback to monthly if unknown
                recurring = { interval: 'month', interval_count: 1 } as Stripe.Price.Recurring;
            }
        }

        // Build allowed payment method types. Add ACH (`us_bank_account`) and
        // disallow crypto for subscription mode because Stripe doesn't support
        // crypto as a recurring payment method.
        const availablePaymentMethods = ['card', 'cashapp', 'crypto', 'link', 'us_bank_account'];
        const payment_method_types = mode === 'subscription'
            ? availablePaymentMethods.filter((m) => m !== 'crypto')
            : availablePaymentMethods;

        // Build session parameters (no automatic tax or tax metadata)
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: payment_method_types as unknown as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: body.name || 'Donation',
                            description: body.description || 'Thanks for supporting us'
                        },
                        unit_amount: amountInCents,
                        ...(recurring ? { recurring } : {}),
                    },
                    quantity: 1
                }
            ],
            mode,
            billing_address_collection: 'required',
            phone_number_collection: { enabled: true },
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/?canceled=true`,
            metadata: {
                source: body.source || 'donation-form',
                interval: interval,
                anonymous: body.anonymous ? String(body.anonymous) : 'false',
                cover_fees: body.coverFees ? String(body.coverFees) : 'false',
            }
        };

        const session = await stripe.checkout.sessions.create(sessionParams);

        // Return the session URL as JSON to client for redirect
        return NextResponse.json({ url: session.url }, { status: 201 })

    } catch (err: unknown) {
        console.error(err)
        const message = err instanceof Error ? err.message : String(err)
        return NextResponse.json(
            { error: message || 'Internal error' },
            { status: 500 }
        )
    }
}
