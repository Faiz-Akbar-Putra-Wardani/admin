"use client";
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import AuthGuard from '../../components/AuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex">
          {/* Sidebar */}
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <Header
              setSidebarOpen={setSidebarOpen}
            />

            {/* Content */}
            <main className="flex-1">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

