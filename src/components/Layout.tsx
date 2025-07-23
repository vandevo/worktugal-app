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
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img 
                src="/worktugal-logo-bg-light-radius-1000-1000.png" 
                alt="" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-contain"
                width="32"
                height="32"
              />
              {/* Mobile Layout: Vertical stacked */}
              <div className="xs:hidden">
                <div className="flex flex-col">
                  <span className="text-lg font-bold leading-tight">Worktugal</span>
                  <span className="inline-flex items-center bg-gradient-to-r from-blue-500/10 via-blue-400/15 to-cyan-400/10 text-blue-200 px-1.5 py-0.5 rounded-full border border-blue-400/20 shadow-sm backdrop-blur-sm text-xs font-medium tracking-wide ring-1 ring-blue-400/10 mt-0.5">
                    <span className="w-1 h-1 bg-blue-400 rounded-full mr-1 animate-pulse"></span>
                    Early Access
                  </span>
                </div>
              </div>
              
              {/* Desktop Layout: Horizontal */}
              <div className="hidden xs:flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-bold">Worktugal Pass</span>
                <span className="inline-flex items-center bg-gradient-to-r from-blue-500/10 via-blue-400/15 to-cyan-400/10 text-blue-200 px-2.5 py-1 rounded-full border border-blue-400/20 shadow-sm backdrop-blur-sm text-xs font-medium tracking-wide ring-1 ring-blue-400/10">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5 animate-pulse"></span>
                  Early Access
                </span>
              </div>
            </a>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-6">
                <a href="#directory" className="text-gray-300 hover:text-white transition-colors">
                  Browse Perks
                </a>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                  For Partners
                </a>
              </div>
              
              {user ? (
                <div className="flex items-center space-x-3 md:space-x-4">
                  <UserRoleBadge />
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium group-hover:scale-105 transition-transform">
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
                        className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg border border-gray-700 shadow-lg py-2"
                      >
                        <button
                          onClick={() => {
                            setShowProfileModal(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Edit Profile</span>
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
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
                  className="text-sm font-medium"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
      
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