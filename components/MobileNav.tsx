'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: '🏠', label: 'Dashboard' },
    { href: '/mobile', icon: '📱', label: 'Quick Sales' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-glass-border md:hidden z-50 rounded-b-none rounded-t-xl">
      <div className="flex justify-around items-center p-4">
        <button className="flex flex-col items-center text-neon-pink text-glow">
          <span className="text-2xl">🏠</span>
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center text-gray-400 hover:text-neon-blue transition-colors">
          <span className="text-2xl">📦</span>
          <span className="text-xs mt-1">Stock</span>
        </button>
        <button className="flex flex-col items-center text-gray-400 hover:text-neon-blue transition-colors">
          <span className="text-2xl">👥</span>
          <span className="text-xs mt-1">CRM</span>
        </button>
        <button className="flex flex-col items-center text-gray-400 hover:text-neon-blue transition-colors">
          <span className="text-2xl">📊</span>
          <span className="text-xs mt-1">Stats</span>
        </button>
      </div>
    </div>
  );
}
