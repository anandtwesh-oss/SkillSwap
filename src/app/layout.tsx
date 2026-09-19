import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/components/AuthProvider';
import { UserProvider } from '@/components/UserContext';
import { Navbar } from '@/components/Navbar';
import { ArrowLeftRight, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SkillSwap — Peer-to-Peer Knowledge Exchange Platform',
  description: 'Trade skills directly with peer matching, 1-on-1 real-time video/chat, reviews, and gamification.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <UserProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            
            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4 mt-12 transition-colors">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white">SkillSwap Platform</span>
                  <span>— Production Ready Peer Knowledge Exchange</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Powered by NextAuth.js & Prisma ORM</span>
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                </div>
              </div>
            </footer>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
