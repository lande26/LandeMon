import React from 'react';
import UserNav from './UserNav';

const ULayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <UserNav />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
};

export default ULayout;