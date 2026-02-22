import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, RefreshCw, ArrowDownLeft, ArrowUpRight, X, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getTransactions } from '../api/transactions';
import { useUnreadMessages } from '../hooks/useUnreadMessages';

const NAVY    = '#003D2B';
const GOLD    = '#C8E15A';
const GOLD_DK = '#8FAB32';
const GREEN   = '#027856';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

/* Module-level cache so we don't refetch on every page navigation */
let _cache = [];
let _cacheTime = 0;

export const Topbar = ({ title, subtitle, onRefresh }) => {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen]   = useState(false);
  const [notifs, setNotifs]         = useState(_cache);
  const [hasNew, setHasNew]         = useState(false);
  const dropRef = useRef(null);
  const { count: msgCount, refresh: refreshMsgs } = useUnreadMessages();
  const totalBadge = (hasNew ? 1 : 0) + msgCount;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  /* Fetch recent transactions for notifications (non-admin only, cached 60s) */
  useEffect(() => {
    if (user?.role === 'admin') return;
    const now = Date.now();
    if (now - _cacheTime < 60_000 && _cache.length) {
      setNotifs(_cache);
      return;
    }
    getTransactions()
      .then(({ data }) => {
        const recent = data.slice(0, 10);
        _cache = recent;
        _cacheTime = Date.now();
        setNotifs(recent);
        if (recent.length > 0) setHasNew(true);
      })
      .catch(() => {});
  }, [user?.role]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleBellClick = () => {
    setNotifOpen(o => !o);
    setHasNew(false);
  };

  const totalCount = msgCount + notifs.length;

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        {!subtitle && (
          <p className="text-sm text-slate-500 mt-0.5">
            {getGreeting()},{' '}
            <span className="font-semibold" style={{ color: GOLD_DK }}>{user?.name?.split(' ')[0]}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            onMouseEnter={e => e.currentTarget.style.color = GOLD_DK}
            onMouseLeave={e => e.currentTarget.style.color = ''}
          >
            <RefreshCw size={16} />
          </button>
        )}

        {/* Bell with dropdown */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          <button
            onClick={handleBellClick}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 relative transition-colors"
          >
            <Bell size={16} />
            {totalBadge > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-white flex items-center justify-center font-bold"
                style={{ background: '#ef4444', fontSize: 9 }}
              >
                {totalBadge > 99 ? '99+' : totalBadge}
              </span>
            )}
          </button>

          {/* Dropdown panel */}
          {notifOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              width: 340, background: '#fff', borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0,0,0,.14)', border: '1px solid #E2E8F0',
              zIndex: 200, overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #E2E8F0' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: NAVY, margin: 0 }}>Notifications</p>
                  <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>Recent account activity</p>
                </div>
                <button
                  onClick={() => setNotifOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, borderRadius: 6 }}
                  onMouseEnter={e => e.currentTarget.style.color = NAVY}
                  onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Items */}
              <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                {/* Message notification */}
                {msgCount > 0 && (
                  <Link
                    to={user?.role === 'admin' ? '/admin/messages' : '/chat'}
                    onClick={() => { setNotifOpen(false); refreshMsgs(); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', background: 'rgba(200,225,90,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fefce8'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(200,225,90,0.04)'}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200,225,90,0.15)' }}>
                      <MessageSquare size={15} style={{ color: GOLD_DK }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: NAVY, margin: 0 }}>
                        {user?.role === 'admin' ? `${msgCount} unread customer message${msgCount > 1 ? 's' : ''}` : `${msgCount} new message${msgCount > 1 ? 's' : ''} from support`}
                      </p>
                      <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0' }}>Click to view</p>
                    </div>
                    <span style={{ minWidth: 20, height: 20, borderRadius: 99, background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
                      {msgCount > 99 ? '99+' : msgCount}
                    </span>
                  </Link>
                )}

                {notifs.length === 0 && msgCount === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 16px', color: '#94a3b8' }}>
                    <Bell size={28} style={{ margin: '0 auto 8px', opacity: .4 }} />
                    <p style={{ fontSize: 13, margin: 0 }}>No recent activity</p>
                  </div>
                ) : notifs.length === 0 ? null : (
                  notifs.map(tx => {
                    const isCredit = tx.type === 'credit';
                    return (
                      <div key={tx.id} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 16px', borderBottom: '1px solid #f1f5f9',
                        transition: 'background .15s', cursor: 'default',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}
                      >
                        {/* Icon */}
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isCredit ? 'rgba(2,120,86,.1)' : 'rgba(239,68,68,.09)',
                        }}>
                          {isCredit
                            ? <ArrowDownLeft size={15} style={{ color: GREEN }} />
                            : <ArrowUpRight size={15} className="text-red-500" />}
                        </div>

                        {/* Text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: NAVY, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {tx.description}
                          </p>
                          <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0' }}>
                            {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {tx.counterparty ? ` · ${tx.counterparty}` : ''}
                          </p>
                        </div>

                        {/* Amount */}
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: isCredit ? GREEN : '#ef4444' }}>
                            {isCredit ? '+' : '-'}{fmt(tx.amount)}
                          </p>
                          <span style={{
                            fontSize: 10, padding: '1px 6px', borderRadius: 99,
                            background: isCredit ? 'rgba(2,120,86,.1)' : 'rgba(239,68,68,.09)',
                            color: isCredit ? GREEN : '#ef4444', fontWeight: 600,
                          }}>
                            {isCredit ? 'Credit' : 'Debit'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {notifs.length > 0 && (
                <div style={{ padding: '10px 16px', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <Link to="/transactions" style={{ fontSize: 12, fontWeight: 600, color: GOLD_DK, textDecoration: 'none' }}
                    onMouseEnter={e => e.target.style.color = NAVY}
                    onMouseLeave={e => e.target.style.color = GOLD_DK}
                  >
                    View all transactions →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
};
