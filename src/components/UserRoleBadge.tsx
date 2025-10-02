import React from 'react';
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
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'partner':
        return {
          label: 'Partner',
          icon: Briefcase,
          className: 'bg-orange-100 text-orange-800 border-orange-200'
        };
      case 'accountant':
        return {
          label: 'Accountant',
          icon: Calculator,
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      default:
        // Check if user has made any purchases to show active status
        const hasActivePurchases = purchases.length > 0;
        return {
          label: hasActivePurchases ? 'Active Member' : 'Member',
          icon: User,
          className: hasActivePurchases 
            ? 'bg-teal-100 text-teal-800 border-teal-200'
            : 'bg-slate-100 text-slate-800 border-slate-200'
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