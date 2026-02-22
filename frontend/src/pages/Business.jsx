import { Link } from 'react-router-dom';
import {
  Building2, CreditCard, Banknote, Store, Users, Shield,
  CheckCircle, ArrowRight, Star, Phone, Mail, Clock
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
  { icon: Building2,   title: 'Business Checking',    desc: 'Flexible accounts with unlimited transactions, free digital tools, and dedicated business support.' },
  { icon: CreditCard,  title: 'Business Credit Cards', desc: 'Earn rewards on every purchase with customizable spending controls and employee card management.' },
  { icon: Banknote,    title: 'Business Loans & Lines', desc: 'Term loans, SBA loans, equipment financing, and revolving lines of credit to fuel your growth.' },
  { icon: Store,       title: 'Merchant Services',     desc: 'Accept payments anywhere with POS solutions, online processing, and next-day funding.' },
  { icon: Users,       title: 'Payroll & HR',           desc: 'Simplify payroll, direct deposits, and tax compliance with integrated HR tools.' },
  { icon: Shield,      title: 'Treasury Management',   desc: 'Optimize liquidity, manage risk, and streamline cash management solutions.' },
];

const industries = ['Healthcare', 'Real Estate', 'Technology', 'Manufacturing', 'Retail & Hospitality', 'Construction', 'Professional Services', 'Agriculture', 'Nonprofit', 'Transportation'];

export default function Business() {
  return (
    <div className="min-h-screen bg-white">

      <PublicNav />

      {/* ── Hero ── */}
      <section className="flex min-h-[520px]">
        <div
          className="flex-1 flex items-center px-10 md:px-16 py-20 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_MID} 100%)` }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 bg-white -translate-y-1/3 translate-x-1/3" />
          <div className="relative max-w-xl animate-fade-in">
            <span className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ background: 'rgba(200,225,90,0.15)', color: GOLD, border: '1px solid rgba(200,225,90,0.3)' }}>
              BUSINESS BANKING
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
              Banking built for your<br /><span style={{ color: GOLD }}>business to grow</span>
            </h1>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,.75)' }}>
              From day one to your next milestone — M&amp;T Bank provides the financial tools, expert guidance, and dedicated support to keep your business moving forward.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 px-7 py-3.5 font-bold text-sm rounded-md hover:-translate-y-0.5 transition-all" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}>
                Open a Business Account <ArrowRight size={16} />
              </Link>
              <a href="#" className="px-7 py-3.5 border-2 text-white font-bold text-sm rounded-md hover:bg-white/10 transition-colors" style={{ borderColor: 'rgba(255,255,255,.4)' }}>
                Talk to an Advisor
              </a>
            </div>
          </div>
        </div>
        <div
          className="hidden lg:block w-[42%] flex-shrink-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}
        />
      </section>

      {/* ── Services ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD_DK }}>OUR SOLUTIONS</p>
            <h2 className="text-3xl font-bold mb-3" style={{ color: NAVY }}>Everything your business needs</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Comprehensive financial solutions tailored to businesses of all sizes.</p>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) + 1}>
                <div
                  className="p-6 rounded-2xl border h-full transition-all card-hover cursor-pointer"
                  style={{ borderColor: '#e2e8f0' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,61,43,.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = ''; }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}>
                    <s.icon size={20} style={{ color: GOLD }} />
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

      {/* ── Stats ── */}
      <section className="py-14" style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: '48K+', label: 'Business Clients' },
              { val: '$3B+', label: 'Business Loans Funded' },
              { val: '98%',  label: 'Client Satisfaction' },
              { val: '320+', label: 'Business Advisors' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i + 1}>
                <div className="text-center p-6 rounded-xl" style={{ background: 'rgba(200,225,90,0.12)', border: '1px solid rgba(200,225,90,0.25)' }}>
                  <p className="text-4xl font-extrabold mb-1" style={{ color: GOLD }}>{s.val}</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,.65)' }}>{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Split — Grow ── */}
      <section className="flex min-h-[420px]">
        <div
          className="hidden lg:block w-[45%]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}
        />
        <Reveal direction="left" className="flex-1 flex items-center px-10 md:px-16 py-16" style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD_LT }}>GROW WITH M&amp;T Bank</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">A partner that invests in your success</h2>
            <p className="mb-5 leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,.75)' }}>
              Our dedicated business banking team works alongside you to craft financing strategies that align with where you want to go — not just where you are today.
            </p>
            <ul className="space-y-2 mb-6">
              {['Dedicated relationship manager', 'Same-day credit decisions', 'Flexible repayment structures', 'Local decision-making'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,.8)' }}>
                  <CheckCircle size={15} style={{ color: GOLD }} /> {f}
                </li>
              ))}
            </ul>
            <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-md" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}>
              Meet our team <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Industries ── */}
      <section className="py-16" style={{ background: '#F7F8FA' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD_DK }}>INDUSTRIES WE SERVE</p>
            <h2 className="text-3xl font-bold mb-3" style={{ color: NAVY }}>Expertise across every sector</h2>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">Deep industry knowledge means we understand your unique challenges better than any generalist bank.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {industries.map(ind => (
                <span key={ind} className="px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer"
                  style={{ background: GOLD_LT, color: NAVY }}
                  onMouseEnter={e => { e.target.style.background = GOLD; }}
                  onMouseLeave={e => { e.target.style.background = GOLD_LT; }}
                >{ind}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <Reveal>
            <div className="p-10 rounded-2xl" style={{ background: '#F7F8FA', borderLeft: `4px solid ${GOLD}` }}>
              <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(i => <Star key={i} size={15} fill={GOLD} style={{ color: GOLD }} />)}</div>
              <p className="text-gray-700 text-lg italic leading-relaxed mb-6">
                "M&amp;T Bank didn't just give us a loan — they gave us a partner. Our relationship manager calls us proactively when they see opportunities to save us money. That level of service is why we've banked with them for over 11 years."
              </p>
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&q=80" alt="" className="w-12 h-12 rounded-full object-cover" style={{ border: `2px solid ${GOLD}` }} />
                <div>
                  <p className="font-bold" style={{ color: NAVY }}>Marcus J. Williams</p>
                  <p className="text-xs text-gray-400">CEO, Williams Manufacturing Group</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 text-center" style={{ background: `linear-gradient(135deg, ${GREEN}, #0D4F3C)` }}>
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <h2 className="text-3xl font-extrabold text-white mb-3">Ready to open your business account?</h2>
            <p className="text-white/75 mb-8">Join over 48,000 businesses that trust M&amp;T Bank to manage their finances.</p>
            <div className="flex gap-3 justify-content-center flex-wrap justify-center">
              <Link to="/register" className="px-8 py-3.5 font-bold text-sm rounded-md hover:-translate-y-0.5 transition-all" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}>
                Open Account Online
              </Link>
              <a href="#" className="px-8 py-3.5 border-2 border-white/40 text-white font-bold text-sm rounded-md hover:bg-white/10 transition-colors">
                Schedule a Consultation
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
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
