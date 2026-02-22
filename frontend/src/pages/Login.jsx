import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Clock, Shield, Lock, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../api/auth';

const NAVY   = '#003D2B';
const GOLD   = '#C8E15A';
const GOLD_DK = '#8FAB32';
const GOLD_LT = '#EDF5C8';
const GREEN  = '#027856';

export default function Login() {
  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [isPending, setIsPending] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setIsPending(false); setLoading(true);
    try {
      const { data } = await login(form.email, form.password);
      loginUser(data.token, data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      if (err.response?.data?.status === 'pending') setIsPending(true);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F8FA' }}>

      {/* ── Top FDIC bar (M&T inspired) ── */}
      <div style={{ background: NAVY, padding: '8px 0' }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" style={{ textDecoration: 'none', fontWeight: 800, fontSize: 22, letterSpacing: -.5 }}>
              <span style={{ color: '#fff' }}>M</span><span style={{ color: GOLD }}>&amp;</span><span style={{ color: '#fff' }}>T</span><span style={{ color: GOLD }}> Bank</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,.6)' }}>
            <Shield size={11} style={{ color: GOLD }} />
            <span>FDIC-Insured · 256-bit SSL Encryption</span>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-1">

        {/* Left panel */}
        <div
          className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to bottom right, rgba(0,61,43,0.97), rgba(0,61,43,0.88)), url('https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=900&q=80')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}
        >
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-5 bg-white -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5 bg-white translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          {/* Hero text */}
          <div className="relative mt-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8"
              style={{ background: 'rgba(200,225,90,0.15)', color: GOLD, border: '1px solid rgba(200,225,90,0.3)' }}
            >
              <Shield size={12} /> Secure Online Banking
            </div>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-5">
              Banking made<br />
              <span style={{ color: GOLD }}>simple &amp; secure</span>
            </h2>
            <p className="text-slate-300 text-base mb-10 leading-relaxed max-w-sm">
              Manage your finances with confidence. Real-time transfers, instant notifications, and bank-grade security — always at your fingertips.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Uptime',      value: '99.9%' },
                { label: 'Encryption', value: '256-bit' },
                { label: 'Transfers',  value: 'Instant' },
                { label: 'Support',    value: '24/7' },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <p className="font-bold text-xl" style={{ color: GOLD }}>{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-slate-600 text-sm relative">&copy; {new Date().getFullYear()} M&amp;T Bank. All rights reserved.</p>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex items-center justify-center p-8" style={{ background: '#F7F8FA' }}>
          <div className="w-full max-w-md">

            {/* Lock icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7 shadow-sm"
              style={{ background: `linear-gradient(135deg, ${GOLD_LT}, rgba(200,225,90,0.2))`, border: `1px solid rgba(200,225,90,0.3)` }}
            >
              <Lock size={22} style={{ color: GOLD_DK }} />
            </div>

            <h1 className="text-3xl font-extrabold mb-1" style={{ color: NAVY }}>Sign in</h1>
            <p className="text-sm mb-8" style={{ color: '#64748b' }}>
              Access your M&amp;T Bank Online Banking account
            </p>

            {/* Pending notice */}
            {isPending && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                <Clock size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-800 font-semibold text-sm">Account Pending Approval</p>
                  <p className="text-amber-700 text-sm mt-0.5">Your account is awaiting admin activation. You'll be notified once approved.</p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && !isPending && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#64748b' }}>
                  Username or Email Address
                </label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 bg-white text-sm input-focus transition-all"
                  style={{ fontSize: 15 }}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#64748b' }}>
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold hover:underline" style={{ color: GOLD_DK }}>
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'} required
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 pr-12 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 bg-white text-sm input-focus transition-all"
                    style={{ fontSize: 15 }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-sm font-bold rounded-xl transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: loading ? '#6b7280' : `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>Sign In Securely <ChevronRight size={16} /></>
                )}
              </button>
            </form>

            {/* Security notice */}
            <div
              className="flex items-start gap-3 mt-5 p-3.5 rounded-xl"
              style={{ background: 'rgba(2,120,86,0.08)', border: '1px solid rgba(2,120,86,0.2)' }}
            >
              <Shield size={15} style={{ color: GREEN }} className="mt-0.5 flex-shrink-0" />
              <p className="text-xs leading-relaxed text-slate-600">
                <strong>Your security matters.</strong> M&amp;T Bank uses end-to-end encryption and multi-factor authentication.
                Never share your password with anyone, including bank staff.
              </p>
            </div>

            <p className="text-center text-sm text-slate-500 mt-6">
              New to online banking?{' '}
              <Link to="/register" className="font-semibold hover:underline" style={{ color: GOLD_DK }}>
                Enroll now
              </Link>
            </p>

            <div className="flex justify-center gap-4 mt-5 flex-wrap">
              {['Privacy Policy', 'Terms of Use', 'Contact Us', 'Security'].map(l => (
                <a key={l} href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">{l}</a>
              ))}
            </div>
            <p className="text-center text-xs text-slate-300 mt-3">
              &copy; {new Date().getFullYear()} M&amp;T Bank. Member FDIC
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
