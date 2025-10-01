import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Button } from './ui/Button';
import { AuthModal } from './auth/AuthModal';
import { ProfileModal } from './ProfileModal';
import { useAuth } from '../hooks/useAuth';
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

  const handleServicesClick = () => {
    navigate('/services');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={handleLogoClick}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <img
                  src="/worktugal-logo-bg-light-radius-1000-1000.png"
                  alt="Worktugal"
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold text-gray-900">
                  Worktugal
                </span>
              </button>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={handleServicesClick}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Services
              </button>
              
              {user ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleDashboardClick}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Dashboard
                  </button>
                  <Button
                    onClick={() => setIsProfileModalOpen(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    {user.email?.split('@')[0]}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  size="sm"
                >
                  Sign In
                </Button>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    handleServicesClick();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Services
                </button>
                
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        handleDashboardClick();
                        setIsMenuOpen(false);
                      }}
                      className="text-left text-gray-600 hover:text-gray-900 transition-colors"
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
                      className="justify-start"
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
                    className="justify-start"
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