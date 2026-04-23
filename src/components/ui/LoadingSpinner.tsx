'use client';

export default function LoadingSpinner() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div className="h-full bg-blue-600 animate-pulse" style={{
        background: 'linear-gradient(90deg, transparent, #3B82F6, transparent)',
        animation: 'loading 1.5s ease-in-out infinite'
      }} />
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}