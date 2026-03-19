import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, LayoutDashboard, ClipboardCheck, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useTheme } from '../contexts/ThemeContext';
import { AuthModal } from './auth/AuthModal';
import { signOut } from '../lib/auth';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { label: 'Diagnostic', href: '/diagnostic' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'Blog', href: '/blog' },
  { label: 'Community', href: 'https://t.me/worktugal', external: true },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const { profile, getDisplayName, getInitials } = useUserProfile();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setShowUserMenu(false);
    setShowMobileMenu(false);
  }, [location.pathname]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showMobileMenu]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAFAF9] dark:bg-[#0E0E10] text-[#1A1A1A] dark:text-[#F5F5F5] transition-colors duration-200">

      {/* ── Navigation ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-[#FAFAF9]/80 dark:bg-[#0E0E10]/80 backdrop-blur-md border-b border-[#0F3D2E]/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[68px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <img
                src="/worktugal-logo-bg-light-radius-1000-1000.png"
                alt="Worktugal"
                className="w-8 h-8 object-contain rounded-lg"
                width="32"
                height="32"
              />
              <span className="text-xl font-extrabold tracking-tight text-[#0F3D2E] dark:text-[#10B981] group-hover:opacity-80 transition-opacity">
                Worktugal
              </span>
            </Link>

            {/* Center nav — desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0F3D2E] dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`text-sm font-semibold transition-colors ${
                      location.pathname.startsWith(link.href)
                        ? 'text-[#0F3D2E] dark:text-[#10B981]'
                        : 'text-slate-600 dark:text-slate-400 hover:text-[#0F3D2E] dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 md:gap-3">

              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-[#0F3D2E] dark:hover:text-white hover:bg-[#0F3D2E]/5 dark:hover:bg-white/5 transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark'
                  ? <Sun className="w-[18px] h-[18px]" />
                  : <Moon className="w-[18px] h-[18px]" />
                }
              </button>

              {user ? (
                /* Authenticated user menu */
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2.5 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0F3D2E] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {getInitials()}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-[#0F3D2E] dark:group-hover:text-white transition-colors">
                      {getDisplayName()}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#161618] rounded-2xl border border-[#E5E7EB] dark:border-[#2D2D35] shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] py-1.5 z-[60]"
                      >
                        <button
                          onClick={() => { navigate('/dashboard'); setShowUserMenu(false); }}
                          className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-[#F5F4F2] dark:hover:bg-[#1E1E22] hover:text-[#0F3D2E] dark:hover:text-white flex items-center gap-3 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                          {profile?.role === 'admin' ? 'Dashboard' : 'My Account'}
                        </button>
                        <button
                          onClick={() => { navigate('/diagnostic'); setShowUserMenu(false); }}
                          className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-[#F5F4F2] dark:hover:bg-[#1E1E22] hover:text-[#0F3D2E] dark:hover:text-white flex items-center gap-3 transition-colors"
                        >
                          <ClipboardCheck className="w-4 h-4 flex-shrink-0" />
                          Run Diagnostic
                        </button>
                        <div className="my-1.5 border-t border-[#E5E7EB] dark:border-[#2D2D35]" />
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 flex items-center gap-3 transition-colors"
                        >
                          <LogOut className="w-4 h-4 flex-shrink-0" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Unauthenticated */
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-[#0F3D2E]/5 dark:hover:bg-white/5 rounded-xl transition-all"
                  >
                    Sign in
                  </button>
                  <Link
                    to="/diagnostic"
                    className="bg-[#0F3D2E] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#1A5C44] hover:shadow-lg hover:shadow-[#0F3D2E]/20 transition-all flex items-center gap-1.5"
                  >
                    Run diagnostic
                  </Link>
                </div>
              )}

              {/* Mobile hamburger — desktop overflow only, hidden when bottom nav is present */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="hidden p-2 rounded-xl text-slate-500 hover:bg-[#0F3D2E]/5 dark:hover:bg-white/5 transition-all"
                aria-label="Toggle menu"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-[#E5E7EB] dark:border-[#2D2D35] bg-[#FAFAF9] dark:bg-[#0E0E10] overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {NAV_LINKS.map(link => (
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-[#F5F4F2] dark:hover:bg-[#1E1E22] hover:text-[#0F3D2E] dark:hover:text-white rounded-xl transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${
                        location.pathname.startsWith(link.href)
                          ? 'bg-[#0F3D2E]/5 text-[#0F3D2E] dark:text-[#10B981]'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-[#F5F4F2] dark:hover:bg-[#1E1E22]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                ))}

                {!user && (
                  <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-[#E5E7EB] dark:border-[#2D2D35]">
                    <button
                      onClick={() => { setShowAuthModal(true); setShowMobileMenu(false); }}
                      className="w-full py-3 text-sm font-bold text-slate-700 dark:text-slate-200 border border-[#E5E7EB] dark:border-[#2D2D35] rounded-xl hover:bg-[#F5F4F2] dark:hover:bg-[#1E1E22] transition-all"
                    >
                      Sign in
                    </button>
                    <Link
                      to="/diagnostic"
                      className="w-full py-3 text-sm font-bold text-white bg-[#0F3D2E] rounded-xl hover:bg-[#1A5C44] transition-all text-center"
                    >
                      Run diagnostic →
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Main content ──────────────────────────────────────────── */}
      <main className="pb-16 md:pb-0">{children}</main>

      <Footer />

      <BottomNav onAuthOpen={() => setShowAuthModal(true)} />

      {/* ── Modals ────────────────────────────────────────────────── */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </div>
  );
};
