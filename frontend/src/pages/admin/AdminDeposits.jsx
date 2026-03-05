import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Clock, Smartphone, User, AlertCircle, RefreshCw } from 'lucide-react';
import { getPendingDeposits, approveDeposit } from '../../api/admin';
import { Layout } from '../../components/Layout';
import { Topbar } from '../../components/Topbar';

const NAVY    = '#003D2B';
const GOLD    = '#C8E15A';
const GOLD_DK = '#8FAB32';
const GOLD_LT = '#EDF5C8';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

export default function AdminDeposits() {
  const [deposits, setDeposits]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [approving, setApproving] = useState({});
  const [errors, setErrors]       = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getPendingDeposits();
      setDeposits(data);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (dep) => {
    setApproving(s => ({ ...s, [dep.id]: true }));
    setErrors(s => ({ ...s, [dep.id]: '' }));
    try {
      await approveDeposit(dep.id);
      setDeposits(ds => ds.filter(d => d.id !== dep.id));
    } catch (err) {
      setErrors(s => ({ ...s, [dep.id]: err.response?.data?.message || 'Approval failed' }));
    } finally {
      setApproving(s => ({ ...s, [dep.id]: false }));
    }
  };

  return (
    <Layout>
      <Topbar
        title="Mobile Deposits"
        subtitle="Review and approve pending check deposits"
        onRefresh={load}
      />

      <div className="flex-1 p-6 animate-fade-in">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: `${GOLD} transparent ${GOLD} ${GOLD}` }} />
          </div>
        ) : deposits.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm text-center py-20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: GOLD_LT }}>
              <Smartphone size={28} style={{ color: GOLD_DK }} />
            </div>
            <p className="text-lg font-semibold text-slate-700 mb-1">No Pending Deposits</p>
            <p className="text-sm text-slate-400">All mobile deposits have been reviewed.</p>
            <button
              onClick={load}
              className="mt-6 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors mx-auto"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-500 font-medium">
              {deposits.length} pending deposit{deposits.length !== 1 ? 's' : ''} awaiting review
            </p>

            {deposits.map(dep => (
              <div key={dep.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Card header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(245,158,11,0.12)' }}>
                    <Clock size={18} style={{ color: '#d97706' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{dep.description}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(dep.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="text-xl font-extrabold flex-shrink-0" style={{ color: NAVY }}>
                    {fmt(dep.amount)}
                  </span>
                </div>

                {/* Details */}
                <div className="px-5 py-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Account Holder</p>
                    <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <User size={12} style={{ color: GOLD_DK }} /> {dep.userName || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Email</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{dep.userEmail || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Reference</p>
                    <p className="text-sm font-mono font-semibold text-slate-700 mt-0.5">{dep.reference}</p>
                  </div>
                </div>

                {/* Error */}
                {errors[dep.id] && (
                  <div className="mx-5 mb-3 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    <AlertCircle size={13} /> {errors[dep.id]}
                  </div>
                )}

                {/* Action */}
                <div className="px-5 pb-5">
                  <button
                    onClick={() => handleApprove(dep)}
                    disabled={approving[dep.id]}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 hover:-translate-y-0.5"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}
                  >
                    <CheckCircle2 size={16} />
                    {approving[dep.id] ? 'Approving...' : `Approve & Post ${fmt(dep.amount)}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
