'use server';

import { prisma } from '@/lib/db';
import { cloudinary } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Admin auth helpers
function isAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token === process.env.ADMIN_SECRET;
}

async function uploadToCloudinary(file: File): Promise<string> {
  try {
    // Validate Cloudinary config
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary is not properly configured. Please contact support.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'raduno26_slips', resource_type: 'auto' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error(`File upload failed: ${error.message}`));
          } else if (result?.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error('No URL returned from Cloudinary'));
          }
        }
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('Cloudinary setup error:', error);
    throw new Error(`Cloudinary configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function createBooking(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const gender = formData.get('gender') as string;
    const slipFile = formData.get('slip') as File;

    if (!name || !phone || !gender || !slipFile) {
      throw new Error('Please fill all required fields (name, phone, gender, payment screenshot).');
    }

    // Validate file type - only images allowed
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedImageTypes.includes(slipFile.type)) {
      throw new Error('Payment screenshot must be an image file (JPG, PNG, GIF or WebP). PDF files are not accepted.');
    }

    // Validate file size (max 5MB)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (slipFile.size > maxFileSize) {
      throw new Error('File size must be less than 5MB.');
    }

    // Check if phone number already exists
    const existingBooking = await prisma.booking.findFirst({
      where: { phone }
    });

    if (existingBooking) {
      throw new Error(`Phone number ${phone} is already registered. Please use a different phone number.`);
    }

    const paymentSlipUrl = await uploadToCloudinary(slipFile);

    const booking = await prisma.booking.create({
      data: {
        name,
        phone,
        address: address || '',
        gender,
        paymentSlipUrl,
      },
    });

    return booking;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create booking';
    console.error('Booking creation error:', message);
    throw error;
  }
}

export async function updateBookingStatus(bookingId: string, status: 'confirmed' | 'rejected') {
  if (!isAdmin()) throw new Error('Unauthorized');
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
  revalidatePath('/admin/dashboard');
  revalidatePath(`/verify/${bookingId}`);
}

export async function adminLogin(secret: string) {
  if (secret === process.env.ADMIN_SECRET) {
    const cookieStore = cookies();
    cookieStore.set('admin_token', secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    redirect('/admin/dashboard');
  } else {
    return { error: 'Invalid secret key' };
  }
}

export async function adminLogout() {
  const cookieStore = cookies();
  cookieStore.delete('admin_token');
  redirect('/admin/login');
}

// New: Mark attendance
export async function markAttendance(bookingId: string) {
  if (!isAdmin()) throw new Error('Unauthorized');
  await prisma.booking.update({
    where: { id: bookingId },
    data: { attended: true },
  });
  revalidatePath(`/verify/${bookingId}`);
  revalidatePath('/admin/dashboard');
}

// Delete booking
export async function deleteBooking(bookingId: string) {
  if (!isAdmin()) throw new Error('Unauthorized');
  await prisma.booking.delete({
    where: { id: bookingId },
  });
  revalidatePath('/admin/dashboard');
}