import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Briefcase, Mail, ArrowRight, ClipboardCheck } from 'lucide-react';
import { getAllAppointments } from '../../lib/appointments';
import { getAllApplications } from '../../lib/accountants';
import { getContactRequestStats } from '../../lib/contacts';
import { supabase } from '../../lib/supabase';

export const AdminOverview: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    scheduledAppointments: 0,
    pendingApplications: 0,
    newContactRequests: 0,
    taxCheckupLeads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [appointmentsRes, applicationsRes, contactStats, checkupLeadsRes] = await Promise.all([
        getAllAppointments(),
        getAllApplications(),
        getContactRequestStats(),
        supabase.from('accounting_intakes').select('id', { count: 'exact', head: true }).eq('source_type', 'tax_checkup'),
      ]);

      const scheduledCount = appointmentsRes.data?.filter(a => a.status === 'scheduled').length || 0;
      const pendingCount = applicationsRes.data?.filter(a => a.status === 'pending').length || 0;

      setStats({
        scheduledAppointments: scheduledCount,
        pendingApplications: pendingCount,
        newContactRequests: contactStats?.new || 0,
        taxCheckupLeads: checkupLeadsRes.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminSections = [
    {
      title: 'Appointments',
      description: 'Manage consultations and assign accountants',
      icon: Calendar,
      path: '/admin/appointments',
      badge: stats.scheduledAppointments,
      color: 'blue',
    },
    {
      title: 'Accountant Applications',
      description: 'Review and approve accountant applications',
      icon: Briefcase,
      path: '/admin/accountant-applications',
      badge: stats.pendingApplications,
      color: 'emerald',
    },
    {
      title: 'Contact Requests',
      description: 'Manage incoming contact requests',
      icon: Mail,
      path: '/admin/contacts',
      badge: stats.newContactRequests,
      color: 'purple',
    },
    {
      title: 'Tax Checkup Leads',
      description: 'Lead generation from compliance diagnostic tool',
      icon: ClipboardCheck,
      path: '/admin/checkup-leads',
      badge: stats.taxCheckupLeads,
      color: 'orange',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-3">Admin Dashboard</h1>
          <p className="text-xl text-slate-400">
            Manage platform operations and monitor activity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, index) => {
            const Icon = section.icon;
            const colorClasses = {
              blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-400/40',
              emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-400/40',
              purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-400/40',
              orange: 'from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-400/40',
            }[section.color];

            return (
              <motion.button
                key={section.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(section.path)}
                className={`relative bg-gradient-to-br ${colorClasses} border rounded-2xl p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-${section.color}-500/20 group`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-3 bg-gradient-to-br from-${section.color}-500 to-${section.color}-600 rounded-xl shadow-lg`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  {section.badge > 0 && (
                    <span className={`px-3 py-1 bg-${section.color}-500 text-white text-sm font-bold rounded-full`}>
                      {section.badge}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {section.title}
                </h2>
                <p className="text-slate-400 mb-6">
                  {section.description}
                </p>

                <div className="flex items-center text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Open</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
