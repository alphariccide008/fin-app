import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, ArrowLeftRight, History, LogOut,
  Users, ShieldCheck, Menu, X, Building2, MessageSquare, UserCircle
} from 'lucide-react';
import { useState } from 'react';
import { useUnreadMessages } from '../hooks/useUnreadMessages';

const NAVY = '#003D2B';
const GOLD = '#C8E15A';

const NavItem = ({ to, icon: Icon, label, onClick, end, badge }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'text-[#003D2B] shadow-lg'
          : 'text-slate-300 hover:bg-white/10 hover:text-white'
      }`
    }
    style={({ isActive }) =>
      isActive ? { backgroundColor: GOLD, boxShadow: `0 4px 14px rgba(200,225,90,0.35)` } : {}
    }
  >
    <Icon size={18} />
    <span className="flex-1">{label}</span>
    {badge > 0 && (
      <span
        className="min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
        style={{ background: '#ef4444' }}
      >
        {badge > 99 ? '99+' : badge}
      </span>
    )}
  </NavLink>
);

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count: msgCount } = useUnreadMessages();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #C8E15A, #8FAB32)' }}
          >
            <Building2 size={18} style={{ color: NAVY }} />
          </div>
          <div>
            <h1 className="font-extrabold text-lg leading-none tracking-tight">
              <span style={{ color: '#fff' }}>M</span><span style={{ color: GOLD }}>&amp;</span><span style={{ color: '#fff' }}>T</span><span style={{ color: GOLD }}> Bank</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Secure Banking</p>
          </div>
        </div>
      </div>

      {/* User profile */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${GOLD}, #8FAB32)`, color: NAVY }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-slate-400 text-xs truncate">{user?.accountNumber}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {user?.role === 'admin' ? (
          <>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-4 mb-2">Admin</p>
            <NavItem to="/admin" end icon={ShieldCheck} label="Overview" onClick={() => setMobileOpen(false)} />
            <NavItem to="/admin/users" icon={Users} label="Users" onClick={() => setMobileOpen(false)} />
            <NavItem to="/admin/transactions" icon={History} label="Transactions" onClick={() => setMobileOpen(false)} />
            <NavItem to="/admin/messages" icon={MessageSquare} label="Messages" onClick={() => setMobileOpen(false)} badge={msgCount} />
          </>
        ) : (
          <>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-4 mb-2">Main</p>
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setMobileOpen(false)} />
            <NavItem to="/transfer" icon={ArrowLeftRight} label="Transfer" onClick={() => setMobileOpen(false)} />
            <NavItem to="/transactions" icon={History} label="History" onClick={() => setMobileOpen(false)} />
            <NavItem to="/profile" icon={UserCircle} label="My Profile" onClick={() => setMobileOpen(false)} />
            <NavItem to="/chat" icon={MessageSquare} label="Support" onClick={() => setMobileOpen(false)} badge={msgCount} />
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
        style={{ backgroundColor: NAVY }}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-72 z-40 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: NAVY }}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 h-screen fixed top-0 left-0 flex-shrink-0"
        style={{ backgroundColor: NAVY }}
      >
        <SidebarContent />
      </aside>
    </>
  );
};
