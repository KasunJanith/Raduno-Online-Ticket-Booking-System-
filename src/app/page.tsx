import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold-500 to-transparent opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-maroon-600 to-transparent opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center">
        {/* Poster with premium frame */}
        <div className="w-full max-w-2xl mb-12 animate-fade-in">
          <div className="relative group">
            {/* Outer glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold-400 to-maroon-600 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
            
            {/* Inner card */}
            <div className="relative bg-black rounded-3xl overflow-hidden border-4 border-gold-400/50">
              <img
                src="/poster.jpg"
                alt="Raduno '26 Poster"
                className="w-full h-auto"
                width={1024}
                height={1024}
              />
              {/* Overlay text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-gold-300 font-serif text-lg italic">Experience the Celebration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Title */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-6xl md:text-7xl font-serif font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500">
            Raduno &apos;26
          </h1>
          <p className="text-gold-400 italic font-serif text-xl md:text-2xl">
            Celebrating Tradition, Creating Memories
          </p>
        </div>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Join us for an unforgettable celebration of culture, community, and camaraderie. Reserve your place at this prestigious event.
        </p>

        {/* Book Now Button with glow effect */}
        <div className="mb-16 animate-bounce-in" style={{ animationDelay: "0.3s" }}>
          <Link
            href="/book"
            className="btn-primary inline-block text-lg px-10 py-4 font-bold shadow-lg shadow-gold-500/40 hover:shadow-gold-500/60 transform hover:scale-105 duration-300"
          >
            ✨ Book Your Ticket Now
          </Link>
        </div>        {/* Organizing Committee Section */}
        
        <div className="card-premium max-w-lg w-full mb-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          {/* Section Header with line divider */}
          <div className="flex items-center justify-center mb-6 pb-4 border-b border-gold-500/30">
            <h2 className="text-xl md:text-2xl font-bold text-gold-400">
              📞 Questions?
            </h2>
          </div>

          {/* Contact Cards - Simplified */}
          <div className="space-y-3">
            <div className="group p-4 rounded-lg border border-gold-500/20 bg-black/30 backdrop-blur-sm hover:border-gold-500/40 hover:bg-black/50 transition-all duration-300 cursor-pointer">
              <p className="text-gold-400 font-semibold group-hover:text-gold-300 transition-colors">
                Contact the Organizing Committee
              </p>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-4 border-t border-gold-500/20">
            <p className="text-gray-400 text-xs text-center">
              💬 Contact via <span className="text-gold-400 font-semibold">WhatsApp</span> or call
            </p>
          </div>
        </div>

        {/* Event Details Footer */}
        <div className="text-gray-400 text-sm space-y-2 max-w-md animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <h3>📅 <span className="text-gold-400">23 May 2026</span></h3>
          <h3>📍 <span className="text-gold-400">Hotel Akashyaam, Negombo</span></h3>
          <h3>⏰ <span className="text-gold-400">4:00 PM Onwards</span></h3>
        </div>
      </div>
    </div>
  );
}