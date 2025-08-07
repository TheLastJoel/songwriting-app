'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Menu, X } from 'lucide-react';

export default function HeaderBar() {
  const { userId } = useAuth();
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <header className={`text-print bg-night p-4 flex items-center transition-all duration-300 ${isOpen ? 'pl-68' : 'pl-4'}`}>
      <button onClick={toggleSidebar} className="p-2">
        {isOpen ? <X /> : <Menu />}
      </button>
      <div className="flex-1 flex justify-between items-center">
        <h1 className="text-xl">Songwriting App</h1>
        <div>Profile: {userId ? 'Anonymous' : 'Loading...'}</div>
      </div>
    </header>
  );
}