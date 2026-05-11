import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      {/* Poster */}
      <div className="w-full max-w-2xl mb-8">
        <img
          src="//poster.jpg"    // Replace with your actual poster URL
          alt="Raduno '26 Poster"
          className="rounded-2xl shadow-2xl w-full h-auto"
          width={1024}
          height={1024}
        />
      </div>

      {/* Book Now Button */}
      <Link
        href="/book"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-full text-xl transition shadow-lg hover:shadow-xl mb-10 inline-block"
      >
        Book Your Ticket Now
      </Link>

      {/* Organizing Committee Contacts */}
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Organizing Committee
        </h2>
        <div className="space-y-3 text-left text-gray-600">
          <p><span className="font-semibold">Saman Perera</span> – 077 123 4567</p>
          <p><span className="font-semibold">Nimali Fernando</span> – 071 234 5678</p>
          <p><span className="font-semibold">Kamal Silva</span> – 078 345 6789</p>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          For any inquiries, please reach out via WhatsApp or call.
        </p>
      </div>
    </div>
  );
}