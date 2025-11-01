import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Briefcase, Mail } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AdminNavigationProps {
  pendingCounts?: {
    appointments?: number;
    applications?: number;
    contacts?: number;
  };
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({ pendingCounts = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: '/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      path: '/admin/appointments',
      label: 'Appointments',
      icon: Calendar,
      badge: pendingCounts.appointments,
    },
    {
      path: '/admin/accountant-applications',
      label: 'Applications',
      icon: Briefcase,
      badge: pendingCounts.applications,
    },
    {
      path: '/admin/contacts',
      label: 'Contact Requests',
      icon: Mail,
      badge: pendingCounts.contacts,
    },
  ];

  return (
    <nav className="sticky top-16 md:top-20 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 overflow-x-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer',
                  isActive
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
