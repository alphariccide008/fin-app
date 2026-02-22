import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard, Home, Banknote, Wallet, BookOpen, TrendingUp,
  Smartphone, Landmark, Search, MapPin, Phone,
  Shield, Send, Facebook, Twitter,
  Linkedin, Instagram, Youtube, CheckCircle,
  Star, Award
} from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { PublicNav } from '../components/PublicNav';

const NAVY     = '#003D2B';
const NAVY_MID = '#005C40';
const ACCENT   = '#027856';
const GOLD     = '#C8E15A';
const GOLD_LT  = '#EDF5C8';
const LIGHT    = '#F7F8FA';
const BORDER   = '#E2E8F0';
const MUTED    = '#64748B';

/* ── Animated counter ── */
function Counter({ to, prefix = '', suffix = '' }) {
  const [ref, inView] = useInView();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const step = to / (1800 / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, to);
      setVal(Math.floor(cur));
      if (cur >= to) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ── Scroll reveal ── */
function Reveal({ children, className = '', delay = 0 }) {
  const [ref, inView] = useInView();
  const dlyCls = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4'][delay] || '';
  return (
    <div ref={ref} className={`reveal ${dlyCls} ${inView ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

const PRODUCTS = [
  { icon: CreditCard, label: 'Checking' },
  { icon: Home,       label: 'Mortgages' },
  { icon: Banknote,   label: 'Lines of Credit /\nPersonal Loans', small: true },
  { icon: Wallet,     label: 'Credit Cards' },
  { icon: BookOpen,   label: 'Financial Education' },
  { icon: Landmark,   label: 'Savings & CDs' },
  { icon: TrendingUp, label: 'Investments &\nInsurance', small: true },
  { icon: Smartphone, label: 'Digital Banking' },
];

const MOBILE_FEATURES = [
  { icon: Send,       text: 'Send & receive money instantly' },
  { icon: Smartphone, text: 'Deposit checks on the go' },
  { icon: Shield,     text: 'Available on Android and iOS' },
  { icon: TrendingUp, text: 'Monitor your spending habits' },
];

/* ── Button styles matching tbb.css (border-radius: 4px) ── */
const btnPrimary = {
  background: NAVY, color: '#fff', fontWeight: 600, fontSize: '14.5px',
  padding: '13px 28px', display: 'inline-flex', alignItems: 'center',
  gap: 8, border: `2px solid ${NAVY}`, textDecoration: 'none',
  transition: 'all .25s', borderRadius: 4, cursor: 'pointer',
};
const btnOutline = {
  background: 'transparent', color: NAVY, fontWeight: 600, fontSize: '14.5px',
  padding: '13px 28px', display: 'inline-flex', alignItems: 'center',
  gap: 8, border: `2px solid ${NAVY}`, textDecoration: 'none',
  transition: 'all .25s', borderRadius: 4, cursor: 'pointer',
};
const btnSecondary = {
  background: 'transparent', color: '#fff', fontWeight: 600, fontSize: '14.5px',
  padding: '13px 28px', display: 'inline-flex', alignItems: 'center',
  gap: 8, border: '2px solid rgba(255,255,255,.6)', textDecoration: 'none',
  transition: 'all .25s', borderRadius: 4,
};

export default function Landing() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1A1A2E', background: LIGHT, lineHeight: 1.6 }}>

      <PublicNav />

      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', background: LIGHT, overflow: 'hidden', minHeight: 500, display: 'flex' }}>
        <div style={{ display: 'flex', width: '100%', minHeight: 500, alignItems: 'stretch' }}>
          {/* Left: text column */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: LIGHT, padding: '0 20px' }} className="lg:flex-none lg:w-1/2">
            <div style={{ maxWidth: 540, padding: '80px 0 80px 40px' }}>
              <span style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>
                Personal Banking
              </span>
              <h1 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.7rem)', fontWeight: 800, color: NAVY, lineHeight: 1.12, marginBottom: 20 }}>
                Discover the checking account that fits your lifestyle
              </h1>
              <p style={{ fontSize: '1.1rem', color: MUTED, lineHeight: 1.75, marginBottom: 32 }}>
                With unique options and convenient features, every M&amp;T Bank checking account offers something different — designed to help meet your everyday financial needs.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  to="/register"
                  style={btnPrimary}
                  onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.borderColor = ACCENT; }}
                  onMouseLeave={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.borderColor = NAVY; }}
                >
                  Explore Checking ›
                </Link>
                <Link
                  to="/register"
                  style={btnOutline}
                  onMouseEnter={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = NAVY; }}
                >
                  Open Account ›
                </Link>
              </div>
            </div>
          </div>

          {/* Right: photo column */}
          <div
            className="hidden lg:block"
            style={{
              flex: '0 0 50%',
              backgroundImage: "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              minHeight: 500,
              position: 'relative',
            }}
          >
            {/* Left edge fade overlay */}
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 80, background: `linear-gradient(to right, ${LIGHT}, transparent)`, zIndex: 1 }} />
          </div>
        </div>
      </section>

      {/* ══ PRODUCT CARD ══ */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 48px' }}>
        <Reveal>
          <div style={{ background: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,.12)', marginTop: -40, position: 'relative', zIndex: 10 }}>
            <div className="flex flex-col lg:flex-row">
              {/* Heading */}
              <div className="lg:w-5/12" style={{ padding: '36px 40px', borderRight: `1px solid ${BORDER}` }}>
                <span style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>
                  Our Products
                </span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: NAVY, lineHeight: 1.15, margin: 0 }}>
                  More Choices.<br />More Possibilities.
                </h2>
                <p style={{ color: MUTED, fontSize: 15, margin: '10px 0 0' }}>
                  Explore products and services designed to help you reach your goals.
                </p>
              </div>

              {/* Icon grid */}
              <div style={{ flex: 1 }}>
                {[PRODUCTS.slice(0, 4), PRODUCTS.slice(4, 8)].map((row, ri) => (
                  <div key={ri} style={{ display: 'flex', borderBottom: ri === 0 ? `1px solid ${BORDER}` : 'none' }}>
                    {row.map(({ icon: Icon, label, small }, ci) => (
                      <Link key={label} to="/register"
                        style={{
                          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                          justifyContent: 'center', padding: '22px 8px',
                          borderRight: ci < 3 ? `1px solid ${BORDER}` : 'none',
                          background: '#fff', color: '#1A1A2E',
                          fontSize: small ? '11px' : '12px',
                          fontWeight: 500, textAlign: 'center', textDecoration: 'none',
                          gap: 10, transition: 'all .25s', cursor: 'pointer', whiteSpace: 'pre-wrap',
                          fontFamily: "'Inter', sans-serif",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = GOLD_LT; e.currentTarget.style.color = ACCENT; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1A1A2E'; }}
                      >
                        <Icon size={28} style={{ color: ACCENT }} />
                        <span>{label}</span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ MOBILE BANKING ══ */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 48px' }}>
        <div style={{ background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,.09)', overflow: 'hidden' }}>
          <div className="flex flex-col md:flex-row">

            {/* Content */}
            <div className="md:w-1/2" style={{ padding: '56px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>
                M&amp;T Bank Mobile Banking
              </span>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: NAVY, marginBottom: 28, lineHeight: 1.2 }}>
                Simple, encrypted and always in your pocket
              </h2>
              {MOBILE_FEATURES.map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
                  <div style={{ width: 46, height: 46, background: 'rgba(2,120,86,.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={17} style={{ color: ACCENT }} />
                  </div>
                  <span style={{ fontSize: '14.5px', fontWeight: 500, color: '#1A1A2E' }}>{text}</span>
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <Link to="/login"
                  style={btnPrimary}
                  onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.borderColor = ACCENT; }}
                  onMouseLeave={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.borderColor = NAVY; }}
                >
                  Mobile Banking ›
                </Link>
              </div>
            </div>

            {/* Phone mockup on dark gradient */}
            <div className="md:w-1/2 flex items-end justify-center" style={{
              background: `linear-gradient(155deg, ${NAVY} 0%, ${NAVY_MID} 45%, #0D4F3C 100%)`,
              position: 'relative', overflow: 'hidden', minHeight: 440,
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 40%, rgba(2,120,86,.35) 0%, transparent 65%)' }} />
              <svg viewBox="0 0 280 480" xmlns="http://www.w3.org/2000/svg" style={{ width: 230, position: 'relative', zIndex: 2, marginBottom: -2 }}>
                <rect x="24" y="12" width="232" height="428" rx="34" fill="#111827" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                <rect x="36" y="40" width="208" height="372" rx="6" fill="#0F172A"/>
                <rect x="36" y="40" width="208" height="26" fill="#1E293B"/>
                <text x="52" y="57" fill="rgba(255,255,255,.7)" fontSize="9" fontFamily="Inter" fontWeight="600">9:41</text>
                <text x="228" y="57" fill="rgba(255,255,255,.7)" fontSize="9" fontFamily="Inter" textAnchor="end">100%</text>
                <rect x="36" y="66" width="208" height="44" fill="#003D2B"/>
                <text x="140" y="93" fill="white" fontSize="13" fontFamily="Inter" fontWeight="700" textAnchor="middle">M&amp;T Bank</text>
                <rect x="48" y="122" width="184" height="86" rx="10" fill="#005C40"/>
                <text x="64" y="144" fill="rgba(255,255,255,.55)" fontSize="8.5" fontFamily="Inter">Available Balance</text>
                <text x="64" y="172" fill="#C8E15A" fontSize="24" fontFamily="Inter" fontWeight="800">$12,450.00</text>
                <text x="64" y="192" fill="rgba(255,255,255,.4)" fontSize="9" fontFamily="Inter">**** **** **** 4821 · VISA</text>
                <rect x="48" y="220" width="42" height="42" rx="10" fill="#1E293B"/>
                <text x="69" y="247" fill="#C8E15A" fontSize="18" textAnchor="middle">↑</text>
                <rect x="98" y="220" width="42" height="42" rx="10" fill="#1E293B"/>
                <text x="119" y="247" fill="#C8E15A" fontSize="18" textAnchor="middle">↓</text>
                <rect x="148" y="220" width="42" height="42" rx="10" fill="#1E293B"/>
                <text x="169" y="247" fill="#C8E15A" fontSize="14" textAnchor="middle">$</text>
                <rect x="198" y="220" width="34" height="42" rx="10" fill="#1E293B"/>
                <text x="215" y="247" fill="#C8E15A" fontSize="14" textAnchor="middle">⋮</text>
                <text x="52" y="285" fill="rgba(255,255,255,.4)" fontSize="8" fontFamily="Inter" fontWeight="700" letterSpacing="1">RECENT TRANSACTIONS</text>
                <line x1="48" y1="292" x2="232" y2="292" stroke="rgba(255,255,255,.08)" strokeWidth="1"/>
                <circle cx="66" cy="312" r="10" fill="#1E293B"/>
                <rect x="84" y="305" width="76" height="8" rx="3" fill="#1E2D42"/>
                <rect x="84" y="318" width="48" height="6" rx="2" fill="#152236"/>
                <text x="228" y="315" fill="#EF4444" fontSize="9" fontFamily="Inter" textAnchor="end" fontWeight="600">-$5.40</text>
                <circle cx="66" cy="342" r="10" fill="#1E293B"/>
                <rect x="84" y="335" width="64" height="8" rx="3" fill="#1E2D42"/>
                <text x="228" y="345" fill="#22C55E" fontSize="9" fontFamily="Inter" textAnchor="end" fontWeight="600">+$3,200.00</text>
                <rect x="106" y="445" width="68" height="4" rx="2" fill="rgba(255,255,255,.25)"/>
                <rect x="104" y="12" width="72" height="14" rx="7" fill="#0A0A0A"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HELP CENTER + TESTIMONIAL ══ */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 48px' }}>
        <div className="flex flex-col md:flex-row" style={{ boxShadow: '0 4px 20px rgba(0,0,0,.09)' }}>

          {/* Help card */}
          <div className="md:w-1/2" style={{ background: `linear-gradient(140deg, ${NAVY} 0%, ${NAVY_MID} 100%)`, padding: 'clamp(28px, 5vw, 56px)', height: '100%' }}>
            <span style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>
              Help Center
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: 28, lineHeight: 1.25 }}>
              What can we help you with today?
            </h2>
            <div style={{ borderBottom: '2px solid rgba(255,255,255,.3)', display: 'flex', alignItems: 'center', paddingBottom: 6 }}>
              <input
                type="text"
                placeholder="Search M&T Bank…"
                style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 15, flex: 1, fontFamily: "'Inter', sans-serif" }}
              />
              <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16 }}>
                <Search size={16} />
              </button>
            </div>
          </div>

          {/* Testimonial card */}
          <div className="md:w-1/2" style={{ background: '#fff', borderTop: `4px solid ${GOLD}`, padding: 'clamp(28px, 5vw, 56px)', height: '100%' }}>
            <span style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: MUTED, marginBottom: 12 }}>
              Banking with M&amp;T Bank
            </span>
            <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: NAVY, lineHeight: 1.8, fontWeight: 500, margin: '14px 0 20px' }}>
              "M&amp;T Bank completely transformed how we manage our finances. Their team genuinely cares about our success and worked with us from day one. We couldn't imagine banking anywhere else."
            </p>
            <div style={{ fontWeight: 700, fontSize: 13, color: NAVY, textTransform: 'uppercase' }}>
              Sarah &amp; James Morrison
              <div style={{ fontWeight: 400, fontSize: 12, color: MUTED, textTransform: 'none', marginTop: 2 }}>Owners of Morrison Bakery Co.</div>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
              {[
                { icon: Award, label: 'Top Rated\nDigital Bank' },
                { icon: Star,  label: 'Best Customer\nService 2024' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ width: 58, height: 58, borderRadius: '50%', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                    <Icon size={22} style={{ color: GOLD }} />
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: NAVY, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ COMMUNITY STATS ══ */}
      <section style={{ padding: '72px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <Reveal>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: NAVY, textAlign: 'center', marginBottom: 48 }}>
              Partnering for Change in the Communities We Serve
            </h2>
          </Reveal>
          <div className="flex flex-col md:flex-row" style={{ border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,.09)' }}>
            {[
              { to: 52,   prefix: '$', suffix: 'M', label: 'In Community Impact (Millions)' },
              { to: 3200, prefix: '',  suffix: '+', label: 'Non-Profit Organizations' },
              { to: 180,  prefix: '',  suffix: 'K', label: 'Thousand Employee Volunteer Hours' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i + 1} className="flex-1">
                <div style={{ textAlign: 'center', padding: '24px 16px', borderRight: i < 2 ? `1px solid ${BORDER}` : 'none' }}>
                  <span style={{ display: 'block', fontSize: '2.6rem', fontWeight: 800, color: GOLD, marginBottom: 6 }}>
                    <Counter to={s.to} prefix={s.prefix} suffix={s.suffix} />
                  </span>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: MUTED }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <p style={{ fontSize: 12, color: MUTED, marginTop: 12 }}>
            Source: <a href="#" style={{ color: ACCENT }}>2024 M&amp;T Bank Community Impact Report</a>
          </p>
        </div>
      </section>

      {/* ══ SUSTAINABILITY SPLIT ══ */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 16px' }}>
        <Reveal>
          <div style={{ background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,.09)', overflow: 'hidden' }}>
            <div className="flex flex-col md:flex-row">
              <div className="order-2 md:order-1 md:w-1/2" style={{ padding: '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>
                  2024 Sustainability Report
                </span>
                <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: NAVY, lineHeight: 1.18, marginBottom: 14 }}>Driven by our purpose</h2>
                <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                  At M&amp;T Bank, sustainability is integral to our mission of making a difference in people's lives. We recognize its importance in the well-being of our customers, employees, and the communities we serve.
                </p>
                <a href="#"
                  style={{ ...btnPrimary, alignSelf: 'flex-start' }}
                  onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.borderColor = ACCENT; }}
                  onMouseLeave={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.borderColor = NAVY; }}
                >
                  Read Our Report ›
                </a>
              </div>
              <div className="order-1 md:order-2 md:w-1/2" style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80')",
                backgroundSize: 'cover', backgroundPosition: 'center',
                minHeight: 420, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,61,43,.35)' }} />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ COMMUNITY SPLIT ══ */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 20px' }}>
        <Reveal>
          <div style={{ background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,.09)', overflow: 'hidden' }}>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2" style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80')",
                backgroundSize: 'cover', backgroundPosition: 'center',
                minHeight: 420, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,61,43,.35)' }} />
              </div>
              <div className="md:w-1/2" style={{ background: `linear-gradient(140deg, ${NAVY}, ${NAVY_MID})`, padding: '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 420 }}>
                <span style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>
                  Multicultural Banking
                </span>
                <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', lineHeight: 1.18, marginBottom: 14 }}>Reflecting our communities.</h2>
                <p style={{ color: 'rgba(255,255,255,.72)', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                  M&amp;T Bank is committed to the growth and sustainability of the businesses and neighborhoods we serve, working to understand the needs of every client across our organization.
                </p>
                <a href="#"
                  style={{ ...btnSecondary, alignSelf: 'flex-start' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.12)'; e.currentTarget.style.borderColor = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.6)'; }}
                >
                  Learn More ›
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ VOLUNTEERING SPLIT ══ */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 20px 48px' }}>
        <Reveal>
          <div style={{ background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,.09)', overflow: 'hidden' }}>
            <div className="flex flex-col md:flex-row">
              <div className="order-2 md:order-1 md:w-1/2" style={{ padding: '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>
                  Volunteering
                </span>
                <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: NAVY, lineHeight: 1.18, marginBottom: 14 }}>Time is our most valuable asset.</h2>
                <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                  When it comes to giving back, we prefer sharing our time with the people in our community. Our employees receive 40 hours of paid volunteer time to share with the organization that speaks to them.
                </p>
                <a href="#"
                  style={{ ...btnPrimary, alignSelf: 'flex-start' }}
                  onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.borderColor = ACCENT; }}
                  onMouseLeave={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.borderColor = NAVY; }}
                >
                  Learn More ›
                </a>
              </div>
              <div className="order-1 md:order-2 md:w-1/2" style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80')",
                backgroundSize: 'cover', backgroundPosition: 'center',
                minHeight: 420, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,61,43,.35)' }} />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ MORTGAGE CALLOUT ══ */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 48px' }}>
        <div style={{ background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,.07)', padding: '36px 44px', display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
          <Home size={48} style={{ color: ACCENT, flexShrink: 0 }} />
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: NAVY, margin: '0 0 6px' }}>Mortgage Assistance Programs</h2>
            <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>
              We're here to help. Learn about the programs we offer to help you through your mortgage and home equity loan hardship.{' '}
              <a href="#" style={{ color: ACCENT, fontWeight: 600, textDecoration: 'none' }}>Learn More</a>
            </p>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: '#fff', borderTop: `1px solid ${BORDER}`, paddingTop: 56 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand */}
            <div>
              <a href="#" style={{ textDecoration: 'none', fontWeight: 800, fontSize: 22, color: NAVY, letterSpacing: -.5, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <span>M</span><span style={{ color: GOLD }}>&amp;</span><span>T</span>
                <span style={{ fontWeight: 400, fontSize: 18, marginLeft: 2 }}>Bank</span>
              </a>
              <p style={{ fontSize: '13.5px', color: MUTED, marginTop: 10, lineHeight: 1.6 }}>
                We understand what's important. That's why we've built a banking experience rooted in community, driven by purpose.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: NAVY, marginBottom: 16, paddingBottom: 8, borderBottom: `2px solid ${GOLD_LT}` }}>Contact Us</h3>
              {[
                { icon: Phone,       text: '1-800-555-0199' },
                { icon: MapPin,      text: 'Locations & ATMs' },
                { icon: CheckCircle, text: 'Make an Appointment' },
              ].map(({ icon: Icon, text }) => (
                <a key={text} href="#"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#1A1A2E', fontSize: '13.5px', padding: '5px 0', textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = ACCENT}
                  onMouseLeave={e => e.currentTarget.style.color = '#1A1A2E'}
                >
                  <Icon size={13} style={{ color: ACCENT, flexShrink: 0 }} /> {text}
                </a>
              ))}
            </div>

            {/* About */}
            <div>
              <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: NAVY, marginBottom: 16, paddingBottom: 8, borderBottom: `2px solid ${GOLD_LT}` }}>About</h3>
              {['About M&T Bank', 'Careers', 'Investor Relations', 'Privacy & Preferences', 'Security Center'].map(link => (
                <a key={link} href="#"
                  style={{ display: 'block', color: '#1A1A2E', fontSize: '13.5px', padding: '4px 0', textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => e.target.style.color = ACCENT}
                  onMouseLeave={e => e.target.style.color = '#1A1A2E'}
                >{link}</a>
              ))}
            </div>

            {/* Search + Social */}
            <div>
              <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: NAVY, marginBottom: 16, paddingBottom: 8, borderBottom: `2px solid ${GOLD_LT}` }}>Search</h3>
              <div style={{ borderBottom: `2px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 8, marginBottom: 24 }}>
                <input type="text" placeholder="Search M&T Bank…"
                  style={{ border: 'none', outline: 'none', fontSize: 14, flex: 1, fontFamily: "'Inter', sans-serif", color: '#1A1A2E', background: 'transparent' }}
                />
                <Search size={14} style={{ color: ACCENT }} />
              </div>
              <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: NAVY, marginBottom: 16, paddingBottom: 8, borderBottom: `2px solid ${GOLD_LT}` }}>Follow Us</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[Facebook, Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
                  <a key={i} href="#"
                    style={{ width: 38, height: 38, border: `1.5px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT, textDecoration: 'none', transition: 'all .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.borderColor = NAVY; e.currentTarget.style.color = GOLD; }}
                    onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = ACCENT; }}
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer bottom */}
          <div style={{ borderTop: `1px solid ${BORDER}`, padding: '20px 0', marginTop: 48 }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p style={{ fontSize: '12.5px', color: MUTED, margin: 0 }}>
                Equal Housing Lender. &copy; {new Date().getFullYear()} M&amp;T Bank Corp. NMLS #381076. Member FDIC. All rights reserved.
              </p>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {['Sitemap', 'Digital Services Agreement', 'Terms of Use', 'Privacy Policy'].map(l => (
                  <a key={l} href="#"
                    style={{ fontSize: '12.5px', color: MUTED, textDecoration: 'none', transition: 'color .2s' }}
                    onMouseEnter={e => e.target.style.color = ACCENT}
                    onMouseLeave={e => e.target.style.color = MUTED}
                  >{l}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ══ DISCLOSURE BAR ══ */}
      <div style={{ background: '#EEF0F4', padding: '28px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#1A1A2E', marginBottom: 10 }}>Disclosures:</div>
          <ol style={{ fontSize: 12, color: MUTED, margin: 0, lineHeight: 1.65, paddingLeft: 18 }}>
            <li style={{ marginBottom: 6 }}>Use of M&amp;T Bank Digital Banking requires an internet connection and compatible device. Carrier data rates may apply.</li>
            <li>All advertised offers and terms are subject to change at any time without notice. Please contact a M&amp;T Bank representative for full details.</li>
          </ol>
        </div>
      </div>

    </div>
  );
}
