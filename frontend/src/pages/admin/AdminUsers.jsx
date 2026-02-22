import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Edit3, X, AlertCircle, Users, Clock, ChevronRight } from 'lucide-react';
import { getAdminUsers, updateUserStatus, updateUserBalance } from '../../api/admin';
import { Layout } from '../../components/Layout';
import { Topbar } from '../../components/Topbar';

const NAVY = '#003D2B';
const GOLD = '#C8E15A';
const GOLD_DK = '#8FAB32';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    suspended: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
};

const BalanceModal = ({ user, onClose, onSave }) => {
  const [available, setAvailable]   = useState(user.availableBalance.toString());
  const [ledger, setLedger]         = useState(user.ledgerBalance.toString());
  const [savings, setSavings]       = useState((user.savingsBalance || 0).toString());
  const [current, setCurrent]       = useState((user.currentBalance || 0).toString());
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSave = async () => {
    setError('');
    setLoading(true);
    try {
      await updateUserBalance(user.id, {
        availableBalance: parseFloat(available),
        ledgerBalance: parseFloat(ledger),
        savingsBalance: parseFloat(savings),
        currentBalance: parseFloat(current),
      });
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Edit Balance</h3>
            <p className="text-slate-500 text-sm mt-0.5">{user.name} · {user.accountNumber}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-4 text-sm text-red-700">
            <AlertCircle size={14} /> {error}
          </div>
        )}
        <div className="space-y-4 mb-6">
          {[
            { label: 'Available Balance (USD)', val: available, set: setAvailable },
            { label: 'Ledger Balance (USD)',    val: ledger,    set: setLedger },
            { label: 'Current Balance (USD)',   val: current,   set: setCurrent },
            { label: 'Savings Balance (USD)',   val: savings,   set: setSavings },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input
                  type="number" step="0.01"
                  value={val}
                  onChange={e => set(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm input-focus"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 text-sm transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="flex-1 py-3 font-semibold rounded-xl disabled:opacity-60 text-sm transition-all" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminUsers() {
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('all');
  const [editUser, setEditUser]         = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAdminUsers();
      setUsers(data.filter(u => u.role !== 'admin'));
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (e, userId, status) => {
    e.stopPropagation();
    setActionLoading(s => ({ ...s, [userId]: true }));
    try {
      await updateUserStatus(userId, status);
      setUsers(us => us.map(u => u.id === userId ? { ...u, status } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(s => ({ ...s, [userId]: false }));
    }
  };

  const filtered = filter === 'all' ? users : users.filter(u => u.status === filter);
  const pendingCount = users.filter(u => u.status === 'pending').length;

  return (
    <Layout>
      <Topbar title="User Management" subtitle="Approve, suspend & edit user accounts" onRefresh={load} />
      {editUser && <BalanceModal user={editUser} onClose={() => setEditUser(null)} onSave={load} />}
      <div className="flex-1 p-6 animate-fade-in">

        {pendingCount > 0 && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5">
            <Clock size={18} className="text-amber-600 flex-shrink-0" />
            <p className="text-amber-800 text-sm">
              <strong>{pendingCount} user{pendingCount > 1 ? 's' : ''}</strong> waiting for approval.
            </p>
            <button onClick={() => setFilter('pending')} className="ml-auto text-amber-700 font-semibold text-sm hover:underline">
              View pending
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          {/* Filter tabs */}
          <div className="flex items-center gap-2 p-4 border-b border-slate-100">
            {['all', 'active', 'pending', 'suspended'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all"
                style={filter === f
                  ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }
                  : { color: '#475569' }
                }
              >
                {f}
                {f === 'pending' && pendingCount > 0 && (
                  <span className="ml-1.5 bg-amber-500 text-white text-xs rounded-full px-1.5">{pendingCount}</span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${GOLD} transparent ${GOLD} ${GOLD}` }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Users size={40} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400">No users found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map(user => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 px-4 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
                      <StatusBadge status={user.status} />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{user.email} · {user.accountNumber}</p>
                  </div>
                  {/* Balances */}
                  <div className="hidden md:block text-right flex-shrink-0">
                    <p className="text-sm font-bold text-slate-800">{fmt(user.availableBalance)}</p>
                    <p className="text-xs text-slate-400">Available</p>
                  </div>
                  {/* Joined */}
                  <div className="hidden lg:block text-sm text-slate-400 flex-shrink-0">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={e => { e.stopPropagation(); setEditUser(user); }}
                      title="Edit balance"
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    {user.status !== 'active' && (
                      <button
                        onClick={e => handleStatus(e, user.id, 'active')}
                        disabled={actionLoading[user.id]}
                        title="Approve"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-40"
                      >
                        <CheckCircle2 size={14} />
                      </button>
                    )}
                    {user.status !== 'suspended' && (
                      <button
                        onClick={e => handleStatus(e, user.id, 'suspended')}
                        disabled={actionLoading[user.id]}
                        title="Suspend"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                      >
                        <XCircle size={14} />
                      </button>
                    )}
                    {user.status === 'suspended' && (
                      <button
                        onClick={e => handleStatus(e, user.id, 'pending')}
                        disabled={actionLoading[user.id]}
                        title="Set to pending"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-40"
                      >
                        <Clock size={14} />
                      </button>
                    )}
                    <ChevronRight size={14} className="text-slate-300 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
