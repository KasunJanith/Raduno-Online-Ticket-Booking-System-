import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  // Auth check
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (token !== process.env.ADMIN_SECRET) redirect('/admin/login');

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <AdminDashboardClient bookings={bookings} />;
}