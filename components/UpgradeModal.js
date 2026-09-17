import { useState } from 'react';

export default function UpgradeModal({ onClose }) {
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCheckout() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Something went wrong. Please try again.');
        setLoading(false);
      }
    } catch (e) {
      setError('Could not connect to checkout. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Upgrade to Pro</h2>
            <p style={styles.subtitle}>Unlimited generations. No daily limits.</p>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Features */}
        <ul style={styles.features}>
          {[
            '⚡ Unlimited Beat Titles, YouTube SEO & more',
            '🔓 All 5 tools, always',
            '🚀 Faster generation queue',
            '💬 Priority support',
          ].map((f) => (
            <li key={f} style={styles.featureItem}>{f}</li>
          ))}
        </ul>

        {/* Plan Selector */}
        <div style={styles.plans}>
          {/* Monthly */}
          <div
            style={{
              ...styles.planCard,
              ...(selectedPlan === 'monthly' ? styles.planSelected : {}),
            }}
            onClick={() => setSelectedPlan('monthly')}
          >
            <div style={styles.planRadio}>
              <div style={selectedPlan === 'monthly' ? styles.radioFilled : styles.radioEmpty} />
            </div>
            <div>
              <div style={styles.planName}>Monthly</div>
              <div style={styles.planPrice}>$9.99<span style={styles.planPer}>/mo</span></div>
            </div>
          </div>

          {/* Annual */}
          <div
            style={{
              ...styles.planCard,
              ...(selectedPlan === 'annual' ? styles.planSelected : {}),
            }}
            onClick={() => setSelectedPlan('annual')}
          >
            <div style={styles.planRadio}>
              <div style={selectedPlan === 'annual' ? styles.radioFilled : styles.radioEmpty} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={styles.planName}>Annual</span>
                <span style={styles.saveBadge}>SAVE 33%</span>
              </div>
              <div style={styles.planPrice}>
                $79.99<span style={styles.planPer}>/yr</span>
                <span style={styles.planPerMonth}> ($6.67/mo)</span>
              </div>
            </div>
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {/* CTA */}
        <button
          style={{ ...styles.ctaBtn, ...(loading ? styles.ctaBtnDisabled : {}) }}
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading
            ? 'Redirecting to checkout...'
            : selectedPlan === 'annual'
            ? 'Get Annual Pro — $79.99/yr'
            : 'Get Monthly Pro — $9.99/mo'}
        </button>

        <p style={styles.fine}>
          Secured by Stripe · Cancel anytime · No hidden fees
        </p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modal: {
    background: '#1a1a2e',
    border: '1px solid #2a2a4a',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '440px',
    width: '100%',
    color: '#fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '22px',
    fontWeight: '700',
  },
  subtitle: {
    margin: '4px 0 0',
    color: '#888',
    fontSize: '14px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '4px',
  },
  features: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  featureItem: {
    fontSize: '14px',
    color: '#ccc',
  },
  plans: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  planCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px',
    border: '2px solid #2a2a4a',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'border-color 0.15s',
  },
  planSelected: {
    borderColor: '#ff6b35',
    background: 'rgba(255,107,53,0.08)',
  },
  planRadio: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid #555',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioEmpty: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  radioFilled: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#ff6b35',
  },
  planName: {
    fontWeight: '600',
    fontSize: '15px',
  },
  planPrice: {
    fontSize: '20px',
    fontWeight: '700',
    marginTop: '2px',
  },
  planPer: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#888',
  },
  planPerMonth: {
    fontSize: '12px',
    fontWeight: '400',
    color: '#888',
  },
  saveBadge: {
    background: '#ff6b35',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '4px',
    letterSpacing: '0.5px',
  },
  ctaBtn: {
    width: '100%',
    padding: '15px',
    background: '#ff6b35',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '12px',
  },
  ctaBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  fine: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#555',
    margin: 0,
  },
  error: {
    color: '#ff4444',
    fontSize: '13px',
    marginBottom: '12px',
    textAlign: 'center',
  },
};
