'use client';

import { updateBookingStatus, markAttendance, deleteBooking } from '@/lib/actions';
import { useState } from 'react';
import Link from 'next/link';

interface Booking {
  id: string;
  name: string;
  phone: string;
  gender: string;
  status: string;
  attended: boolean;
  paymentSlipUrl: string;
}

export default function AdminDashboardClient({ bookings }: { bookings: Booking[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  async function handleStatusUpdate(bookingId: string, status: 'confirmed' | 'rejected') {
    await updateBookingStatus(bookingId, status);
  }

  async function handleMarkAttendance(bookingId: string) {
    await markAttendance(bookingId);
  }

  async function handleDeleteBooking(bookingId: string) {
    if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      try {
        await deleteBooking(bookingId);
        alert('Booking deleted successfully');
      } catch (error) {
        alert('Error deleting booking: ' + (error instanceof Error ? error.message : String(error)));
      }
    }
  }

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    attended: bookings.filter(b => b.attended).length,
  };

  const filteredBookings = bookings.filter(booking =>
    booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-gold-500 to-transparent opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-maroon-600 to-transparent opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-gold-500/20 bg-black/60 backdrop-blur-lg sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400 mt-2">Manage event bookings & attendance verification</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Link
                  href="/admin/scan"
                  className="btn-secondary py-3 px-6 text-sm font-bold inline-flex items-center gap-2 hover:shadow-lg hover:shadow-gold-500/30"
                >
                  📷 Scan QR Code
                </Link>
                <Link
                  href="/admin/login"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 text-sm"
                >
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {/* Total Bookings */}
            <div className="card-glass hover:shadow-gold-500/20 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-2">Total Bookings</p>
                  <p className="text-5xl font-bold text-gold-400">{stats.total}</p>
                  <p className="text-xs text-gray-500 mt-2">All registered attendees</p>
                </div>
                <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">📊</div>
              </div>
            </div>

            {/* Confirmed */}
            <div className="card-glass hover:shadow-green-500/20 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-2">Confirmed</p>
                  <p className="text-5xl font-bold text-green-400">{stats.confirmed}</p>
                  <p className="text-xs text-gray-500 mt-2">{Math.round((stats.confirmed / stats.total) * 100)}% of total</p>
                </div>
                <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">✅</div>
              </div>
            </div>

            {/* Pending */}
            <div className="card-glass hover:shadow-yellow-500/20 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-2">Pending Review</p>
                  <p className="text-5xl font-bold text-yellow-400">{stats.pending}</p>
                  <p className="text-xs text-gray-500 mt-2">Awaiting verification</p>
                </div>
                <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">⏳</div>
              </div>
            </div>

            {/* Attended */}
            <div className="card-glass hover:shadow-blue-500/20 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-2">Attended</p>
                  <p className="text-5xl font-bold text-blue-400">{stats.attended}</p>
                  <p className="text-xs text-gray-500 mt-2">{Math.round((stats.attended / stats.confirmed) * 100)}% attendance rate</p>
                </div>
                <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">👥</div>
              </div>
            </div>
          </div>          {/* Image/PDF Modal */}
          {selectedImage && (
            <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-lg animate-fade-in" onClick={() => setSelectedImage(null)}>
              <div className="relative max-w-4xl w-full max-h-[90vh] rounded-2xl border-2 border-gold-400/50 shadow-2xl shadow-gold-500/30 overflow-hidden bg-black">
                {selectedImage.toLowerCase().endsWith('.pdf') ? (
                  <div className="w-full h-full min-h-[600px] flex flex-col">
                    <iframe
                      src={selectedImage}
                      className="w-full h-full flex-1"
                      title="Payment slip PDF"
                      onError={() => {
                        alert('Could not load PDF. You can download it directly from the link.');
                      }}
                    />
                  </div>
                ) : (
                  <img src={selectedImage} alt="Payment slip" className="w-full h-auto max-h-[90vh] object-contain" />
                )}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-maroon-600 hover:bg-maroon-700 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg transition-colors z-10"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or phone number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 border-2 border-gold-400/50 hover:border-gold-400 text-white placeholder-gray-500 py-4 px-6 rounded-xl focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all duration-300 text-lg font-medium"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gold-400">🔍</span>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="card-premium overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gold-500/20">
              <h2 className="text-2xl font-bold text-gold-400">📋 Attendee Records</h2>
              <span className="text-sm text-gray-400">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gold-400/30">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gold-400 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gold-400 uppercase tracking-widest">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gold-400 uppercase tracking-widest">Gender</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gold-400 uppercase tracking-widest">Slip</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gold-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gold-400 uppercase tracking-widest">Attendance</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gold-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-500/10">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking, index) => (
                      <tr 
                        key={booking.id} 
                        className={`transition-all duration-200 hover:bg-black/40 ${index % 2 === 0 ? 'bg-black/20' : 'bg-black/10'}`}
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <p className="font-semibold text-white text-sm">{booking.name}</p>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <p className="text-gray-300 text-sm font-medium">{booking.phone}</p>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <p className="text-gray-300 text-sm capitalize font-medium">{booking.gender}</p>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedImage(booking.paymentSlipUrl)}
                            className="text-gold-400 hover:text-gold-300 font-semibold text-sm transition-colors hover:underline"
                          >
                            View Slip
                          </button>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`px-4 py-2 rounded-full text-xs font-bold inline-block border-2
                            ${booking.status === 'confirmed' ? 'bg-green-900/40 text-green-300 border-green-500/50' :
                              booking.status === 'rejected' ? 'bg-red-900/40 text-red-300 border-red-500/50' :
                              'bg-yellow-900/40 text-yellow-300 border-yellow-500/50'}`}>
                            {booking.status === 'confirmed' ? '✅ Confirmed' :
                             booking.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          {booking.attended ? (
                            <span className="text-green-400 font-bold text-xs bg-green-900/30 px-3 py-1 rounded-full border border-green-500/30">
                              ✔ Present
                            </span>
                          ) : (
                            <button
                              onClick={() => handleMarkAttendance(booking.id)}
                              disabled={booking.status !== 'confirmed'}
                              className={`text-xs font-semibold px-3 py-1 rounded-full transition-all ${
                                booking.status === 'confirmed'
                                  ? 'text-gold-400 hover:text-gold-300 hover:bg-gold-400/10 cursor-pointer'
                                  : 'text-gray-500 cursor-not-allowed opacity-50'
                              }`}
                            >
                              Mark Present
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex gap-2 justify-center">                            {booking.status !== 'confirmed' && (
                              <button
                                onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                className="bg-green-600/80 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-bold transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30"
                                title="Confirm payment"
                              >
                                ✓
                              </button>
                            )}
                            {booking.status !== 'rejected' && (
                              <button
                                onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                                className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-bold transition-all duration-200 hover:shadow-lg hover:shadow-red-500/30"
                                title="Reject payment"
                              >
                                ✕
                              </button>
                            )}
                            <a
                              href={`/ticket/${booking.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold inline-flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30"
                              title="View e-ticket"
                            >
                              🎫
                            </a>
                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="bg-red-700/80 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold transition-all duration-200 hover:shadow-lg hover:shadow-red-500/30"
                              title="Delete booking"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <p className="text-gray-400 text-lg">
                          {searchTerm ? 'No bookings match your search' : 'No bookings yet'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}