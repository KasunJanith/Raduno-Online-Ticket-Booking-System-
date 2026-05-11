import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import TicketClient from './TicketClient';

export default async function TicketPage({ params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
  });

  if (!booking) notFound();

  return <TicketClient booking={booking} />;
}