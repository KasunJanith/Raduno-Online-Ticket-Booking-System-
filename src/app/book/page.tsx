'use client';

import { createBooking } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BookPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    setUploading(true);
    setError('');
    try {
      await createBooking(formData);
    } catch (e: any) {
      setError(e.message || 'Something went wrong.');
      setUploading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8">Book Your Ticket</h1>

      <form
        action={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 space-y-6"
      >
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Telephone Number
          </label>
          <input
            type="tel"
            name="phone"
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3"
            placeholder="+94 77 123 4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            name="address"
            required
            rows={2}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3"
            placeholder="Your address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Slip (PDF or Screenshot)
          </label>
          <input
            type="file"
            name="slip"
            accept=".pdf,image/*"
            required
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload a clear image or PDF of your bank transfer / payment confirmation.
          </p>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
        >
          {uploading ? "Uploading & Reserving..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}