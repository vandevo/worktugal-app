import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, LayoutDashboard, ClipboardCheck, Menu, X, Briefcase, Sun, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useSubscription } from '../hooks/useSubscription';
import { useTheme } from '../contexts/ThemeContext';
import { AuthModal } from './auth/AuthModal';
import { signOut } from '../lib/auth';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { label: 'Jobs', href: '/jobs' },
  { label: 'Diagnostic', href: '/diagnostic' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'Blog', href: 'https://blog.worktugal.com', external: true },
  { label: 'Community', href: 'https://t.me/worktugal', external: true },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const { profile, getDisplayName, getInitials } = useUserProfile();
  const { subscription } = useSubscription();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check if user was trying to post a job before OAuth redirect
  useEffect(() => {
    const pending = sessionStorage.getItem('pendingPostJob');
    if (pending && user) {
      sessionStorage.removeItem('pendingPostJob');
      navigate('/jobs/post');
    }
  }, [user, navigate]);

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

              {/* Theme toggle */}
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

              {/* Membership badge */}
              {subscription ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#10B981]/10 text-[#10B981] text-[10px] font-black uppercase tracking-wider">
                  Pro
                </span>
              ) : user ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-200 dark:bg-white/[0.05] text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider">
                  Free
                </span>
              ) : null}

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
                    onClick={() => { navigate('/jobs/post'); setShowUserMenu(false); }}
                          className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-[#F5F4F2] dark:hover:bg-[#1E1E22] hover:text-[#0F3D2E] dark:hover:text-white flex items-center gap-3 transition-colors"
                        >
                          <Briefcase className="w-4 h-4 flex-shrink-0" />
                          Post a job
                        </button>
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
                    onClick={() => { sessionStorage.setItem('pendingPostJob', 'true'); setShowAuthModal(true); }}
                    className="px-4 py-2 text-sm font-bold text-white bg-[#0F3D2E] hover:bg-[#1A5C44] rounded-xl transition-all"
                  >
                    Post a job
                  </button>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all"
                  >
                    Sign in
                  </button>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-[#0F3D2E]/5 dark:hover:bg-white/5 transition-all"
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
                      onClick={() => { sessionStorage.setItem('pendingPostJob', 'true'); setShowAuthModal(true); setShowMobileMenu(false); }}
                      className="w-full py-3 text-sm font-bold text-white bg-[#0F3D2E] rounded-xl hover:bg-[#1A5C44] transition-all text-center"
                    >
                      Post a job for €49
                    </button>
                    <button
                      onClick={() => { setShowAuthModal(true); setShowMobileMenu(false); }}
                      className="w-full py-3 text-sm font-bold text-slate-700 dark:text-slate-200 border border-[#E5E7EB] dark:border-[#2D2D35] rounded-xl hover:bg-[#F5F4F2] dark:hover:bg-[#1E1E22] transition-all"
                    >
                      Sign in
                    </button>
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
