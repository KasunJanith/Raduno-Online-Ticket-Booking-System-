'use client';

import { createBooking } from '@/lib/actions';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProcessingModalProps {
  name: string;
  bookingId: string;
  onComplete: () => void;
}

function ProcessingModal({ name, bookingId, onComplete }: ProcessingModalProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [
      { delay: 500, value: 30 },
      { delay: 1200, value: 65 },
      { delay: 2000, value: 100 }
    ];

    const timers = steps.map(step =>
      setTimeout(() => setProgress(step.value), step.delay)
    );

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const steps = [
    { label: 'Verifying Payment', completed: progress >= 30 },
    { label: 'Generating E-Ticket', completed: progress >= 65 },
    { label: 'Finalizing Booking', completed: progress >= 100 }
  ];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-lg animate-fade-in">
      <div className="bg-gradient-to-br from-black via-black to-maroon-900/30 border-2 border-gold-400/50 rounded-3xl p-10 max-w-md w-full shadow-2xl shadow-gold-500/30 animate-bounce-in [animation-duration:0.8s]">
        <div className="flex flex-col items-center space-y-8">
          {/* Animated Hourglass Icon */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl animate-bounce" style={{animationDuration: '1.5s'}}>⏳</span>
            </div>
            <svg className="absolute inset-0 w-full h-full animate-spin" style={{animationDuration: '3s'}} viewBox="0 0 100 100" fill="none" stroke="url(#goldGradient)" strokeWidth="2">
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#f4d03f" stopOpacity="0.8"/>
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" opacity="0.3"/>
            </svg>
          </div>

          {/* Message */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gold-300 to-gold-400 bg-clip-text text-transparent">
              Processing Booking
            </h2>
            <p className="text-gray-400 text-lg font-semibold">{name}</p>
          </div>

          {/* Booking ID */}
          <div className="bg-black/60 border-2 border-gold-500/30 rounded-xl p-4 w-full text-center">
            <p className="text-xs text-gray-500 mb-1">BOOKING ID</p>
            <p className="font-mono text-gold-300 font-bold text-sm">{bookingId.slice(0, 8).toUpperCase()}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full space-y-3">
            <div className="relative h-2 bg-black/50 rounded-full border border-gold-500/30 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-gold-300 text-sm font-semibold">{progress}%</p>
          </div>

          {/* Processing Steps */}
          <div className="w-full space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  step.completed 
                    ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-black' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {step.completed ? '✓' : index + 1}
                </div>
                <span className={`text-sm font-medium transition-colors duration-500 ${
                  step.completed ? 'text-gold-300' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Subtle hint */}
          <p className="text-xs text-gray-600 italic text-center">Redirecting to your e-ticket...</p>
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
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState<{ bookingId: string; name: string } | null>(null);
  const [errorModal, setErrorModal] = useState('');
  useEffect(() => {
    // Handle file selection display and validation
    const fileInput = document.getElementById('slip-upload') as HTMLInputElement;
    const fileNameElement = document.getElementById('file-name');
    const fileDisplayElement = document.getElementById('file-display');
    const fileErrorElement = document.getElementById('file-error');
    const fileErrorMsg = document.getElementById('file-error-msg');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        
        // Clear previous errors
        if (fileErrorElement) fileErrorElement.classList.add('hidden');
        if (fileNameElement) fileNameElement.classList.add('hidden');

        if (file) {
          // Validate file type
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
          if (!allowedTypes.includes(file.type)) {
            if (fileErrorElement && fileErrorMsg) {
              fileErrorMsg.textContent = 'Only image files are allowed (JPG, PNG, GIF, WebP)';
              fileErrorElement.classList.remove('hidden');
            }
            fileInput.value = ''; // Clear the input
            return;
          }

          // Validate file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            if (fileErrorElement && fileErrorMsg) {
              fileErrorMsg.textContent = 'File size must be less than 5MB';
              fileErrorElement.classList.remove('hidden');
            }
            fileInput.value = ''; // Clear the input
            return;
          }

          // Show success
          if (fileNameElement && fileDisplayElement) {
            fileDisplayElement.textContent = file.name;
            fileNameElement.classList.remove('hidden');
          }
        }
      });
    }
  }, []);  async function handleSubmit(formData: FormData) {
    setUploading(true);
    setErrorModal('');
    try {
      const name = formData.get('name') as string;
      // createBooking now calls redirect() internally, so it won't return
      await createBooking(formData);
    } catch (e: any) {
      const errorMessage = e.message || 'Something went wrong. Please try again.';
      setErrorModal(errorMessage);
      setUploading(false);
    }
  }

  const handleProcessingComplete = () => {
    // Processing modal automatically closes after animation
    // Router.push happens in handleSubmit
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
                <p className="text-white font-semibold text-lg">People's Bank</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Account Holder</p>
                <p className="text-white font-semibold text-lg">K. J. B. Thilakarathna</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Account Number</p>
                <p className="text-gold-400 font-mono font-bold text-lg">034200120714156</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Branch</p>
                <p className="text-white font-semibold text-lg">Negombo Branch</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Amount</p>
                <p className="text-white font-semibold text-lg">LKR 5,000.00</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gold-400/20">
              Tip: Include your name in the payment reference for faster confirmation
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
            <div className="flex items-center gap-2">
              <label className="block text-sm font-semibold text-gold-400 uppercase tracking-wider">Payment Screenshot</label>
              <span className="text-red-500 font-bold text-lg">*</span>
            </div>
            <div className="relative border-2 border-gold-400/50 rounded-lg p-4 hover:border-gold-400 transition-colors duration-300">
              <input
                type="file"
                id="slip-upload"
                name="slip"
                accept="image/*"
                required
                className="hidden"
              />
              <label
                htmlFor="slip-upload"
                className="block bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-bold py-4 px-6 rounded-lg cursor-pointer transition-all duration-300 text-center text-base md:text-lg shadow-lg hover:shadow-xl"
              >
                📸 Upload Payment Screenshot Here
              </label>
              <p id="file-name" className="text-gold-300 text-sm mt-3 text-center font-semibold hidden">✓ File selected: <span id="file-display"></span></p>
              <p id="file-error" className="text-red-400 text-sm mt-3 text-center font-semibold hidden">⚠️ <span id="file-error-msg"></span></p>
            </div>
            <p className="text-xs text-gray-400 italic">Upload a screenshot of your payment slip (JPG, PNG or GIF)</p>
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
              "Confirm Booking"
            )}
          </button>
        </form>

        {/* Security Note */}
        <div className="mt-10 text-center space-y-2 text-gray-400 text-sm">
          <p>🔒 All information is secure and confidential</p>
          <p>✉️ You&apos;ll receive your e-ticket shortly download it and keep it with you</p>
          
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