import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight, Search, CheckCircle2, AlertCircle, ArrowRight,
  X, Building2, Landmark, Shield, User, Clock,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { transfer, externalTransfer } from '../api/transactions';
import { lookupUser } from '../api/auth';
import { UserPageLayout } from '../components/UserPageLayout';

const GREEN    = '#003D2B';
const LEMON    = '#C8E15A';
const LEMON_DK = '#8FAB32';
const LEMON_LT = '#EDF5C8';
const BORDER   = '#E2E8F0';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

const ACCOUNT_TYPES = ['Checking', 'Savings', 'Money Market', 'Business Checking'];

export default function Transfer() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode]       = useState('internal');
  const [step, setStep]       = useState(1);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);

  // Recipient lookup state (internal only)
  const [lookupState, setLookupState] = useState('idle'); // idle | loading | found | notfound
  const [recipientInfo, setRecipientInfo] = useState(null); // { name, accountNumber }
  const lookupTimer = useRef(null);

  const [intForm, setIntForm] = useState({ recipientIdentifier: '', amount: '', description: '' });
  const [extForm, setExtForm] = useState({
    bankName: '', routingNumber: '', accountNumber: '', accountType: 'Checking',
    accountHolderName: '', amount: '', description: '',
  });

  const parsedAmount = parseFloat((mode === 'internal' ? intForm.amount : extForm.amount).replace(/,/g, '')) || 0;

  const isIntValid = intForm.recipientIdentifier.trim() && parsedAmount > 0
    && parsedAmount <= (user?.availableBalance || 0) && lookupState === 'found';
  const isExtValid = extForm.bankName.trim() && /^\d{9}$/.test(extForm.routingNumber) &&
    extForm.accountNumber.trim() && parsedAmount > 0 && parsedAmount <= (user?.availableBalance || 0);
  const isValid = mode === 'internal' ? isIntValid : isExtValid;

  // Debounced recipient lookup
  useEffect(() => {
    const id = intForm.recipientIdentifier.trim();
    if (!id || mode !== 'internal') {
      setLookupState('idle');
      setRecipientInfo(null);
      return;
    }
    setLookupState('loading');
    clearTimeout(lookupTimer.current);
    lookupTimer.current = setTimeout(async () => {
      try {
        const { data } = await lookupUser(id);
        setRecipientInfo(data);
        setLookupState('found');
      } catch {
        setRecipientInfo(null);
        setLookupState('notfound');
      }
    }, 700);
    return () => clearTimeout(lookupTimer.current);
  }, [intForm.recipientIdentifier, mode]);

  const handleAmountChange = (val) => {
    const raw = val.replace(/[^0-9.]/g, '');
    if (mode === 'internal') setIntForm(f => ({ ...f, amount: raw }));
    else setExtForm(f => ({ ...f, amount: raw }));
  };

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    try {
      let data;
      if (mode === 'internal') {
        ({ data } = await transfer({
          recipientIdentifier: intForm.recipientIdentifier.trim(),
          amount: parsedAmount,
          description: intForm.description.trim(),
        }));
      } else {
        ({ data } = await externalTransfer({
          bankName: extForm.bankName.trim(),
          routingNumber: extForm.routingNumber.trim(),
          accountNumber: extForm.accountNumber.trim(),
          accountType: extForm.accountType,
          amount: parsedAmount,
          description: extForm.description.trim(),
        }));
      }
      setResult(data);
      await refreshUser();
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed. Please try again.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setIntForm({ recipientIdentifier: '', amount: '', description: '' });
    setExtForm({ bankName: '', routingNumber: '', accountNumber: '', accountType: 'Checking', accountHolderName: '', amount: '', description: '' });
    setStep(1); setResult(null); setError('');
    setLookupState('idle'); setRecipientInfo(null);
  };

  const lookupIcon = () => {
    if (lookupState === 'loading') return <span style={{ width: 13, height: 13, border: '2px solid #94a3b8', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />;
    if (lookupState === 'found')    return <CheckCircle2 size={14} style={{ color: '#16a34a' }} />;
    if (lookupState === 'notfound') return <AlertCircle size={14} style={{ color: '#dc2626' }} />;
    return null;
  };

  return (
    <UserPageLayout>
      <div className="transfer-page-pad" style={{ flex: 1, padding: '32px 28px', background: '#F0F2F5', overflowY: 'auto' }}>

        {/* Page title */}
        <div style={{ maxWidth: 560, margin: '0 auto 20px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: GREEN, margin: '0 0 4px' }}>Payments &amp; Transfers</h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Send money securely within M&amp;T Bank or to an external account.</p>
        </div>

        <div style={{ maxWidth: 560, margin: '0 auto' }}>

          {/* Balance card */}
          <div style={{ background: '#fff', borderRadius: 8, padding: '18px 22px', border: `1px solid ${BORDER}`, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '.5px' }}>Available Balance</p>
            <p style={{ fontSize: 30, fontWeight: 800, color: GREEN, margin: 0 }}>{fmt(user?.availableBalance)}</p>
          </div>

          {/* ── SUCCESS SCREEN ── */}
          {step === 3 && (
            <div style={{ background: '#fff', borderRadius: 8, padding: '32px 28px', border: `1px solid ${BORDER}`, textAlign: 'center' }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: mode === 'external' ? '#fef3c7' : 'rgba(2,120,86,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                {mode === 'external'
                  ? <Clock size={36} style={{ color: '#d97706' }} />
                  : <CheckCircle2 size={36} style={{ color: '#027856' }} />}
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: GREEN, margin: '0 0 6px' }}>
                {mode === 'external' ? 'Transfer Pending' : 'Transfer Successful!'}
              </h2>
              <p style={{ color: '#64748b', margin: '0 0 20px', fontSize: 14 }}>
                {mode === 'external'
                  ? 'Your external transfer is queued and will be processed within 1–3 business days.'
                  : `You sent ${fmt(parsedAmount)} successfully.`}
              </p>

              {/* Receipt details */}
              <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '16px 20px', textAlign: 'left', marginBottom: 20, border: `1px solid ${BORDER}` }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '.5px', margin: '0 0 12px' }}>Receipt</p>
                {mode === 'internal' ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: '#64748b' }}>Sent To</span>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>{recipientInfo?.name || intForm.recipientIdentifier}</p>
                        <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{intForm.recipientIdentifier}</p>
                      </div>
                    </div>
                    {intForm.description && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                        <span style={{ color: '#64748b' }}>Note</span>
                        <span style={{ fontWeight: 500 }}>{intForm.description}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: '#64748b' }}>Bank</span>
                      <span style={{ fontWeight: 700 }}>{extForm.bankName}</span>
                    </div>
                    {extForm.accountHolderName && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                        <span style={{ color: '#64748b' }}>Payee</span>
                        <span style={{ fontWeight: 600 }}>{extForm.accountHolderName}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: '#64748b' }}>Account</span>
                      <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>****{extForm.accountNumber.slice(-4)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: '#64748b' }}>Routing</span>
                      <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{extForm.routingNumber}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: '#64748b' }}>Type</span>
                      <span style={{ fontWeight: 600 }}>{extForm.accountType}</span>
                    </div>
                    {extForm.description && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                        <span style={{ color: '#64748b' }}>Note</span>
                        <span style={{ fontWeight: 500 }}>{extForm.description}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: '#64748b' }}>Status</span>
                      <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 700, background: '#fef3c7', color: '#92400e' }}>PENDING</span>
                    </div>
                  </>
                )}
                <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12, marginTop: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, marginBottom: 6 }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Amount</span>
                    <span style={{ fontWeight: 800, color: GREEN }}>{fmt(parsedAmount)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: '#94a3b8' }}>Reference</span>
                    <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>{result?.transaction?.reference}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#94a3b8' }}>New Balance</span>
                    <span style={{ fontWeight: 600, color: '#374151' }}>{fmt(result?.newBalance)}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={resetAll} style={{ flex: 1, padding: '11px 0', border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 14, fontWeight: 600, color: '#374151', background: '#fff', cursor: 'pointer' }}>
                  New Transfer
                </button>
                <button onClick={() => navigate('/transactions')} style={{ flex: 1, padding: '11px 0', borderRadius: 6, fontSize: 14, fontWeight: 700, color: GREEN, background: `linear-gradient(135deg, ${LEMON}, ${LEMON_DK})`, border: 'none', cursor: 'pointer' }}>
                  View History
                </button>
              </div>
            </div>
          )}

          {step !== 3 && (
            <>
              {/* Mode toggle */}
              <div style={{ background: '#fff', borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16, padding: 6, display: 'flex', gap: 6 }}>
                {[
                  { key: 'internal', icon: ArrowLeftRight, label: 'M&T Bank Account' },
                  { key: 'external', icon: Landmark, label: 'External Bank' },
                ].map(({ key, icon: Icon, label }) => (
                  <button key={key} onClick={() => { setMode(key); setStep(1); setError(''); setLookupState('idle'); setRecipientInfo(null); }}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0', borderRadius: 6, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all .15s', background: mode === key ? GREEN : 'transparent', color: mode === key ? '#fff' : '#64748b' }}
                  >
                    <Icon size={15} /> {label}
                  </button>
                ))}
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 6, marginBottom: 14 }}>
                  <AlertCircle size={15} style={{ color: '#dc2626', flexShrink: 0 }} />
                  <p style={{ color: '#dc2626', fontSize: 13, flex: 1, margin: 0 }}>{error}</p>
                  <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}><X size={13} /></button>
                </div>
              )}

              {/* ── INTERNAL FORM ── */}
              {mode === 'internal' && step === 1 && (
                <div style={{ background: '#fff', borderRadius: 8, padding: 24, border: `1px solid ${BORDER}` }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: GREEN, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ArrowLeftRight size={17} style={{ color: LEMON_DK }} /> Transfer to M&amp;T Bank Account
                  </h3>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>Recipient (Account Number or Email)</label>
                    <div style={{ position: 'relative' }}>
                      <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input type="text" value={intForm.recipientIdentifier}
                        onChange={e => setIntForm(f => ({ ...f, recipientIdentifier: e.target.value }))}
                        placeholder="FIN-12345678 or email@example.com"
                        style={{ width: '100%', paddingLeft: 36, paddingRight: 40, paddingTop: 11, paddingBottom: 11, border: `1px solid ${lookupState === 'found' ? '#16a34a' : lookupState === 'notfound' ? '#dc2626' : BORDER}`, borderRadius: 6, fontSize: 14, color: '#1e293b', outline: 'none', boxSizing: 'border-box' }}
                      />
                      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                        {lookupIcon()}
                      </span>
                    </div>
                    {lookupState === 'found' && recipientInfo && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, padding: '8px 12px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 6 }}>
                        <User size={13} style={{ color: '#16a34a', flexShrink: 0 }} />
                        <p style={{ fontSize: 13, color: '#15803d', margin: 0, fontWeight: 600 }}>{recipientInfo.name}</p>
                        <span style={{ fontSize: 11, color: '#86efac', marginLeft: 'auto', fontFamily: 'monospace' }}>{recipientInfo.accountNumber}</span>
                      </div>
                    )}
                    {lookupState === 'notfound' && (
                      <p style={{ fontSize: 12, color: '#dc2626', margin: '4px 0 0' }}>Recipient not found or account not active</p>
                    )}
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>Amount (USD)</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, fontWeight: 600, color: '#475569' }}>$</span>
                      <input type="text" inputMode="decimal" value={intForm.amount}
                        onChange={e => handleAmountChange(e.target.value)}
                        placeholder="0.00"
                        style={{ width: '100%', paddingLeft: 28, paddingRight: 14, paddingTop: 11, paddingBottom: 11, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 18, fontWeight: 700, color: GREEN, outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    {parsedAmount > (user?.availableBalance || 0) && parsedAmount > 0 && (
                      <p style={{ fontSize: 12, color: '#dc2626', margin: '4px 0 0' }}>Insufficient balance</p>
                    )}
                  </div>

                  <div style={{ marginBottom: 22 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>
                      Description <span style={{ textTransform: 'none', fontWeight: 400, color: '#94a3b8' }}>(optional)</span>
                    </label>
                    <input type="text" value={intForm.description}
                      onChange={e => setIntForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="e.g. Rent payment, Invoice #123"
                      style={{ width: '100%', padding: '11px 14px', border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 14, color: '#1e293b', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <button onClick={() => setStep(2)} disabled={!isValid}
                    style={{ width: '100%', padding: '13px 0', borderRadius: 6, fontSize: 14, fontWeight: 700, color: GREEN, background: `linear-gradient(135deg, ${LEMON}, ${LEMON_DK})`, border: 'none', cursor: isValid ? 'pointer' : 'not-allowed', opacity: isValid ? 1 : .4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* ── EXTERNAL FORM ── */}
              {mode === 'external' && step === 1 && (
                <div style={{ background: '#fff', borderRadius: 8, padding: 24, border: `1px solid ${BORDER}` }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: GREEN, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Landmark size={17} style={{ color: LEMON_DK }} /> Transfer to External Bank
                  </h3>

                  <div className="transfer-ext-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>Bank Name</label>
                      <div style={{ position: 'relative' }}>
                        <Building2 size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input type="text" value={extForm.bankName} onChange={e => setExtForm(f => ({ ...f, bankName: e.target.value }))} placeholder="e.g. Chase Bank, Wells Fargo"
                          style={{ width: '100%', paddingLeft: 36, paddingRight: 14, paddingTop: 11, paddingBottom: 11, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 14, color: '#1e293b', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>
                        Account Holder Name <span style={{ textTransform: 'none', fontWeight: 400, color: '#94a3b8' }}>(optional)</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input type="text" value={extForm.accountHolderName} onChange={e => setExtForm(f => ({ ...f, accountHolderName: e.target.value }))} placeholder="Payee / recipient full name"
                          style={{ width: '100%', paddingLeft: 36, paddingRight: 14, paddingTop: 11, paddingBottom: 11, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 14, color: '#1e293b', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>Routing Number</label>
                      <input type="text" inputMode="numeric" maxLength={9} value={extForm.routingNumber} onChange={e => setExtForm(f => ({ ...f, routingNumber: e.target.value.replace(/\D/g, '') }))} placeholder="9-digit ABA"
                        style={{ width: '100%', padding: '11px 14px', border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 14, fontFamily: 'monospace', color: '#1e293b', outline: 'none', boxSizing: 'border-box' }} />
                      {extForm.routingNumber && !/^\d{9}$/.test(extForm.routingNumber) && <p style={{ fontSize: 12, color: '#dc2626', margin: '3px 0 0' }}>Must be exactly 9 digits</p>}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>Account Number</label>
                      <input type="text" inputMode="numeric" value={extForm.accountNumber} onChange={e => setExtForm(f => ({ ...f, accountNumber: e.target.value.replace(/\D/g, '') }))} placeholder="Account number"
                        style={{ width: '100%', padding: '11px 14px', border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 14, fontFamily: 'monospace', color: '#1e293b', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>Account Type</label>
                      <select value={extForm.accountType} onChange={e => setExtForm(f => ({ ...f, accountType: e.target.value }))}
                        style={{ width: '100%', padding: '11px 14px', border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 14, color: '#1e293b', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                        {ACCOUNT_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>Amount (USD)</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, fontWeight: 600, color: '#475569' }}>$</span>
                        <input type="text" inputMode="decimal" value={extForm.amount} onChange={e => handleAmountChange(e.target.value)} placeholder="0.00"
                          style={{ width: '100%', paddingLeft: 28, paddingRight: 14, paddingTop: 11, paddingBottom: 11, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 18, fontWeight: 700, color: GREEN, outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      {parsedAmount > (user?.availableBalance || 0) && parsedAmount > 0 && <p style={{ fontSize: 12, color: '#dc2626', margin: '3px 0 0' }}>Insufficient balance</p>}
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>
                        Description <span style={{ textTransform: 'none', fontWeight: 400, color: '#94a3b8' }}>(optional)</span>
                      </label>
                      <input type="text" value={extForm.description} onChange={e => setExtForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Invoice #123, Rent"
                        style={{ width: '100%', padding: '11px 14px', border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 14, color: '#1e293b', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, background: LEMON_LT, border: `1px solid rgba(200,225,90,.4)`, borderRadius: 6, marginBottom: 18, fontSize: 12, color: '#475569' }}>
                    <Shield size={13} style={{ color: LEMON_DK, flexShrink: 0 }} />
                    External transfers are processed within 1–3 business days via ACH and will show as <strong>Pending</strong> until cleared.
                  </div>

                  <button onClick={() => setStep(2)} disabled={!isValid}
                    style={{ width: '100%', padding: '13px 0', borderRadius: 6, fontSize: 14, fontWeight: 700, color: GREEN, background: `linear-gradient(135deg, ${LEMON}, ${LEMON_DK})`, border: 'none', cursor: isValid ? 'pointer' : 'not-allowed', opacity: isValid ? 1 : .4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* ── CONFIRM ── */}
              {step === 2 && (
                <div style={{ background: '#fff', borderRadius: 8, padding: 24, border: `1px solid ${BORDER}` }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: GREEN, margin: '0 0 20px' }}>Confirm Transfer</h3>
                  <div style={{ background: '#F8FAFC', borderRadius: 6, padding: 16, marginBottom: 16 }}>
                    {mode === 'internal' ? (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, alignItems: 'flex-start' }}>
                          <span style={{ color: '#64748b' }}>To</span>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontWeight: 700 }}>{recipientInfo?.name}</p>
                            <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{intForm.recipientIdentifier}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {[
                          ['Bank', extForm.bankName],
                          ...(extForm.accountHolderName ? [['Payee', extForm.accountHolderName]] : []),
                          ['Routing', extForm.routingNumber],
                          ['Account', `****${extForm.accountNumber.slice(-4)}`],
                          ['Type', extForm.accountType],
                        ].map(([k, v]) => (
                          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                            <span style={{ color: '#64748b' }}>{k}</span>
                            <span style={{ fontWeight: 600 }}>{v}</span>
                          </div>
                        ))}
                      </>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: '#64748b' }}>Amount</span>
                      <span style={{ fontWeight: 800, fontSize: 15, color: GREEN }}>{fmt(parsedAmount)}</span>
                    </div>
                    {(mode === 'internal' ? intForm.description : extForm.description) && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                        <span style={{ color: '#64748b' }}>Note</span>
                        <span style={{ fontWeight: 500 }}>{mode === 'internal' ? intForm.description : extForm.description}</span>
                      </div>
                    )}
                    <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: '#64748b' }}>Balance after</span>
                      <span style={{ fontWeight: 700 }}>{fmt((user?.availableBalance || 0) - parsedAmount)}</span>
                    </div>
                  </div>

                  <div style={{ padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, marginBottom: 18, fontSize: 12, color: '#92400e', textAlign: 'center' }}>
                    {mode === 'external'
                      ? 'External transfers cannot be reversed once submitted. Verify all bank details carefully.'
                      : 'This transfer cannot be reversed. Please verify the recipient before proceeding.'}
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setStep(1)} style={{ flex: 1, padding: '12px 0', border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 14, fontWeight: 600, color: '#374151', background: '#fff', cursor: 'pointer' }}>Edit</button>
                    <button onClick={handleSubmit} disabled={loading}
                      style={{ flex: 1, padding: '12px 0', borderRadius: 6, fontSize: 14, fontWeight: 700, color: GREEN, background: `linear-gradient(135deg, ${LEMON}, ${LEMON_DK})`, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    >
                      {loading
                        ? <><span style={{ width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} /> Processing…</>
                        : 'Confirm & Send'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </UserPageLayout>
  );
}
