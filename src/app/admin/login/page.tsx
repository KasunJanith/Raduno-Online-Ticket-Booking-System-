'use client';

import { adminLogin } from '@/lib/actions';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await adminLogin(secret);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-gold-500 to-transparent opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-maroon-600 to-transparent opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors font-semibold">
            <span className="text-2xl">←</span> Back to Home
          </Link>
        </div>

        {/* Login Card */}
        <div className="card-premium space-y-8 animate-bounce-in">
          {/* Header Section with maroon top stripe */}
          <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-maroon-700 via-maroon-600 to-maroon-700 px-8 py-8 text-center -mx-8 -mt-8 mb-4">
            <h1 className="text-4xl font-bold text-gold-400 mb-2">Admin Panel</h1>
            <p className="text-gold-300 text-sm">Raduno &apos;26 Management System</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-900/30 border-2 border-red-500/50 text-red-300 px-5 py-4 rounded-xl animate-fade-in font-semibold text-sm">
                🔐 {error}
              </div>
            )}

            {/* Secret Input */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gold-400 uppercase tracking-wider">
                Admin Secret
              </label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter your admin secret key"
                className="w-full bg-black/50 border-b-2 border-gold-400 text-white placeholder-gray-500 py-3 px-2 focus:outline-none focus:border-maroon-500 focus:bg-black transition-all duration-300 text-lg"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 italic">This key is required to access the admin dashboard</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !secret}
              className="w-full btn-primary py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold-500/40 mt-8"
            >
              {loading ? (
                <>
                  <div className="spinner w-5 h-5"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  🔓 Log In
                </>
              )}
            </button>
          </form>

          {/* Security Info */}
          <div className="bg-black/30 border border-gold-500/20 rounded-xl p-4 space-y-2 text-center">
            <p className="text-xs text-gray-400">
              🔒 This is a secured admin area
            </p>
            <p className="text-xs text-gray-500">
              Only authorized personnel can access the dashboard
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-gray-500 text-sm">
          <p>For access issues, contact the Raduno &apos;26 organizing committee</p>
        </div>
      </div>
    </div>
  );
}