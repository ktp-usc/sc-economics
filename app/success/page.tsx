// app/success/page.tsx
import Stripe from 'stripe';
import SuccessRedirect from './SuccessRedirect'
import { prisma } from '@/lib/prisma';

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

		// Decrement inventory if this is a product purchase
		if (session.payment_status === 'paid' && session.metadata?.itemId) {
			const itemId = session.metadata.itemId;
			try {
				// Check if item exists and get current availability
				const item = await prisma.item.findUnique({
					where: { id: itemId },
					select: { available: true }
				});

				if (item && item.available > 0) {
					await prisma.item.update({
						where: { id: itemId },
						data: {
							available: {
								decrement: 1
							}
						}
					});
					console.log(`Decremented inventory for item ${itemId}. New count: ${item.available - 1}`);
				} else if (item && item.available === 0) {
					console.warn(`Item ${itemId} already at 0 availability, skipping decrement`);
				} else {
					console.error(`Item not found: ${itemId}`);
				}
			} catch (error) {
				// Log error but don't fail the success page
				console.error('Error decrementing inventory:', error);
			}
		}

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
		console.error(error)
		return (
			<div>
				<h1>Error</h1>
				<p>Could not retrieve session</p>
			</div>
		);
	}
}
