import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, ArrowDownLeft, ArrowUpRight, X, AlertCircle, History } from 'lucide-react';
import { getAdminUsers } from '../../api/admin';
import { getAdminTransactions, addAdminTransaction, deleteTransaction } from '../../api/admin';
import { Layout } from '../../components/Layout';
import { Topbar } from '../../components/Topbar';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

const AddModal = ({ users, onClose, onSave }) => {
  const [form, setForm] = useState({
    userId: '',
    type: 'credit',
    amount: '',
    description: '',
    counterparty: '',
    bankTo: '',
    status: 'completed',
    createdAt: new Date().toISOString().slice(0, 16),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.userId || !form.amount) {
      setError('User and amount are required');
      return;
    }
    setLoading(true);
    try {
      await addAdminTransaction({
        ...form,
        amount: parseFloat(form.amount),
        createdAt: new Date(form.createdAt).toISOString(),
      });
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-fade-in my-4">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 text-lg">Add Manual Transaction</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-4 text-sm text-red-700">
            <AlertCircle size={14} /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">User Account</label>
            <select
              required
              value={form.userId}
              onChange={e => setForm(f => ({ ...f, userId: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm input-focus bg-white"
            >
              <option value="">Select user...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.accountNumber})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <div className="flex gap-2">
                {['credit', 'debit'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors border ${
                      form.type === t
                        ? t === 'credit'
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-red-500 text-white border-red-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm input-focus bg-white"
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm input-focus"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="e.g. Initial deposit, Bonus credit"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm input-focus"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Counterparty</label>
            <input
              type="text"
              value={form.counterparty}
              onChange={e => setForm(f => ({ ...f, counterparty: e.target.value }))}
              placeholder="e.g. Bank Transfer, Client Name"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm input-focus"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bank To</label>
            <input
              type="text"
              value={form.bankTo}
              onChange={e => setForm(f => ({ ...f, bankTo: e.target.value }))}
              placeholder="e.g. Chase Bank, Wells Fargo"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm input-focus"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date & Time</label>
            <input
              type="datetime-local"
              value={form.createdAt}
              onChange={e => setForm(f => ({ ...f, createdAt: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm input-focus"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 font-semibold rounded-xl disabled:opacity-60 text-sm transition-all" style={{ background: 'linear-gradient(135deg, #C8E15A, #8FAB32)', color: '#003D2B' }}>
              {loading ? 'Adding...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [txRes, usersRes] = await Promise.all([getAdminTransactions(), getAdminUsers()]);
      setTransactions(txRes.data);
      setUsers(usersRes.data.filter(u => u.role !== 'admin'));
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction? Note: This does not reverse the balance change.')) return;
    setDeleting(s => ({ ...s, [id]: true }));
    try {
      await deleteTransaction(id);
      setTransactions(ts => ts.filter(t => t.id !== id));
    } catch {} finally {
      setDeleting(s => ({ ...s, [id]: false }));
    }
  };

  return (
    <Layout>
      <Topbar title="Transaction Management" subtitle="Add and manage all platform transactions" onRefresh={load} />
      {showModal && <AddModal users={users} onClose={() => setShowModal(false)} onSave={load} />}
      <div className="flex-1 p-6 animate-fade-in">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 font-semibold rounded-xl text-sm transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #C8E15A, #8FAB32)', color: '#003D2B' }}
          >
            <Plus size={16} /> Add Transaction
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#C8E15A transparent #C8E15A #C8E15A' }} />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-16">
              <History size={40} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400">No transactions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transactions.map(tx => {
                const isCredit = tx.type === 'credit';
                return (
                  <div key={tx.id} className="flex items-center gap-4 px-4 py-4 hover:bg-slate-50 transition-colors">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCredit ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {isCredit ? <ArrowDownLeft size={15} className="text-green-600" /> : <ArrowUpRight size={15} className="text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800 truncate">{tx.description}</p>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{tx.userName} · {tx.counterparty}</p>
                    </div>
                    <div className="hidden sm:block text-xs text-slate-400 flex-shrink-0 text-right">
                      <p className="font-mono">{tx.reference}</p>
                      <p>{new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
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
                    <button
                      onClick={() => handleDelete(tx.id)}
                      disabled={deleting[tx.id]}
                      className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
