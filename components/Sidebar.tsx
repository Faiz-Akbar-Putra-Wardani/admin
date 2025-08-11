"use client";
import React from 'react';
import { Users, Code, Briefcase, Building, X, Menu, Home, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/admin',
      active: pathname === '/admin'
    },
     {
      title: 'About Us',
      icon: FileText,
      href: '/admin/about',
      active: pathname.startsWith('/admin/about')
    },
    {
      title: 'Business Line',
      icon: FileText,
      href: '/admin/business-line',
      active: pathname.startsWith('/admin/business-line')
    },
    {
      title: 'Career',
      icon: Building,
      href: '/admin/career',
      active: pathname === '/admin/career' || pathname.startsWith('/admin/career/')
    },
    {
      title: 'Career Opportunities',
      icon: FileText,
      href: '/admin/career-opportunities',
      active: pathname === '/admin/career-opportunities' || pathname.startsWith('/admin/career-opportunities/')
    },
    {
      title: 'Clients',
      icon: FileText,
      href: '/admin/client',
      active: pathname.startsWith('/admin/client')
    },
    {
      title: 'Microdata Options',
      icon: FileText,
      href: '/admin/microdata-options',
      active: pathname.startsWith('/admin/microdata-options')
    },
    {
      title: 'position',
      icon: FileText,
      href: '/admin/position',
      active: pathname.startsWith('/admin/position')
    },
    {
      title: 'process',
      icon: FileText,
      href: '/admin/process',
      active: pathname.startsWith('/admin/process')
    },

    {
      title: 'Team',
      icon: Users,
      href: '/admin/team',
      active: pathname.startsWith('/admin/team')
    },
    {
      title: 'Technology',
      icon: Code,
      href: '/admin/technology',
      active: pathname.startsWith('/admin/technology')
    },
    {
      title: 'Service',
      icon: Briefcase,
      href: '/admin/service',
      active: pathname.startsWith('/admin/service')
    },
    {
      title: 'Service Landing Page',
      icon: Briefcase,
      href: '/admin/service-landingpage',
      active: pathname.startsWith('/admin/service-landingpage')
    },
    
    

  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">Dashboard Microdata</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    item.active
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}

