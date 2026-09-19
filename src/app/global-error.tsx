'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Application Error</h2>
          <p className="text-xs text-slate-500">
            A critical system error occurred. Please try reloading the platform.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow transition-all hover:bg-indigo-700 inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
