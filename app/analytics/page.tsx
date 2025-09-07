'use client'
import React, { useState } from 'react';
import { BarChart3, Users, ChevronRight } from 'lucide-react';
import AnalyticsDashboard from '@/components/analytics';

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState('analytics');

  const menuItems = [
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      component: AnalyticsDashboard
    },
    {
      id: 'influencers',
      label: 'Influencers',
      icon: Users,
      component: () => (
        <div className="p-6 bg-[#1a1a2e] h-screen flex flex-col justify-center items-center">
          <img src={'7.png'} className='w-40'/>
          <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
          <p>
             Nothing here..
          </p>
        </div>
      )
    }
  ];

  const ActiveComponent = menuItems.find(item => item.id === activeMenu)?.component || AnalyticsDashboard;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a1a2e] shadow-lg border-r border-white">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-white">shotzspot</h1>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-500 transition-colors duration-200 ${
                  activeMenu === item.id 
                    ? 'bg-yellow-50 border-r-2 border-yellow-500 text-yellow-600' 
                    : 'text-white'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
                {activeMenu === item.id && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <ActiveComponent />
      </div>
    </div>
  );
};

function Page() {
  return <Sidebar />;
}

export default Page;