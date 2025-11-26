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
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/20 sm:hidden z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
              pathname === item.href
                ? 'bg-green-600/50 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-xs font-medium">{item.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
