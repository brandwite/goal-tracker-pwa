"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, CreditCard, User } from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Goals",
    href: "/goals",
    icon: Target,
  },
  {
    title: "Subscription",
    href: "/subscription",
    icon: CreditCard,
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
    mobileOnly: true,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden">
      <div className="flex items-center justify-around h-16">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive
                  ? "text-pink-600 dark:text-pink-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 