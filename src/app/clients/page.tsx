import Link from "next/link";
import CommonHeader from "@/components/layout/CommonHeader";
import CommonFooter from "@/components/layout/CommonFooter";

export default function ClientsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-primary-950 dark:via-neutral-900 dark:to-accent-950">
      <CommonHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Our Trusted Clients</h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400">Trusted by businesses worldwide</p>
        </div>

        {/* Client Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
          {clientLogos.map((client, index) => (
            <div key={index} className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 dark:from-primary-600 dark:to-accent-600 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-xl">
                  {client.initial}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">{client.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-12 text-center">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-warning-400 dark:text-warning-500">⭐</span>
                  ))}
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900 dark:text-neutral-100">{testimonial.name}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-primary-600 dark:bg-primary-700 rounded-2xl p-12 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">Growing</div>
              <div className="text-primary-100 dark:text-primary-200">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Growing</div>
              <div className="text-primary-100 dark:text-primary-200">Cards Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-primary-100 dark:text-primary-200">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-primary-100 dark:text-primary-200">Support</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Join Our Growing Community</h3>
          <Link href="/register" className="inline-block bg-primary-600 dark:bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 dark:hover:bg-primary-600">
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
  { name: "Rajesh Kumar", role: "Business Owner", initial: "RK", text: "Parichay transformed how I network. Creating and sharing my digital card is so easy!" },
  { name: "Priya Sharma", role: "Marketing Manager", initial: "PS", text: "The analytics feature helps me track engagement. Best investment for my business!" },
  { name: "Amit Patel", role: "Freelancer", initial: "AP", text: "Professional, easy to use, and affordable. Highly recommend to all professionals!" },
];
