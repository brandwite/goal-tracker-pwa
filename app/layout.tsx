import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";

const APP_NAME = "Goal Tracker App";
const APP_DEFAULT_TITLE = "Goal Tracker";
const APP_TITLE_TEMPLATE = "%s | Goal Tracker";
const APP_DESCRIPTION =
  "This is a Goal Tracker Platform";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

const quicksand = Quicksand({ subsets: ["latin"] });

export const viewport: Viewport = {
    themeColor: "#9333ea",
  };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/ios/32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/ios/16.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/ios/192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/ios/512.png" />
        <link rel="shortcut icon" href="/icons/ios/32.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#9333ea" />
        <link rel="apple-touch-icon" href="/icons/ios/180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${quicksand.className} min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
        {/* Fixed Gradient Background */}
        <div className="fixed top-0 left-0 w-full h-[270px] z-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-tr from-purple-900/70 via-blue-800/70 to-pink-700/70 dark:from-purple-900 dark:via-blue-800 dark:to-pink-700/50 rounded-b-3xl" />
        </div>

        <div className="flex flex-row h-screen gap-4 md:gap-8 p-2 md:p-4 relative z-10">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden md:block">
            <Sidebar />
          </div>
          
          {/* Main Content */}
          <main className="w-full h-full rounded-3xl p-4 md:p-8 flex flex-col overflow-y-auto pb-20 md:pb-8">
            {children}
          </main>

          {/* Bottom Navigation - Only visible on mobile */}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
