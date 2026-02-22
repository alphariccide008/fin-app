import { Link } from 'react-router-dom';
import {
  Building2, Landmark, Globe, BarChart3, Home,
  CheckCircle, ArrowRight, Star, Users
} from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { PublicNav } from '../components/PublicNav';

const NAVY    = '#003D2B';
const NAVY_MID= '#005C40';
const GOLD    = '#C8E15A';
const GOLD_DK = '#8FAB32';
const GOLD_LT = '#EDF5C8';
const GREEN   = '#027856';

function Reveal({ children, className = '', direction = 'up', delay = 0 }) {
  const [ref, inView] = useInView();
  const cls = direction === 'left' ? 'reveal-left' : direction === 'right' ? 'reveal-right' : 'reveal';
  const dlyCls = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4'][delay] || '';
  return (
    <div ref={ref} className={`${cls} ${dlyCls} ${inView ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

const capabilities = [
  {
    icon: Landmark,
    title: 'Commercial Lending',
    desc: 'Syndicated loans, revolving credit, asset-based lending, and acquisition finance for companies with revenues of $10M to $1B+.',
    items: ['Syndicated Loans', 'Revolving Credit Facilities', 'Asset-Based Lending', 'Acquisition Finance'],
  },
  {
    icon: Building2,
    title: 'Treasury Management',
    desc: 'Optimize your working capital with payables, receivables, liquidity, and risk management tools all in one platform.',
    items: ['ACH & Wire Payments', 'Liquidity Management', 'Fraud Prevention', 'Reporting & Analytics'],
  },
  {
    icon: Globe,
    title: 'International Banking',
    desc: 'Cross-border payment solutions, trade finance, and FX risk management backed by our global correspondent network.',
    items: ['Letters of Credit', 'Foreign Exchange', 'Cross-Border Payments', 'Export Finance'],
  },
  {
    icon: BarChart3,
    title: 'Capital Markets',
    desc: 'Interest rate hedging, private placements, and debt underwriting for sophisticated institutional clients.',
    items: ['Interest Rate Swaps', 'Private Placements', 'Debt Underwriting', 'Structured Products'],
  },
  {
    icon: Home,
    title: 'Real Estate Finance',
    desc: 'Construction loans, permanent financing, and portfolio lending for developers, investors, and REITs.',
    items: ['Construction Finance', 'Permanent Financing', 'Bridge Loans', 'Portfolio Lending'],
  },
  {
    icon: Users,
    title: 'Institutional Services',
    desc: 'Comprehensive banking solutions for municipalities, healthcare systems, educational institutions, and nonprofits.',
    items: ['Government Banking', 'Healthcare Finance', 'Higher Education', 'Nonprofit Solutions'],
  },
];

const team = [
  { name: 'David Chen', role: 'Head of Commercial Banking', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80', cred: '20+ yrs' },
  { name: 'Sarah Mitchell', role: 'Director, Treasury Solutions', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80', cred: '16 yrs' },
  { name: 'James Rodriguez', role: 'SVP, Real Estate Finance', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80', cred: '18 yrs' },
  { name: 'Priya Nair', role: 'Director, International Banking', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80', cred: '14 yrs' },
];

export default function Commercial() {
  return (
    <div className="min-h-screen bg-white">

      <PublicNav />

      {/* Hero */}
      <section className="flex min-h-[540px]">
        <div
          className="flex-1 flex items-center px-10 md:px-16 py-20 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full -translate-y-1/3 translate-x-1/3" />
          </div>
          <div className="relative max-w-xl animate-fade-in">
            <span className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ background: 'rgba(200,225,90,0.15)', color: GOLD, border: '1px solid rgba(200,225,90,0.3)' }}>
              COMMERCIAL BANKING
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
              Sophisticated banking<br /><span style={{ color: GOLD }}>for complex enterprises</span>
            </h1>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,.75)' }}>
              M&amp;T Bank's commercial banking team delivers institutional-grade financial solutions — from syndicated lending to international trade finance — backed by deep expertise and a relationship-first approach.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="inline-flex items-center gap-2 px-7 py-3.5 font-bold text-sm rounded-md hover:-translate-y-0.5 transition-all" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}>
                Speak with a Commercial Banker <ArrowRight size={16} />
              </a>
              <a href="#" className="px-7 py-3.5 border-2 text-white font-bold text-sm rounded-md hover:bg-white/10 transition-colors" style={{ borderColor: 'rgba(255,255,255,.4)' }}>
                Download Capability Brief
              </a>
            </div>
          </div>
        </div>
        <div
          className="hidden lg:block w-[42%]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80')`,
            backgroundSize: 'cover', backgroundPosition: 'center top',
          }}
        />
      </section>

      {/* Capabilities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD_DK }}>CAPABILITIES</p>
            <h2 className="text-3xl font-bold mb-3" style={{ color: NAVY }}>End-to-end commercial solutions</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Comprehensive banking products designed for mid-market and large enterprise clients.</p>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) + 1}>
                <div
                  className="p-6 rounded-2xl border h-full transition-all card-hover"
                  style={{ borderColor: '#e2e8f0' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,61,43,.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = ''; }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}>
                    <c.icon size={20} style={{ color: GOLD }} />
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: NAVY }}>{c.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{c.desc}</p>
                  <ul className="space-y-1">
                    {c.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-xs text-gray-500">
                        <CheckCircle size={12} style={{ color: GREEN }} /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats dark */}
      <section className="py-16" style={{ background: `linear-gradient(135deg, ${NAVY}, #0d2140)` }}>
        <div className="max-w-7xl mx-auto px-4">
          <Reveal className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD_LT }}>BY THE NUMBERS</p>
            <h2 className="text-3xl font-bold text-white">A proven track record</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: '$24B+', label: 'Commercial Loans Originated' },
              { val: '2,400+', label: 'Corporate Clients' },
              { val: '38 yrs', label: 'Commercial Banking Experience' },
              { val: '47', label: 'Countries in Our Network' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i + 1}>
                <div className="text-center p-6 rounded-xl" style={{ background: 'rgba(200,225,90,0.12)', border: '1px solid rgba(200,225,90,0.25)' }}>
                  <p className="text-3xl font-extrabold mb-1" style={{ color: GOLD }}>{s.val}</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,.6)' }}>{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Split — Relationship */}
      <section className="flex min-h-[440px]">
        <Reveal direction="right" className="flex-1 flex items-center px-10 md:px-16 py-16 bg-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GREEN }}>OUR APPROACH</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight" style={{ color: NAVY }}>Relationship banking at enterprise scale</h2>
            <p className="text-gray-500 mb-5 leading-relaxed text-sm">
              Unlike large money-center banks, M&amp;T Bank combines the sophistication of institutional banking with the responsiveness of a true relationship bank. Your senior banker has direct lines to credit approval — no committees, no delays.
            </p>
            <ul className="space-y-2 mb-6">
              {['Dedicated senior relationship banker', '48-hour credit decisions', 'Custom structure for every deal', 'Industry-specialist team support'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={15} style={{ color: GREEN }} /> {f}
                </li>
              ))}
            </ul>
            <a href="#" className="inline-flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-md text-white" style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}>
              Connect with our team <ArrowRight size={15} />
            </a>
          </div>
        </Reveal>
        <div
          className="hidden lg:block w-[45%]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}
        />
      </section>

      {/* Team */}
      <section className="py-16" style={{ background: '#F7F8FA' }}>
        <div className="max-w-7xl mx-auto px-4">
          <Reveal className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD_DK }}>OUR BANKERS</p>
            <h2 className="text-3xl font-bold" style={{ color: NAVY }}>Industry experts on your side</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t, i) => (
              <Reveal key={t.name} delay={i + 1}>
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover text-center">
                  <img src={t.img} alt={t.name} className="w-full h-52 object-cover object-top" />
                  <div className="p-5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: GOLD_LT, color: GOLD_DK }}>{t.cred}</span>
                    <h4 className="font-bold mt-2 mb-0.5" style={{ color: NAVY }}>{t.name}</h4>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center" style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}>
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <h2 className="text-3xl font-extrabold text-white mb-3">Let's build something together</h2>
            <p className="mb-8 text-sm" style={{ color: 'rgba(255,255,255,.7)' }}>Our commercial banking team is ready to discuss your financing needs — no obligation, no cookie-cutter solutions.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a href="#" className="px-8 py-3.5 font-bold text-sm rounded-md hover:-translate-y-0.5 transition-all" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}>
                Schedule a Meeting
              </a>
              <a href="#" className="px-8 py-3.5 border-2 border-white/35 text-white font-bold text-sm rounded-md hover:bg-white/10 transition-colors">
                Download Credentials
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: NAVY }}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-extrabold text-xl"><span className="text-white">T</span><span style={{ color: GOLD }}>B</span><span style={{ color: GREEN }}>&amp;</span><span style={{ color: GOLD }}>B</span></span>
            <div className="flex gap-6 text-xs" style={{ color: 'rgba(255,255,255,.4)' }}>
              <a href="#" className="hover:text-white transition-colors" style={{ color: 'inherit' }}>Privacy</a>
              <a href="#" className="hover:text-white transition-colors" style={{ color: 'inherit' }}>Terms</a>
              <Link to="/" className="hover:text-white transition-colors" style={{ color: 'inherit' }}>Home</Link>
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,.25)' }}>© 2026 M&amp;T Bank · Member FDIC</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
