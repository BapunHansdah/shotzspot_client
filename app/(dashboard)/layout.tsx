'use client'
import React from 'react';
import Sidebar from '@/components/sidebar';


const layout = ({children}:any) => {

  return (
    <div className="flex h-screen bg-[#141424]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto w-full">
        {children}
      </div>
    </div>
  );
};

export default layout;
