'use client';

import { useEffect, useState } from 'react';
import { getCurrentFestival } from '@/lib/festival-themes';

export default function FestivalEffects() {
  const [festival, setFestival] = useState<any>(null);

  useEffect(() => {
    const currentFestival = getCurrentFestival();
    setFestival(currentFestival);
  }, []);

  if (!festival) return null;

  return (
    <>
      {/* Confetti Effect */}
      {festival.effects.confetti && <ConfettiEffect />}

      {/* Snow Effect */}
      {festival.effects.snow && <SnowEffect />}

      {/* Fireworks Effect */}
      {festival.effects.fireworks && <FireworksEffect />}
    </>
  );
}

function ConfettiEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}%`,
            backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCF7F', '#C44569'][Math.floor(Math.random() * 5)],
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
}

function SnowEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full animate-snow"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 5}s`,
            opacity: 0.8,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes snow {
          to {
            transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }
        .animate-snow {
          animation: snow linear infinite;
        }
      `}</style>
    </div>
  );
}

function FireworksEffect() {
  const [fireworks, setFireworks] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newFirework = {
        x: Math.random() * 100,
        y: 20 + Math.random() * 30,
        id: Date.now(),
      };
      setFireworks((prev) => [...prev, newFirework]);

      // Remove after animation
      setTimeout(() => {
        setFireworks((prev) => prev.filter((fw) => fw.id !== newFirework.id));
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {fireworks.map((fw) => (
        <div
          key={fw.id}
          className="absolute"
          style={{
            left: `${fw.x}%`,
            top: `${fw.y}%`,
          }}
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-firework"
              style={{
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#C44569', '#6BCF7F'][Math.floor(Math.random() * 5)],
                transform: `rotate(${i * 30}deg) translateY(0)`,
                animationDelay: '0s',
              }}
            />
          ))}
        </div>
      ))}
      <style jsx>{`
        @keyframes firework {
          0% {
            transform: translateY(0) scale(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(1);
            opacity: 0;
          }
        }
        .animate-firework {
          animation: firework 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
