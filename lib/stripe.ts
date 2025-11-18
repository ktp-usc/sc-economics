import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(
    process.env.STRIPE_PUBLIC_TEST_SECRET || ""
)

//export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)