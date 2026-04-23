'use client';

import { useEffect, useState } from 'react';
import { Festival, FestivalSettings, getFestivalById, isBrandFestivalActive } from '@/lib/festival-themes';

interface FestivalEffectsProps {
  settings: FestivalSettings | null;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  speed: number;
  type: string;
}

export default function FestivalEffects({ settings }: FestivalEffectsProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [festival, setFestival] = useState<Festival | null>(null);

  useEffect(() => {
    if (settings?.festivalId) {
      const f = getFestivalById(settings.festivalId);
      setFestival(f);
    }
  }, [settings?.festivalId]);

  useEffect(() => {
    if (!settings?.showEffects || !festival || !isBrandFestivalActive(settings)) {
      setParticles([]);
      return;
    }

    const effects = festival.effects;
    if (!effects.confetti && !effects.snow && !effects.sparkles && !effects.fireworks) {
      return;
    }

    // Generate initial particles
    const newParticles: Particle[] = [];
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      newParticles.push(createParticle(i, festival));
    }

    setParticles(newParticles);

    // Animation loop
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => {
          let newY = p.y + p.speed;
          let newX = p.x;
          let newRotation = p.rotation + 2;

          // Add some horizontal drift for snow/confetti
          if (effects.snow || effects.confetti) {
            newX += Math.sin(Date.now() / 1000 + p.id) * 0.5;
          }

          // Reset particle when it goes off screen
          if (newY > 100) {
            return createParticle(p.id, festival);
          }

          return {
            ...p,
            x: newX,
            y: newY,
            rotation: newRotation,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [settings, festival]);

  if (!settings?.showEffects || !festival || !isBrandFestivalActive(settings) || particles.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute transition-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `rotate(${particle.rotation}deg)`,
            fontSize: `${particle.size}px`,
            opacity: 0.8,
          }}
        >
          {particle.type === 'snow' && (
            <span style={{ color: '#fff', textShadow: '0 0 3px rgba(255,255,255,0.5)' }}>
              ❄
            </span>
          )}
          {particle.type === 'confetti' && (
            <span
              style={{
                display: 'inline-block',
                width: particle.size,
                height: particle.size * 0.6,
                backgroundColor: particle.color,
                borderRadius: '2px',
              }}
            />
          )}
          {particle.type === 'sparkle' && (
            <span style={{ color: particle.color }}>✨</span>
          )}
          {particle.type === 'firework' && (
            <span style={{ color: particle.color }}>✦</span>
          )}
        </div>
      ))}
    </div>
  );
}

function createParticle(id: number, festival: Festival): Particle {
  const effects = festival.effects;
  let type = 'confetti';
  let color = festival.colors.primary;

  if (effects.snow) {
    type = 'snow';
    color = '#FFFFFF';
  } else if (effects.sparkles) {
    type = 'sparkle';
    color = ['#FFD700', '#FFA500', '#FF69B4', '#00CED1'][Math.floor(Math.random() * 4)];
  } else if (effects.fireworks) {
    type = 'firework';
    color = [festival.colors.primary, festival.colors.secondary, festival.colors.accent][
      Math.floor(Math.random() * 3)
    ];
  } else if (effects.confetti) {
    type = 'confetti';
    color = [
      festival.colors.primary,
      festival.colors.secondary,
      festival.colors.accent,
      '#FF1493',
      '#00CED1',
      '#FFD700',
    ][Math.floor(Math.random() * 6)];
  }

  return {
    id,
    x: Math.random() * 100,
    y: Math.random() * -20, // Start above the viewport
    size: 8 + Math.random() * 12,
    color,
    rotation: Math.random() * 360,
    speed: 0.3 + Math.random() * 0.5,
    type,
  };
}
