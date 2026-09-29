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

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId, profileId } = await request.json();

    console.log('Checkout params:', { priceId, userId, profileId });

    if (!priceId || !userId || !profileId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, stripe_customer_id')
      .eq('id', userId)
      .single();

    console.log('Profile query result:', { profile, profileError });

    if (profileError || !profile) {
      console.error('Profile error:', profileError);
      return NextResponse.json(
        { error: 'Profile not found. User ID: ' + userId },
        { status: 404 }
      );
    }

    console.log('Creating Stripe session...');

    // Controlla se ha già usato una prova
    let hasUsedTrial = false;

    if (profile.stripe_customer_id) {
      const subscriptions = await stripe.subscriptions.list({
        customer: profile.stripe_customer_id,
        limit: 100,
      });

      hasUsedTrial = subscriptions.data.some(
        (sub) =>
          sub.trial_end != null ||
          sub.metadata?.trial_used === 'true'
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'klarna'], // <-- AGGIUNTO "klarna" qui
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      // Applica trial solo se NON ha mai usato una prova
      ...(hasUsedTrial
        ? {}
        : {
            subscription_data: {
              trial_period_days: 7,
              metadata: {
                userId,
                profileId,
                trial_used: 'true',
              },
            },
          }),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      customer_email: undefined,
      metadata: {
        userId,
        profileId,
        username: profile.username,
      },
    });

    console.log('Stripe session created:', session.id);

    return NextResponse.json({ url: session.url, successPath: '/dashboard/upgrade/success' });
  } catch (error: any) {
  console.error('Checkout session error:', error);
  return NextResponse.json(
    {
      error: 'Internal server error',
      details: {
        message: error?.message || String(error),
        type: error?.type,
        code: error?.code,
      },
    },
    { status: 500 }
  );
}
}