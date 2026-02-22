import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, AlertCircle, CheckCircle2, Shield,
  Lock, User, Mail, Phone, ArrowRight, Upload, CreditCard, Hash
} from 'lucide-react';
import { register } from '../api/auth';

const NAVY   = '#003D2B';
const NAVY_MID = '#005C40';
const GOLD   = '#C8E15A';
const GOLD_DK = '#8FAB32';
const GOLD_LT = '#EDF5C8';
const GREEN  = '#027856';

const PERKS = [
  'Instant account setup — no paperwork',
  'Real-time balance & spending tracking',
  'Fast, secure domestic & international transfers',
  'Complete transaction history at your fingertips',
];

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

const UploadBox = ({ label, value, onChange, inputRef }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#64748b' }}>
      {label}
    </label>
    <div
      className="relative border-2 border-dashed rounded-xl overflow-hidden transition-all cursor-pointer hover:border-amber-400"
      style={{ borderColor: value ? GOLD : '#e2e8f0', background: value ? 'rgba(200,225,90,0.06)' : 'white', minHeight: 80 }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const b64 = await toBase64(file);
          onChange(b64);
        }}
      />
      {value ? (
        <div className="relative">
          <img src={value} alt="ID preview" className="w-full h-32 object-cover" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-semibold">Click to change</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-5 gap-2">
          <Upload size={20} style={{ color: '#94a3b8' }} />
          <span className="text-xs text-slate-400">Click to upload image</span>
        </div>
      )}
    </div>
  </div>
);

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', ssn: '',
  });
  const [idFront, setIdFront] = useState('');
  const [idBack, setIdBack]   = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState('');
  const [success, setSuccess]  = useState(false);
  const frontRef = useRef(null);
  const backRef  = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (!idFront) { setError('Please upload the front of your ID card'); return; }
    if (!idBack)  { setError('Please upload the back of your ID card'); return; }
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        ssn: form.ssn,
        idFront,
        idBack,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Success screen ── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#F7F8FA' }}>
        <div className="w-full max-w-md text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${GOLD_LT}, rgba(200,225,90,0.2))`, border: `2px solid ${GOLD}` }}
          >
            <CheckCircle2 size={44} style={{ color: GOLD_DK }} />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>Registration Successful!</h2>
          <p className="mb-2" style={{ color: '#64748b' }}>
            Your account has been created and is <strong style={{ color: NAVY }}>pending admin approval</strong>.
          </p>
          <p className="text-sm mb-8" style={{ color: '#94a3b8' }}>
            You'll be able to sign in once an administrator activates your account.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 font-bold text-sm rounded-xl transition-all hover:-translate-y-0.5"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY, textDecoration: 'none' }}
          >
            Back to Sign In <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left brand panel ── */}
      <div
        className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(0,61,43,0.97), rgba(0,61,43,0.88)), url('https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=900&q=80')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-5 bg-white -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5 bg-white translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative">
          <span style={{ fontWeight: 800, fontSize: 26, letterSpacing: -.5, textDecoration: 'none' }}>
            <span style={{ color: '#fff' }}>M</span><span style={{ color: GOLD }}>&amp;</span><span style={{ color: '#fff' }}>T</span><span style={{ color: GOLD }}> Bank</span>
          </span>
        </div>

        <div className="relative">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(200,225,90,0.15)', color: GOLD, border: '1px solid rgba(200,225,90,0.3)' }}
          >
            <Shield size={12} /> FDIC Insured · 256-bit Encryption
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Join thousands of<br />
            <span style={{ color: GOLD }}>smart savers</span>
          </h2>
          <p className="text-slate-300 text-base mb-8 leading-relaxed">
            Open your M&amp;T Bank account in minutes — no paperwork, no waiting. Your financial future starts here.
          </p>
          <ul className="space-y-3">
            {PERKS.map(p => (
              <li key={p} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,.8)' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(200,225,90,0.2)', border: '1px solid rgba(200,225,90,0.4)' }}>
                  <CheckCircle2 size={12} style={{ color: GOLD }} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-slate-500 text-sm relative">&copy; {new Date().getFullYear()} M&amp;T Bank. All rights reserved.</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-start justify-center p-8 overflow-y-auto" style={{ background: '#F7F8FA' }}>
        <div className="w-full max-w-md py-8">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: -.5 }}>
              <span style={{ color: NAVY }}>M</span><span style={{ color: GOLD }}>&amp;</span><span style={{ color: NAVY }}>T</span><span style={{ color: GOLD }}> Bank</span>
            </span>
          </div>

          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #EDF5C8, rgba(200,225,90,0.2))', border: '1px solid rgba(200,225,90,0.3)' }}
          >
            <Lock size={22} style={{ color: GOLD_DK }} />
          </div>

          <h1 className="text-3xl font-extrabold mb-1" style={{ color: NAVY }}>Create your account</h1>
          <p className="mb-8 text-sm" style={{ color: '#64748b' }}>Fill in your details to get started with M&amp;T Bank</p>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#64748b' }}>Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
                  <input
                    type="text" required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 bg-white text-sm input-focus transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#64748b' }}>
                  Phone <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'none' }}>(opt.)</span>
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+1 234 567 8900"
                    className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 bg-white text-sm input-focus transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Email + SSN */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#64748b' }}>Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
                  <input
                    type="email" required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 bg-white text-sm input-focus transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#64748b' }}>SSN</label>
                <div className="relative">
                  <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
                  <input
                    type="text"
                    value={form.ssn}
                    onChange={e => setForm(f => ({ ...f, ssn: e.target.value }))}
                    placeholder="XXX-XX-XXXX"
                    maxLength={11}
                    className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 bg-white text-sm input-focus transition-all"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Stored securely.</p>
              </div>
            </div>

            {/* ID Card upload */}
            <div
              className="p-4 rounded-xl space-y-3"
              style={{ background: 'rgba(200,225,90,0.06)', border: '1px solid rgba(200,225,90,0.2)' }}
            >
              <div className="flex items-center gap-2">
                <CreditCard size={15} style={{ color: GOLD_DK }} />
                <p className="text-sm font-semibold" style={{ color: NAVY }}>Government-Issued ID Card</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <UploadBox label="Front of ID" value={idFront} onChange={setIdFront} inputRef={frontRef} />
                <UploadBox label="Back of ID" value={idBack} onChange={setIdBack} inputRef={backRef} />
              </div>
              <p className="text-xs text-slate-400">Driver's License, Passport, or National ID</p>
            </div>

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#64748b' }}>Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'} required
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Min. 6 chars"
                    className="w-full px-3 py-3 pr-10 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 bg-white text-sm input-focus transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#64748b' }}>Confirm</label>
                <input
                  type="password" required
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="Repeat password"
                  className="w-full px-3 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 bg-white text-sm input-focus transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-sm font-bold rounded-xl transition-all duration-200 disabled:opacity-60 hover:-translate-y-0.5"
              style={{
                background: loading ? '#6b7280' : `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`,
                color: NAVY,
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div
            className="flex items-start gap-3 mt-5 p-3.5 rounded-xl"
            style={{ background: 'rgba(2,120,86,0.08)', border: '1px solid rgba(2,120,86,0.2)' }}
          >
            <Shield size={15} style={{ color: GREEN }} className="mt-0.5 flex-shrink-0" />
            <p className="text-xs leading-relaxed text-slate-600">
              <strong>Your data is protected.</strong> M&amp;T Bank uses end-to-end encryption and bank-grade security on all accounts. Your SSN and ID are stored with military-grade encryption.
            </p>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: GOLD_DK }}>
              Sign in
            </Link>
          </p>

          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {['Privacy Policy', 'Terms of Use', 'Contact Us'].map(l => (
              <a key={l} href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-center text-xs text-slate-300 mt-3">
            &copy; {new Date().getFullYear()} M&amp;T Bank. Member FDIC
          </p>
        </div>
      </div>
    </div>
  );
}
