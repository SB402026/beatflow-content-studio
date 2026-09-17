import { useState, useEffect } from 'react';

const STORAGE_KEY = 'beatscript_pro';
// Re-verify against Stripe every 24 hours
const VERIFY_INTERVAL_MS = 24 * 60 * 60 * 1000;

export function useSubscription() {
  const [isPro, setIsPro] = useState(false);
  const [plan, setPlan] = useState(null); // 'monthly' | 'annual' | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          setIsPro(false);
          setLoading(false);
          return;
        }

        const stored = JSON.parse(raw);
        const lastVerified = stored.lastVerified || 0;
        const needsRefresh = Date.now() - lastVerified > VERIFY_INTERVAL_MS;

        if (!needsRefresh) {
          // Trust local cache
          setIsPro(stored.isPro ?? true);
          setPlan(stored.plan);
          setLoading(false);
          return;
        }

        // Re-verify with Stripe
        const res = await fetch(
          `/api/check-subscription?email=${encodeURIComponent(stored.email)}`
        );
        const data = await res.json();

        const updated = {
          ...stored,
          isPro: data.isPro,
          plan: data.plan,
          lastVerified: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        setIsPro(data.isPro);
        setPlan(data.plan);
      } catch (e) {
        // Fallback: trust local cache on network error
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const stored = JSON.parse(raw);
            setIsPro(stored.isPro ?? false);
            setPlan(stored.plan ?? null);
          }
        } catch (_) {}
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, []);

  function activatePro({ email, customerId, subscriptionId, plan: p }) {
    const data = {
      email,
      customerId,
      subscriptionId,
      plan: p,
      isPro: true,
      lastVerified: Date.now(),
      since: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setIsPro(true);
    setPlan(p);
  }

  function clearPro() {
    localStorage.removeItem(STORAGE_KEY);
    setIsPro(false);
    setPlan(null);
  }

  return { isPro, plan, loading, activatePro, clearPro };
}
