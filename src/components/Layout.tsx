import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { UserRoleBadge } from './UserRoleBadge';
import { AuthModal } from './auth/AuthModal';
import { ProfileModal } from './ProfileModal';
import { Button } from './ui/Button';
import { useState } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { signOut } from '../lib/auth';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const { getDisplayName, getInitials } = useUserProfile();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-400">
      <nav className="sticky top-0 z-50 bg-gray-900/30 backdrop-blur-2xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img 
                src="/worktugal-logo-bg-light-radius-1000-1000.png" 
                alt="" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-contain shadow-lg"
                width="32"
                height="32"
              />
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-bold hidden xs:inline">Worktugal Pass</span>
                <span className="text-lg sm:text-xl font-bold xs:hidden">Worktugal</span>
                <span className="hidden xs:inline-flex items-center bg-white/[0.04] backdrop-blur-xl text-blue-200 px-3 py-1.5 rounded-full border border-blue-400/20 shadow-lg text-xs font-medium tracking-wide">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5 animate-pulse"></span>
                  Early Access
                </span>
              </div>
            </a>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-6">
                <a href="#directory" className="text-gray-400 hover:text-white transition-all duration-300 font-medium">
                  Browse Perks
                </a>
                <a href="#pricing" className="text-gray-400 hover:text-white transition-all duration-300 font-medium">
                  For Partners
                </a>
              </div>
              
              {user ? (
                <div className="flex items-center space-x-3 md:space-x-4">
                  <UserRoleBadge />
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300 group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-sm font-medium group-hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/25 border border-white/[0.08]">
                        {getInitials()}
                      </div>
                      <span className="hidden sm:inline text-sm">
                        {getDisplayName()}
                      </span>
                    </button>
                    
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 mt-2 w-48 bg-white/[0.03] backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-2xl py-2"
                      >
                        <button
                          onClick={() => {
                            setShowProfileModal(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-3 text-left text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all duration-300 flex items-center space-x-2 rounded-xl mx-1"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Edit Profile</span>
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-3 text-left text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all duration-300 flex items-center space-x-2 rounded-xl mx-1"
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
                  className="text-sm font-medium rounded-2xl px-6"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="text-gray-400">{children}</main>
      
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-400">
      <nav className="sticky top-0 z-50 bg-gray-900/30 backdrop-blur-2xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img 
                src="/worktugal-logo-bg-light-radius-1000-1000.png" 
                alt="" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-contain shadow-lg"
                width="32"
                height="32"
              />
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-bold hidden xs:inline">Worktugal Pass</span>
                <span className="text-lg sm:text-xl font-bold xs:hidden">Worktugal</span>
                <span className="hidden xs:inline-flex items-center bg-white/[0.04] backdrop-blur-xl text-blue-200 px-3 py-1.5 rounded-full border border-blue-400/20 shadow-lg text-xs font-medium tracking-wide">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5 animate-pulse"></span>
                  Early Access
                </span>
              </div>
            </a>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-6">
                <a href="#directory" className="text-gray-400 hover:text-white transition-all duration-300 font-medium">
                  Browse Perks
                </a>
                <a href="#pricing" className="text-gray-400 hover:text-white transition-all duration-300 font-medium">
                  For Partners
                </a>
              </div>
              
              {user ? (
                <div className="flex items-center space-x-3 md:space-x-4">
                  <UserRoleBadge />
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300 group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-sm font-medium group-hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/25 border border-white/[0.08]">
                        {getInitials()}
                      </div>
                      <span className="hidden sm:inline text-sm">
                        {getDisplayName()}
                      </span>
                    </button>
                    
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 mt-2 w-48 bg-white/[0.03] backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-2xl py-2"
                      >
                        <button
                          onClick={() => {
                            setShowProfileModal(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-3 text-left text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all duration-300 flex items-center space-x-2 rounded-xl mx-1"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Edit Profile</span>
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-3 text-left text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all duration-300 flex items-center space-x-2 rounded-xl mx-1"
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
                  className="text-sm font-medium rounded-2xl px-6"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="text-gray-400">{children}</main>
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
  )
};