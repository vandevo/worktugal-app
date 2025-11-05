import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Button } from './ui/Button';
import { AuthModal } from './auth/AuthModal';
import { ProfileModal } from './ProfileModal';
import { useAuth } from '../hooks/useAuth';
import { UserSubscriptionStatus } from './UserSubscriptionStatus';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-slate-950/50 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-3 hover:opacity-90 transition-all duration-300"
            >
              <img
                src="https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/business-logos/worktugal-logo-bg-light-radius-1000-1000.png"
                alt="Worktugal Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-lg"
                width="40"
                height="40"
              />
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm sm:text-xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent whitespace-nowrap">
                  Worktugal
                </span>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-4">
                  {user && <UserSubscriptionStatus />}
                  <button
                    onClick={handleDashboardClick}
                    className="text-slate-400 hover:text-white transition-colors duration-200 font-medium text-sm"
                  >
                    Dashboard
                  </button>
                  <Button
                    onClick={() => setIsProfileModalOpen(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 rounded-xl"
                  >
                    <User className="w-4 h-4" />
                    {user.email?.split('@')[0]}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 rounded-xl font-semibold shadow-lg shadow-blue-600/20"
                >
                  Sign In
                </Button>
              )}
            </nav>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-800/50">
              <div className="flex flex-col gap-3">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        handleDashboardClick();
                        setIsMenuOpen(false);
                      }}
                      className="text-left text-slate-300 hover:text-white transition-colors duration-200 font-medium py-2"
                    >
                      Dashboard
                    </button>
                    <Button
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      size="sm"
                      className="justify-start border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 rounded-xl"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    size="sm"
                    className="justify-start bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 rounded-xl font-semibold"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {user && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </>
  );
}