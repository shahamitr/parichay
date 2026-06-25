'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const POINTS = [
  { x: 200, y: 150, delay: 0.1 },
  { x: 450, y: 100, delay: 0.5 },
  { x: 600, y: 200, delay: 0.8 },
  { x: 300, y: 350, delay: 1.2 },
  { x: 750, y: 300, delay: 1.5 },
  { x: 150, y: 400, delay: 1.8 },
  { x: 500, y: 450, delay: 2.1 },
  { x: 850, y: 150, delay: 2.4 },
  { x: 400, y: 250, delay: 2.7 },
  { x: 700, y: 400, delay: 3.0 },
];

const CONNECTIONS = [
  [0, 8], [8, 1], [1, 7], [8, 3], [3, 5], [3, 6], [6, 9], [6, 4], [9, 2], [2, 7]
];

export default function WorldNetworkMap() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-full aspect-[2/1]" />;

  return (
    <div className="relative w-full aspect-[2/1] max-w-5xl mx-auto overflow-hidden">
      <svg viewBox="0 0 1000 500" className="w-full h-full opacity-40">
        {/* Connection Lines */}
        {CONNECTIONS.map(([start, end], i) => {
          const startPt = POINTS[start];
          const endPt = POINTS[end];
          return (
            <motion.line
              key={`line-${i}`}
              x1={startPt.x}
              y1={startPt.y}
              x2={endPt.x}
              y2={endPt.y}
              stroke="url(#lineGradient)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ 
                duration: 2, 
                delay: Math.max(startPt.delay, endPt.delay) + 0.5,
                ease: "easeInOut"
              }}
            />
          );
        })}

        {/* Nodes */}
        {POINTS.map((point, i) => (
          <g key={`node-${i}`}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#6366f1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: point.delay, duration: 0.5 }}
            />
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="12"
              fill="rgba(99, 102, 241, 0.2)"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ 
                repeat: Infinity, 
                duration: 3, 
                delay: point.delay 
              }}
            />
          </g>
        ))}

        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center Highlight */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full animate-pulse" />
      </div>
    </div>
  );
}
