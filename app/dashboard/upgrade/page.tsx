'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  username: string;
  plan: 'free' | 'premium';
  subscription_status: string | null;
}

export default function UpgradePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [processing, setProcessing] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const PRICE_IDS = {
    monthly: 'price_1UG37rV05Ak3S5GruigAUSMF',  
    yearly: 'price_1UG38sV05Ak3S5GrsXIlpeYV',
  };

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, plan, subscription_status')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpgrade() {
    if (!profile) return;
    
    setProcessing(true);
    setError(null);

    try {
      const priceId = billingPeriod === 'monthly' ? PRICE_IDS.monthly : PRICE_IDS.yearly;

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: profile.id,
          profileId: profile.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (!data.url) {
        throw new Error('No URL returned from checkout');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Upgrade error:', error);
      setError(error instanceof Error ? error.message : 'Si è verificato un errore');
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Profilo non trovato</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Upgrade del Piano</h1>
      <p className="text-gray-600 mb-8">Scegli il piano migliore per te</p>

      {/* Messaggio di errore */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Errore</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Stato attuale */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Il tuo piano attuale</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold capitalize text-gray-900">
              {profile.plan === 'premium' ? 'Premium' : 'Free'}
            </p>
            {profile.subscription_status && (
              <p className="text-sm text-gray-500">
                Stato: {profile.subscription_status}
              </p>
            )}
          </div>
          {profile.plan === 'premium' ? (
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
              Attivo
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-medium">
              Piano gratuito
            </span>
          )}
        </div>
      </div>

      {/* Toggle mensile/annuale */}
      {profile.plan === 'free' && (
        <div className="flex items-center justify-center mb-8">
          <span className={`mr-3 font-medium ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Mensile
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              billingPeriod === 'yearly' ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                billingPeriod === 'yearly' ? 'left-8' : 'left-1'
              }`}
            />
          </button>
          <span className={`ml-3 font-medium ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Annuale
          </span>
          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
            -17%
          </span>
        </div>
      )}

      {/* Piano Premium */}
      {profile.plan === 'free' && (
        <div className="bg-white rounded-lg shadow-lg p-8 border border-purple-200">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Piano Premium</h2>
              <p className="text-gray-600">Tutte le funzionalità per crescere il tuo brand</p>
            </div>
            <div className="text-right">
              {billingPeriod === 'monthly' ? (
                <>
                  <p className="text-sm text-gray-500 line-through">€9.99/mese</p>
                  <p className="text-4xl font-bold text-purple-600">€5.99</p>
                  <p className="text-sm text-gray-500">al mese</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-500 line-through">€99.99/anno</p>
                  <p className="text-4xl font-bold text-purple-600">€59.99</p>
                  <p className="text-sm text-gray-500">all'anno</p>
                </>
              )}
            </div>
          </div>

          {/* Badge trial */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="font-semibold text-green-800">Prova gratuita di 7 giorni</p>
                <p className="text-sm text-green-700">Nessun addebito durante il periodo di prova</p>
              </div>
            </div>
          </div>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Badge verificato
            </li>
            <li className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Dominio personalizzato
            </li>
            <li className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Analytics avanzati
            </li>
            <li className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Supporto prioritario
            </li>
            <li className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Link illimitati
            </li>
          </ul>

          <div className="flex items-center justify-between mb-6">
            <div>
              {billingPeriod === 'monthly' ? (
                <>
                  <p className="text-3xl font-bold text-gray-900">€5.99</p>
                  <p className="text-gray-500">al mese (dopo 7 giorni gratis)</p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold text-gray-900">€59.99</p>
                  <p className="text-gray-500">all'anno (dopo 7 giorni gratis)</p>
                </>
              )}
            </div>
            <button
              onClick={handleUpgrade}
              disabled={processing}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Elaborazione...' : 'Inizia prova gratuita'}
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Pagamento sicuro con Stripe. Puoi cancellare in qualsiasi momento.
          </p>
        </div>
      )}

      {/* Se già premium */}
      {profile.plan === 'premium' && (
        <div className="bg-white rounded-lg shadow p-6 border border-green-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Grazie per essere Premium! 🎉</h2>
          <p className="text-gray-600 mb-4">
            Hai accesso a tutte le funzionalità premium.
          </p>
          <button
            onClick={() => {
              // Qui puoi aggiungere un link al Stripe Customer Portal
            }}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Gestisci abbonamento →
          </button>
        </div>
      )}
    </div>
  );
}