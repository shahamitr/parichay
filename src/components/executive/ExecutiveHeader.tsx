'use client';

import { User, LogOut } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';

interface ExecutiveHeaderProps {
  name: string;
  email: string;
  onLogout: () => void;
}

export default function ExecutiveHeader({ name, email, onLogout }: ExecutiveHeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">OT</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Executive Portal</h1>
              <p className="text-xs text-gray-500">Parichay</p>
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">{name}</p>
              <p className="text-xs text-gray-500">{email}</p>
            </div>

            <div className="flex items-center space-x-2">
              <Avatar name={name} size="md" />

              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
