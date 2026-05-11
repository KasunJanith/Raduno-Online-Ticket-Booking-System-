'use server';

import { prisma } from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Admin auth helpers
function isAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token === process.env.ADMIN_SECRET;
}

// Upload file to Cloudinary and return secure URL
async function uploadToCloudinary(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'raduno26_slips', resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

// Create booking (called from booking form)
export async function createBooking(formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const slipFile = formData.get('slip') as File;

  if (!name || !phone || !address || !slipFile) {
    throw new Error('All fields are required.');
  }

  const paymentSlipUrl = await uploadToCloudinary(slipFile);

  const booking = await prisma.booking.create({
    data: {
      name,
      phone,
      address,
      paymentSlipUrl,
      status: 'pending',
    },
  });

  // Redirect to the ticket page
  redirect(`/ticket/${booking.id}`);
}

// Update booking status (admin only)
export async function updateBookingStatus(bookingId: string, status: 'confirmed' | 'rejected') {
  if (!isAdmin()) {
    throw new Error('Unauthorized');
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  revalidatePath('/admin/dashboard');
  revalidatePath(`/verify/${bookingId}`);
}

// Admin login action
export async function adminLogin(secret: string) {
  if (secret === process.env.ADMIN_SECRET) {
    const cookieStore = cookies();
    cookieStore.set('admin_token', secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });
    redirect('/admin/dashboard');
  } else {
    return { error: 'Invalid secret key' };
  }
}

// Admin logout (optional)
export async function adminLogout() {
  const cookieStore = cookies();
  cookieStore.delete('admin_token');
  redirect('/admin/login');
}