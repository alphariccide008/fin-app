import { useState, useEffect, useCallback } from 'react';
import { ArrowDownLeft, ArrowUpRight, Search, History } from 'lucide-react';
import { getTransactions } from '../api/transactions';
import { UserPageLayout } from '../components/UserPageLayout';

const GREEN   = '#003D2B';
const LEMON   = '#C8E15A';
const LEMON_DK = '#8FAB32';
const LEMON_LT = '#EDF5C8';
const BORDER  = '#E2E8F0';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);
const ITEMS_PER_PAGE = 15;

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

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
    const matchFilter = filter === 'all' || tx.type === filter;
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

  return (
    <UserPageLayout>
      <div style={{ flex: 1, padding: '32px 28px', background: '#F0F2F5', overflowY: 'auto' }}>

        {/* Page title */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: GREEN, margin: '0 0 4px' }}>Transaction History</h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>View and search all your account activity.</p>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
          {[
            { label: 'Total Transactions', value: transactions.length, color: GREEN,    isNum: true },
            { label: 'Total Credits',      value: fmt(totalCredit),    color: '#16a34a', isNum: false },
            { label: 'Total Debits',       value: fmt(totalDebit),     color: '#dc2626', isNum: false },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 6, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 6px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '.4px' }}>{label}</p>
              <p style={{ fontSize: 24, fontWeight: 800, margin: 0, color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filter + search + table */}
        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 6, boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 12, padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input type="text" value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search description, counterparty, reference…"
                style={{ width: '100%', paddingLeft: 34, paddingRight: 14, paddingTop: 9, paddingBottom: 9, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 13, color: '#1e293b', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['all', 'credit', 'debit'].map(f => (
                <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                  style={{ padding: '9px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', textTransform: 'capitalize', background: filter === f ? `linear-gradient(135deg, ${LEMON}, ${LEMON_DK})` : '#f1f5f9', color: filter === f ? GREEN : '#475569', transition: 'all .15s' }}
                  onMouseEnter={e => { if (filter !== f) e.currentTarget.style.background = LEMON_LT; }}
                  onMouseLeave={e => { if (filter !== f) e.currentTarget.style.background = '#f1f5f9'; }}
                >{f}</button>
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
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Loading transactions…</p>
            </div>
          ) : paginated.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '56px 16px', color: '#64748b' }}>
              <History size={40} style={{ opacity: .25, marginBottom: 12 }} />
              <p style={{ fontWeight: 600, margin: '0 0 4px' }}>No transactions found</p>
              <p style={{ fontSize: 12, margin: 0 }}>Try adjusting your search or filter</p>
            </div>
          ) : (
            paginated.map(tx => {
              const isCredit = tx.type === 'credit';
              return (
                <div key={tx.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', borderBottom: `1px solid ${BORDER}`, background: '#fff', transition: 'background .1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: isCredit ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isCredit
                      ? <ArrowDownLeft size={16} style={{ color: '#16a34a' }} />
                      : <ArrowUpRight size={16} style={{ color: '#dc2626' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {tx.counterparty && <span style={{ fontSize: 11, color: '#94a3b8' }}>{tx.counterparty}</span>}
                      {tx.reference && <><span style={{ color: '#cbd5e1', fontSize: 11 }}>·</span><span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{tx.reference}</span></>}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', flexShrink: 0, textAlign: 'right' }}>
                    <p style={{ margin: '0 0 2px' }}>
                      {new Date(tx.createdAt || tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p style={{ margin: 0 }}>
                      {new Date(tx.createdAt || tx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ padding: '7px 16px', border: `1px solid ${BORDER}`, borderRadius: 5, fontSize: 13, fontWeight: 600, color: GREEN, background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? .4 : 1 }}
                >Previous</button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ padding: '7px 16px', borderRadius: 5, fontSize: 13, fontWeight: 700, color: GREEN, background: `linear-gradient(135deg, ${LEMON}, ${LEMON_DK})`, border: 'none', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? .4 : 1 }}
                >Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </UserPageLayout>
  );
}
