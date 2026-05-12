'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ScanPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(true);
  const router = useRouter();
  const scannerRef = useRef<Html5Qrcode | null>(null);  useEffect(() => {
    const initScanner = async () => {
      try {
        // Check if camera is available
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
          setError('No camera device found on this device. Please use a device with a camera.');
          setLoading(false);
          return;
        }

        // Create scanner instance
        const scanner = new Html5Qrcode('reader');
        scannerRef.current = scanner;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          disableFlip: false,
        };

        // Start camera with timeout
        const startPromise = scanner.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            // QR code found
            setScanning(false);
            scanner.stop().then(() => {
              // Extract booking ID from verification URL
              if (decodedText.includes('/verify/')) {
                const id = decodedText.split('/verify/')[1]?.split('?')[0];
                if (id) {
                  router.push(`/verify/${id}?admin=true`);
                } else {
                  setError('Invalid QR code format.');
                  setScanning(true);
                }
              } else {
                setError('QR code is not from a valid Raduno ticket.');
                setScanning(true);
              }
            }).catch(() => {
              setError('Scanner error. Please try again.');
              setScanning(true);
            });
          },
          (err) => {
            // Scanning error - usually just means no QR found yet
            if (err && err.toString && !err.toString().includes('No QR found')) {
              console.debug('Scan attempt:', err);
            }
          }
        );

        // Add timeout for camera access
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Camera timeout')), 8000)
        );

        await Promise.race([startPromise, timeoutPromise]);
        setLoading(false);

      } catch (err) {
        console.error('Scanner initialization error:', err);
        const errMsg = err instanceof Error ? err.message : String(err);
        
        if (errMsg.includes('NotAllowedError') || errMsg.includes('Permission denied') || errMsg.includes('permission')) {
          setError('Camera access denied. Please allow camera permissions:\n1. Check browser settings\n2. Allow camera access for this site\n3. Refresh the page');
        } else if (errMsg.includes('NotFoundError')) {
          setError('No camera device found on this device.');
        } else if (errMsg.includes('timeout')) {
          setError('Camera initialization timed out. Please check if another app is using the camera and try again.');
        } else if (errMsg.includes('NotReadableError') || errMsg.includes('device is already in use')) {
          setError('Camera is in use by another application. Please close other camera apps and try again.');
        } else {
          setError('Unable to access camera. Try:\n1. Refreshing the page\n2. Closing other camera apps\n3. Checking browser permissions');
        }
        setLoading(false);
      }
    };

    initScanner();

    // Cleanup on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden py-12 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-bl from-gold-500 to-transparent opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-maroon-600 to-transparent opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors font-semibold">
            <span className="text-2xl">←</span> Back to Dashboard
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent mb-3">
            Scan QR Code
          </h1>
          <p className="text-gray-400 text-lg">Point the camera at the attendee&apos;s e-ticket</p>
        </div>

        {/* Camera Container */}
        <div className="card-premium space-y-6 animate-slide-up">
          {/* Instructions */}
          <div className="bg-maroon-900/30 border-2 border-maroon-600/50 rounded-xl p-4">
            <p className="text-gold-400 font-semibold flex items-start gap-3">
              <span className="text-xl mt-0.5">📱</span>
              <span>Position the QR code from an attendee&apos;s e-ticket within the camera frame</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border-2 border-red-500/50 text-red-300 px-5 py-4 rounded-xl animate-fade-in font-semibold text-sm">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="spinner w-12 h-12"></div>
            </div>
          )}

          {/* QR Scanner - Conditionally Render */}
          {!loading && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-maroon-600 via-gold-500 to-maroon-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
              <div id="reader" className="relative w-full rounded-2xl overflow-hidden border-4 border-maroon-600 shadow-2xl shadow-maroon-600/50 min-h-96" style={{aspectRatio: '1'}}></div>
            </div>
          )}

          {/* Instructions Text */}
          <div className="space-y-2 text-center text-gray-400">
            <p className="text-sm">✦ Make sure there&apos;s good lighting</p>
            <p className="text-sm">✦ Hold the camera steady</p>
            <p className="text-sm">✦ Scanning will automatically proceed to verification</p>
          </div>
        </div>

        {/* Helpful Tips */}
        <div className="card-premium mt-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl font-bold text-gold-400 mb-4">💡 Scanning Tips</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-gold-400 font-bold">•</span>
              <span>Ensure the QR code is clearly visible and not partially cut off</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gold-400 font-bold">•</span>
              <span>If scanning fails, try zooming in or adjusting the distance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gold-400 font-bold">•</span>
              <span>The QR code is located on the attendee&apos;s e-ticket PDF or mobile screen</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gold-400 font-bold">•</span>
              <span>After successful scan, you&apos;ll be taken to the verification page</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}