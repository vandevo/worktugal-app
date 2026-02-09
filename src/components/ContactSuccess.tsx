import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { CheckCircle, ExternalLink, BookOpen, Briefcase, MessageCircle } from 'lucide-react';

export function ContactSuccess() {
  const [searchParams] = useSearchParams();
  const purpose = searchParams.get('purpose') || 'other';
  const budget = searchParams.get('budget') || 'none';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getContent = () => {
    if (purpose === 'accounting') {
      return {
        title: 'Request Sent',
        icon: Briefcase,
        message:
          "Thanks for reaching out about accounting help. We'll review your request and connect you with an English-speaking Portuguese accountant within 3-5 business days.",
        footer: 'Check your email for confirmation.',
        actions: [
          {
            label: 'Learn More About Accounting Desk',
            href: '/',
            external: false,
          },
        ],
      };
    }

    if (purpose === 'partnership') {
      if (budget === '1000+' || budget === '500-999' || budget === '200-499') {
        return {
          title: 'Message Received',
          icon: CheckCircle,
          message:
            "Thanks for your partnership inquiry. We'll review within 5 business days.",
          subMessage: [
            'Our collaboration packages start at €200',
            'We work through structured agreements (no informal DMs)',
            'We prioritize partners with clear audience reach or venue access',
          ],
          footer: "You'll receive an email confirmation shortly.",
          actions: [
            {
              label: 'Browse Partner Hub',
              href: '/partners',
              external: false,
            },
          ],
        };
      } else {
        return {
          title: 'Message Received',
          icon: MessageCircle,
          message: 'Thanks for reaching out.',
          subMessage: [
            'Worktugal partnerships start at €200 to ensure quality and mutual value.',
            'If budget becomes available, we would love to reconnect.',
          ],
          footer: 'Meanwhile, explore these resources:',
          actions: [
            {
              label: 'Partner Hub (€49 for perk visibility)',
              href: '/partners',
              external: false,
            },
            {
              label: 'Free Guides',
              href: 'https://worktugal.com',
              external: true,
            },
            {
              label: 'Join Telegram Community',
              href: 'https://t.me/worktugal',
              external: true,
            },
          ],
        };
      }
    }

    if (purpose === 'info') {
      return {
        title: 'Message Sent',
        icon: BookOpen,
        message: "Thanks for contacting us. We'll reply within 5-7 business days.",
        footer: 'While you wait, check out these resources:',
        actions: [
          {
            label: 'Portugal Setup Guides',
            href: 'https://worktugal.com',
            external: true,
          },
          {
            label: 'Remote Jobs Board',
            href: 'https://jobs.worktugal.com',
            external: true,
          },
          {
            label: 'Telegram Community',
            href: 'https://t.me/worktugal',
            external: true,
          },
        ],
      };
    }

    return {
      title: 'Message Sent',
      icon: CheckCircle,
      message: "Thanks for reaching out. We'll get back to you within 5-7 business days.",
      footer: 'Check your email for confirmation.',
      actions: [],
    };
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl shadow-black/30 p-8 md:p-12 text-center"
      >
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/5 border border-emerald-500/10 rounded-full mb-8">
            <Icon className="w-10 h-10 text-emerald-500/50" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">{content.title}</h1>
          <p className="text-lg text-gray-500 font-light leading-relaxed">{content.message}</p>
        </div>

        {content.subMessage && (
          <div className="bg-blue-500/[0.02] border border-blue-500/10 rounded-2xl p-8 mb-8 text-left">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-6">Quick context</p>
            <ul className="space-y-4">
              {content.subMessage.map((item, index) => (
                <li key={index} className="text-sm text-gray-500 font-light flex items-start gap-4">
                  <span className="text-blue-500/50 mt-1 text-xs">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {content.footer && (
          <p className="text-xs text-gray-600 font-light uppercase tracking-widest mb-10">{content.footer}</p>
        )}

        {content.actions && content.actions.length > 0 && (
          <div className="space-y-4 mb-12">
            {content.actions.map((action, index) =>
              action.external ? (
                <a
                  key={index}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full h-14 bg-white text-black hover:bg-gray-200 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-xl shadow-black/20"
                >
                  {action.label}
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <Link
                  key={index}
                  to={action.href}
                  className="flex items-center justify-center gap-3 w-full h-14 bg-white text-black hover:bg-gray-200 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-xl shadow-black/20"
                >
                  {action.label}
                </Link>
              )
            )}
          </div>
        )}

        <div className="flex justify-center pt-8 border-t border-white/5">
          <Link to="/">
            <Button variant="outline" className="h-12 text-xs uppercase tracking-widest font-bold px-8">Back to Home</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
