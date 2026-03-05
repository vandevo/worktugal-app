import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Briefcase, Mail, ArrowRight, ClipboardCheck, FlaskConical } from 'lucide-react';
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
      const [appointmentsRes, applicationsRes, contactStats, allIntakesRes] = await Promise.all([
        getAllAppointments(),
        getAllApplications(),
        getContactRequestStats(),
        supabase.rpc('get_all_accounting_intakes'),
      ]);

      const scheduledCount = appointmentsRes.data?.filter(a => a.status === 'scheduled').length || 0;
      const pendingCount = applicationsRes.data?.filter(a => a.status === 'pending').length || 0;
      const taxCheckupCount = allIntakesRes.data?.filter((intake: any) => intake.source_type === 'tax_checkup').length || 0;

      setStats({
        scheduledAppointments: scheduledCount,
        pendingApplications: pendingCount,
        newContactRequests: contactStats?.new || 0,
        taxCheckupLeads: taxCheckupCount,
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
    {
      title: 'Test Hub',
      description: 'Testing and development utilities',
      icon: FlaskConical,
      path: '/admin/test-hub',
      badge: 0,
      color: 'slate',
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
    <div className="min-h-screen bg-obsidian py-24 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="font-serif text-5xl text-white mb-4 tracking-tight">Admin Dashboard</h1>
          <p className="font-light text-gray-500 text-xl leading-relaxed max-w-2xl">
            Manage platform operations and monitor activity through our sovereign control center.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminSections.map((section, index) => {
            const Icon = section.icon;

            const accentColors = {
              blue: 'text-blue-400/50',
              emerald: 'text-emerald-400/50',
              purple: 'text-purple-400/50',
              orange: 'text-orange-400/50',
              slate: 'text-slate-400/50',
            }[section.color];

            return (
              <motion.button
                key={section.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onClick={() => navigate(section.path)}
                className="group relative bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl shadow-black/30 p-8 text-left transition-all duration-300 hover:border-white/10 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className={`p-4 bg-white/5 border border-white/5 rounded-2xl transition-colors group-hover:bg-white/10`}>
                    <Icon className={`h-6 w-6 ${accentColors}`} />
                  </div>
                  {section.badge > 0 && (
                    <span className="bg-white/5 text-gray-400 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-widest border border-white/10">
                      {section.badge}
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-2xl text-white mb-3 group-hover:text-blue-400/80 transition-colors">
                  {section.title}
                </h2>
                <p className="font-light text-gray-500 text-sm leading-relaxed mb-8">
                  {section.description}
                </p>

                <div className="flex items-center text-xs uppercase tracking-[0.2em] font-bold text-gray-400 group-hover:text-white transition-all">
                  <span>Open Console</span>
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
