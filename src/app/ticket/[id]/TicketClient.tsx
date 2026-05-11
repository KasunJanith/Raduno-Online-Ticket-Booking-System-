'use client';

import { QRCodeSVG } from 'qrcode.react';

interface Booking {
  id: string;
  name: string;
  status: string;
}

export default function TicketClient({ booking }: { booking: Booking }) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${booking.id}`;

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white text-center">
            Raduno &apos;26 E‑Ticket
          </h1>
        </div>
        <div className="p-8 space-y-6">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">{booking.name}</p>
            <p className="text-sm text-gray-500">Ticket ID: {booking.id}</p>
          </div>

          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300">
              <QRCodeSVG value={verificationUrl} size={200} level="H" includeMargin />
            </div>
          </div>

          <div className="text-center">
            {booking.status === 'pending' ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                ⏳ Payment Pending
              </span>
            ) : booking.status === 'confirmed' ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ✅ Confirmed
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                ❌ Rejected
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 text-center">
            Please show this QR code at the entrance. <br />
            Your ticket will be validated on the spot.
          </p>

          <div className="border-t pt-4 text-center">
            <p className="text-xs text-gray-500">
              In case of any issues, contact the organizing committee.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => window.print()}
          className="text-indigo-600 hover:text-indigo-800 underline text-sm"
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}