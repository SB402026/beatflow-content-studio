import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [email, setEmail] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [plan, setPlan] = useState('');

  useEffect(() => {
    const { email: queryEmail } = router.query;
    if (!router.isReady) return;
    if (queryEmail) {
      setEmail(queryEmail);
      verify(queryEmail);
    } else {
      setStatus('ask-email');
    }
  }, [router.isReady, router.query]);

  function verify(emailToCheck) {
    setStatus('verifying');
    fetch(`/api/verify-session?email=${encodeURIComponent(emailToCheck)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const proData = {
            email: emailToCheck,
            plan: data.plan || 'pro',
            isPro: true,
            lastVerified: Date.now(),
            since: new Date().toISOString(),
            validUntil: data.validUntil || null,
          };
          try { localStorage.setItem('beatscript_pro', JSON.stringify(proData)); } catch (_) {}
          if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'Purchase', { value: 19.00, currency: 'USD' });
          }
          setEmail(emailToCheck);
          setPlan(data.plan || 'pro');
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }

  if (status === 'loading') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.spinner}></div>
          <p style={styles.text}>Verifying your subscription...</p>
        </div>
      </div>
    );
  }

  if (status === 'ask-email') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Confirm Your Email</h1>
          <p style={styles.text}>Enter the email address you used to purchase BeatScript Pro.</p>
          <input
            type="email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            placeholder="your@email.com"
            style={styles.input}
            onKeyDown={(e) => e.key === 'Enter' && verify(inputEmail)}
          />
          <button
            onClick={() => verify(inputEmail)}
            style={styles.button}
          >
            Verify Access
          </button>
        </div>
      </div>
    );
  }

  if (status === 'verifying') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.spinner}></div>
          <p style={styles.text}>Verifying {email}...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Access Not Found</h1>
          <p style={styles.text}>
            We couldn&apos;t verify your subscription. Make sure you&apos;re using the email
            you signed up with on Whop.
          </p>
          <button onClick={() => setStatus('ask-email')} style={styles.button}>
            Try Again
          </button>
          <a href="https://whop.com/beatscript-eaf8/" style={styles.link}>
            Get BeatScript Pro →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.checkmark}>✓</div>
        <h1 style={styles.title}>You&apos;re In!</h1>
        <p style={styles.text}>
          Welcome to BeatScript Pro{plan ? ` (${plan})` : ''}. Your account is active.
        </p>
        <p style={styles.emailBadge}>{email}</p>
        <a href="/" style={styles.button}>
          Start Creating →
        </a>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: '20px',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,107,53,0.3)',
    borderRadius: '16px',
    padding: '48px 40px',
    textAlign: 'center',
    maxWidth: '420px',
    width: '100%',
  },
  title: {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '16px',
  },
  text: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  emailBadge: {
    color: '#ff6b35',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '24px',
    background: 'rgba(255,107,53,0.1)',
    padding: '8px 16px',
    borderRadius: '20px',
    display: 'inline-block',
  },
  button: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #ff6b35, #ff4500)',
    color: '#ffffff',
    padding: '14px 32px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    marginTop: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    marginBottom: '16px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255,107,53,0.2)',
    borderTop: '3px solid #ff6b35',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  checkmark: {
    fontSize: '48px',
    color: '#ff6b35',
    marginBottom: '16px',
  },
  link: {
    display: 'block',
    color: 'rgba(255,255,255,0.5)',
    marginTop: '16px',
    fontSize: '14px',
    textDecoration: 'none',
  },
};
