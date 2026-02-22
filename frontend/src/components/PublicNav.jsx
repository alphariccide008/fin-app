import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Lock, Menu, X } from 'lucide-react';

const NAVY   = '#003D2B';
const GOLD   = '#C8E15A';
const ACCENT = '#027856';
const LIGHT  = '#F7F8FA';
const BORDER = '#E2E8F0';

const NAV_LINKS = [
  { label: 'Personal',   to: '/' },
  { label: 'Business',   to: '/business' },
  { label: 'Commercial', to: '/commercial' },
  { label: 'Wealth',     to: '/wealth' },
];

export function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname === to;

  return (
    <>
      {/* ── Utility bar ── */}
      <div style={{ background: NAVY, color: 'rgba(255,255,255,.82)', fontSize: '11.5px', padding: '7px 0', position: 'relative', zIndex: 600 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontStyle: 'italic', fontSize: 11 }}>
            <Shield size={12} style={{ color: GOLD }} />
            FDIC-Insured — Backed by the full faith and credit of the U.S. Government
          </div>
          <div className="hidden md:flex" style={{ gap: 2 }}>
            {['Search', 'About M&T Bank', 'Locations', 'Help Center', 'Español'].map(l => (
              <a key={l} href="#"
                style={{ color: 'rgba(255,255,255,.78)', fontSize: '11.5px', padding: '3px 10px', textDecoration: 'none', transition: 'color .2s' }}
                onMouseEnter={e => e.target.style.color = GOLD}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.78)'}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main nav ── */}
      <header style={{
        background: '#fff', borderBottom: `1px solid ${BORDER}`,
        position: 'sticky', top: 0, zIndex: 500,
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,.07)' : 'none',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'stretch', minHeight: 62 }}>

          {/* Hamburger */}
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px 6px 0', display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center', justifyContent: 'center' }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} color={NAVY} /> : <>
              <span style={{ display: 'block', width: 22, height: 2, background: NAVY }} />
              <span style={{ display: 'block', width: 22, height: 2, background: NAVY }} />
              <span style={{ display: 'block', width: 22, height: 2, background: NAVY }} />
            </>}
          </button>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 40 }}>
            <Link to="/" style={{ textDecoration: 'none', fontWeight: 800, fontSize: 22, letterSpacing: -.5, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '16px 0' }}>
              <span style={{ color: NAVY }}>M</span><span style={{ color: GOLD }}>&amp;</span><span style={{ color: NAVY }}>T</span>
              <span style={{ color: NAVY, fontWeight: 400, fontSize: 18, marginLeft: 2 }}>Bank</span>
            </Link>
          </div>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex" style={{ alignItems: 'stretch', flex: 1 }}>
            <ul style={{ listStyle: 'none', display: 'flex', height: '100%', margin: 0, padding: 0 }}>
              {NAV_LINKS.map(l => {
                const active = isActive(l.to);
                return (
                  <li key={l.label} style={{ position: 'relative' }}>
                    <Link
                      to={l.to}
                      style={{
                        display: 'flex', alignItems: 'center', height: '100%',
                        padding: '0 16px', fontSize: '14.5px', fontWeight: 500,
                        textDecoration: 'none', whiteSpace: 'nowrap',
                        color: active ? ACCENT : '#1A1A2E',
                        borderBottom: active ? `3px solid ${GOLD}` : '3px solid transparent',
                        transition: 'color .2s',
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.color = ACCENT; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#1A1A2E'; }}
                    >{l.label}</Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Log In */}
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
            <Link
              to="/login"
              style={{ background: NAVY, color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 22px', display: 'inline-flex', alignItems: 'center', gap: 7, textDecoration: 'none', transition: 'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = ACCENT}
              onMouseLeave={e => e.currentTarget.style.background = NAVY}
            >
              <Lock size={11} /> Log In
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background: '#fff', borderTop: `1px solid ${BORDER}`, padding: '8px 20px 16px' }}>
            {NAV_LINKS.map(l => (
              <Link key={l.label} to={l.to} onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '10px 12px', fontSize: 15, fontWeight: 600, color: NAVY, textDecoration: 'none', borderRadius: 6 }}
                onMouseEnter={e => e.currentTarget.style.background = LIGHT}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >{l.label}</Link>
            ))}
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/login" style={{ padding: '10px 0', textAlign: 'center', fontWeight: 600, color: NAVY, textDecoration: 'none', border: `2px solid ${NAVY}` }}>Log In</Link>
              <Link to="/register" style={{ padding: '10px 0', textAlign: 'center', fontWeight: 700, color: '#fff', textDecoration: 'none', background: NAVY }}>Open Account</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
