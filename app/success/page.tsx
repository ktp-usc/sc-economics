// app/success/page.tsx
import { env } from 'process';
import Stripe from 'stripe';
import SuccessRedirect from './SuccessRedirect'

const stripe = new Stripe(
	process.env.STRIPE_PUBLIC_TEST_SECRET || ""
)

interface PageProps {
  	searchParams: { session_id?: string };
}

export default async function SuccessPage({ searchParams }: PageProps) {
  	const sessionId = (await searchParams).session_id;

  	if (!sessionId) {
    	return (
      		<div>
        		<h1>Error</h1>
        		<p>No session ID provided</p>
      		</div>
    	);
  	}

  	try {
    	const session = await stripe.checkout.sessions.retrieve(sessionId, {
      		expand: ['line_items', 'customer'], // Optional: get additional details
    	});

			return (
				<div>
					<SuccessRedirect />
					<h1>Payment Successful!</h1>
					<p>Amount: ${(session.amount_total! / 100).toFixed(2)}</p>
					<p>Customer Email: {session.customer_details?.email}</p>
					<p>Customer Name: {session.customer_details?.name}</p>
					<p>Address: {JSON.stringify(session.customer_details?.address)}</p>

					<p>Status: {session.payment_status}</p>
				</div>
			);
  	} catch (error) {
    	return (
			<div>
				<h1>Error</h1>
				<p>Could not retrieve session</p>
			</div>
    	);
  	}
}
