import React from 'react';
import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">404</h2>
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Page Not Found</h3>
          <p className="text-xs text-slate-500">
            The skill exchange page or session room you are looking for does not exist or has moved.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
