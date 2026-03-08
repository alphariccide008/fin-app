import {
  Mail, Phone, CreditCard, Calendar,
  Building2, Hash,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserPageLayout } from '../components/UserPageLayout';

const GREEN    = '#003D2B';
const GREEN_MID = '#005C40';
const LEMON    = '#C8E15A';
const LEMON_DK = '#8FAB32';
const LEMON_LT = '#EDF5C8';
const BORDER   = '#E2E8F0';
const MUTED    = '#64748B';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: `1px solid ${BORDER}` }}>
    <div style={{ width: 34, height: 34, borderRadius: 8, background: LEMON_LT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={14} style={{ color: LEMON_DK }} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '.4px', margin: '0 0 2px' }}>{label}</p>
      <p style={{ fontSize: 13.5, fontWeight: 600, color: '#1e293b', margin: 0, wordBreak: 'break-all' }}>{value || '—'}</p>
    </div>
  </div>
);


export default function Profile() {
  const { user } = useAuth();

  return (
    <UserPageLayout>
      <div style={{ flex: 1, background: '#F0F2F5', overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '22px 20px', width: '100%', boxSizing: 'border-box' }}>

          {/* Page header */}
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: GREEN, margin: '0 0 3px' }}>My Profile</h1>
            <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>Your personal information and uploaded identification documents.</p>
          </div>

          {/* ── Personal & Account Info ── */}
          <div className="profile-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

            {/* Personal Info */}
            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ background: `linear-gradient(135deg, ${GREEN}, ${GREEN_MID})`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${LEMON}, ${LEMON_DK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: GREEN, flexShrink: 0 }}>
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: '0 0 2px' }}>{user?.name}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: user?.status === 'active' ? 'rgba(200,225,90,.2)' : 'rgba(255,150,0,.2)', color: user?.status === 'active' ? LEMON : '#fbbf24', border: `1px solid ${user?.status === 'active' ? 'rgba(200,225,90,.35)' : 'rgba(255,150,0,.35)'}` }}>
                    {(user?.status || 'active').toUpperCase()}
                  </span>
                </div>
              </div>
              <div style={{ padding: '4px 20px 14px' }}>
                <InfoRow icon={Mail}     label="Email Address" value={user?.email} />
                <InfoRow icon={Phone}    label="Phone Number"  value={user?.phone || 'Not provided'} />
                <InfoRow icon={Calendar} label="Member Since"  value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'} />
              </div>
            </div>

            {/* Account Details */}
            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ background: `linear-gradient(135deg, ${GREEN}, ${GREEN_MID})`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(200,225,90,.2)', border: '1px solid rgba(200,225,90,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={16} style={{ color: LEMON }} />
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>Account Details</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', margin: '1px 0 0' }}>M&amp;T Bank account information</p>
                </div>
              </div>
              <div style={{ padding: '4px 20px 14px' }}>
                <InfoRow icon={CreditCard} label="Account Number" value={user?.accountNumber} />
                <InfoRow icon={Building2}  label="Account Type"   value="M&T Checking" />
                <InfoRow icon={Hash}       label="Routing Number" value="022000046" />
              </div>
            </div>

          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </UserPageLayout>
  );
}
