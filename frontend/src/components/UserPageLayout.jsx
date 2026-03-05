import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUnreadMessages } from '../hooks/useUnreadMessages';

const GREEN  = '#003D2B';
const LEMON  = '#C8E15A';
const BORDER = '#E2E8F0';

const NAV_TABS = [
  { label: 'Accounts',    to: '/dashboard'    },
  { label: 'Transfer',    to: '/transfer'     },
  { label: 'History',     to: '/transactions' },
  { label: 'My Profile',  to: '/profile'      },
  { label: 'Support',     to: '/chat'         },
];

export function UserPageLayout({ children, contentStyle, fixedHeight }) {
  const { user, logout } = useAuth();
  const { count: msgCount } = useUnreadMessages();
  const navigate  = useNavigate();
  const location  = useLocation();
  const firstName = user?.name ?? '';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{
      ...(fixedHeight ? { height: '100dvh', overflow: 'hidden' } : { minHeight: '100dvh' }),
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      background: '#F0F2F5',
      overflowX: 'hidden',
      width: '100%',
      maxWidth: '100vw',
    }}>

      {/* ── Top green bar ── */}
      <div
        className="top-bar"
        style={{
          background: GREEN,
          padding: '0 28px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 52,
          width: '100%',
        }}
      >
        <Link to="/" style={{
          textDecoration: 'none', fontWeight: 800, fontSize: 21,
          letterSpacing: -.5, display: 'inline-flex', alignItems: 'center', gap: 2,
          flexShrink: 0,
        }}>
          <span style={{ color: '#fff' }}>M</span>
          <span style={{ color: LEMON }}>&amp;</span>
          <span style={{ color: '#fff' }}>T</span>
          <span style={{ color: '#fff', fontWeight: 400, fontSize: 17, marginLeft: 3 }}>Bank</span>
        </Link>

        <div className="top-bar-right" style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <Link
            to="/chat"
            style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#F0C040', fontSize: 13, fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = LEMON}
            onMouseLeave={e => e.currentTarget.style.color = '#F0C040'}
          >
            <MessageSquare size={15} />
            <span className="top-bar-msg-text">
              Messages{msgCount > 0 ? ` (${msgCount})` : ''}
            </span>
          </Link>

          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.22)', flexShrink: 0 }} />

          <Link
            to="/profile"
            style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,.7)', fontSize: 12, fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.7)'}
          >
            <User size={14} />
            <span className="top-bar-msg-text">{firstName || 'Profile'}</span>
          </Link>

          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.22)', flexShrink: 0 }} />

          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, background: 'none',
              border: '1px solid rgba(255,255,255,.45)', color: '#fff',
              fontSize: 12, fontWeight: 600, padding: '5px 12px', cursor: 'pointer',
              letterSpacing: '.3px', transition: 'all .2s', flexShrink: 0, whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          >
            <LogOut size={12} /> Log Out
          </button>
        </div>
      </div>

      {/* ── Secondary white tab nav ── */}
      <div
        className="tab-nav-outer"
        style={{
          background: '#fff',
          borderBottom: `1px solid ${BORDER}`,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          minHeight: 46,
          flexShrink: 0,
          width: '100%',
        }}
      >
        <nav style={{ display: 'flex', alignItems: 'stretch', flexShrink: 0 }}>
          {NAV_TABS.map(tab => {
            const active = location.pathname === tab.to;
            return (
              <Link
                key={tab.label}
                to={tab.to}
                className="tab-nav-link"
                style={{
                  display: 'flex', alignItems: 'center', padding: '0 16px',
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  color: active ? GREEN : '#374151', textDecoration: 'none',
                  borderBottom: active ? `3px solid ${LEMON}` : '3px solid transparent',
                  whiteSpace: 'nowrap', transition: 'color .15s', flexShrink: 0,
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = GREEN; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#374151'; }}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="tab-nav-welcome" style={{
          display: 'flex', alignItems: 'center', fontSize: 13,
          color: '#64748b', fontStyle: 'italic', flexShrink: 0, paddingLeft: 12,
        }}>
          Welcome back,&nbsp;<strong style={{ color: GREEN, fontStyle: 'normal' }}>{firstName}</strong>
        </div>
      </div>

      {/* ── Page content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, ...contentStyle }}>
        {children}
      </div>

      {/* ── Footer ── */}
      <div
        className="footer-bar"
        style={{
          background: GREEN,
          padding: '12px 28px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          width: '100%',
        }}
      >
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', margin: 0 }}>
          &copy; {new Date().getFullYear()} M&amp;T Bank. Member FDIC. Equal Housing Lender.
        </p>
        <div className="footer-links" style={{ display: 'flex', gap: 14 }}>
          {['Privacy Policy', 'Terms of Use', 'Security', 'Contact Us'].map(l => (
            <a key={l} href="#"
              style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = LEMON}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.5)'}
            >{l}</a>
          ))}
        </div>
      </div>
    </div>
  );
}
