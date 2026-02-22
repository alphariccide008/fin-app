import { Link } from 'react-router-dom';
import {
  TrendingUp, ScrollText, Shield, Calculator,
  Leaf, Briefcase, Umbrella, CheckCircle, ArrowRight, Star
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

const services = [
  { icon: TrendingUp,  title: 'Investment Management', desc: 'Personalized portfolios built around your goals, risk tolerance, and time horizon — actively managed by our experienced investment team.' },
  { icon: ScrollText,  title: 'Estate Planning',        desc: 'Preserve your legacy with coordinated estate planning that integrates legal, tax, and financial strategies to protect your family.' },
  { icon: Shield,      title: 'Trust Services',         desc: 'M&T Bank serves as corporate trustee for revocable, irrevocable, charitable, and special needs trusts with institutional rigor.' },
  { icon: Calculator,  title: 'Tax Strategy',            desc: 'Proactive tax-loss harvesting, charitable giving strategies, and coordination with your CPA to minimize your tax burden.' },
  { icon: Leaf,        title: 'Philanthropic Planning',  desc: 'Donor-advised funds, private foundations, and charitable trust strategies to align your giving with your values.' },
  { icon: Briefcase,   title: 'Business Succession',     desc: 'Comprehensive planning for business owners — buy-sell agreements, ESOPs, family transitions, and monetization strategies.' },
  { icon: Umbrella,    title: 'Insurance & Risk',        desc: 'Life insurance, long-term care, and liability coverage tailored to protect your wealth and provide for the people who matter most.' },
];

const advisors = [
  { name: 'Dr. Angela Foster', role: 'Chief Wealth Officer', cred: 'CFP® · CFA®', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80', bio: '25 years building comprehensive wealth strategies for ultra-high-net-worth families.' },
  { name: 'Robert Thorne',     role: 'Director, Estate Planning', cred: 'CFP® · JD',  img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', bio: 'Attorney and planner specializing in complex trust structures and wealth transfer.' },
  { name: 'Michelle Park',     role: 'Portfolio Manager',    cred: 'CFA® · CAIA', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', bio: 'Oversees $4.2B in client assets with expertise in alternative investments and ESG.' },
  { name: 'Carlos Mendez',     role: 'Tax & Wealth Strategist', cred: 'CFP® · CPA',img: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80', bio: 'Integrates tax planning with investment strategy to maximize after-tax wealth.' },
];

const process = [
  { icon: '01', title: 'Discovery Call',     desc: 'A 30-minute conversation to understand your goals and current picture — no obligation.' },
  { icon: '02', title: 'Deep Analysis',      desc: 'We analyze your complete financial picture — assets, liabilities, taxes, estate.' },
  { icon: '03', title: 'Tailored Plan',      desc: 'Your advisor presents a comprehensive wealth plan with clear recommendations.' },
  { icon: '04', title: 'Ongoing Partnership',desc: 'Regular reviews and proactive outreach as your life and markets evolve.' },
];

export default function Wealth() {
  return (
    <div className="min-h-screen bg-white">

      <PublicNav />

      {/* Hero */}
      <section className="flex min-h-[560px]">
        <div
          className="flex-1 flex items-center px-10 md:px-16 py-20 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}
        >
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-5 bg-white -translate-y-1/3 translate-x-1/3" />
          <div className="relative max-w-xl animate-fade-in">
            <span className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ background: 'rgba(200,225,90,0.15)', color: GOLD, border: '1px solid rgba(200,225,90,0.3)' }}>
              WEALTH MANAGEMENT
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
              Your wealth.<br /><span style={{ color: GOLD }}>Thoughtfully managed.</span>
            </h1>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,.75)' }}>
              M&amp;T Bank Wealth brings together investment management, estate planning, tax strategy, and trust services under one roof — guided by advisors who put your goals at the center of every decision.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="inline-flex items-center gap-2 px-7 py-3.5 font-bold text-sm rounded-md hover:-translate-y-0.5 transition-all" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}>
                Meet a Wealth Advisor <ArrowRight size={16} />
              </a>
              <a href="#" className="px-7 py-3.5 border-2 text-white font-bold text-sm rounded-md hover:bg-white/10 transition-colors" style={{ borderColor: 'rgba(255,255,255,.4)' }}>
                Our Philosophy
              </a>
            </div>
          </div>
        </div>
        <div
          className="hidden lg:block w-[42%]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?auto=format&fit=crop&w=900&q=80')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}
        />
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: '$18B+', label: 'Assets Under Management' },
              { val: '7,200+', label: 'Client Relationships' },
              { val: '35 yrs', label: 'Wealth Expertise' },
              { val: '94%', label: 'Client Retention Rate' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i + 1}>
                <div className="text-center p-6 rounded-xl border border-gray-100" style={{ background: '#F7F8FA' }}>
                  <p className="text-3xl font-extrabold mb-1" style={{ color: NAVY }}>{s.val}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16" style={{ background: '#F7F8FA' }}>
        <div className="max-w-7xl mx-auto px-4">
          <Reveal className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD_DK }}>OUR SERVICES</p>
            <h2 className="text-3xl font-bold mb-3" style={{ color: NAVY }}>Comprehensive wealth solutions</h2>
            <p className="text-gray-500 max-w-lg mx-auto">From growing your portfolio to protecting your legacy, our integrated services work together for your total financial picture.</p>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) + 1}>
                <div
                  className="p-6 rounded-2xl bg-white border h-full transition-all card-hover"
                  style={{ borderLeft: `3px solid ${GOLD}`, borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,61,43,.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: GOLD_LT }}>
                    <s.icon size={20} style={{ color: GOLD_DK }} />
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: NAVY }}>{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{s.desc}</p>
                  <a href="#" className="text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: GOLD_DK }}>
                    Learn more <ArrowRight size={13} />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="flex min-h-[460px]">
        <div
          className="hidden lg:block w-[45%]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}
        />
        <Reveal direction="left" className="flex-1 flex items-center px-10 md:px-16 py-16" style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD_LT }}>OUR PHILOSOPHY</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">We believe wealth management is deeply personal</h2>
            <p className="mb-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,.75)' }}>
              We don't sell products — we build relationships. Every decision we make is guided by a fiduciary standard, meaning your interests always come first.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                'Fiduciary standard, always',
                'Holistic financial planning',
                'Disciplined, evidence-based investing',
                'Transparent, fair fee structure',
              ].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,.8)' }}>
                  <CheckCircle size={15} style={{ color: GOLD }} /> {f}
                </li>
              ))}
            </ul>
            <a href="#" className="inline-flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-md" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}>
              Start a Conversation <ArrowRight size={15} />
            </a>
          </div>
        </Reveal>
      </section>

      {/* Advisors */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD_DK }}>MEET OUR TEAM</p>
            <h2 className="text-3xl font-bold" style={{ color: NAVY }}>Your advisors</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advisors.map((a, i) => (
              <Reveal key={a.name} delay={i + 1}>
                <div className="rounded-2xl overflow-hidden border border-gray-100 card-hover bg-white">
                  <img src={a.img} alt={a.name} className="w-full h-56 object-cover object-top" />
                  <div className="p-5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: GOLD_LT, color: GOLD_DK }}>{a.cred}</span>
                    <h4 className="font-bold mt-2 mb-0.5" style={{ color: NAVY }}>{a.name}</h4>
                    <p className="text-xs font-semibold mb-2" style={{ color: GOLD_DK }}>{a.role}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{a.bio}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16" style={{ background: '#F7F8FA' }}>
        <div className="max-w-7xl mx-auto px-4">
          <Reveal className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD_DK }}>HOW IT WORKS</p>
            <h2 className="text-3xl font-bold" style={{ color: NAVY }}>Your path to a wealth plan</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <Reveal key={p.title} delay={i + 1}>
                <div className="text-center p-6 bg-white rounded-2xl border border-gray-100">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`, color: GOLD }}
                  >
                    {p.icon}
                  </div>
                  <h4 className="font-bold mb-2" style={{ color: NAVY }}>{p.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Gold */}
      <section
        className="py-16 text-center"
        style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})` }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <h2 className="text-3xl font-extrabold mb-3" style={{ color: NAVY }}>Begin your wealth journey today</h2>
            <p className="mb-8 text-sm" style={{ color: 'rgba(0,61,43,.75)' }}>Complimentary, no-obligation consultation with a M&amp;T Bank wealth advisor.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a href="#" className="px-8 py-3.5 font-bold text-sm rounded-md hover:-translate-y-0.5 transition-all" style={{ background: NAVY, color: GOLD }}>
                Schedule Consultation
              </a>
              <a href="#" className="px-8 py-3.5 border-2 font-bold text-sm rounded-md hover:bg-black/5 transition-colors" style={{ borderColor: 'rgba(0,61,43,.35)', color: NAVY }}>
                Download Our Brochure
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <Reveal>
            <div className="p-10 rounded-2xl" style={{ background: '#F7F8FA', borderLeft: `4px solid ${GOLD}` }}>
              <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(i => <Star key={i} size={15} fill={GOLD} style={{ color: GOLD }} />)}</div>
              <p className="text-gray-700 text-lg italic leading-relaxed mb-6">
                "M&amp;T Bank Wealth has managed my family's assets for over 15 years. Dr. Foster's team doesn't just manage investments — they coordinate every aspect of our financial life. We sleep soundly knowing everything is in order."
              </p>
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="" className="w-12 h-12 rounded-full object-cover" style={{ border: `2px solid ${GOLD}` }} />
                <div>
                  <p className="font-bold" style={{ color: NAVY }}>Jonathan Pierce</p>
                  <p className="text-xs text-gray-400">Founder, Pierce Capital Partners</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Disclosure */}
      <div className="py-4 px-4 text-center" style={{ background: '#F7F8FA', borderTop: '1px solid #e2e8f0' }}>
        <p className="text-xs text-gray-400 max-w-3xl mx-auto">
          M&amp;T Bank Wealth Management is a registered investment adviser. Investing involves risk including loss of principal. Securities are not FDIC insured, not bank guaranteed, and may lose value. Past performance is not indicative of future results.
        </p>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: NAVY }}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-extrabold text-xl"><span className="text-white">T</span><span style={{ color: GOLD }}>B</span><span style={{ color: GREEN }}>&amp;</span><span style={{ color: GOLD }}>B</span></span>
            <div className="flex gap-6 text-xs" style={{ color: 'rgba(255,255,255,.4)' }}>
              <a href="#" className="hover:text-white transition-colors" style={{ color: 'inherit' }}>Privacy</a>
              <a href="#" className="hover:text-white transition-colors" style={{ color: 'inherit' }}>Form ADV</a>
              <Link to="/" className="hover:text-white transition-colors" style={{ color: 'inherit' }}>Home</Link>
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,.25)' }}>© 2026 M&amp;T Bank · Member FDIC</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
