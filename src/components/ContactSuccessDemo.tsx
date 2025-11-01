import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { Copy, CheckCircle, Briefcase, Users, BookOpen, MessageCircle, Building } from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  description: string;
  purpose: string;
  budget?: string;
  icon: typeof Briefcase;
  color: string;
}

const scenarios: Scenario[] = [
  {
    id: 'accounting',
    title: 'Accounting & Tax Help',
    description: 'User requests English-speaking accountant in Portugal',
    purpose: 'accounting',
    icon: Briefcase,
    color: 'blue',
  },
  {
    id: 'partnership-high',
    title: 'Partnership - High Budget',
    description: 'Partner inquiry with €1000+ budget',
    purpose: 'partnership',
    budget: '1000+',
    icon: Users,
    color: 'green',
  },
  {
    id: 'partnership-medium',
    title: 'Partnership - Medium Budget',
    description: 'Partner inquiry with €500-€999 budget',
    purpose: 'partnership',
    budget: '500-999',
    icon: Users,
    color: 'green',
  },
  {
    id: 'partnership-starter',
    title: 'Partnership - Starter Budget',
    description: 'Partner inquiry with €200-€499 budget',
    purpose: 'partnership',
    budget: '200-499',
    icon: Users,
    color: 'green',
  },
  {
    id: 'partnership-no-budget',
    title: 'Partnership - No Budget',
    description: 'Partner inquiry with no budget or exploring',
    purpose: 'partnership',
    budget: 'not_yet',
    icon: Users,
    color: 'yellow',
  },
  {
    id: 'info',
    title: 'Portugal Setup Questions',
    description: 'General visa, NIF, housing, legal questions',
    purpose: 'info',
    icon: BookOpen,
    color: 'purple',
  },
  {
    id: 'other',
    title: 'General Inquiry',
    description: 'Other questions or feedback',
    purpose: 'other',
    icon: MessageCircle,
    color: 'gray',
  },
];

export function ContactSuccessDemo() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getSuccessUrl = (scenario: Scenario) => {
    const params = new URLSearchParams();
    params.set('purpose', scenario.purpose);
    if (scenario.budget) {
      params.set('budget', scenario.budget);
    } else {
      params.set('budget', 'none');
    }
    return `/contact/success?${params.toString()}`;
  };

  const copyUrl = (scenario: Scenario) => {
    const fullUrl = `${window.location.origin}${getSuccessUrl(scenario)}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(scenario.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      green: 'bg-green-500/10 border-green-500/30 text-green-400',
      yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
      purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      gray: 'bg-gray-500/10 border-gray-500/30 text-gray-400',
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8 text-center">
          <p className="text-yellow-300 font-semibold">
            DEMO MODE - Preview all contact success page variations
          </p>
          <p className="text-yellow-400/80 text-sm mt-1">
            No forms to fill, no database records created
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-3">
              Contact Success Page Preview
            </h1>
            <p className="text-lg text-gray-400 mb-2">
              Quick access to all success page variations for testing and refinement
            </p>
            <p className="text-sm text-gray-500">
              Bookmark this page for easy access during development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 }}
                  className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] shadow-xl shadow-black/20 p-6 hover:border-white/[0.15] transition-all duration-200"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`p-2.5 rounded-lg ${getColorClasses(scenario.color)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {scenario.title}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {scenario.description}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-800/40 rounded-lg p-3 mb-4 border border-white/[0.05]">
                    <p className="text-xs text-gray-500 mb-1">Query Parameters:</p>
                    <code className="text-xs text-gray-300 break-all">
                      purpose={scenario.purpose}
                      {scenario.budget && `, budget=${scenario.budget}`}
                    </code>
                  </div>

                  <div className="space-y-2">
                    <Link
                      to={getSuccessUrl(scenario)}
                      className="block w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-center text-sm"
                    >
                      View Success Page
                    </Link>
                    <button
                      onClick={() => copyUrl(scenario)}
                      className="w-full px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 rounded-lg transition-colors duration-200 font-medium text-sm flex items-center justify-center gap-2 border border-white/[0.08]"
                    >
                      {copiedId === scenario.id ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy URL
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] shadow-xl shadow-black/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Special Case: Job Inquiry
            </h2>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <Building className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-gray-300 mb-3">
                  When users select "Looking for a Job" in the contact form, they are
                  automatically redirected to the jobs board at{' '}
                  <a
                    href="https://jobs.worktugal.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    jobs.worktugal.com
                  </a>
                </p>
                <p className="text-sm text-gray-400">
                  This happens immediately after selecting the purpose, before reaching
                  the form details. No success page is shown for job inquiries.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Reference: Query Parameters
            </h3>
            <div className="space-y-3 text-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 mb-2">
                    <span className="font-mono text-blue-400">purpose</span> values:
                  </p>
                  <ul className="space-y-1 text-gray-300 ml-4">
                    <li>• accounting</li>
                    <li>• partnership</li>
                    <li>• info</li>
                    <li>• other</li>
                  </ul>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">
                    <span className="font-mono text-blue-400">budget</span> values:
                  </p>
                  <ul className="space-y-1 text-gray-300 ml-4">
                    <li>• 200-499</li>
                    <li>• 500-999</li>
                    <li>• 1000+</li>
                    <li>• not_yet</li>
                    <li>• none</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link to="/contact">
              <Button variant="outline" className="w-full sm:w-auto">
                Go to Contact Form
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
