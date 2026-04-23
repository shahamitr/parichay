'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Upload,
  Play,
  Pause,
  Trash2,
  Save,
  Loader2,
  Volume2,
  FileAudio,
  Clock,
} from 'lucide-react';

interface VoiceIntro {
  id: string;
  audioUrl: string;
  duration: number;
  transcript?: string;
  isActive: boolean;
  playCount: number;
}

interface VoiceIntroEditorProps {
  branchId: string;
}

export default function VoiceIntroEditor({ branchId }: VoiceIntroEditorProps) {
  const [voiceIntro, setVoiceIntro] = useState<VoiceIntro | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [formData, setFormData] = useState({
    audioUrl: '',
    duration: 0,
    transcript: '',
    isActive: true,
  });

  useEffect(() => {
    fetchVoiceIntro();
  }, [branchId]);

  const fetchVoiceIntro = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/voice-intro?branchId=${branchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch voice intro');

      const data = await response.json();
      if (data.voiceIntro) {
        setVoiceIntro(data.voiceIntro);
        setFormData({
          audioUrl: data.voiceIntro.audioUrl,
          duration: data.voiceIntro.duration,
          transcript: data.voiceIntro.transcript || '',
          isActive: data.voiceIntro.isActive,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload an audio file (MP3, WAV, OGG, or WebM)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Audio file must be less than 10MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('type', 'voice'); // Use 'voice' asset type
      uploadFormData.append('branchId', branchId); // Store in microsite folder

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadFormData,
      });

      if (!response.ok) throw new Error('Failed to upload audio');

      const data = await response.json();

      // Get audio duration
      const audio = new Audio(data.url);
      audio.addEventListener('loadedmetadata', () => {
        setFormData((prev) => ({
          ...prev,
          audioUrl: data.url,
          duration: Math.round(audio.duration),
        }));
      });
    } catch (err: any) {
      setError(err.message || 'Failed to upload audio');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.audioUrl) {
      setError('Please upload an audio file first');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/voice-intro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          branchId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save voice intro');
      }

      const data = await response.json();
      setVoiceIntro(data.voiceIntro);
      setSuccess('Voice intro saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!voiceIntro) return;
    if (!confirm('Are you sure you want to delete the voice intro?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/voice-intro/${voiceIntro.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete voice intro');

      setVoiceIntro(null);
      setFormData({
        audioUrl: '',
        duration: 0,
        transcript: '',
        isActive: true,
      });
      setSuccess('Voice intro deleted');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        <span className="ml-2 text-gray-400">Loading voice intro...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Mic className="w-5 h-5 text-amber-500" />
          Voice Introduction
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Add an audio introduction that plays when visitors view your microsite
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
          {success}
        </div>
      )}

      {/* Audio Upload / Player */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        {formData.audioUrl ? (
          <div className="space-y-4">
            {/* Audio Player */}
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlayback}
                className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 text-gray-900 flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileAudio className="w-5 h-5 text-gray-400" />
                  <span className="text-white font-medium">Voice Introduction</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all"
                    style={{
                      width: `${formData.duration ? (currentTime / formData.duration) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(formData.duration)}</span>
                </div>
              </div>

              <audio
                ref={audioRef}
                src={formData.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
              />
            </div>

            {/* Stats */}
            {voiceIntro && (
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Volume2 className="w-4 h-4" />
                  <span>{voiceIntro.playCount} plays</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(formData.duration)}</span>
                </div>
              </div>
            )}

            {/* Replace Audio */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Replace Audio
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {voiceIntro && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Mic className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">No voice introduction uploaded</p>
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-lg font-medium cursor-pointer transition-colors">
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Audio File
                </>
              )}
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <p className="text-xs text-gray-500 mt-3">
              Supported formats: MP3, WAV, OGG, WebM (max 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Transcript */}
      {formData.audioUrl && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Transcript (Optional)
          </label>
          <textarea
            value={formData.transcript}
            onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
            placeholder="Add a transcript for accessibility..."
            rows={4}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            The transcript helps with accessibility and can be shown to visitors
          </p>
        </div>
      )}

      {/* Active Toggle */}
      {formData.audioUrl && (
        <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <div>
            <p className="text-white font-medium">Enable Voice Introduction</p>
            <p className="text-sm text-gray-400">
              Show audio player on your microsite
            </p>
          </div>
          <button
            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              formData.isActive ? 'bg-amber-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                formData.isActive ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      )}

      {/* Save Button */}
      {formData.audioUrl && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-lg font-medium disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Voice Intro
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
