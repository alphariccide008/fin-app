import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUnreadMessages } from '../hooks/useUnreadMessages';

const GREEN  = '#003D2B';
const LEMON  = '#C8E15A';
const BORDER = '#E2E8F0';

const NAV_TABS = [
  { label: 'Accounts',               to: '/dashboard' },
  { label: 'Payments and Transfers', to: '/transfer'  },
  { label: 'Services',               to: '/transactions' },
  { label: 'Settings and Support',   to: '/chat' },
];

/**
 * Shared M&T Bank portal layout used by all authenticated user pages.
 * Renders: top green bar → secondary tab nav → children → footer.
 * Pass `contentStyle` to override the flex-1 content wrapper.
 */
export function UserPageLayout({ children, contentStyle, fixedHeight }) {
  const { user, logout } = useAuth();
  const { count: msgCount } = useUnreadMessages();
  const navigate  = useNavigate();
  const location  = useLocation();
  const firstName = user?.name?.split(' ')[0] ?? '';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{
      ...(fixedHeight ? { height: '100vh', overflow: 'hidden' } : { minHeight: '100vh' }),
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#F0F2F5',
    }}>

      {/* ── Top green bar ── */}
      <div style={{
        background: GREEN, padding: '0 28px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 54,
      }}>
        <Link to="/" style={{
          textDecoration: 'none', fontWeight: 800, fontSize: 22,
          letterSpacing: -.5, display: 'inline-flex', alignItems: 'center', gap: 2,
        }}>
          <span style={{ color: '#fff' }}>M</span>
          <span style={{ color: LEMON }}>&amp;</span>
          <span style={{ color: '#fff' }}>T</span>
          <span style={{ color: '#fff', fontWeight: 400, fontSize: 18, marginLeft: 3 }}>Bank</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link
            to="/chat"
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#F0C040', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = LEMON}
            onMouseLeave={e => e.currentTarget.style.color = '#F0C040'}
          >
            <MessageSquare size={15} />
            Messages{msgCount > 0 ? ` (${msgCount})` : ''}
          </Link>

          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,.25)' }} />

          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, background: 'none',
              border: '1px solid rgba(255,255,255,.5)', color: '#fff',
              fontSize: 12, fontWeight: 600, padding: '5px 14px', cursor: 'pointer',
              letterSpacing: '.3px', transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          >
            <LogOut size={12} /> Log Out
          </button>
        </div>
      </div>

      {/* ── Secondary white tab nav ── */}
      <div style={{
        background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '0 28px',
        display: 'flex', alignItems: 'stretch', justifyContent: 'space-between',
        minHeight: 48, flexShrink: 0,
      }}>
        <nav style={{ display: 'flex', alignItems: 'stretch' }}>
          {NAV_TABS.map(tab => {
            const active = location.pathname === tab.to;
            return (
              <Link
                key={tab.label}
                to={tab.to}
                style={{
                  display: 'flex', alignItems: 'center', padding: '0 18px',
                  fontSize: 13.5, fontWeight: active ? 700 : 500,
                  color: active ? GREEN : '#374151', textDecoration: 'none',
                  borderBottom: active ? `3px solid ${LEMON}` : '3px solid transparent',
                  whiteSpace: 'nowrap', transition: 'color .15s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = GREEN; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#374151'; }}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: '#64748b', fontStyle: 'italic' }}>
          Welcome back,&nbsp;<strong style={{ color: GREEN, fontStyle: 'normal' }}>{firstName}</strong>
        </div>
      </div>

      {/* ── Page content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', ...contentStyle }}>
        {children}
      </div>

      {/* ── Footer ── */}
      <div style={{
        background: GREEN, padding: '14px 28px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
      }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', margin: 0 }}>
          &copy; {new Date().getFullYear()} M&amp;T Bank. Member FDIC. Equal Housing Lender.
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Privacy Policy', 'Terms of Use', 'Security', 'Contact Us'].map(l => (
            <a key={l} href="#"
              style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = LEMON}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.55)'}
            >{l}</a>
          ))}
        </div>
      </div>
    </div>
  );
}
