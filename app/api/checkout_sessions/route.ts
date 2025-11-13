import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../../lib/stripe'

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const body = await req.json()
        // Expect amount in dollars
        const rawAmount = body.amount
        const currency = (body.currency || 'usd').toLowerCase()

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

        const session = await stripe.checkout.sessions.create({
        
       // Update payment methods (look into ACH and direct debit)
        payment_method_types: ['card', 'cashapp', 'crypto', 'link'],
        line_items: [
            {
            price_data: {
                currency,
                product_data: {
                name: 'Donation',
                description: body.description || 'Thanks for supporting us'
                },
                unit_amount: amountInCents
            },
            quantity: 1
            }
        ],
        mode: 'payment',
        // Collect billing address and phone number from donor
        billing_address_collection: 'required',
        phone_number_collection: { enabled: true },
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/?canceled=true`,

        // metadata for identifying payment
        metadata: {
            source: 'donation-form',
            // ID from database
        }
        })

        // Return the session URL as JSON to client for redirect
        return NextResponse.json({ url: session.url }, { status: 201 })

    } catch (err: any) {
        console.error(err)
        return NextResponse.json(
        { error: err.message || 'Internal error' },
        { status: err.statusCode || 500 }
        )
    }
}
