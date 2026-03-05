import { useState, useEffect, useCallback } from 'react';
import { ArrowDownLeft, ArrowUpRight, Search, History, X, Building2, User, Hash, CreditCard, Calendar, DollarSign, FileText } from 'lucide-react';
import { getTransactions } from '../api/transactions';
import { UserPageLayout } from '../components/UserPageLayout';

const GREEN    = '#003D2B';
const GREEN_MID = '#005C40';
const LEMON    = '#C8E15A';
const LEMON_DK = '#8FAB32';
const LEMON_LT = '#EDF5C8';
const BORDER   = '#E2E8F0';
const MUTED    = '#64748b';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);
const ITEMS_PER_PAGE = 15;

/* ── Transaction Detail Modal ── */
const TxDetailModal = ({ tx, onClose }) => {
  if (!tx) return null;

  const isCredit   = tx.type === 'credit';
  const isExternal = tx.reference?.startsWith('EXT-');
  const isInternal = tx.reference?.startsWith('TRF-');

  // Parse counterpartyAccount for external: "routing/account/type"
  const cpParts   = (tx.counterpartyAccount || '').split('/');
  const routing   = isExternal ? (cpParts[0] || '') : '';
  const extAccNum = isExternal ? (cpParts[1] || '') : '';
  const accType   = isExternal ? (cpParts[2] || 'N/A') : '';

  // Parse bank name from counterparty: "BankName ****XXXX"
  const bankName = isExternal
    ? (tx.counterparty || '').replace(/ \*{4}\d{0,4}$/, '').trim()
    : '';

  const statusColor = {
    completed: { bg: '#dcfce7', text: '#15803d' },
    pending:   { bg: '#fef3c7', text: '#92400e' },
    failed:    { bg: '#fee2e2', text: '#b91c1c' },
  }[tx.status] || { bg: '#f1f5f9', text: '#475569' };

  const DetailRow = ({ icon: Icon, label, value, mono }) => {
    if (!value) return null;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ width: 32, height: 32, borderRadius: 7, background: LEMON_LT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={13} style={{ color: LEMON_DK }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 11, color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.3px', margin: '0 0 1px' }}>{label}</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: 0, wordBreak: 'break-all', fontFamily: mono ? 'monospace' : undefined }}>{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 480, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,.25)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${GREEN}, ${GREEN_MID})`, padding: '20px 22px', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,.15)', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <X size={14} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: isCredit ? 'rgba(22,163,74,.25)' : 'rgba(220,38,38,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {isCredit
                ? <ArrowDownLeft size={20} style={{ color: '#86efac' }} />
                : <ArrowUpRight size={20} style={{ color: '#fca5a5' }} />}
            </div>
            <div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', margin: '0 0 2px' }}>
                {isExternal ? 'External Transfer' : isInternal ? 'Internal Transfer' : isCredit ? 'Incoming' : 'Outgoing'}
              </p>
              <p style={{ fontSize: 26, fontWeight: 800, color: isCredit ? '#86efac' : '#fca5a5', margin: 0 }}>
                {isCredit ? '+' : '-'}{fmt(tx.amount)}
              </p>
            </div>
          </div>
          <span style={{ display: 'inline-block', marginTop: 10, fontSize: 11, padding: '3px 12px', borderRadius: 20, fontWeight: 700, background: statusColor.bg, color: statusColor.text }}>
            {(tx.status || 'completed').toUpperCase()}
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: '4px 22px 20px' }}>
          <DetailRow icon={FileText}  label="Description" value={tx.description} />
          <DetailRow icon={Calendar}  label="Date & Time"  value={tx.createdAt ? new Date(tx.createdAt).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : undefined} />
          <DetailRow icon={Hash}      label="Reference"    value={tx.reference} mono />

          {isExternal && (
            <>
              <DetailRow icon={Building2}  label="Bank Name"      value={bankName} />
              <DetailRow icon={CreditCard} label="Account Number" value={extAccNum ? `****${extAccNum.slice(-4)}` : undefined} mono />
              <DetailRow icon={Hash}       label="Routing Number"  value={routing} mono />
              <DetailRow icon={CreditCard} label="Account Type"   value={accType} />
            </>
          )}

          {isInternal && tx.counterparty && (
            <>
              <DetailRow icon={User}       label={isCredit ? 'From' : 'To'} value={tx.counterparty} />
              <DetailRow icon={CreditCard} label="Account"     value={tx.counterpartyAccount} mono />
            </>
          )}

          {!isExternal && !isInternal && tx.counterparty && (
            <DetailRow icon={User} label="Counterparty" value={tx.counterparty} />
          )}

          <DetailRow icon={DollarSign} label="Balance After" value={tx.balanceAfter != null ? fmt(tx.balanceAfter) : undefined} />

          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: 6, border: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>Transaction Type</p>
              <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 20, background: isCredit ? '#dcfce7' : '#fee2e2', color: isCredit ? '#15803d' : '#dc2626' }}>
                {isCredit ? 'CREDIT' : 'DEBIT'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const [selectedTx, setSelectedTx] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getTransactions();
      setTransactions(data);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = transactions.filter(tx => {
    const matchFilter = filter === 'all' || tx.type === filter ||
      (filter === 'pending' && tx.status === 'pending');
    const matchSearch = !search ||
      tx.description?.toLowerCase().includes(search.toLowerCase()) ||
      tx.counterparty?.toLowerCase().includes(search.toLowerCase()) ||
      tx.reference?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalCredit = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalDebit  = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  return (
    <UserPageLayout>
      <div style={{ flex: 1, padding: '32px 28px', background: '#F0F2F5', overflowY: 'auto' }}>

        {/* Page title */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: GREEN, margin: '0 0 4px' }}>Transaction History</h1>
          <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>View and search all your account activity. Click any row for details.</p>
        </div>

        {/* Summary cards */}
        <div className="tx-summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
          {[
            { label: 'Total Transactions', value: transactions.length,  color: GREEN,     plain: true },
            { label: 'Total Credits',      value: fmt(totalCredit),     color: '#16a34a', plain: false },
            { label: 'Total Debits',       value: fmt(totalDebit),      color: '#dc2626', plain: false },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 6, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
              <p style={{ fontSize: 12, color: MUTED, margin: '0 0 6px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '.4px' }}>{label}</p>
              <p style={{ fontSize: 22, fontWeight: 800, margin: 0, color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filter + search + table */}
        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 6, boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>

          {/* Controls */}
          <div className="tx-controls" style={{ display: 'flex', gap: 12, padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input type="text" value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search description, counterparty, reference…"
                style={{ width: '100%', paddingLeft: 34, paddingRight: 14, paddingTop: 9, paddingBottom: 9, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 13, color: '#1e293b', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div className="tx-filter-btns" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['all', 'credit', 'debit', 'pending'].map(f => (
                <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                  style={{ padding: '9px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', textTransform: 'capitalize', background: filter === f ? `linear-gradient(135deg, ${LEMON}, ${LEMON_DK})` : '#f1f5f9', color: filter === f ? GREEN : '#475569', transition: 'all .15s' }}
                  onMouseEnter={e => { if (filter !== f) e.currentTarget.style.background = LEMON_LT; }}
                  onMouseLeave={e => { if (filter !== f) e.currentTarget.style.background = '#f1f5f9'; }}
                >
                  {f}{f === 'pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Refresh */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 16px 0', borderBottom: `1px solid ${BORDER}` }}>
            <button onClick={load} style={{ fontSize: 12, color: '#027856', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '4px 8px' }}>↺ Refresh</button>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ width: 30, height: 30, border: `3px solid ${LEMON}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 10px' }} />
              <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>Loading transactions…</p>
            </div>
          ) : paginated.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '56px 16px', color: MUTED }}>
              <History size={40} style={{ opacity: .25, marginBottom: 12 }} />
              <p style={{ fontWeight: 600, margin: '0 0 4px' }}>No transactions found</p>
              <p style={{ fontSize: 12, margin: 0 }}>Try adjusting your search or filter</p>
            </div>
          ) : (
            paginated.map(tx => {
              const isCredit   = tx.type === 'credit';
              const isExternal = tx.reference?.startsWith('EXT-');
              return (
                <div key={tx.id}
                  className="tx-row"
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', borderBottom: `1px solid ${BORDER}`, background: '#fff', transition: 'background .1s', cursor: 'pointer' }}
                  onClick={() => setSelectedTx(tx)}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: isCredit ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isCredit
                      ? <ArrowDownLeft size={16} style={{ color: '#16a34a' }} />
                      : <ArrowUpRight  size={16} style={{ color: '#dc2626' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {tx.counterparty && <span style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{tx.counterparty}</span>}
                      {isExternal && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 10, background: '#e0f2fe', color: '#0369a1', fontWeight: 600, flexShrink: 0 }}>EXTERNAL</span>}
                    </div>
                  </div>
                  <div className="tx-row-date" style={{ fontSize: 12, color: '#94a3b8', flexShrink: 0, textAlign: 'right' }}>
                    <p style={{ margin: '0 0 2px' }}>
                      {new Date(tx.createdAt || tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p style={{ margin: 0 }}>
                      {new Date(tx.createdAt || tx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="tx-row-amount" style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 3px', color: isCredit ? '#16a34a' : '#dc2626' }}>
                      {isCredit ? '+' : '-'}{fmt(tx.amount)}
                    </p>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600, background: tx.status === 'completed' ? '#dcfce7' : tx.status === 'pending' ? '#fef3c7' : '#fee2e2', color: tx.status === 'completed' ? '#15803d' : tx.status === 'pending' ? '#92400e' : '#b91c1c' }}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: `1px solid ${BORDER}`, flexWrap: 'wrap', gap: 8 }}>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ padding: '7px 16px', border: `1px solid ${BORDER}`, borderRadius: 5, fontSize: 13, fontWeight: 600, color: GREEN, background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? .4 : 1 }}>Previous</button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ padding: '7px 16px', borderRadius: 5, fontSize: 13, fontWeight: 700, color: GREEN, background: `linear-gradient(135deg, ${LEMON}, ${LEMON_DK})`, border: 'none', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? .4 : 1 }}>Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transaction detail modal */}
      {selectedTx && <TxDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </UserPageLayout>
  );
}
