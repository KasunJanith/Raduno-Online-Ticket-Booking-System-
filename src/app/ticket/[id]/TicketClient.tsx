'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Link from 'next/link';

interface Booking {
  id: string;
  name: string;
  phone: string;
  gender: string;
  status: string;
  attended: boolean;
}

export default function TicketClient({ booking }: { booking: Booking }) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${booking.id}`;  const downloadPDF = async () => {
    if (!ticketRef.current) return;
    try {
      const element = ticketRef.current;
      
      // Generate canvas with optimized settings
      const canvas = await html2canvas(element, { 
        scale: 2, 
        backgroundColor: '#000000',
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 30000,
        ignoreElements: (el) => {
          return el.id === 'download-btn';
        }
      });

      // Create PDF from canvas
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      let finalHeight = pdfHeight;
      if (finalHeight > pageHeight) {
        finalHeight = pageHeight - 10;
      }
      
      pdf.addImage(imgData, 'PNG', 5, 5, pdfWidth - 10, finalHeight - 10);
      
      // Generate PDF blob and trigger download
      const pdfBlob = pdf.output('blob');
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = `Raduno26_Ticket_${booking.id.slice(0, 8).toUpperCase()}.pdf`;
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadUrl);
      }, 100);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Could not download PDF. Please try one of these alternatives:\n\n1. Use Ctrl+P (Cmd+P on Mac) to print to PDF\n2. Right-click and select "Save as PDF"\n3. Take a screenshot and save as image');
    }
  };

  const statusConfig = {
    pending: { 
      bgGradient: 'from-yellow-900/40 to-yellow-800/30',
      textColor: 'text-yellow-300',
      borderColor: 'border-yellow-500/50',
      text: '⏳ Pending Confirmation',
      badge: 'bg-yellow-900/60 text-yellow-300'
    },
    confirmed: { 
      bgGradient: 'from-green-900/40 to-emerald-800/30',
      textColor: 'text-green-300',
      borderColor: 'border-green-500/50',
      text: '✅ Confirmed',
      badge: 'bg-green-900/60 text-green-300'
    },
    rejected: { 
      bgGradient: 'from-red-900/40 to-red-800/30',
      textColor: 'text-red-300',
      borderColor: 'border-red-500/50',
      text: '❌ Rejected',
      badge: 'bg-red-900/60 text-red-300'
    },
  };

  const currentStatus = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden py-12 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-gold-500 to-transparent opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-maroon-600 to-transparent opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors font-semibold">
            <span className="text-2xl">←</span> Back to Home
          </Link>          <button
            id="download-btn"
            onClick={downloadPDF}
            className="btn-primary py-2 px-6 text-sm font-bold flex items-center gap-2 hover:shadow-gold-500/60"
          >
            📥 Download PDF
          </button>
        </div>

        {/* E-Ticket Card - Premium Physical Ticket Look */}
        <div ref={ticketRef} className="card-premium space-y-1 overflow-hidden border-4 border-gold-400/40 shadow-2xl shadow-gold-500/20 animate-fade-in" id="ticket">
          {/* Top Stripe - Maroon with gold accents */}
          <div className="bg-gradient-to-r from-maroon-700 via-maroon-600 to-maroon-700 h-2"></div>

          {/* Header Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-maroon-900/50 to-black/30 px-8 py-8 text-center border-b-2 border-gold-400/20">
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <pattern id="premium-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="2" fill="white"/>
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#premium-dots)" />
              </svg>
            </div>
            <div className="relative">
              <p className="text-xs font-bold text-gold-300 tracking-[0.3em] uppercase mb-3">Official E-Ticket</p>
              <h1 className="text-5xl font-serif font-bold text-gold-400 drop-shadow-lg">Raduno &apos;26</h1>
              <p className="text-gold-300 italic text-lg mt-3 font-serif">Celebrating Tradition, Creating Memories</p>
            </div>
          </div>          {/* Attendee Information */}
          <div className="px-8 py-8 space-y-6">
            {/* Name - Large and prominent */}
            <div className="border-b-2 border-gold-400/20 pb-6">
              <p className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-2">Attendee Name</p>
              <p className="text-4xl font-bold text-gold-300">{booking.name}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ticket ID</p>
                <p className="text-xs font-mono text-gold-300 font-bold break-all">{booking.id.slice(0, 16)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                <p className="text-sm text-gray-300 font-medium">{booking.phone}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Gender</p>
                <p className="text-sm text-gray-300 font-medium capitalize">{booking.gender}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Entry Status</p>
                <p className={`text-sm font-bold ${currentStatus.textColor}`}>{booking.attended ? '✔ Attended' : (booking.status === 'confirmed' ? '✅ Allowed' : booking.status === 'rejected' ? '❌ Denied' : '⏳ Pending')}</p>
              </div>
            </div>
          </div>          {/* Decorative Divider */}
          <div className="px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"></div>
              <span className="text-gold-300 text-sm">✦</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"></div>
            </div>
          </div>

          {/* QR Code Display */}
          <div className="flex flex-col items-center px-8 py-8 space-y-4">
            <p className="text-xs font-bold text-gold-400 uppercase tracking-widest">Scan for Verification</p>
            <div className="bg-white p-5 rounded-2xl shadow-xl border-4 border-gold-400/30 hover:border-gold-400/50 transition-colors">
              <QRCodeSVG value={verificationUrl} size={180} level="H" includeMargin={true} />
            </div>
            <p className="text-xs text-gray-500 italic text-center">Show this QR code at the entrance for verification</p>
          </div>{/* Event Details Card */}
          <div className="px-8 py-6 space-y-3 bg-black/30 border-t border-b border-gold-400/20">
            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider mb-4">Event Details</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">📅 Date</span>
              <span className="text-white font-semibold">23 May 2026</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">⏰ Time</span>
              <span className="text-white font-semibold">4:00 PM Onwards</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">📍 Venue</span>
              <span className="text-white font-semibold text-right">Hotel Akashyaam, Negombo (Rooftop)</span>
            </div>
          </div>

          {/* Footer Section with Important Info */}
          <div className="px-8 py-6 border-t border-gold-400/20 text-center bg-black/30 space-y-3">
            <p className="text-xs text-gray-400 font-semibold">This is an official Raduno &apos;26 E-Ticket</p>
            <p className="text-xs text-gray-500">Please present this at the venue entrance for entry</p>
          </div>

          {/* Bottom Stripe */}
          <div className="bg-gradient-to-r from-maroon-700 via-maroon-600 to-maroon-700 h-2"></div>
        </div>        {/* Verification Status Section - Below Ticket */}
        <div className="mt-10 flex justify-center animate-slide-up">
          <div className={`px-8 py-4 rounded-2xl border-2 flex items-center gap-3 ${currentStatus.badge}`}>
            <span className="text-2xl">
              {booking.status === 'confirmed' ? '✅' : booking.status === 'rejected' ? '❌' : '⏳'}
            </span>
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Verification Status</p>
              <p className="text-lg font-bold">{currentStatus.text}</p>
            </div>
          </div>
        </div>

        {/* Important Information Box */}
        <div className="card-premium mt-10 animate-slide-up">
          <h2 className="text-2xl font-bold text-gold-400 mb-6 flex items-center gap-2">
            <span>📋</span> Important Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-sm text-gray-300 flex items-start gap-3">
                <span className="text-gold-400 font-bold mt-0.5">✓</span>
                <span>Arrive on time before the event start time</span>
              </p>
              <p className="text-sm text-gray-300 flex items-start gap-3">
                <span className="text-gold-400 font-bold mt-0.5">✓</span>
                <span>Bring this ticket for verification</span>
              </p>
          
            </div>
            <div className="space-y-3">
    
              <p className="text-sm text-gray-300 flex items-start gap-3">
                <span className="text-gold-400 font-bold mt-0.5">✓</span>
                <span>Enjoy the celebration responsibly</span>
              </p>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="text-center text-gray-500 text-xs mt-10 space-y-2">
          <p>For inquiries or support: <span className="text-gold-400 font-semibold">contact@raduno26.com</span></p>
          <p>WhatsApp: <span className="text-gold-400 font-semibold">+94 77 123 4567</span></p>
        </div>
      </div>
    </div>
  );
}