import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Settings, LayoutDashboard, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { UserRoleBadge } from './UserRoleBadge';
import { AuthModal } from './auth/AuthModal';
import { ProfileModal } from './ProfileModal';
import { Button } from './ui/Button';
import { signOut } from '../lib/auth';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const { profile, getDisplayName, getInitials } = useUserProfile();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-300">
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 shadow-lg shadow-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-300">
              <img
                src="https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/business-logos/worktugal-logo-bg-light-radius-1000-1000.png"
                alt="Worktugal Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-lg"
                width="40"
                height="40"
              />
              <div className="flex items-center gap-3">
                <span className="text-sm sm:text-xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent whitespace-nowrap">
                  Worktugal
                </span>
                <span className="hidden sm:inline-flex items-center bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 text-xs font-semibold tracking-wide shadow-sm">
                  Early Access
                </span>
              </div>
            </a>

            {/* Navigation Links & Auth */}
            <div className="flex items-center space-x-6">
              {/* User Menu or Sign In */}
              {user ? (
                <div className="flex items-center space-x-3 md:space-x-4">
                  {profile && <UserRoleBadge role={profile.role} hasPaidReview={profile.has_paid_compliance_review} />}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-200 group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-sm font-semibold group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-200 border border-white/10">
                        {getInitials()}
                      </div>
                      <span className="hidden sm:inline text-sm font-medium">
                        {getDisplayName()}
                      </span>
                    </button>

                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 mt-3 w-52 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-700/50 shadow-2xl shadow-slate-950/50 py-2"
                      >
                        {profile?.role === 'admin' && (
                          <button
                            onClick={() => {
                              navigate('/dashboard');
                              setShowUserMenu(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors duration-200 flex items-center space-x-3 text-sm font-medium"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Dashboard</span>
                          </button>
                        )}
                        {profile?.has_paid_compliance_review && (
                          <button
                            onClick={() => {
                              navigate('/compliance-review');
                              setShowUserMenu(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors duration-200 flex items-center space-x-3 text-sm font-medium"
                          >
                            <ClipboardCheck className="h-4 w-4" />
                            <span>My Compliance Review</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setShowProfileModal(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors duration-200 flex items-center space-x-3 text-sm font-medium"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Edit Profile</span>
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-2.5 text-left text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors duration-200 flex items-center space-x-3 text-sm font-medium"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="text-sm font-semibold rounded-xl px-6 py-2 border-slate-700 hover:border-slate-600 hover:bg-slate-800/50"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="text-slate-300">{children}</main>
      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
};
