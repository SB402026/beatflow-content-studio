import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('');

  useEffect(() => {
    const { session_id } = router.query;
    if (!session_id) return;

    fetch(`/api/verify-session?session_id=${session_id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          // Save to localStorage — useSubscription will pick this up
          const proData = {
            email: data.email,
            customerId: data.customerId,
            subscriptionId: data.subscriptionId,
            plan: data.plan,
            isPro: true,
            lastVerified: Date.now(),
            since: new Date().toISOString(),
          };
          localStorage.setItem('beatscript_pro', JSON.stringify(proData));
          setEmail(data.email);
          setPlan(data.plan);
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [router.query]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {status === 'loading' && (
          <>
            <div style={styles.spinner}>⚡</div>
            <h2 style={styles.heading}>Activating your Pro account...</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={styles.checkmark}>🎉</div>
            <h1 style={styles.heading}>You're now BeatScript Pro!</h1>
            <p style={styles.sub}>
              Confirmed for <strong>{email}</strong>
              {plan === 'annual' && (
                <span style={styles.badge}> Annual Plan</span>
              )}
              {plan === 'monthly' && (
                <span style={styles.badge}> Monthly Plan</span>
              )}
            </p>
            <ul style={styles.perks}>
              <li>✅ Unlimited Beat Titles</li>
              <li>✅ Unlimited YouTube SEO</li>
              <li>✅ Unlimited Social Captions</li>
              <li>✅ Unlimited Bio Writer</li>
              <li>✅ Unlimited Pricing Copy</li>
            </ul>
            <button style={styles.btn} onClick={() => router.push('/')}>
              Start Generating →
            </button>
            <p style={styles.fine}>
              A receipt was sent to your email. Manage your subscription at{' '}
              <a
                href="https://billing.stripe.com/p/login/test_xxx"
                style={{ color: '#ff6b35' }}
              >
                the billing portal
              </a>
              .
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={styles.checkmark}>⚠️</div>
            <h2 style={styles.heading}>Something went wrong</h2>
            <p style={styles.sub}>
              Your payment may have gone through — check your email for a
              Stripe receipt. If you were charged,{' '}
              <a href="mailto:support@beatscriptapp.com" style={{ color: '#ff6b35' }}>
                contact support
              </a>{' '}
              and we'll activate your account manually.
            </p>
            <button style={styles.btn} onClick={() => router.push('/')}>
              Back to BeatScript
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0d0d1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  card: {
    background: '#1a1a2e',
    border: '1px solid #2a2a4a',
    borderRadius: '20px',
    padding: '48px 40px',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    color: '#fff',
  },
  spinner: {
    fontSize: '48px',
    marginBottom: '16px',
    display: 'block',
    animation: 'pulse 1s infinite',
  },
  checkmark: {
    fontSize: '56px',
    marginBottom: '16px',
    display: 'block',
  },
  heading: {
    margin: '0 0 12px',
    fontSize: '26px',
    fontWeight: '700',
  },
  sub: {
    color: '#aaa',
    fontSize: '15px',
    marginBottom: '24px',
  },
  badge: {
    background: '#ff6b35',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px',
    marginLeft: '6px',
    verticalAlign: 'middle',
  },
  perks: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 32px',
    textAlign: 'left',
    display: 'inline-block',
    lineHeight: '2',
    fontSize: '15px',
    color: '#ccc',
  },
  btn: {
    background: '#ff6b35',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 32px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'block',
    width: '100%',
    marginBottom: '20px',
  },
  fine: {
    fontSize: '12px',
    color: '#555',
    margin: 0,
  },
};
