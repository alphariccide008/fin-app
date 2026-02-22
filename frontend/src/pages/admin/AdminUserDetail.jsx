import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Mail, Phone, CreditCard, Hash, Wallet,
  TrendingUp, PiggyBank, Shield, CheckCircle2, XCircle,
  Clock, ArrowDownLeft, ArrowUpRight, MessageSquare, Edit3, X, AlertCircle
} from 'lucide-react';
import { getAdminUserDetail, updateUserInfo, updateUserStatus, updateUserBalance } from '../../api/admin';
import { Layout } from '../../components/Layout';
import { Topbar } from '../../components/Topbar';

const NAVY    = '#003D2B';
const NAVY_MID = '#005C40';
const GOLD    = '#C8E15A';
const GOLD_DK = '#8FAB32';
const GOLD_LT = '#EDF5C8';
const GREEN   = '#027856';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

const StatusBadge = ({ status }) => {
  const styles = { active: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', suspended: 'bg-red-100 text-red-700' };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
};

const InfoRow = ({ icon: Icon, label, value, masked }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: GOLD_LT }}>
      <Icon size={14} style={{ color: GOLD_DK }} />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <p className="text-sm font-semibold text-slate-800 mt-0.5 break-all">{value || '—'}</p>
    </div>
  </div>
);

const BalanceModal = ({ user, onClose, onSave }) => {
  const [available, setAvailable] = useState((user.availableBalance || 0).toString());
  const [ledger, setLedger]       = useState((user.ledgerBalance || 0).toString());
  const [savings, setSavings]     = useState((user.savingsBalance || 0).toString());
  const [current, setCurrent]     = useState((user.currentBalance || 0).toString());
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSave = async () => {
    setError(''); setLoading(true);
    try {
      await updateUserBalance(user.id, {
        availableBalance: parseFloat(available),
        ledgerBalance: parseFloat(ledger),
        savingsBalance: parseFloat(savings),
        currentBalance: parseFloat(current),
      });
      onSave(); onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 text-lg">Edit Balance</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        {error && <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-4 text-sm text-red-700"><AlertCircle size={14} /> {error}</div>}
        <div className="space-y-4 mb-6">
          {[
            { label: 'Available Balance', val: available, set: setAvailable },
            { label: 'Ledger Balance',    val: ledger,    set: setLedger },
            { label: 'Current Balance',   val: current,   set: setCurrent },
            { label: 'Savings Balance',   val: savings,   set: setSavings },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label} (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input type="number" step="0.01" value={val} onChange={e => set(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm input-focus" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 text-sm">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="flex-1 py-3 font-semibold rounded-xl disabled:opacity-60 text-sm" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserInfoModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name:  user.name  || '',
    email: user.email || '',
    phone: user.phone || '',
    role:  user.role  || 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.');
      return;
    }
    setError(''); setLoading(true);
    try {
      await updateUserInfo(user.id, form);
      onSave(); onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 text-lg">Edit User Information</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-4 text-sm text-red-700">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text" value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm input-focus"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email" value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="email@example.com"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm input-focus"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel" value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm input-focus"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              value={form.role}
              onChange={e => set('role', e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm input-focus bg-white"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 text-sm">
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading}
            className="flex-1 py-3 font-semibold rounded-xl disabled:opacity-60 text-sm"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [editBal, setEditBal]   = useState(false);
  const [editInfo, setEditInfo] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAdminUserDetail(id);
      setUser(data);
    } catch {} finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (status) => {
    setStatusLoading(true);
    try {
      await updateUserStatus(id, status);
      setUser(u => ({ ...u, status }));
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Topbar title="User Detail" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${GOLD} transparent ${GOLD} ${GOLD}` }} />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <Topbar title="User Detail" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400">User not found.</p>
        </div>
      </Layout>
    );
  }

  const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <Layout>
      <Topbar
        title="User Detail"
        subtitle={user.name}
        onRefresh={load}
      />
      {editBal  && <BalanceModal  user={user} onClose={() => setEditBal(false)}  onSave={load} />}
      {editInfo && <UserInfoModal user={user} onClose={() => setEditInfo(false)} onSave={load} />}

      <div className="flex-1 p-6 space-y-6 animate-fade-in">

        {/* Back button */}
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Users
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left column: profile + ID */}
          <div className="xl:col-span-1 space-y-4">

            {/* Profile card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex flex-col items-center text-center mb-6">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-3 shadow"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}
                >
                  {initials}
                </div>
                <h2 className="text-xl font-bold" style={{ color: NAVY }}>{user.name}</h2>
                <p className="text-sm text-slate-400 mt-1">{user.accountNumber}</p>
                <div className="mt-2"><StatusBadge status={user.status} /></div>
              </div>

              {/* Status actions */}
              <div className="flex gap-2 mb-5">
                {user.status !== 'active' && (
                  <button
                    onClick={() => handleStatus('active')}
                    disabled={statusLoading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 size={14} /> Approve
                  </button>
                )}
                {user.status !== 'suspended' && (
                  <button
                    onClick={() => handleStatus('suspended')}
                    disabled={statusLoading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <XCircle size={14} /> Suspend
                  </button>
                )}
                {user.status === 'suspended' && (
                  <button
                    onClick={() => handleStatus('pending')}
                    disabled={statusLoading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-50"
                  >
                    <Clock size={14} /> Set Pending
                  </button>
                )}
              </div>

              {/* Personal info */}
              <div>
                <InfoRow icon={Mail}  label="Email"   value={user.email} />
                <InfoRow icon={Phone} label="Phone"   value={user.phone || 'Not provided'} />
                <InfoRow icon={Hash}  label="SSN"     value={user.ssn ? `***-**-${user.ssn.slice(-4)}` : 'Not provided'} />
                <InfoRow icon={User}  label="Role"    value={user.role} />
                <InfoRow icon={Clock} label="Joined"  value={new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
              </div>

              {/* Edit info + message */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditInfo(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}
                >
                  <Edit3 size={14} /> Edit Info
                </button>
                <button
                  onClick={() => navigate(`/admin/messages?user=${user.id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`, color: GOLD }}
                >
                  <MessageSquare size={15} /> Message
                </button>
              </div>
            </div>

            {/* SSN reveal card */}
            {user.ssn && (
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Full SSN</p>
                <p
                  className="text-lg font-mono font-bold tracking-widest px-4 py-3 rounded-xl text-center"
                  style={{ background: 'rgba(200,225,90,0.08)', color: NAVY, border: `1px solid rgba(200,225,90,0.25)` }}
                >
                  {user.ssn}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Shield size={12} style={{ color: GREEN }} />
                  <p className="text-xs text-slate-400">Handle with care — sensitive information</p>
                </div>
              </div>
            )}

            {/* ID Card images */}
            {(user.idFront || user.idBack) && (
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={15} style={{ color: GOLD_DK }} />
                  <p className="text-sm font-semibold" style={{ color: NAVY }}>Government ID Card</p>
                </div>
                <div className="space-y-3">
                  {user.idFront && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1.5">Front</p>
                      <img src={user.idFront} alt="ID Front" className="w-full rounded-xl border border-slate-200 object-cover" style={{ maxHeight: 160 }} />
                    </div>
                  )}
                  {user.idBack && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1.5">Back</p>
                      <img src={user.idBack} alt="ID Back" className="w-full rounded-xl border border-slate-200 object-cover" style={{ maxHeight: 160 }} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right column: balances */}
          <div className="xl:col-span-2 space-y-4">

            {/* Balance cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Available Balance', val: user.availableBalance, icon: Wallet,    color: GOLD_DK,  bg: GOLD_LT },
                { label: 'Current Balance',   val: user.currentBalance,  icon: TrendingUp, color: GOLD_DK,  bg: GOLD_LT },
                { label: 'Savings Balance',   val: user.savingsBalance,  icon: PiggyBank,  color: GREEN,    bg: 'rgba(2,120,86,0.1)' },
                { label: 'Ledger Balance',    val: user.ledgerBalance,   icon: Shield,     color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
              ].map(({ label, val, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-500">{label}</span>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                      <Icon size={14} style={{ color }} />
                    </div>
                  </div>
                  <p className="text-xl font-bold" style={{ color: NAVY }}>{fmt(val)}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setEditBal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-amber-50"
              style={{ borderColor: `rgba(200,225,90,0.4)`, color: GOLD_DK }}
            >
              <Edit3 size={14} /> Edit Balances
            </button>

            {/* Transaction history */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-semibold" style={{ color: NAVY }}>Transaction History</h3>
              </div>
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {user.transactions && user.transactions.length > 0 ? (
                  user.transactions.map(tx => {
                    const isCredit = tx.type === 'credit';
                    return (
                      <div key={tx.id} className="flex items-center gap-3 px-5 py-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: isCredit ? 'rgba(2,120,86,0.1)' : 'rgba(239,68,68,0.1)' }}
                        >
                          {isCredit
                            ? <ArrowDownLeft size={15} style={{ color: GREEN }} />
                            : <ArrowUpRight size={15} className="text-red-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-700 truncate">{tx.description}</p>
                          <p className="text-xs text-slate-400">{tx.counterparty} · {new Date(tx.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-sm font-bold ${isCredit ? 'text-green-600' : 'text-red-500'}`}>
                            {isCredit ? '+' : '-'}{fmt(tx.amount)}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                            tx.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>{tx.status}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-slate-400 text-sm">No transactions yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
