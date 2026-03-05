import { useState } from 'react';
import {
  Mail, Phone, CreditCard, Calendar,
  Building2, Shield, Hash, ZoomIn, X, CheckCircle2,
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

const IdImageCard = ({ label, src }) => {
  const [zoomed, setZoomed] = useState(false);

  if (!src) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.5px', margin: '0 0 10px' }}>{label}</p>
        <div style={{ background: '#f8fafc', border: `2px dashed ${BORDER}`, borderRadius: 10, flex: 1, minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
          <CreditCard size={28} style={{ color: '#cbd5e1' }} />
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Not uploaded</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.5px', margin: '0 0 10px' }}>{label}</p>
      <div
        style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: `2px solid ${LEMON}`, cursor: 'zoom-in', flex: 1 }}
        onClick={() => setZoomed(true)}
      >
        <img src={src} alt={label} style={{ width: '100%', height: 190, objectFit: 'cover', display: 'block' }} />
        <div
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,61,43,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity .2s', flexDirection: 'column', gap: 6 }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0}
        >
          <ZoomIn size={28} style={{ color: '#fff' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>Click to enlarge</span>
        </div>
      </div>

      {zoomed && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setZoomed(false)}
        >
          <button
            style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,.15)', border: 'none', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
            onClick={() => setZoomed(false)}
          >
            <X size={18} />
          </button>
          <img
            src={src} alt={label}
            style={{ maxWidth: '92vw', maxHeight: '88vh', borderRadius: 10, objectFit: 'contain', boxShadow: '0 30px 80px rgba(0,0,0,.6)' }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

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

          {/* ── ID Card — MAIN SECTION ── */}
          <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, marginBottom: 18, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ background: `linear-gradient(135deg, ${GREEN}, ${GREEN_MID})`, padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(200,225,90,.2)', border: '1px solid rgba(200,225,90,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={17} style={{ color: LEMON }} />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>Government-Issued ID Card</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', margin: '1px 0 0' }}>Your uploaded identification documents</p>
              </div>
              {(user?.idFront && user?.idBack) && (
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: LEMON, background: 'rgba(200,225,90,.15)', border: '1px solid rgba(200,225,90,.3)', padding: '3px 10px', borderRadius: 20 }}>
                  <CheckCircle2 size={12} /> Verified
                </span>
              )}
            </div>

            {/* ID images */}
            <div style={{ padding: '20px 22px' }}>
              <div className="id-card-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <IdImageCard label="Front of ID" src={user?.idFront} />
                <IdImageCard label="Back of ID"  src={user?.idBack} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, padding: '10px 14px', background: LEMON_LT, borderRadius: 8, border: `1px solid rgba(200,225,90,.3)` }}>
                <Shield size={13} style={{ color: LEMON_DK, flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>
                  Your ID documents are encrypted and stored securely. Only you and authorized bank staff can view them.
                </p>
              </div>
            </div>
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
          .id-card-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </UserPageLayout>
  );
}
