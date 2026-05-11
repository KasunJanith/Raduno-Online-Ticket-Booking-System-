import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold text-indigo-600 mb-4">
          Raduno &apos;26
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-2">
          Harischandra National College
        </p>
        <p className="text-lg text-gray-500 mb-8">
          2015 O/L &amp; 2018 A/L Batch Reunion
        </p>
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 inline-block text-left">
          <p className="text-2xl font-semibold text-gray-800 mb-2">
            📅 Saturday, 23rd May 2026
          </p>
          <p className="text-xl text-gray-600">
            📍 Hotel Akshayaam, Negombo (Rooftop)


          </p>
        </div>
        <Link
          href="/book"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-full text-xl transition shadow-lg hover:shadow-xl"
        >
          Book Your Ticket Now
        </Link>
        <p className="mt-6 text-gray-400 text-sm">
          Already booked? You&apos;ll receive your e-ticket immediately.
        </p>
      </div>
    </div>
  );
}