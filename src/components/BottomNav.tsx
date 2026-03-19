import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BarChart2, Users, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface BottomNavProps {
  onAuthOpen?: () => void;
}

const NAV_ITEMS = [
  { label: 'HOME', href: '/', icon: Home, exact: true },
  { label: 'RESULTS', href: '/diagnostic', icon: BarChart2, exact: false },
  { label: 'COMMUNITY', href: 'https://t.me/worktugal', icon: Users, external: true },
  { label: 'PROFILE', href: '/dashboard', icon: User, exact: false, authRequired: true },
];

export const BottomNav: React.FC<BottomNavProps> = ({ onAuthOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isActive = (item: typeof NAV_ITEMS[number]) => {
    if (item.external) return false;
    if (item.exact) return location.pathname === item.href;
    return location.pathname.startsWith(item.href!);
  };

  const handleProfileTab = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      onAuthOpen?.();
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#161618] border-t border-[#E5E7EB] dark:border-[#2D2D35]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
              >
                <Icon
                  className={`w-5 h-5 ${active ? 'text-[#10B981]' : 'text-slate-400 dark:text-slate-500'}`}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span className={`text-[10px] font-bold tracking-wide ${active ? 'text-[#10B981]' : 'text-slate-400 dark:text-slate-500'}`}>
                  {item.label}
                </span>
              </a>
            );
          }

          if (item.authRequired) {
            return (
              <button
                key={item.label}
                onClick={handleProfileTab}
                className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
              >
                <Icon
                  className={`w-5 h-5 ${active ? 'text-[#10B981]' : 'text-slate-400 dark:text-slate-500'}`}
                  strokeWidth={active ? 2.5 : 1.8}
                  fill={active ? 'currentColor' : 'none'}
                />
                <span className={`text-[10px] font-bold tracking-wide ${active ? 'text-[#10B981]' : 'text-slate-400 dark:text-slate-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.href!}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
            >
              <Icon
                className={`w-5 h-5 ${active ? 'text-[#10B981]' : 'text-slate-400 dark:text-slate-500'}`}
                strokeWidth={active ? 2.5 : 1.8}
                fill={active ? 'currentColor' : 'none'}
              />
              <span className={`text-[10px] font-bold tracking-wide ${active ? 'text-[#10B981]' : 'text-slate-400 dark:text-slate-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
