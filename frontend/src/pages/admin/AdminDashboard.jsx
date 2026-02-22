import { useState, useEffect } from 'react';
import { Users, ArrowLeftRight, TrendingUp, Clock } from 'lucide-react';
import { getAdminStats } from '../../api/admin';
import { Layout } from '../../components/Layout';
import { Topbar } from '../../components/Topbar';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 card-hover">
    <div className="flex items-center justify-between mb-4">
      <span className="text-slate-500 text-sm font-medium">{label}</span>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="text-3xl font-bold text-slate-800">{value}</p>
    {sub && <p className="text-slate-400 text-sm mt-1">{sub}</p>}
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <Topbar title="Admin Overview" subtitle="Platform statistics" />
      <div className="flex-1 p-6 animate-fade-in">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#C8E15A transparent #C8E15A #C8E15A' }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats?.totalUsers || 0}
              sub="Registered accounts"
              color="bg-amber-50 text-amber-700"
            />
            <StatCard
              icon={Clock}
              label="Pending Approval"
              value={stats?.pendingUsers || 0}
              sub="Awaiting activation"
              color="bg-amber-50 text-amber-600"
            />
            <StatCard
              icon={ArrowLeftRight}
              label="Total Transactions"
              value={stats?.totalTransactions || 0}
              sub="All platform activity"
              color="bg-green-50 text-green-600"
            />
            <StatCard
              icon={TrendingUp}
              label="Total Volume"
              value={fmt(stats?.totalVolume)}
              sub="Credits processed"
              color="bg-purple-50 text-purple-600"
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
