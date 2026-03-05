import { useState } from 'react';
import {
  User, Mail, Phone, CreditCard, Hash, Calendar,
  Building2, Shield, Eye, EyeOff, ZoomIn, X,
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

const InfoRow = ({ icon: Icon, label, value, masked, secret }) => {
  const [show, setShow] = useState(false);
  const displayed = masked && !show ? (secret || '•••••••••••') : (value || '—');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: LEMON_LT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={15} style={{ color: LEMON_DK }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '.4px', margin: '0 0 2px' }}>{label}</p>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', margin: 0, wordBreak: 'break-all' }}>{displayed}</p>
      </div>
      {masked && (
        <button onClick={() => setShow(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4, flexShrink: 0 }}>
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      )}
    </div>
  );
};

const IdImageCard = ({ label, src }) => {
  const [zoomed, setZoomed] = useState(false);
  if (!src) {
    return (
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '.4px', margin: '0 0 8px' }}>{label}</p>
        <div style={{ background: '#f8fafc', border: `2px dashed ${BORDER}`, borderRadius: 8, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
          <CreditCard size={24} style={{ color: '#cbd5e1' }} />
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Not uploaded</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <p style={{ fontSize: 12, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '.4px', margin: '0 0 8px' }}>{label}</p>
      <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: `2px solid ${LEMON}`, cursor: 'pointer' }} onClick={() => setZoomed(true)}>
        <img src={src} alt={label} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity .2s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0}
        >
          <ZoomIn size={24} style={{ color: '#fff' }} />
        </div>
      </div>
      {zoomed && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setZoomed(false)}
        >
          <button style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,.15)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <X size={18} />
          </button>
          <img src={src} alt={label} style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 8, objectFit: 'contain' }} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default function Profile() {
  const { user } = useAuth();

  const maskedSSN = user?.ssn
    ? `XXX-XX-${user.ssn.replace(/\D/g, '').slice(-4)}`
    : null;

  return (
    <UserPageLayout>
      <div style={{ flex: 1, background: '#F0F2F5', overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '22px 20px', width: '100%', boxSizing: 'border-box' }}>

          {/* Page header */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: GREEN, margin: '0 0 4px' }}>My Profile</h1>
            <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>View your personal information and account details.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}
            className="profile-grid"
          >

            {/* ── Left: Personal Info ── */}
            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ background: `linear-gradient(135deg, ${GREEN}, ${GREEN_MID})`, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${LEMON}, ${LEMON_DK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: GREEN, flexShrink: 0 }}>
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                </div>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 2px' }}>{user?.name}</p>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20, background: user?.status === 'active' ? 'rgba(200,225,90,.2)' : 'rgba(255,150,0,.2)', color: user?.status === 'active' ? LEMON : '#fbbf24', border: `1px solid ${user?.status === 'active' ? 'rgba(200,225,90,.4)' : 'rgba(255,150,0,.4)'}` }}>
                    {(user?.status || 'active').toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={{ padding: '4px 22px 16px' }}>
                <InfoRow icon={Mail}     label="Email Address"  value={user?.email} />
                <InfoRow icon={Phone}    label="Phone Number"   value={user?.phone || 'Not provided'} />
                <InfoRow icon={Hash}     label="SSN"            value={user?.ssn} masked secret={maskedSSN} />
                <InfoRow icon={Calendar} label="Member Since"   value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'} />
              </div>
            </div>

            {/* ── Right: Account Info + ID ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Account details */}
              <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '16px 22px' }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: GREEN, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Building2 size={15} style={{ color: LEMON_DK }} /> Account Details
                </p>
                <p style={{ fontSize: 12, color: MUTED, margin: '0 0 8px' }}>Your M&amp;T Bank account information.</p>
                <InfoRow icon={CreditCard} label="Account Number" value={user?.accountNumber} />
                <InfoRow icon={Building2}  label="Account Type"   value="M&T Checking" />
                <InfoRow icon={Hash}       label="Routing Number" value="022000046" />
              </div>

              {/* Security */}
              <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '16px 22px' }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: GREEN, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Shield size={15} style={{ color: LEMON_DK }} /> Security
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: LEMON_LT, borderRadius: 6, border: `1px solid rgba(200,225,90,.3)` }}>
                  <Shield size={14} style={{ color: LEMON_DK, flexShrink: 0 }} />
                  <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5 }}>
                    Your account is protected with 256-bit encryption and bank-grade security. Your SSN and ID documents are stored securely.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ── ID Card Section ── */}
          <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 8, marginTop: 20, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <CreditCard size={16} style={{ color: LEMON_DK }} />
              <p style={{ fontSize: 13.5, fontWeight: 700, color: GREEN, margin: 0 }}>Government-Issued ID Card</p>
            </div>
            <p style={{ fontSize: 12, color: MUTED, margin: '0 0 16px' }}>
              Your uploaded identification documents. Click on an image to view full size.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="id-card-grid">
              <IdImageCard label="Front of ID" src={user?.idFront} />
              <IdImageCard label="Back of ID"  src={user?.idBack} />
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr !important; }
          .id-card-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </UserPageLayout>
  );
}
