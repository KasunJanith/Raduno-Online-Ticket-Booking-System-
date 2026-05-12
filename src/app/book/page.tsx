'use client';

import { createBooking } from '@/lib/actions';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProcessingModalProps {
  name: string;
  bookingId: string;
  onComplete: () => void;
}

function ProcessingModal({ name, bookingId, onComplete }: ProcessingModalProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Redirect to success modal after processing
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-lg animate-fade-in">
      <div className="bg-gradient-to-br from-black via-black to-maroon-900/30 border-2 border-gold-400/50 rounded-3xl p-10 max-w-md w-full shadow-2xl shadow-gold-500/30 animate-bounce-in [animation-duration:0.8s]">
        <div className="flex flex-col items-center space-y-6">
          {/* Loading Spinner */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-gold-400/30 border-t-gold-400 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">⏳</span>
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gold-300 to-gold-400 bg-clip-text text-transparent">
              Processing Your Booking
            </h2>
            <p className="text-gray-400 text-lg">{name}</p>
            <p className="text-gray-500 text-sm">Please wait while we confirm your payment...</p>
          </div>

          {/* Booking ID */}
          <div className="bg-black/60 border-2 border-gold-500/30 rounded-xl p-4 w-full text-center">
            <p className="text-xs text-gray-500 mb-1">BOOKING ID</p>
            <p className="font-mono text-gold-300 font-bold text-sm">{bookingId.slice(0, 8).toUpperCase()}</p>
          </div>

          {/* Status Message */}
          <div className="text-center space-y-1">
            <p className="text-gray-400 text-sm">✦ Verifying payment</p>
            <p className="text-gray-400 text-sm">✦ Generating e-ticket</p>
            <p className="text-gray-400 text-sm">✦ Redirecting...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

function ErrorModal({ message, onClose }: ErrorModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-lg animate-fade-in">
      <div className="bg-gradient-to-br from-black via-black to-red-900/30 border-2 border-red-500/50 rounded-3xl p-10 max-w-md w-full shadow-2xl shadow-red-500/30 animate-bounce-in [animation-duration:0.8s]">
        <div className="flex flex-col items-center space-y-6">
          {/* Error Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-red-600 to-red-500 rounded-full p-5">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-red-400">Error</h2>
            <p className="text-gray-300 text-lg leading-relaxed">{message}</p>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

interface SuccessModalProps {
  bookingId: string;
  name: string;
  onClose: () => void;
}

function SuccessModal({ bookingId, name, onClose }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-lg animate-fade-in">
      <div className="bg-gradient-to-br from-black via-black to-maroon-900/30 border-2 border-gold-400/50 rounded-3xl p-10 max-w-md w-full shadow-2xl shadow-gold-500/30 animate-bounce-in [animation-duration:0.8s] relative">
        {/* Celebration confetti effect background */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '1.5s'}}></div>
          <div className="absolute top-0 right-1/4 w-2 h-2 bg-gold-300 rounded-full animate-bounce" style={{animationDelay: '0.3s', animationDuration: '1.5s'}}></div>
          <div className="absolute top-10 left-1/3 w-1.5 h-1.5 bg-maroon-400 rounded-full animate-bounce" style={{animationDelay: '0.6s', animationDuration: '1.5s'}}></div>
        </div>        {/* Celebration Icon */}
        <div className="flex justify-center mb-8 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500 to-maroon-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-gold-400 to-gold-500 rounded-full p-5 animate-success-check transform">
              <svg className="w-14 h-14 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Success Message */}
        <h2 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-gold-300 to-gold-400 bg-clip-text text-transparent">
          Booking Confirmed!
        </h2>
        <p className="text-center text-gray-300 mb-8 text-lg">
          Welcome to Raduno &apos;26, <span className="text-gold-400 font-bold">{name}</span>
        </p>

        {/* Details Card */}
        <div className="bg-black/60 border-2 border-gold-500/30 rounded-2xl p-6 mb-8 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Booking ID:</p>
            <p className="font-mono text-gold-300 font-semibold text-sm bg-black/50 px-3 py-1 rounded">{bookingId.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className="border-t border-gold-500/20 pt-4 space-y-2">
            <p className="text-gray-400 text-sm">✅ Your e-ticket has been sent to your email</p>
            <p className="text-gray-300 text-sm">📅 <span className="text-gold-400">23 May 2026</span></p>
            <p className="text-gray-300 text-sm">📍 <span className="text-gold-400">Hotel Akashyaam, Negombo</span></p>
            <p className="text-gray-300 text-sm">⏰ <span className="text-gold-400">4:00 PM Onwards</span></p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href={`/ticket/${bookingId}`}
            className="btn-primary w-full text-center block py-3 font-bold text-lg"
          >
            📱 View E-Ticket
          </Link>
          <button
            onClick={onClose}
            className="w-full bg-white/10 hover:bg-white/20 border-2 border-gold-500/30 hover:border-gold-500/50 text-gold-300 font-bold py-3 px-6 rounded-lg transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState<{ bookingId: string; name: string } | null>(null);
  const [errorModal, setErrorModal] = useState('');

  useEffect(() => {
    // Handle file selection display
    const fileInput = document.getElementById('slip-upload') as HTMLInputElement;
    const fileNameElement = document.getElementById('file-name');
    const fileDisplayElement = document.getElementById('file-display');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file && fileNameElement && fileDisplayElement) {
          fileDisplayElement.textContent = file.name;
          fileNameElement.classList.remove('hidden');
        }      });
    }
  }, []);  async function handleSubmit(formData: FormData) {
    setUploading(true);
    setErrorModal('');
    try {
      const name = formData.get('name') as string;
      const result = await createBooking(formData);
      const bookingId = result?.id || 'unknown';
      
      // Show processing modal first
      setProcessing({ bookingId, name });
      
      // After 3 seconds, redirect to ticket
      setTimeout(() => {
        window.location.href = `/ticket/${bookingId}`;
      }, 3000);
    } catch (e: any) {
      const errorMessage = e.message || 'Something went wrong. Please try again.';
      setErrorModal(errorMessage);
      setUploading(false);
    }
  }
  const handleProcessingComplete = () => {
    // Redirect happens in handleSubmit via setTimeout
  };

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden py-12 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-br from-maroon-600 to-transparent opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-tl from-gold-500 to-transparent opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Back Button */}
        <div className="mb-10 flex items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors font-semibold">
            <span className="text-2xl">←</span> Back to Home
          </Link>
        </div>        {/* Page Title */}
        <div className="mb-10 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Book Your Ticket</h1>
          <p className="text-gray-400 text-lg">Reserve your place at Raduno &apos;26</p>
        </div>        {/* Booking Form */}
        <form action={handleSubmit} className="card-premium space-y-6 md:space-y-8 animate-slide-up">
          {/* Bank Account Details Section */}
          <div className="bg-black/50 border-2 border-gold-400/20 rounded-2xl p-6 md:p-8 space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-gold-400 mb-6 flex items-center gap-2">
              <span>🏦</span> Payment Account Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Bank Name</p>
                <p className="text-white font-semibold text-lg">Commercial Bank of Ceylon</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Account Holder</p>
                <p className="text-white font-semibold text-lg">Raduno '26 Committee</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Account Number</p>
                <p className="text-gold-400 font-mono font-bold text-lg">1234567890</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Branch</p>
                <p className="text-white font-semibold text-lg">Negombo Main Branch</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gold-400/20">
              💡 Tip: Include your name in the payment reference for faster confirmation
            </p>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gold-400 uppercase tracking-wider">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              className="w-full bg-black/50 border-b-2 border-gold-400 text-white placeholder-gray-500 py-3 px-2 focus:outline-none focus:border-maroon-500 focus:bg-black transition-all duration-300 text-base md:text-lg"
              placeholder="Your full name"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gold-400 uppercase tracking-wider">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              required
              className="w-full bg-black/50 border-b-2 border-gold-400 text-white placeholder-gray-500 py-3 px-2 focus:outline-none focus:border-maroon-500 focus:bg-black transition-all duration-300 text-base md:text-lg"
              placeholder="+94 77 123 4567"
            />
          </div>

          {/* Gender Selection */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-gold-400 uppercase tracking-wider">Gender *</legend>
            <div className="flex gap-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="gender" 
                  value="male" 
                  required 
                  className="w-5 h-5 accent-gold-400 cursor-pointer"
                />
                <span className="text-gray-300 group-hover:text-gold-400 transition-colors font-medium">Male</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="gender" 
                  value="female" 
                  required 
                  className="w-5 h-5 accent-gold-400 cursor-pointer"
                />
                <span className="text-gray-300 group-hover:text-gold-400 transition-colors font-medium">Female</span>
              </label>
            </div>
          </fieldset>

          {/* Address */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gold-400 uppercase tracking-wider">Address (Optional)</label>
            <textarea
              name="address"
              rows={2}
              className="w-full bg-black/50 border-b-2 border-gold-400 text-white placeholder-gray-500 py-3 px-2 focus:outline-none focus:border-maroon-500 focus:bg-black transition-all duration-300 resize-none text-base md:text-lg"
              placeholder="Your address"
            />
          </div>          {/* Payment Slip Upload */}
          <div className="space-y-3 pt-4 md:pt-6">
            <label className="block text-sm font-semibold text-gold-400 uppercase tracking-wider">Payment Slip *</label>
            <div className="relative">
              <input
                type="file"
                id="slip-upload"
                name="slip"
                accept=".pdf,image/*"
                required
                className="hidden"
              />
              <label
                htmlFor="slip-upload"
                className="block bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-bold py-4 px-6 rounded-lg cursor-pointer transition-all duration-300 text-center text-base md:text-lg shadow-lg hover:shadow-xl"
              >
                📤 Choose Payment Slip (PDF or Image)
              </label>
              <p id="file-name" className="text-gold-300 text-sm mt-2 text-center font-semibold hidden">File selected: <span id="file-display"></span></p>
            </div>
            <p className="text-xs text-gray-400 italic">📄 Upload your payment confirmation (PDF or image)</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-4 text-lg font-bold flex items-center justify-center gap-2 mt-6 md:mt-8"
          >
            {uploading ? (
              <>
                <div className="spinner w-5 h-5"></div>
                Uploading & Reserving...
              </>
            ) : (
              "✨ Confirm Booking"
            )}
          </button>
        </form>

        {/* Security Note */}
        <div className="mt-10 text-center space-y-2 text-gray-400 text-sm">
          <p>🔒 All information is secure and confidential</p>
          <p>✉️ You&apos;ll receive your e-ticket via email shortly</p>
          <p className="text-xs text-gray-500 mt-4">Have questions? Contact the organizing committee on the home page.</p>
        </div>      </div>      {errorModal && (
        <ErrorModal
          message={errorModal}
          onClose={() => setErrorModal('')}
        />
      )}

      {processing && (
        <ProcessingModal
          bookingId={processing.bookingId}
          name={processing.name}
          onComplete={handleProcessingComplete}
        />
      )}
    </div>
  );
}