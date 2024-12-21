import React from 'react';

export const Loading: React.FC = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
  </div>
); 