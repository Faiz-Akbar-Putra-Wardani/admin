"use client";
import React from 'react';
import { Users, Code, Briefcase, Building } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const features = [
    {
      title: 'Team Management',
      description: 'Manage team members, their roles and information',
      icon: Users,
      href: '/admin/team',
      color: 'bg-blue-600 hover:bg-blue-700',
      count: 'Manage team members'
    },
    {
      title: 'Technology Management',
      description: 'Manage technologies and tools used in projects',
      icon: Code,
      href: '/admin/technology',
      color: 'bg-green-600 hover:bg-green-700',
      count: 'Manage technologies'
    },
    {
      title: 'Service Management',
      description: 'Manage services offered by the company',
      icon: Briefcase,
      href: '/admin/service',
      color: 'bg-purple-600 hover:bg-purple-700',
      count: 'Manage services'
    },
    {
      title: 'Career Management',
      description: 'Manage job openings and career opportunities',
      icon: Building,
      href: '/admin/career',
      color: 'bg-orange-600 hover:bg-orange-700',
      count: 'Manage careers'
    }
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Manage your website content and data
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="block"
              >
                <div className={`${feature.color} rounded-xl p-6 transition-all duration-200 transform hover:scale-105 shadow-lg`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon size={32} className="text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-100 text-sm mb-4">
                    {feature.description}
                  </p>
                  
                  <div className="text-xs text-gray-200 font-medium">
                    {feature.count}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">-</div>
              <div className="text-sm text-gray-400">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">-</div>
              <div className="text-sm text-gray-400">Technologies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">-</div>
              <div className="text-sm text-gray-400">Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">-</div>
              <div className="text-sm text-gray-400">Career Openings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

