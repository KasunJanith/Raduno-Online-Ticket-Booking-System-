import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function VerifyPage({ params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
  });

  if (!booking) notFound();

  const statusColor =
    booking.status === 'confirmed'
      ? 'bg-green-100 text-green-800 border-green-400'
      : booking.status === 'rejected'
      ? 'bg-red-100 text-red-800 border-red-400'
      : 'bg-yellow-100 text-yellow-800 border-yellow-400';

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden text-center">
        <div className="bg-gray-800 px-6 py-4">
          <h1 className="text-xl font-bold text-white">Entry Verification</h1>
        </div>
        <div className="p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">{booking.name}</h2>
          <p className="text-sm text-gray-500">Ticket #{booking.id}</p>

          <div
            className={`mt-4 inline-block border px-6 py-2 rounded-full text-lg font-bold ${statusColor}`}
          >
            {booking.status === 'confirmed'
              ? '✅ ALLOWED ENTRY'
              : booking.status === 'rejected'
              ? '❌ REJECTED'
              : '⏳ PENDING'}
          </div>

          <p className="text-sm text-gray-600 mt-4">
            {booking.status === 'confirmed'
              ? 'Welcome! Please proceed inside.'
              : booking.status === 'rejected'
              ? 'We could not verify your payment. Please contact the committee.'
              : 'Your payment is being reviewed. Please wait for confirmation.'}
          </p>
        </div>
      </div>
    </div>
  );
}