import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserSubscription } from '../hooks/useUserSubscription';
import { LogOut, Shield, Crown } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { activePlan, loading } = useUserSubscription();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-xl font-semibold text-gray-900">
              Compliance Review
            </h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              {!loading && activePlan && (
                <div className="flex items-center bg-indigo-50 px-3 py-1 rounded-full">
                  <Crown className="w-4 h-4 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium text-indigo-700">
                    {activePlan}
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};