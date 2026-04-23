'use client';

import { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  X,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  Star,
  Trophy,
  BadgeCheck,
  Crown,
  Sparkles,
  ThumbsUp,
  Zap,
  Heart,
  Clock,
} from 'lucide-react';

interface SocialProofBadge {
  id: string;
  type: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  displayOrder: number;
  expiresAt?: string;
}

interface SocialProofBadgesEditorProps {
  branchId: string;
  brandId: string;
}

const BADGE_TYPES = [
  { value: 'TOP_SELLER', label: 'Top Seller', icon: Trophy, color: '#f59e0b' },
  { value: 'VERIFIED', label: 'Verified', icon: BadgeCheck, color: '#3b82f6' },
  { value: 'TRUSTED', label: 'Trusted', icon: Shield, color: '#10b981' },
  { value: 'AWARD_WINNER', label: 'Award Winner', icon: Award, color: '#8b5cf6' },
  { value: 'CERTIFIED', label: 'Certified', icon: BadgeCheck, color: '#06b6d4' },
  { value: 'YEARS_IN_BUSINESS', label: 'Years in Business', icon: Clock, color: '#6366f1' },
  { value: 'CUSTOMER_FAVORITE', label: 'Customer Favorite', icon: Heart, color: '#ec4899' },
  { value: 'BEST_RATED', label: 'Best Rated', icon: Star, color: '#eab308' },
  { value: 'FEATURED', label: 'Featured', icon: Sparkles, color: '#f97316' },
  { value: 'PREMIUM', label: 'Premium', icon: Crown, color: '#a855f7' },
];

const ICON_OPTIONS = [
  { value: 'shield', label: 'Shield', icon: Shield },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'trophy', label: 'Trophy', icon: Trophy },
  { value: 'badge', label: 'Badge', icon: BadgeCheck },
  { value: 'crown', label: 'Crown', icon: Crown },
  { value: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'thumbsup', label: 'Thumbs Up', icon: ThumbsUp },
  { value: 'zap', label: 'Zap', icon: Zap },
  { value: 'heart', label: 'Heart', icon: Heart },
  { value: 'award', label: 'Award', icon: Award },
];

const COLOR_OPTIONS = [
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f97316', // orange
  '#06b6d4', // cyan
  '#6366f1', // indigo
  '#eab308', // yellow
  '#a855f7', // purple
];

export default function SocialProofBadgesEditor({
  branchId,
  brandId,
}: SocialProofBadgesEditorProps) {
  const [badges, setBadges] = useState<SocialProofBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<SocialProofBadge | null>(null);

  const [formData, setFormData] = useState({
    type: 'VERIFIED',
    title: '',
    description: '',
    icon: 'badge',
    color: '#3b82f6',
    isActive: true,
    expiresAt: '',
  });

  useEffect(() => {
    fetchBadges();
  }, [branchId]);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/social-proof-badges?branchId=${branchId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch badges');

      const data = await response.json();
      setBadges(data.badges || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const url = editingBadge
        ? `/api/social-proof-badges/${editingBadge.id}`
        : '/api/social-proof-badges';
      const method = editingBadge ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          branchId,
          brandId,
          expiresAt: formData.expiresAt || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save badge');
      }

      await fetchBadges();
      closeModal();
      setSuccess(editingBadge ? 'Badge updated' : 'Badge added');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this badge?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/social-proof-badges/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete badge');

      setBadges((prev) => prev.filter((b) => b.id !== id));
      setSuccess('Badge deleted');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleActive = async (badge: SocialProofBadge) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/social-proof-badges/${badge.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !badge.isActive }),
      });

      if (!response.ok) throw new Error('Failed to update badge');

      setBadges((prev) =>
        prev.map((b) =>
          b.id === badge.id ? { ...b, isActive: !b.isActive } : b
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openModal = (badge?: SocialProofBadge) => {
    if (badge) {
      setEditingBadge(badge);
      setFormData({
        type: badge.type,
        title: badge.title,
        description: badge.description || '',
        icon: badge.icon || 'badge',
        color: badge.color || '#3b82f6',
        isActive: badge.isActive,
        expiresAt: badge.expiresAt ? badge.expiresAt.split('T')[0] : '',
      });
    } else {
      setEditingBadge(null);
      const defaultType = BADGE_TYPES[1]; // VERIFIED
      setFormData({
        type: defaultType.value,
        title: defaultType.label,
        description: '',
        icon: 'badge',
        color: defaultType.color,
        isActive: true,
        expiresAt: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBadge(null);
    setError(null);
  };

  const handleTypeChange = (type: string) => {
    const badgeType = BADGE_TYPES.find((t) => t.value === type);
    if (badgeType) {
      setFormData({
        ...formData,
        type,
        title: badgeType.label,
        color: badgeType.color,
      });
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = ICON_OPTIONS.find((i) => i.value === iconName);
    return iconOption ? iconOption.icon : BadgeCheck;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        <span className="ml-2 text-gray-400">Loading badges...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Social Proof Badges
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Add trust badges to build credibility with visitors
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Badge
        </button>
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

      {/* Badges List */}
      {badges.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
          <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No badges added yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Add badges like "Verified", "Top Seller", or "Award Winner"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map((badge) => {
            const IconComponent = getIconComponent(badge.icon || 'badge');
            return (
              <div
                key={badge.id}
                className={`flex items-center gap-4 p-4 bg-gray-800/50 border rounded-xl transition-colors ${
                  badge.isActive ? 'border-gray-700' : 'border-gray-800 opacity-60'
                }`}
              >
                {/* Badge Preview */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${badge.color}20` }}
                >
                  <IconComponent
                    className="w-7 h-7"
                    style={{ color: badge.color }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white">{badge.title}</h4>
                  {badge.description && (
                    <p className="text-sm text-gray-400 truncate">
                      {badge.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${badge.color}20`,
                        color: badge.color,
                      }}
                    >
                      {BADGE_TYPES.find((t) => t.value === badge.type)?.label || badge.type}
                    </span>
                    {badge.expiresAt && (
                      <span className="text-xs text-gray-500">
                        Expires: {new Date(badge.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleActive(badge)}
                    className={`p-2 rounded-lg transition-colors ${
                      badge.isActive
                        ? 'text-emerald-500 hover:bg-emerald-500/10'
                        : 'text-gray-500 hover:bg-gray-700'
                    }`}
                    title={badge.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {badge.isActive ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => openModal(badge)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(badge.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">
                {editingBadge ? 'Edit' : 'Add'} Badge
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Badge Preview */}
              <div className="flex items-center justify-center p-6 bg-gray-800/50 rounded-xl">
                <div
                  className="flex items-center gap-3 px-4 py-2 rounded-full"
                  style={{ backgroundColor: `${formData.color}20` }}
                >
                  {(() => {
                    const IconComp = getIconComponent(formData.icon);
                    return (
                      <IconComp
                        className="w-5 h-5"
                        style={{ color: formData.color }}
                      />
                    );
                  })()}
                  <span
                    className="font-medium"
                    style={{ color: formData.color }}
                  >
                    {formData.title || 'Badge Title'}
                  </span>
                </div>
              </div>

              {/* Badge Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Badge Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BADGE_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleTypeChange(type.value)}
                      className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                        formData.type === type.value
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <type.icon
                        className="w-4 h-4"
                        style={{ color: type.color }}
                      />
                      <span className="text-sm text-white">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Badge title"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: icon.value })}
                      className={`p-3 rounded-lg border transition-colors ${
                        formData.icon === icon.value
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      title={icon.label}
                    >
                      <icon.icon
                        className="w-5 h-5"
                        style={{ color: formData.color }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        formData.color === color ? 'ring-2 ring-white scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Expiration Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty for badges that don't expire
                </p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-300">
                  Show badge on microsite
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-lg font-medium disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingBadge ? 'Update' : 'Add'} Badge
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
