import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, AlertTriangle, BookOpen, Settings } from 'lucide-react';

const NAV = [
  { to: '/',        icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/subs',    icon: List,            label: 'My Subs'   },
  { to: '/waste',   icon: AlertTriangle,   label: 'Waste'     },
  { to: '/guides',  icon: BookOpen,        label: 'Guides'    },
  { to: '/settings',icon: Settings,        label: 'Settings'  },
];

const BottomNav = () => (
  <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 z-40"
    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
    <div className="flex items-center justify-around h-16">
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors ${isActive ? 'text-brand-900' : 'text-gray-400'}`}>
          {({ isActive }) => (
            <>
              <span className={`p-1 rounded-xl ${isActive ? 'bg-brand-50' : ''}`}>
                <Icon size={21} strokeWidth={isActive ? 2.5 : 1.8} />
              </span>
              <span className={`text-[10px] font-medium ${isActive ? 'text-brand-900' : 'text-gray-400'}`}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default BottomNav;
