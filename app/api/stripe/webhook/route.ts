import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-08-26.dahlia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  console.log('🔔 Webhook received!');
  
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.error('❌ Missing stripe-signature header');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  console.log('Signature header:', signature);
  console.log('Signature length:', signature.length);
  console.log('Webhook secret length:', webhookSecret?.length);
  console.log('Webhook secret starts with:', webhookSecret?.substring(0, 6));

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('✅ Event constructed:', event.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    console.log('🎉 checkout.session.completed received');
    
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    console.log('User ID from metadata:', userId);

    if (!userId) {
      console.error('❌ No userId in session metadata');
      return NextResponse.json({ error: 'No userId' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        plan: 'PREMIUM',
        subscription_status: 'active',
        subscription_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('❌ Error updating user plan:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    console.log('✅ User updated to PREMIUM:', data);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}