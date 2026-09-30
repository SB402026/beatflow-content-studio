import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const [status, setStatus] = useState('loading'); // loading | ask-email | verifying | success | error
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
          setEmail(emailToCheck);
          setPlan(data.plan || 'pro');
          setStatus('success');
        } else { setStatus('error'); }
      })
      .catch(() => setStatus('error'));
  }

  function handleEmailSubmit(e) {
    e.preventDefault();
    if (!inputEmail.trim()) return;
    verify(inputEmail.trim());
  }

  if (status === 'loading') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Verifying your access...</p>
        </div>
      </div>
    );
  }

  if (status === 'ask-email') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.iconWrap}>🎵</div>
          <h1 style={styles.title}>Confirm Your Access</h1>
          <p style={styles.subtitle}>Enter the email you used to purchase BeatScript Pro.</p>
          <form onSubmit={handleEmailSubmit} style={styles.form}>
            <input
              type="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              placeholder="you@example.com"
              style={styles.input}
              required
              autoFocus
            />
            <button type="submit" style={styles.button}>Verify Access →</button>
          </form>
        </div>
      </div>
    );
  }

  if (status === 'verifying') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Checking membership...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.iconWrap}>⚠️</div>
          <h1 style={styles.title}>Access Not Found</h1>
          <p style={styles.subtitle}>
            We couldn't verify a BeatScript Pro membership for <strong>{email}</strong>.
          </p>
          <p style={{ ...styles.subtitle, marginTop: 8 }}>
            Make sure you're using the same email from your Whop purchase.
          </p>
          <button onClick={() => { setStatus('ask-email'); setInputEmail(''); }} style={styles.button}>
            Try a Different Email
          </button>
          <a href="https://whop.com/beatscript-eaf8/" style={styles.link}>Get BeatScript Pro →</a>
        </div>
      </div>
    );
  }

  // success
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>🎉</div>
        <h1 style={styles.title}>You're In!</h1>
        <p style={styles.subtitle}>
          BeatScript Pro is now active for <strong>{email}</strong>.
          {plan && <span> Plan: <strong>{plan}</strong></span>}
        </p>
        <button onClick={() => router.push('/')} style={styles.button}>
          Open BeatScript →
        </button>
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
    background: '#0d0d1a',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: '24px 16px',
  },
  card: {
    background: '#161628',
    border: '1px solid #2a2a45',
    borderRadius: 16,
    padding: '40px 36px',
    maxWidth: 440,
    width: '100%',
    textAlign: 'center',
  },
  iconWrap: {
    fontSize: 48,
    marginBottom: 20,
  },
  title: {
    color: '#e8e8f0',
    fontSize: '1.6rem',
    fontWeight: 700,
    marginBottom: 12,
  },
  subtitle: {
    color: '#9090b0',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    marginBottom: 24,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  input: {
    background: '#0d0d1a',
    border: '1px solid #2a2a45',
    borderRadius: 8,
    color: '#e8e8f0',
    fontSize: '1rem',
    padding: '12px 14px',
    outline: 'none',
    width: '100%',
  },
  button: {
    background: '#ff6b35',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    padding: '12px 24px',
    width: '100%',
    marginTop: 4,
  },
  link: {
    color: '#ff6b35',
    display: 'block',
    fontSize: '0.9rem',
    marginTop: 16,
    textDecoration: 'none',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid #2a2a45',
    borderTop: '3px solid #ff6b35',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 20px',
  },
  loadingText: {
    color: '#9090b0',
    fontSize: '0.95rem',
  },
};
