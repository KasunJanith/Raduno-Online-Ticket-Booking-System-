import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import VerifyClient from './VerifyClient';
import { cookies } from 'next/headers';

export default async function VerifyPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { admin?: string };
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
  });
  if (!booking) notFound();

  const cookieStore = cookies();
  const isAdmin = cookieStore.get('admin_token')?.value === process.env.ADMIN_SECRET;
  const showAdmin = searchParams.admin === 'true' && isAdmin;

  return <VerifyClient booking={booking} showAdmin={showAdmin} />;
}