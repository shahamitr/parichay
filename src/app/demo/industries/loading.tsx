export default function DemoIndustriesLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-12 animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded-lg mx-auto mb-4" />
          <div className="h-5 w-96 bg-gray-100 rounded-lg mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
