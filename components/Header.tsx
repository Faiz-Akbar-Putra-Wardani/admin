"use client";
import React from 'react';
import { Menu, LogOut, User } from 'lucide-react';
// Update the import path if your api file is located elsewhere, for example:
import api from '../lib/api'; // adjust the path as needed
import { useRouter } from 'next/navigation';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const router = useRouter();

 const handleLogout = async () => {
  try {
     await api.post('/logout');
    // Clear token from localStorage
    localStorage.removeItem('authToken');
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
    // Even if logout fails on server, clear local token
    localStorage.removeItem('authToken');
    router.push('/login');
  }
};

  return (
    <header className="bg-gray-800 border-b border-gray-700 h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-gray-300">
            <User size={20} />
            <span className="text-sm font-medium">Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}


