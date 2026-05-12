'use client';

import { markAttendance } from '@/lib/actions';
import { useState } from 'react';
import Link from 'next/link';

interface Booking {
  id: string;
  name: string;
  phone: string;
  status: string;
  attended: boolean;
}

export default function VerifyClient({ booking, showAdmin }: { booking: Booking; showAdmin: boolean }) {
  const [attended, setAttended] = useState(booking.attended);
  const [marking, setMarking] = useState(false);

  const handleMark = async () => {
    setMarking(true);
    await markAttendance(booking.id);
    setAttended(true);
    setMarking(false);
  };

  const statusConfig = {
    confirmed: {
      bgGradient: 'from-green-900/40 to-emerald-800/30',
      borderColor: 'border-green-500/50',
      textColor: 'text-green-300',
      statusText: '✅ ALLOWED ENTRY',
      description: 'Welcome! Please proceed inside.'
    },
    rejected: {
      bgGradient: 'from-red-900/40 to-red-800/30',
      borderColor: 'border-red-500/50',
      textColor: 'text-red-300',
      statusText: '❌ REJECTED',
      description: 'We could not verify your payment. Please contact the committee.'
    },
    pending: {
      bgGradient: 'from-yellow-900/40 to-yellow-800/30',
      borderColor: 'border-yellow-500/50',
      textColor: 'text-yellow-300',
      statusText: '⏳ PENDING VERIFICATION',
      description: 'Your payment is being reviewed. Please wait for confirmation.'
    }
  };

  const config = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden py-12 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-bl from-gold-500 to-transparent opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-maroon-600 to-transparent opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        {showAdmin && (
          <div className="mb-10">
            <Link href="/admin/scan" className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors font-semibold">
              <span className="text-2xl">←</span> Scan Another
            </Link>
          </div>
        )}

        {/* Main Card */}
        <div className="card-premium space-y-8 animate-bounce-in">
          {/* Header Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-maroon-900/50 to-black/30 px-8 py-8 border-b-2 border-gold-400/20">
            <h1 className="text-4xl font-bold text-gold-400 mb-2">
              {showAdmin ? '🎟️ Entry Verification' : '📋 Your Ticket Status'}
            </h1>
            <p className="text-gray-400 text-sm">Raduno &apos;26 - Event Verification System</p>
          </div>

          {/* Attendee Information */}
          <div className="space-y-6">
            {/* Name */}
            <div className="text-center pb-6 border-b border-gold-400/20">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Attendee Name</p>
              <h2 className="text-5xl font-bold text-gold-300">
                {booking.name}
              </h2>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-black/30 rounded-xl p-4 border border-gold-500/20">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Ticket ID</p>
                <p className="text-sm font-mono text-gold-300 font-bold break-all">{booking.id.slice(0, 16)}</p>
              </div>
              <div className="bg-black/30 rounded-xl p-4 border border-gold-500/20">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Phone</p>
                <p className="text-sm text-gray-300 font-medium">{booking.phone}</p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`bg-gradient-to-r ${config.bgGradient} border-2 ${config.borderColor} rounded-2xl p-6 text-center backdrop-blur-sm`}>
            <p className={`text-3xl font-bold ${config.textColor} mb-2`}>
              {config.statusText}
            </p>
            {attended && (
              <p className="text-green-400 text-sm font-semibold bg-green-900/40 border border-green-500/30 rounded-full px-4 py-1 inline-block mt-2">
                ✔ Attendance Marked
              </p>
            )}
          </div>

          {/* Action Button (Admin Only) */}
          {showAdmin && !attended && booking.status === 'confirmed' && (
            <button
              onClick={handleMark}
              disabled={marking}
              className="w-full btn-primary py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold-500/40"
            >
              {marking ? (
                <>
                  <div className="spinner w-5 h-5"></div>
                  Marking...
                </>
              ) : (
                <>
                  ✓ Mark as Attended
                </>
              )}
            </button>
          )}

          {/* Description */}
          <div className="bg-black/30 border border-gold-500/20 rounded-xl p-6 text-center">
            <p className="text-gray-300 text-sm leading-relaxed">
              {config.description}
            </p>
          </div>

          {/* Event Details */}
          <div className="bg-black/50 rounded-xl p-6 space-y-3 border border-gold-500/20">
            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider mb-4">Event Details</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📅 <span className="text-gold-400">23 May 2026</span></p>
              <p>⏰ <span className="text-gold-400">4:00 PM Onwards</span></p>
              <p>📍 <span className="text-gold-400">Hotel Akashyaam, Negombo (Rooftop)</span></p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        {showAdmin && (
          <div className="mt-10 text-center">
            <Link
              href="/admin/scan"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-semibold text-lg transition-colors"
            >
              <span>📱</span> Scan Another Ticket
            </Link>
          </div>
        )}

        {!showAdmin && (
          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-semibold text-lg transition-colors"
            >
              <span>🏠</span> Back to Home
            </Link>
          </div>
        )}

        {/* Important Info for Entry */}
        {booking.status === 'confirmed' && (
          <div className="card-premium mt-10 animate-slide-up">
            <h3 className="text-lg font-bold text-gold-400 mb-4">✓ You&apos;re All Set!</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-gold-400 font-bold">•</span>
                <span>Arrive 15 minutes before the event starts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold-400 font-bold">•</span>
                <span>Bring a valid ID for identification</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold-400 font-bold">•</span>
                <span>Dress code: Smart Casual or Formal</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold-400 font-bold">•</span>
                <span>Photography is allowed for personal use</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}