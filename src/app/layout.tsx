import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raduno '26 – Ticket Booking",
  description: "Harischandra National College 2015 O/L & 2018 A/L Reunion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        <footer className="text-center text-sm text-gray-500 py-4">
          Raduno &apos;26 – Organized by HNC 2015 O/L &amp; 2018 A/L Batch. <br />
          </footer>
      </body>
    </html>
  );
}