'use client';

import { useState, useEffect } from 'react';
import {
  PartyPopper,
  Calendar,
  Image as ImageIcon,
  Sparkles,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Info,
} from 'lucide-react';
import {
  getFestivalOptions,
  getFestivalById,
  FestivalSettings,
} from '@/lib/festival-themes';

interface FestivalSettingsEditorProps {
  brandId: string;
  onSave?: () => void;
}

import { SectionHeader } from '@/components/ui';

export default function FestivalSettingsEditor({
  brandId,
  onSave,
}: FestivalSettingsEditorProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<FestivalSettings>({
    enabled: false,
    festivalId: '',
    position: 'header',
    showEffects: true,
  });
  const [previewOpen, setPreviewOpen] = useState(false);

  const festivalOptions = getFestivalOptions();
  const selectedFestival = settings.festivalId
    ? getFestivalById(settings.festivalId)
    : null;

  useEffect(() => {
    fetchSettings();
  }, [brandId]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/brands/${brandId}/festival-settings`);
      const data = await response.json();

      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching festival settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/brands/${brandId}/festival-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        onSave?.();
      } else {
        alert(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving festival settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const positions = [
    { value: 'header', label: 'Header Banner', desc: 'Fixed banner at top of page' },
    { value: 'floating', label: 'Floating Badge', desc: 'Floating badge in corner' },
    { value: 'overlay', label: 'Full Overlay', desc: 'Overlay on page load' },
    { value: 'border', label: 'Border Decoration', desc: 'Festive border around page' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-neutral-700" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <SectionHeader
        title="Festival Theming"
        description="Add festive decorations to your microsite"
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-black uppercase tracking-widest rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-primary-500/20"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Theme
          </button>
        }
      />

      {/* Enable Toggle */}
      <div className="bg-neutral-800/50 border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-800 transition-all">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${settings.enabled ? 'bg-green-500/10 text-green-500' : 'bg-neutral-800 text-neutral-500'}`}>
              {settings.enabled ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-white">
                Enable Festival Theme
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Show festive decorations on your microsite
              </p>
            </div>
          </div>
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) =>
                setSettings({ ...settings, enabled: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
          </div>
        </label>
      </div>

      {settings.enabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Festival Selection */}
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest">
              Select Festival
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {festivalOptions.map((festival) => {
                const isSelected = settings.festivalId === festival.value;
                const festivalData = getFestivalById(festival.value);

                return (
                  <button
                    key={festival.value}
                    onClick={() =>
                      setSettings({ ...settings, festivalId: festival.value })
                    }
                    className={`relative p-5 rounded-2xl border-2 transition-all text-left group ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500/5'
                        : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                    }`}
                  >
                    <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">{festival.emoji}</div>
                    <p
                      className={`text-sm font-black uppercase tracking-widest ${
                        isSelected
                          ? 'text-primary-500'
                          : 'text-white'
                      }`}
                    >
                      {festival.label}
                    </p>
                    {festivalData && (
                      <p className="text-[10px] font-bold text-neutral-500 mt-1 uppercase tracking-tighter">
                        {festivalData.dateRange}
                      </p>
                    )}
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Festival Preview */}
          {selectedFestival && (
            <div
              className="rounded-2xl p-6 border-2 overflow-hidden relative"
              style={{
                background: `linear-gradient(135deg, ${selectedFestival.colors.primary}15, ${selectedFestival.colors.secondary}15)`,
                borderColor: selectedFestival.colors.primary + '40',
              }}
            >
              <div className="flex items-start gap-5">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl"
                  style={{ background: selectedFestival.colors.primary + '30' }}
                >
                  {selectedFestival.emoji}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-black uppercase tracking-widest text-white">
                    {selectedFestival.name}
                  </h4>
                  <p className="text-sm text-neutral-300 mt-1 font-medium leading-relaxed">
                    {selectedFestival.greeting}
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedFestival.dateRange}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Position Selection */}
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest">
              Banner Position
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {positions.map((pos) => (
                <button
                  key={pos.value}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      position: pos.value as FestivalSettings['position'],
                    })
                  }
                  className={`p-5 rounded-2xl border-2 text-left transition-all group ${
                    settings.position === pos.value
                      ? 'border-primary-500 bg-primary-500/5'
                      : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                  }`}
                >
                  <p
                    className={`text-sm font-black uppercase tracking-widest ${
                      settings.position === pos.value
                        ? 'text-primary-500'
                        : 'text-white'
                    }`}
                  >
                    {pos.label}
                  </p>
                  <p className="text-xs text-neutral-500 mt-2 font-medium leading-relaxed">
                    {pos.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message & Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                Custom Message (Optional)
              </label>
              <textarea
                value={settings.customMessage || ''}
                onChange={(e) =>
                  setSettings({ ...settings, customMessage: e.target.value })
                }
                placeholder={selectedFestival?.greeting || 'Enter a custom greeting...'}
                rows={3}
                className="w-full px-5 py-4 rounded-2xl border border-neutral-800 bg-neutral-900 text-sm text-white placeholder-neutral-600 focus:ring-2 focus:ring-primary-500/50 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                Custom Banner Image URL (Optional)
              </label>
              <div className="relative group">
                <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="url"
                  value={settings.customBannerUrl || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, customBannerUrl: e.target.value })
                  }
                  placeholder="https://example.com/banner.jpg"
                  className="w-full pl-14 pr-5 py-4 rounded-2xl border border-neutral-800 bg-neutral-900 text-sm text-white placeholder-neutral-600 focus:ring-2 focus:ring-primary-500/50 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Show Effects Toggle */}
          <div className="bg-neutral-800/50 border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-800 transition-all">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${settings.showEffects ? 'bg-amber-500/10 text-amber-500' : 'bg-neutral-800 text-neutral-500'}`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest text-white">
                    Show Particle Effects
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Display animated effects (confetti, snow, sparkles, etc.)
                  </p>
                </div>
              </div>
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  checked={settings.showEffects}
                  onChange={(e) =>
                    setSettings({ ...settings, showEffects: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </div>
            </label>
          </div>
        </motion.div>
      )}
    </div>
  );
}
