import { Shield, Briefcase, User, Calculator } from 'lucide-react';

interface UserRoleBadgeProps {
  role: string;
  purchases?: Array<{ productName: string }>;
}

export function UserRoleBadge({ role, purchases = [] }: UserRoleBadgeProps) {
  const getRoleInfo = () => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          icon: Shield,
          className: 'bg-red-500/10 text-red-400 border-red-500/20 backdrop-blur-xl shadow-lg shadow-red-500/5'
        };
      case 'partner':
        return {
          label: 'Partner',
          icon: Briefcase,
          className: 'bg-orange-500/10 text-orange-400 border-orange-500/20 backdrop-blur-xl shadow-lg shadow-orange-500/5'
        };
      case 'accountant':
        return {
          label: 'Accountant',
          icon: Calculator,
          className: 'bg-blue-500/10 text-blue-400 border-blue-500/20 backdrop-blur-xl shadow-lg shadow-blue-500/5'
        };
      default:
        // Check if user has made any purchases to show active status
        const hasActivePurchases = purchases.length > 0;
        return {
          label: hasActivePurchases ? 'Active Member' : 'Member',
          icon: User,
          className: hasActivePurchases
            ? 'bg-teal-500/10 text-teal-400 border-teal-500/20 backdrop-blur-xl shadow-lg shadow-teal-500/5'
            : 'bg-slate-700/30 text-slate-300 border-slate-600/30 backdrop-blur-xl shadow-lg'
        };
    }
  };

  const { label, icon: Icon, className } = getRoleInfo();

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${className}`}>
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
  );
}