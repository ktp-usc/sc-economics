// app/success/page.tsx
import SuccessRedirect from './SuccessRedirect'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import type { PurchaseType } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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

		// Check whether donor requested anonymity (stored as metadata on the Checkout Session)
		const anonymousFlag = !!(session.metadata && (session.metadata.anonymous === 'true' || session.metadata.anonymous === '1' || session.metadata.anonymous === 'yes'));
		// Check whether donor chose to cover processing fees
		const coverFeesFlag = !!(session.metadata && (session.metadata.cover_fees === 'true' || session.metadata.cover_fees === '1' || session.metadata.cover_fees === 'yes'));
        

		// Extract primary line item info (with runtime guards because Stripe types can be unions)
		const line = session.line_items?.data?.[0];

		function isProductObject(x: unknown): x is { name?: unknown; description?: unknown; metadata?: Record<string, unknown> } {
			return typeof x === 'object' && x !== null && !Array.isArray(x);
		}

		let productName = 'Unknown';
		let productDescription = '';

		const prod = line?.price?.product;
		if (isProductObject(prod)) {
			if (typeof prod.name === 'string' && prod.name.trim() !== '') productName = prod.name;
			if (typeof prod.description === 'string') productDescription = prod.description;
			if (!productName && prod.metadata && typeof prod.metadata === 'object' && typeof prod.metadata['name'] === 'string') {
				productName = prod.metadata['name'] as string;
			}
		}

		if ((productName === 'Unknown' || !productName) && typeof line?.description === 'string' && line.description.trim() !== '') {
			productName = line.description;
		}

		// fallback to session metadata if available
		if ((productName === 'Unknown' || !productName) && typeof session.metadata?.name === 'string') productName = session.metadata.name;
		if (!productDescription && typeof session.metadata?.description === 'string') productDescription = session.metadata.description;
		const amountCents = session.amount_total ?? 0;
		const amount = Number(amountCents) / 100;

		// Session created time (seconds) -> ms
		const sessionTimeMs = (session.created ? Number(session.created) : Date.now()) * 1000;

		// Quick idempotency check:
		// 1) If a previous purchase contains this Stripe session id in its `reason`, treat as existing (prevents duplicate on refresh)
		// 2) Otherwise fall back to the earlier heuristic (same name+amount within ±5 minutes)
		const sessionIdStr = String(session.id ?? '');
		// Only check for an existing purchase by the Stripe session id
		let existing = null;
		if (sessionIdStr) {
			existing = await prisma.purchase.findFirst({ where: { stripeSessionId: sessionIdStr } });
		}

		let createdPurchase = null;
		if (!existing) {
			// Create or coerce address (customer_details may be undefined)
			const cd = session.customer_details;
			const addr = cd?.address;
			const streetRaw = addr
				? [addr.line1, addr.line2]
					  .filter((s) => typeof s === 'string' && s.trim() !== '')
					  .join(', ')
				: '';
			const cityRaw = addr?.city || '';
			const stateRaw = addr?.state || '';
			const zipCodeRaw = addr?.postal_code || '';
			const countryRaw = addr?.country || '';

			// If anonymous was requested, avoid storing PII: blank out address and email, and set name to ANONYMOUS
			const street = anonymousFlag ? '' : streetRaw;
			const city = anonymousFlag ? '' : cityRaw;
			const state = anonymousFlag ? '' : stateRaw;
			const zipCode = anonymousFlag ? '' : zipCodeRaw;
			const country = anonymousFlag ? '' : countryRaw;

			const address = await prisma.address.create({
				data: {
					street,
					city,
					state,
					zipCode,
					country,
				},
			});

			const fullName = String(cd?.name ?? '').trim();
			const parts = fullName.split(' ');
			let firstName = String(parts.shift() || '');
			const rest = parts;
			let lastName = rest.join(' ');
			if (anonymousFlag) {
				firstName = 'ANONYMOUS';
				lastName = '';
			}

			const rawType = String(session.metadata?.source ?? 'workshop');
			const allowedTypes: PurchaseType[] = ['donation', 'workshop', 'event', 'merchandise'];
			const purchaseType: PurchaseType = allowedTypes.includes(rawType as PurchaseType)
				? (rawType as PurchaseType)
				: 'workshop';

			try {
				createdPurchase = await prisma.purchase.create({
					data: {
						itemName: String(productName),
						amount: Number(amount),
						type: purchaseType,
						reason: String(productDescription ?? ''),
						stripeSessionId: sessionIdStr,
						date: new Date(sessionTimeMs),
						status: 'completed',
						addressId: address.id,
						email: anonymousFlag ? '' : String(cd?.email ?? ''),
						firstName: String(firstName ?? ''),
						lastName: String(lastName ?? ''),
					},
				});
			} catch (err) {
				// If a concurrent process already created a purchase with this session id,
				// treat it as existing (idempotent). Prisma unique constraint error code is P2002.
				if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
					createdPurchase = await prisma.purchase.findFirst({ where: { stripeSessionId: sessionIdStr } });
				} else {
					throw err;
				}
			}

			// If there is an item matching this product name, decrement its available stock.
			try {
				const matchedItem = await prisma.item.findFirst({
					where: { name: String(productName) },
				});

				if (matchedItem) {
					// Only decrement if available is greater than 0
					if (typeof matchedItem.available === 'number' && matchedItem.available > 0) {
						const updated = await prisma.item.update({
							where: { id: matchedItem.id },
							data: { available: { decrement: 1 } },
						});

						// If stock is now 0 or less, mark item Inactive
						if (typeof updated.available === 'number' && updated.available <= 0) {
							await prisma.item.update({
								where: { id: matchedItem.id },
								data: { status: 'Inactive' },
							});
						}
					}
				}
			} catch (err) {
				console.error('Error updating item stock:', err);
			}
		}

		  const cd = session.customer_details;
		  const addr = cd?.address;
		  const formattedAddress = (!anonymousFlag && addr)
			? [addr.line1, addr.line2, addr.city, addr.state, addr.postal_code, addr.country]
				.filter((s) => typeof s === 'string' && s.trim() !== '')
				.join(', ')
			: '';

		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-6">
				<Card className="w-full max-w-3xl">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Payment Successful</CardTitle>
								<CardDescription className="mt-1">Thank you for your support — your payment was processed.</CardDescription>
							</div>
							<div className="flex items-center gap-3">
								<Badge variant="default">{session.payment_status ?? 'unknown'}</Badge>
							</div>
						</div>
					</CardHeader>

					<CardContent>
						<SuccessRedirect />

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<div className="text-sm text-muted-foreground">Amount</div>
								<div className="text-2xl font-semibold">${(amount).toFixed(2)}</div>

								<div className="mt-4 text-sm text-muted-foreground">Item</div>
								<div className="font-medium">{productName} {productDescription ? `— ${productDescription}` : ''}</div>

								<div className="mt-6">
									{existing ? (
										<div className="text-sm text-muted-foreground">This purchase was already recorded.</div>
									) : (
										<div className="text-sm text-muted-foreground">Purchase recorded{createdPurchase ? '' : ' (no DB record created)'}.</div>
									)}
									{coverFeesFlag ? (
										<div className="text-sm text-muted-foreground mt-2">Processing fees were covered by donor.</div>
									) : null}
                                    
								</div>
							</div>

							<div className="space-y-4">
								<div className="text-sm text-muted-foreground">Customer</div>
								<div className="font-medium">{anonymousFlag ? 'ANONYMOUS' : (cd?.name || (createdPurchase ? `${createdPurchase.firstName} ${createdPurchase.lastName}`.trim() : '—'))}</div>
								<div className="text-sm text-muted-foreground">{anonymousFlag ? 'No email provided' : (cd?.email || (createdPurchase?.email ?? 'No email provided'))}</div>

								<div className="mt-4">
									<div className="text-sm text-muted-foreground">Address</div>
									<div className="mt-1 text-sm">{formattedAddress || 'No address provided'}</div>
								</div>
							</div>
						</div>

						<div className="mt-6 flex items-center justify-end">
							<Button variant="outline" asChild>
								<a href="/catalog">Continue browsing</a>
							</Button>
						</div>
					</CardContent>
				</Card>
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
