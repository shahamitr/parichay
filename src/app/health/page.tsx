export default function HealthCheck() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">✅ Server is Running!</h1>
        <p className="text-lg text-gray-600">Landing page should be working now</p>
        <div className="mt-6">
          <a
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go to Landing Page
          </a>
        </div>
      </div>
    </div>
  );
}