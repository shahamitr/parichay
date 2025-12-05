import Link from "next/link";

export default function ClientsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">OneTouch BizCard</Link>
            <div className="flex items-center space-x-4">
              <Link href="/features" className="text-gray-700 hover:text-blue-600 px-3 py-2">Features</Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2">Pricing</Link>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2">Sign In</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Trusted Clients</h1>
          <p className="text-xl text-gray-600">Trusted by thousands of businesses worldwide</p>
        </div>

        {/* Client Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
          {clientLogos.map((client, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-xl">
                  {client.initial}
                </div>
                <p className="text-xs text-gray-600 font-semibold">{client.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-blue-600 rounded-2xl p-12 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Cards Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Growing Community</h3>
          <Link href="/register" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700">
            Get Started Today
          </Link>
        </div>
      </main>
    </div>
  );
}

const clientLogos = [
  { name: "Tech Corp", initial: "TC" },
  { name: "Design Studio", initial: "DS" },
  { name: "Marketing Pro", initial: "MP" },
  { name: "Finance Plus", initial: "FP" },
  { name: "Health Care", initial: "HC" },
  { name: "Edu Learn", initial: "EL" },
  { name: "Real Estate", initial: "RE" },
  { name: "Food Hub", initial: "FH" },
  { name: "Fashion Store", initial: "FS" },
  { name: "Auto Works", initial: "AW" },
  { name: "Travel Agency", initial: "TA" },
  { name: "Sports Club", initial: "SC" },
];

const testimonials = [
  { name: "Rajesh Kumar", role: "Business Owner", initial: "RK", text: "OneTouch BizCard transformed how I network. Creating and sharing my digital card is so easy!" },
  { name: "Priya Sharma", role: "Marketing Manager", initial: "PS", text: "The analytics feature helps me track engagement. Best investment for my business!" },
  { name: "Amit Patel", role: "Freelancer", initial: "AP", text: "Professional, easy to use, and affordable. Highly recommend to all professionals!" },
];
