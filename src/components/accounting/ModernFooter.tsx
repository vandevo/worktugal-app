import React from 'react';
import { Shield } from 'lucide-react';

export const ModernFooter: React.FC = () => {
  return (
    <footer className="bg-obsidian border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-white text-black rounded flex items-center justify-center">
              <Shield className="w-3 h-3" />
            </div>
            <span className="font-medium text-white text-sm">Worktugal</span>
          </div>
          
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
          
          <p className="text-xs text-gray-600">© 2025 Worktugal.</p>
        </div>
      </div>
    </footer>
  );
};
