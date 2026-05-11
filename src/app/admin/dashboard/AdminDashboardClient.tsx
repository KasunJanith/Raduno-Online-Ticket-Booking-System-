'use client';

import { updateBookingStatus } from '@/lib/actions';
import { useState } from 'react';

interface Booking {
  id: string;
  name: string;
  phone: string;
  address: string;
  paymentSlipUrl: string;
  status: string;
  createdAt: Date;
}

export default function AdminDashboardClient({ bookings }: { bookings: Booking[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleUpdateStatus(bookingId: string, status: 'confirmed' | 'rejected') {
    await updateBookingStatus(bookingId, status);
    setRefreshKey((k) => k + 1); // force re-fetch (actions already revalidate)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <a href="/admin/login" className="text-sm text-red-600 hover:underline">
          Logout
        </a>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <div className="bg-white p-2 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
            <img src={selectedImage} alt="Payment slip" className="max-w-full h-auto" />
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slip</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {booking.phone}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-indigo-600 hover:underline cursor-pointer"
                  onClick={() => setSelectedImage(booking.paymentSlipUrl)}>
                  View
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Reject
                  </button>
                  <a
                    href={`/ticket/${booking.id}`}
                    target="_blank"
                    className="text-indigo-600 hover:underline text-xs"
                  >
                    Ticket
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}