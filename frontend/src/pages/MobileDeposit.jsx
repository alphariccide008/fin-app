import { useState, useRef } from 'react';
import {
  Smartphone, DollarSign, FileText, Upload, CheckCircle2,
  Clock, AlertCircle, X, Camera,
} from 'lucide-react';
import { mobileDeposit } from '../api/transactions';
import { UserPageLayout } from '../components/UserPageLayout';

const GREEN    = '#003D2B';
const GREEN_MID = '#005C40';
const LEMON    = '#C8E15A';
const LEMON_DK = '#8FAB32';
const LEMON_LT = '#EDF5C8';
const BORDER   = '#E2E8F0';
const MUTED    = '#64748B';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

const CheckImageUpload = ({ label, value, onChange }) => {
  const ref = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <p style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.4px', margin: '0 0 8px' }}>{label}</p>
      {value ? (
        <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: `2px solid ${LEMON}` }}>
          <img src={value} alt={label} style={{ width: '100%', height: 170, objectFit: 'cover', display: 'block' }} />
          <button
            type="button"
            onClick={() => onChange(null)}
            style={{
              position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(0,0,0,.6)', border: 'none', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', color: '#fff',
            }}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => ref.current.click()}
          style={{
            border: `2px dashed ${BORDER}`, borderRadius: 10, height: 170,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 8, cursor: 'pointer', background: '#f8fafc', transition: 'border-color .2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = LEMON_DK}
          onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}
        >
          <Camera size={26} style={{ color: '#cbd5e1' }} />
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
            Click to upload check image<br />(optional)
          </p>
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
};

export default function MobileDeposit() {
  const [amount, setAmount]       = useState('');
  const [desc, setDesc]           = useState('');
  const [checkFront, setFront]    = useState(null);
  const [checkBack, setBack]      = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError('Please enter a valid deposit amount.'); return; }
    if (amt > 50000) { setError('Single mobile deposit limit is $50,000.'); return; }

    setLoading(true);
    try {
      const { data } = await mobileDeposit({ amount: amt, description: desc.trim() || undefined });
      setSuccess(data.transaction);
    } catch (err) {
      setError(err.response?.data?.message || 'Deposit failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAmount(''); setDesc(''); setFront(null); setBack(null);
    setError(''); setSuccess(null);
  };

  return (
    <UserPageLayout>
      <div style={{ flex: 1, background: '#F0F2F5', overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '22px 20px', width: '100%', boxSizing: 'border-box' }}>

          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: GREEN, margin: '0 0 3px' }}>Mobile Deposit</h1>
            <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>Deposit a check directly from your device. Funds post after admin review.</p>
          </div>

          {success ? (
            /* ── Success screen ── */
            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ background: `linear-gradient(135deg, ${GREEN}, ${GREEN_MID})`, padding: '24px 28px', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(200,225,90,.2)', border: `2px solid rgba(200,225,90,.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <Clock size={26} style={{ color: LEMON }} />
                </div>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>Deposit Submitted</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', margin: 0 }}>Awaiting admin review</p>
              </div>

              <div style={{ padding: '24px 28px' }}>
                <div style={{ background: LEMON_LT, borderRadius: 10, padding: '18px 20px', marginBottom: 20, border: `1px solid rgba(200,225,90,.3)` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: MUTED }}>Amount</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: GREEN }}>{fmt(success.amount)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: MUTED }}>Description</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{success.description}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: MUTED }}>Reference</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', fontFamily: 'monospace' }}>{success.reference}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: MUTED }}>Status</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '2px 10px', borderRadius: 20, border: '1px solid #fcd34d' }}>
                      PENDING REVIEW
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', background: '#fffbeb', borderRadius: 8, border: '1px solid #fcd34d', marginBottom: 20 }}>
                  <Clock size={14} style={{ color: '#d97706', flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 12, color: '#92400e', margin: 0, lineHeight: 1.5 }}>
                    Your deposit is under review. Once approved by our team it will be posted to your account and your balance will be updated.
                  </p>
                </div>

                <button
                  onClick={reset}
                  style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', background: `linear-gradient(135deg, ${LEMON}, ${LEMON_DK})`, color: GREEN }}
                >
                  Make Another Deposit
                </button>
              </div>
            </div>
          ) : (
            /* ── Deposit form ── */
            <form onSubmit={handleSubmit}>
              <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
                {/* Card header */}
                <div style={{ background: `linear-gradient(135deg, ${GREEN}, ${GREEN_MID})`, padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(200,225,90,.2)', border: '1px solid rgba(200,225,90,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Smartphone size={17} style={{ color: LEMON }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>Deposit a Check</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', margin: '1px 0 0' }}>Enter amount and upload check images</p>
                  </div>
                </div>

                <div style={{ padding: '22px 24px' }}>
                  {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, marginBottom: 18, fontSize: 13, color: '#b91c1c' }}>
                      <AlertCircle size={14} style={{ flexShrink: 0 }} /> {error}
                    </div>
                  )}

                  {/* Amount */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 8 }}>
                      Deposit Amount *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <DollarSign size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="50000"
                        placeholder="0.00"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        required
                        style={{ width: '100%', paddingLeft: 38, paddingRight: 14, paddingTop: 12, paddingBottom: 12, border: `1.5px solid ${BORDER}`, borderRadius: 9, fontSize: 15, fontWeight: 600, color: '#1e293b', outline: 'none', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = LEMON_DK}
                        onBlur={e => e.target.style.borderColor = BORDER}
                      />
                    </div>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: '5px 0 0' }}>Maximum single deposit: $50,000</p>
                  </div>

                  {/* Description */}
                  <div style={{ marginBottom: 22 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 8 }}>
                      Description (optional)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <FileText size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="text"
                        placeholder="e.g. Paycheck, Refund check..."
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        maxLength={120}
                        style={{ width: '100%', paddingLeft: 38, paddingRight: 14, paddingTop: 12, paddingBottom: 12, border: `1.5px solid ${BORDER}`, borderRadius: 9, fontSize: 14, color: '#1e293b', outline: 'none', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = LEMON_DK}
                        onBlur={e => e.target.style.borderColor = BORDER}
                      />
                    </div>
                  </div>

                  {/* Check images */}
                  <div className="dep-img-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
                    <CheckImageUpload label="Front of Check" value={checkFront} onChange={setFront} />
                    <CheckImageUpload label="Back of Check"  value={checkBack}  onChange={setBack}  />
                  </div>

                  {/* Notice */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '11px 14px', background: LEMON_LT, borderRadius: 8, border: `1px solid rgba(200,225,90,.3)`, marginBottom: 22 }}>
                    <CheckCircle2 size={13} style={{ color: LEMON_DK, flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5 }}>
                      Deposits are reviewed by our team before being posted. Funds will be available once approved. Do not destroy the original check until the deposit is posted.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !amount}
                    style={{
                      width: '100%', padding: '13px', borderRadius: 10, border: 'none',
                      fontWeight: 700, fontSize: 14, cursor: loading || !amount ? 'not-allowed' : 'pointer',
                      background: loading || !amount ? '#e2e8f0' : `linear-gradient(135deg, ${LEMON}, ${LEMON_DK})`,
                      color: loading || !amount ? '#94a3b8' : GREEN,
                      transition: 'all .2s',
                    }}
                  >
                    {loading ? 'Submitting...' : 'Submit Deposit'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 500px) {
          .dep-img-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </UserPageLayout>
  );
}
