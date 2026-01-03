import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { User, LogOut } from 'lucide-react';

export function Header() {
  const { user, signOut } = useAuth();
  const { subscription } = useSubscription();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Compliance Services
            </h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              {subscription && (
                <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  Active: {subscription.plan_name}
                </span>
              )}
              <div className="flex items-center text-sm text-gray-700">
                <User className="w-4 h-4 mr-2" />
                {user.email}
              </div>
              <button
                onClick={signOut}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}