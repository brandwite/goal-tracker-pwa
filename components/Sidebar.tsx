'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Target, CreditCard, LogOut, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import avatar from '@/public/images/avatar.jpg';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    title: 'Goals',
    href: '/goals',
    icon: Target,
  },
  {
    title: 'Subscription',
    href: '/subscription',
    icon: CreditCard,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // On mount, check localStorage or system preference
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setDark((d) => {
      const next = !d;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  return (
    <aside className="flex h-full w-80 flex-col bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-transparent relative z-20">
      {/* Logo */}
      <div className="flex items-center justify-center h-20 px-6 border-b border-gray-100/70 dark:border-gray-800/40">
        <span className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white uppercase"><span className="text-pink-500/80">Goal</span><span className="text-blue-500/80">Tracker</span></span>
      </div>
      {/* User Info */}
      <div className="flex flex-col items-center py-6 px-6 border-b border-gray-100/70 dark:border-gray-800/40">
        <Image
          src={avatar}
          alt="User Avatar"
          width={120}
          height={120}
          priority
          className="rounded-full mb-2 border-4 border-white shadow-lg shadow-pink-300/40"
        />
        <div className="font-semibold text-gray-900 dark:text-white mb-1">John Doe</div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-6 py-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-150 ${
                isActive 
                  ? "bg-pink-500/20 text-pink-700 shadow-md scale-105"
                  : "text-gray-700 dark:text-gray-200 hover:bg-pink-500/10 hover:text-pink-700 hover:scale-105"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      {/* Bottom Actions */}
      <div className="mt-auto px-6 pb-6 flex flex-col gap-2">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-pink-500/10 hover:text-pink-700 hover:scale-105 transition-all duration-150 cursor-pointer"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span>Change Theme</span>
        </button>
        <Link
          href="/logout"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-pink-500/10 hover:text-pink-700 hover:scale-105 transition-all duration-150"
        >
          <LogOut className="h-5 w-5" />
          Sign-out
        </Link>
      </div>
    </aside>
  );
} 