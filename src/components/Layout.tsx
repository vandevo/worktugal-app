import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-obsidian text-slate-300 selection:bg-blue-500/30">
      <nav className="sticky top-0 z-50 bg-obsidian/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 group">
              <img
                src="https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/business-logos/worktugal-logo-bg-light-radius-1000-1000.png"
                alt="Worktugal Logo"
                className="w-9 h-9 object-contain grayscale brightness-125 group-hover:grayscale-0 transition-all duration-500"
                width="36"
                height="36"
              />
              <div className="flex items-center gap-3">
                <span className="text-xl font-medium tracking-tight text-white">
                  Worktugal
                </span>
                <Link 
                  to="/changelog"
                  className="hidden sm:inline-flex items-center bg-white/5 text-gray-400 px-3 py-1 rounded-full border border-white/10 text-[10px] font-medium tracking-widest uppercase hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  Readyfile v1.2
                </Link>
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
                      className="flex items-center space-x-3 text-slate-400 hover:text-white transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white text-xs font-medium group-hover:bg-white/10 transition-all duration-200 border border-white/10">
                        {getInitials()}
                      </div>
                      <span className="hidden sm:inline text-sm font-light">
                        {getDisplayName()}
                      </span>
                    </button>

                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 mt-3 w-48 bg-[#121212] backdrop-blur-xl rounded-xl border border-white/5 shadow-2xl py-2 z-[60]"
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
                            <span>My Review</span>
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
                  className="text-xs font-medium uppercase tracking-widest rounded-lg px-6 py-2 border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-400 hover:text-white transition-all duration-300"
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
