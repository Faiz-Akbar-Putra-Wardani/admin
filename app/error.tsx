"use client";
import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <AlertTriangle size={64} className="mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Something went wrong!</h1>
        <p className="text-gray-400 mb-6">
          An error occurred while loading this page.
        </p>
        <button
          onClick={reset}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
        >
          <RefreshCw size={16} />
          <span>Try again</span>
        </button>
      </div>
    </div>
  );
}

