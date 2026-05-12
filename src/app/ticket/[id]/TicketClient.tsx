'use client';

import { QRCodeSVG } from 'qrcode.react';
import QRCode from 'qrcode';
import { useRef, useState } from 'react';
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
  const [downloading, setDownloading] = useState(false);
  const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${booking.id}`;  const downloadPDF = async () => {
  setDownloading(true);

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    pdf.setTextColor(212, 175, 55); // Gold
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(28);
    pdf.text("Raduno '26", pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setTextColor(150, 150, 150);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Official E-Ticket', pageWidth / 2, yPosition, { align: 'center' });

    // Divider
    yPosition += 12;
    pdf.setDrawColor(212, 175, 55);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);

    // Attendee name
    yPosition += 15;
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Attendee Name', 20, yPosition);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(18);
    pdf.setTextColor(212, 175, 55);
    yPosition += 12;
    pdf.text(booking.name, 20, yPosition);

    // Details
    yPosition += 18;
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);

    const details = [
      `Booking ID: ${booking.id.slice(0, 16).toUpperCase()}`,
      `Phone: ${booking.phone}`,
      `Gender: ${booking.gender.charAt(0).toUpperCase() + booking.gender.slice(1)}`,
      `Status: ${booking.status === 'confirmed' ? 'Confirmed' : booking.status === 'pending' ? 'Pending' : 'Rejected'}`,
    ];

    details.forEach((detail) => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text(detail, 20, yPosition);
      yPosition += 8;
    });

    // Event details
    yPosition += 10;
    pdf.setDrawColor(212, 175, 55);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 12;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(212, 175, 55);
    pdf.text('Event Details', 20, yPosition);

    yPosition += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    const eventDetails = [
      'Date: 23 May 2026',
      'Time: 4:00 PM Onwards',
      'Venue: Hotel Grand Maas & Banquets (Akshayaam), Negombo - Rooftop',
    ];

    eventDetails.forEach((detail) => {
      pdf.text(detail, 20, yPosition);
      yPosition += 7;
    });    // QR Code – generated from the SVG on the page    yPosition += 15;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(212, 175, 55);
    pdf.text('Scan for Verification', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 10;    try {
      // Generate QR code using qrcode library
      const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      // Add QR code to PDF
      const qrSize = 50; // mm
      const qrX = (pageWidth - qrSize) / 2;
      pdf.addImage(qrDataUrl, 'PNG', qrX, yPosition, qrSize, qrSize);
      yPosition += qrSize + 5;
    } catch (error) {
      console.warn('Could not generate QR code:', error);
      // Fallback: write the verification URL as text
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(verificationUrl, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
    }

    // Footer
    yPosition = Math.max(yPosition + 10, pageHeight - 25);
    pdf.setDrawColor(212, 175, 55);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);

    yPosition += 8;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text("This is an official Raduno '26 E-Ticket", pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 6;
    pdf.text('Please present this at the venue entrance for entry', pageWidth / 2, yPosition, { align: 'center' });

    // Save PDF
    const fileName = `Raduno26_Ticket_${booking.id.slice(0, 8).toUpperCase()}.pdf`;
    pdf.save(fileName);
    setDownloading(false);
  } catch (error) {
    console.error('Error generating PDF:', error);
    setDownloading(false);
    alert('Error: ' + (error instanceof Error ? error.message : String(error)));
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
            disabled={downloading}
            className="btn-primary py-2 px-6 text-sm font-bold flex items-center gap-2 hover:shadow-gold-500/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-white rounded-full animate-spin"></div>
                Generating PDF...
              </>
            ) : (
              <>📥 Download PDF</>
            )}
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
              
            </div>
          </div>          {/* Decorative Divider */}
        

          {/* QR Code Display */}
          <div className="flex flex-col items-center px-8 py-8 space-y-4">
            <p className="text-xs font-bold text-gold-400 uppercase tracking-widest">Scan for Verification</p>
            <div className="bg-white p-5 rounded-2xl shadow-xl border-4 border-gold-400/30 hover:border-gold-400/50 transition-colors">
              <QRCodeSVG value={verificationUrl} size={180} level="H" includeMargin={true} />
            </div>
            <p className="text-xs text-gray-500 italic text-center">Show this QR code at the entrance for verification</p>          </div>{/* Event Details Card */}
          <div className="px-8 py-6 space-y-3 bg-black/30 border-t border-b border-gold-400/20">
            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider mb-4">Event Details</h3>
            <div className="flex flex-col items-start gap-2 text-sm">
              <div>
                <span className="text-gray-400 font-bold">Date</span>
                <p className="text-white font-semibold">23 May 2026</p>
              </div>
              <div>
                <span className="text-gray-400 font-bold">Time</span>
                <p className="text-white font-semibold">4:00 PM Onwards</p>
              </div>
              <div>
                <span className="text-gray-400 font-bold">Venue</span>
                <p className="text-white font-semibold">Hotel Grand Maas & Banquets (Akshayaam), Negombo - Rooftop</p>
              </div>
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
      
      </div>
    </div>
  );
}