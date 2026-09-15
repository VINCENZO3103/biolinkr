import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-08-26.dahlia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Supporta solo POST
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  console.log('🔔 Webhook ricevuto!');
  
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('❌ Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
  const session = event.data.object as Stripe.Checkout.Session;
  
  const { userId, profileId } = session.metadata || {};
  
  console.log('📋 Session metadata:', session.metadata);
  console.log('🎯 Profile ID:', profileId);
  
  if (!profileId) {
    console.error('❌ No profileId in session metadata');
    break;
  }

  console.log('🔄 Updating profile', profileId, 'to trialing');

  const { data, error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'trialing',
      updated_at: new Date().toISOString(),
    })
    .eq('id', profileId);

  console.log('📊 Update result:', { data, error });

  if (error) {
    console.error('❌ Supabase error:', error);
  } else {
    console.log('✅ Profile updated successfully');
  }

  break;
}

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        
        const profileId = subscription.metadata?.profileId;
        
        if (!profileId) {
          console.error('❌ No profileId in subscription metadata');
          break;
        }

        const status = subscription.status;
        const endDate = subscription.ended_at 
          ? new Date(subscription.ended_at * 1000).toISOString()
          : subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null;

        console.log(`✅ Updating profile ${profileId} to ${status}`);

        await supabase
          .from('profiles')
          .update({
            subscription_status: status,
            subscription_end_date: endDate,
            plan: status === 'active' || status === 'trialing' ? 'premium' : 'free',
            updated_at: new Date().toISOString(),
          })
          .eq('id', profileId);

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        
        const profileId = subscription.metadata?.profileId;
        
        if (!profileId) {
          console.error('❌ No profileId in subscription metadata');
          break;
        }

        console.log(`✅ Cancelling profile ${profileId}`);

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'canceled',
            plan: 'free',
            updated_at: new Date().toISOString(),
          })
          .eq('id', profileId);

        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Gestisci esplicitamente altri metodi con 405
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}