import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  // Auth check - protect dashboard
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value;
  const adminSecret = process.env.ADMIN_SECRET;
  
  // Redirect to login if no token or token doesn't match
  if (!token || !adminSecret || token !== adminSecret) {
    redirect('/admin/login');
  }

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <AdminDashboardClient bookings={bookings} />;
}