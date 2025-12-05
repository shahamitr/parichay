'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, FileText } from 'lucide-react';
import { VoiceIntroConfig } from '@/types/microsite';

interface VoiceIntroProps {
  config: VoiceIntroConfig;
  branchId: string;
  brandId: string;
}

export default function VoiceIntro({ config, branchId, brandId }: VoiceIntroProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (config.autoPlay && config.audioUrl && hasInteracted) {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  }, [config.autoPlay, config.audioUrl, hasInteracted]);

  useEffect(() => {
    // Listen for first user interaction to enable autoplay
    const handleInteraction = () => {
      setHasInteracted(true);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  if (!config.enabled || !config.audioUrl) return null;

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying != null) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        // Track play
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'CLICK',
            branchId,
            brandId,
            metadata: { action: 'voice_intro_play' },
          }),
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-24 right-4 z-40">
      <audio
        ref={audioRef}
        src={config.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden w-72">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            <span className="font-medium">Voice Introduction</span>
          </div>
        </div>

        {/* Player */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            <div className="flex-1">
              {/* Progress Bar */}
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full bg-blue-600 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}
                </span>
                <span>
                  {config.duration ? formatTime(config.duration) : '--:--'}
                </span>
              </div>
            </div>

            <button
              onClick={toggleMute}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Transcript Toggle */}
          {config.showTranscript && config.transcript && (
            <div>
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <FileText className="w-4 h-4" />
                <span>{showTranscript ? 'Hide' : 'Show'} Transcript</span>
              </button>

              {showTranscript && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 max-h-32 overflow-y-auto">
                  {config.transcript}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
