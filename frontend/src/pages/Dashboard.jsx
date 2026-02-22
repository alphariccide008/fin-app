import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle, ChevronDown, Download, CheckSquare,
  CalendarClock, Ban, FileText, Plus, ArrowLeftRight, Eye,
  Pencil, ArrowDownLeft, X, Check,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getTransactions } from '../api/transactions';
import { updateMyBalance } from '../api/auth';
import { UserPageLayout } from '../components/UserPageLayout';

/* ─── Brand tokens ─── */
const GREEN     = '#003D2B';
const GREEN_MID = '#005C40';
const GREEN_LT  = '#027856';
const LEMON     = '#C8E15A';
const LEMON_DK  = '#8FAB32';
const CARD_BG   = '#1B3A6B';
const CARD_MID  = '#254d8e';
const BORDER    = '#E2E8F0';
const MUTED     = '#64748B';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

/* ─── Transaction row ─── */
const TxRow = ({ tx }) => {
  const isPending = tx.status === 'pending';
  const isCredit  = tx.type === 'credit';
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: `1px solid ${BORDER}`, background: '#fff' }}
      onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
      onMouseLeave={e => e.currentTarget.style.background = '#fff'}
    >
      <div style={{ flexShrink: 0, width: 18, height: 18, borderRadius: '50%', background: isPending ? '#E8F4FD' : '#EDF5C8', border: `2px solid ${isPending ? '#3B82F6' : LEMON_DK}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: isPending ? '#3B82F6' : LEMON_DK }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.5px', minWidth: 54, color: isPending ? '#2563EB' : GREEN_MID }}>
        {isPending ? 'PENDING' : 'POSTED'}
      </span>
      <HelpCircle size={13} style={{ color: '#cbd5e1', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>
          {tx.description || (isCredit ? 'Credit' : 'Debit')}
          {tx.counterparty && <span style={{ color: '#2563EB', marginLeft: 6 }}>— {tx.counterparty.toUpperCase()}</span>}
        </span>
        <div style={{ fontSize: 11, color: MUTED }}>
          {tx.created_at ? new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
        </div>
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, flexShrink: 0, color: isCredit ? '#16a34a' : '#dc2626' }}>
        {isCredit ? '+' : '-'}{fmt(tx.amount)}
      </span>
    </div>
  );
};

/* ─── Balance Edit Modal ─── */
const BalanceModal = ({ field, currentValue, onSave, onClose, saving }) => {
  const [value, setValue] = useState(String(currentValue ?? ''));
  const label = field === 'ledger' ? 'Total Balance' : 'Available Balance';

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 8, padding: 28, width: 380, boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: GREEN }}>Edit {label}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4 }}>
            <X size={18} />
          </button>
        </div>
        <p style={{ fontSize: 13, color: MUTED, margin: '0 0 14px' }}>Enter the new {label.toLowerCase()} amount in USD.</p>
        <div style={{ position: 'relative', marginBottom: 18 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, fontWeight: 600, color: '#475569' }}>$</span>
          <input
            type="number" min="0" step="0.01"
            value={value}
            onChange={e => setValue(e.target.value)}
            autoFocus
            style={{ width: '100%', paddingLeft: 28, paddingRight: 14, paddingTop: 10, paddingBottom: 10, border: `2px solid ${LEMON}`, borderRadius: 6, fontSize: 18, fontWeight: 700, color: GREEN, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px 0', border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 14, fontWeight: 600, color: MUTED, background: '#fff', cursor: 'pointer' }}>
            Cancel
          </button>
          <button
            onClick={() => onSave(parseFloat(value))}
            disabled={saving || !value || isNaN(parseFloat(value))}
            style={{ flex: 1, padding: '10px 0', borderRadius: 6, fontSize: 14, fontWeight: 700, color: GREEN, background: `linear-gradient(135deg, ${LEMON}, ${LEMON_DK})`, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: saving ? .6 : 1 }}
          >
            {saving ? <span style={{ width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} /> : <Check size={15} />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { user, refreshUser } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('recent');

  /* balance editing */
  const [editField,  setEditField]  = useState(null);  // 'ledger' | 'available'
  const [savingBal,  setSavingBal]  = useState(false);
  const [balError,   setBalError]   = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getTransactions();
      setTransactions(data);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  const handleSaveBalance = async (newValue) => {
    if (isNaN(newValue) || newValue < 0) return;
    setSavingBal(true);
    setBalError('');
    try {
      const payload = editField === 'ledger'
        ? { ledgerBalance: newValue }
        : { availableBalance: newValue };
      await updateMyBalance(payload);
      await refreshUser();
      setEditField(null);
    } catch (err) {
      setBalError(err.response?.data?.message || 'Failed to update balance');
    } finally {
      setSavingBal(false);
    }
  };

  const fullName  = user?.name?.toUpperCase() ?? '';
  const lastName  = user?.name?.split(' ').slice(-1)[0]?.toUpperCase() ?? '';
  const recent    = transactions.slice(0, 10);
  const pending   = transactions.filter(t => t.status === 'pending' && t.type === 'debit');
  const scheduled = pending.reduce((s, t) => s + Number(t.amount), 0);

  const TABS = [
    { id: 'recent', label: 'Recent Activity' },
    { id: '7years', label: 'Last 7 Years'   },
    { id: 'info',   label: 'Account Info'   },
  ];

  const AccountInfo = () => (
    <div style={{ padding: '20px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          { label: 'Account Holder', value: user?.name },
          { label: 'Account Number', value: user?.accountNumber },
          { label: 'Email',          value: user?.email },
          { label: 'Account Type',   value: 'M&T Checking' },
          { label: 'Routing Number', value: '022000046' },
          { label: 'Member Since',   value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '.4px', margin: '0 0 3px' }}>{label}</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <UserPageLayout>
      {/* ── Account header bar ── */}
      <div style={{ background: GREEN_MID, padding: '12px 28px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', flexShrink: 0 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>
            M&amp;T Checking — {user?.accountNumber}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', margin: '2px 0 0' }}>
            Dear, <strong style={{ color: LEMON }}>{fullName}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,.7)' }}>View Account</span>
          <div style={{ display: 'flex', alignItems: 'stretch', border: '1px solid rgba(255,255,255,.3)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(255,255,255,.08)', fontSize: 13, color: '#fff', minWidth: 230 }}>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                M&amp;T Checking ({user?.accountNumber})
              </span>
              <ChevronDown size={13} style={{ color: 'rgba(255,255,255,.6)', flexShrink: 0 }} />
            </div>
            <Link
              to="/transactions"
              style={{ padding: '6px 18px', background: LEMON, color: GREEN, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => e.currentTarget.style.background = LEMON_DK}
              onMouseLeave={e => e.currentTarget.style.background = LEMON}
            >
              Go
            </Link>
          </div>
        </div>
      </div>

      {/* ── Three-column main content ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '22px 28px', display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* ── LEFT: Balance cards + Activity ── */}
        <div style={{ flex: '1 1 560px', minWidth: 0 }}>

          {/* Balance error */}
          {balError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 6, marginBottom: 14, fontSize: 13, color: '#dc2626' }}>
              <X size={14} /> {balError}
              <button onClick={() => setBalError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}><X size={13} /></button>
            </div>
          )}

          {/* Balance cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>

            {/* Total Balance */}
            <div style={{ background: `linear-gradient(145deg, ${CARD_BG}, ${CARD_MID})`, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.6px' }}>Total Balance</span>
                  <HelpCircle size={12} style={{ color: 'rgba(255,255,255,.35)' }} />
                </div>
                <button
                  onClick={() => setEditField('ledger')}
                  title="Edit total balance"
                  style={{ background: 'rgba(255,255,255,.12)', border: 'none', borderRadius: 4, cursor: 'pointer', padding: '3px 6px', display: 'flex', alignItems: 'center', gap: 4, color: LEMON, fontSize: 11, fontWeight: 600 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.22)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.12)'}
                >
                  <Pencil size={10} /> Edit
                </button>
              </div>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: -.5 }}>
                {fmt(user?.ledgerBalance ?? user?.availableBalance)}
              </p>
            </div>

            {/* Available Balance */}
            <div style={{ background: `linear-gradient(145deg, ${CARD_BG}, ${CARD_MID})`, padding: '20px 22px', position: 'relative', overflow: 'hidden', borderTop: `4px solid ${LEMON}` }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.6px' }}>Available Balance</span>
                  <HelpCircle size={12} style={{ color: 'rgba(255,255,255,.35)' }} />
                </div>
                <button
                  onClick={() => setEditField('available')}
                  title="Edit available balance"
                  style={{ background: 'rgba(255,255,255,.12)', border: 'none', borderRadius: 4, cursor: 'pointer', padding: '3px 6px', display: 'flex', alignItems: 'center', gap: 4, color: LEMON, fontSize: 11, fontWeight: 600 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.22)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.12)'}
                >
                  <Pencil size={10} /> Edit
                </button>
              </div>
              <p style={{ fontSize: 28, fontWeight: 800, color: LEMON, margin: 0, letterSpacing: -.5 }}>
                {fmt(user?.availableBalance)}
              </p>
            </div>
          </div>

          {/* ── Activity section ── */}
          <div style={{ background: '#fff', border: `1px solid ${BORDER}` }}>

            {/* Tab bar + quick links */}
            <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', borderBottom: `2px solid ${BORDER}`, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex' }}>
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '11px 20px', fontSize: 13.5, fontWeight: activeTab === tab.id ? 700 : 500,
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: activeTab === tab.id ? GREEN : MUTED,
                      borderBottom: activeTab === tab.id ? `3px solid ${LEMON}` : '3px solid transparent',
                      marginBottom: -2, transition: 'color .15s',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px' }}>
                {[
                  { label: 'Place a Stop Payment', to: '/chat',     icon: Ban },
                  { label: 'Schedule a Transfer',  to: '/transfer', icon: CalendarClock },
                  { label: 'Pay a Bill',           to: '/transfer', icon: FileText },
                ].map(({ label, to, icon: Icon }, i) => (
                  <Link key={label} to={to}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 12px', fontSize: 12.5, fontWeight: 500, color: GREEN_LT, textDecoration: 'none', borderLeft: i > 0 ? `1px solid ${BORDER}` : 'none', height: '100%', whiteSpace: 'nowrap' }}
                    onMouseEnter={e => e.currentTarget.style.color = GREEN}
                    onMouseLeave={e => e.currentTarget.style.color = GREEN_LT}
                  >
                    <Icon size={13} /> {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Scheduled info bar */}
            <div style={{ display: 'flex', background: '#F8FAFC', borderBottom: `1px solid ${BORDER}`, flexWrap: 'wrap' }}>
              <a href="#" style={{ flex: 1, padding: '8px 16px', fontSize: 12.5, color: GREEN_LT, textDecoration: 'none', fontWeight: 500, borderRight: `1px solid ${BORDER}`, whiteSpace: 'nowrap' }}
                onMouseEnter={e => e.target.style.color = GREEN} onMouseLeave={e => e.target.style.color = GREEN_LT}
              >View Scheduled Transfers ({fmt(scheduled)})</a>
              <a href="#" style={{ flex: 1, padding: '8px 16px', fontSize: 12.5, color: GREEN_LT, textDecoration: 'none', fontWeight: 500, borderRight: `1px solid ${BORDER}`, whiteSpace: 'nowrap' }}
                onMouseEnter={e => e.target.style.color = GREEN} onMouseLeave={e => e.target.style.color = GREEN_LT}
              >View Scheduled Bill Payments ($0.00)</a>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', fontSize: 12.5, color: GREEN_LT, textDecoration: 'none', fontWeight: 500, borderRight: `1px solid ${BORDER}`, whiteSpace: 'nowrap' }}
                  onMouseEnter={e => e.currentTarget.style.color = GREEN} onMouseLeave={e => e.currentTarget.style.color = GREEN_LT}
                ><Download size={12} /> Export Transaction History</a>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', fontSize: 12.5, color: GREEN_LT, textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}
                  onMouseEnter={e => e.currentTarget.style.color = GREEN} onMouseLeave={e => e.currentTarget.style.color = GREEN_LT}
                ><CheckSquare size={12} /> View Cleared Checks</a>
              </div>
            </div>

            {/* Tab content */}
            {activeTab !== 'info' ? (
              <>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <div style={{ width: 30, height: 30, border: `3px solid ${LEMON}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 10px' }} />
                    <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>Loading transactions…</p>
                  </div>
                ) : recent.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 16px', color: MUTED }}>
                    <ArrowDownLeft size={32} style={{ opacity: .3, marginBottom: 8 }} />
                    <p style={{ margin: 0, fontSize: 13 }}>No transactions yet</p>
                  </div>
                ) : (
                  recent.map(tx => <TxRow key={tx.id} tx={tx} />)
                )}
              </>
            ) : (
              <AccountInfo />
            )}
          </div>
        </div>

        {/* ── RIGHT: Promo + Shortcuts ── */}
        <div style={{ flex: '0 0 270px', minWidth: 240, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Promo banner */}
          <div style={{ overflow: 'hidden' }}>
            <div style={{ background: `linear-gradient(160deg, ${GREEN} 0%, ${GREEN_MID} 45%, #0d6b4a 75%, #3a7d44 100%)`, padding: '28px 22px 52px', position: 'relative', overflow: 'hidden', minHeight: 140 }}>
              <svg viewBox="0 0 270 72" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }} preserveAspectRatio="none">
                <path d="M0 72 Q35 38 72 50 Q110 62 148 30 Q186 2 220 34 Q245 50 270 42 L270 72 Z" fill="rgba(255,255,255,.22)" />
                <path d="M0 72 Q45 48 90 56 Q135 64 180 42 Q220 22 270 50 L270 72 Z" fill="rgba(255,255,255,.12)" />
              </svg>
              <p style={{ fontSize: 21, fontWeight: 800, color: '#fff', lineHeight: 1.35, margin: 0, position: 'relative', zIndex: 1 }}>
                Thank you for<br />banking with M&amp;T.
              </p>
            </div>
          </div>

          {/* My Shortcuts */}
          <div style={{ background: '#fff', border: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: GREEN, margin: 0 }}>My Shortcuts</p>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: GREEN_LT, fontWeight: 600, padding: 0 }}>
                <Pencil size={11} /> Edit
              </button>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <p style={{ fontSize: 12, color: MUTED, margin: '0 0 14px', lineHeight: 1.65 }}>
                Create shortcuts to your most frequently used online banking services.
              </p>
              {[
                { icon: ArrowLeftRight, label: 'Schedule a Transfer', to: '/transfer' },
                { icon: Eye,           label: 'View Transactions',   to: '/transactions' },
                { icon: FileText,      label: 'Contact Support',     to: '/chat' },
              ].map(({ icon: Icon, label, to }) => (
                <Link key={label} to={to}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 0', fontSize: 13, color: GREEN_LT, textDecoration: 'none', borderBottom: `1px solid ${BORDER}`, fontWeight: 500 }}
                  onMouseEnter={e => e.currentTarget.style.color = GREEN}
                  onMouseLeave={e => e.currentTarget.style.color = GREEN_LT}
                >
                  <Icon size={14} /> {label}
                </Link>
              ))}
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 13, fontSize: 12.5, color: GREEN_LT, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}
                onMouseEnter={e => e.currentTarget.style.color = GREEN}
                onMouseLeave={e => e.currentTarget.style.color = GREEN_LT}
              >
                <Plus size={15} style={{ background: GREEN_LT, color: '#fff', borderRadius: '50%', padding: 2 }} />
                Add Shortcuts
              </button>
            </div>
          </div>

          {/* Pending summary */}
          {pending.length > 0 && (
            <div style={{ background: '#fff', border: `1px solid ${BORDER}` }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}` }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: GREEN, margin: 0 }}>Pending Activity</p>
              </div>
              <div style={{ padding: '12px 16px' }}>
                <p style={{ fontSize: 12, color: MUTED, margin: '0 0 8px' }}>
                  {pending.length} pending transaction{pending.length > 1 ? 's' : ''}
                </p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#dc2626', margin: 0 }}>−{fmt(scheduled)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Balance edit modal */}
      {editField && (
        <BalanceModal
          field={editField}
          currentValue={editField === 'ledger' ? (user?.ledgerBalance ?? user?.availableBalance) : user?.availableBalance}
          onSave={handleSaveBalance}
          onClose={() => { setEditField(null); setBalError(''); }}
          saving={savingBal}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </UserPageLayout>
  );
}
