'use client';

import { useState, useEffect } from 'react';
import {
  Video,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  GripVertical,
  X,
  Save,
  Loader2,
  ExternalLink,
  Play,
} from 'lucide-react';

interface VideoTestimonial {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  customerName: string;
  customerTitle?: string;
  customerAvatar?: string;
  duration?: number;
  isPublished: boolean;
  viewCount: number;
  order: number;
}

interface VideoTestimonialsEditorProps {
  branchId: string;
  brandId: string;
}

export default function VideoTestimonialsEditor({
  branchId,
  brandId,
}: VideoTestimonialsEditorProps) {
  const [testimonials, setTestimonials] = useState<VideoTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<VideoTestimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    customerName: '',
    customerTitle: '',
    customerAvatar: '',
    duration: 0,
    isPublished: false,
  });

  useEffect(() => {
    fetchTestimonials();
  }, [branchId]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/video-testimonials?branchId=${branchId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch testimonials');

      const data = await response.json();
      setTestimonials(data.testimonials || []);
    } catch (err) {
      setError('Failed to load video testimonials');
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
      const url = editingItem
        ? `/api/video-testimonials/${editingItem.id}`
        : '/api/video-testimonials';
      const method = editingItem ? 'PUT' : 'POST';

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
          duration: formData.duration || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save testimonial');
      }

      await fetchTestimonials();
      closeModal();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/video-testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete testimonial');

      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete testimonial');
    }
  };

  const togglePublish = async (testimonial: VideoTestimonial) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/video-testimonials/${testimonial.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished: !testimonial.isPublished }),
      });

      if (!response.ok) throw new Error('Failed to update testimonial');

      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === testimonial.id ? { ...t, isPublished: !t.isPublished } : t
        )
      );
    } catch (err) {
      setError('Failed to update testimonial');
    }
  };

  const openModal = (item?: VideoTestimonial) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description || '',
        videoUrl: item.videoUrl,
        thumbnailUrl: item.thumbnailUrl || '',
        customerName: item.customerName,
        customerTitle: item.customerTitle || '',
        customerAvatar: item.customerAvatar || '',
        duration: item.duration || 0,
        isPublished: item.isPublished,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        customerName: '',
        customerTitle: '',
        customerAvatar: '',
        duration: 0,
        isPublished: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setError(null);
  };

  const getVideoThumbnail = (url: string) => {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
    }
    return '/images/video-placeholder.jpg';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        <span className="ml-2 text-gray-400">Loading testimonials...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-amber-500" />
            Video Testimonials
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Add video testimonials from your customers (YouTube, Vimeo, or direct links)
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Testimonials List */}
      {testimonials.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
          <Video className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No video testimonials yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Add your first customer testimonial video
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex items-center gap-4 p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-gray-600 transition-colors"
            >
              {/* Thumbnail */}
              <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                <img
                  src={testimonial.thumbnailUrl || getVideoThumbnail(testimonial.videoUrl)}
                  alt={testimonial.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Play className="w-8 h-8 text-white" />
                </div>
                {testimonial.duration && (
                  <span className="absolute bottom-1 right-1 text-xs bg-black/70 text-white px-1.5 py-0.5 rounded">
                    {Math.floor(testimonial.duration / 60)}:{(testimonial.duration % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white truncate">{testimonial.title}</h4>
                <p className="text-sm text-gray-400">
                  {testimonial.customerName}
                  {testimonial.customerTitle && ` - ${testimonial.customerTitle}`}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>{testimonial.viewCount} views</span>
                  <span className={testimonial.isPublished ? 'text-emerald-500' : 'text-gray-500'}>
                    {testimonial.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePublish(testimonial)}
                  className={`p-2 rounded-lg transition-colors ${
                    testimonial.isPublished
                      ? 'text-emerald-500 hover:bg-emerald-500/10'
                      : 'text-gray-500 hover:bg-gray-700'
                  }`}
                  title={testimonial.isPublished ? 'Unpublish' : 'Publish'}
                >
                  {testimonial.isPublished ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={testimonial.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  title="Open video"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => openModal(testimonial)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">
                {editingItem ? 'Edit' : 'Add'} Video Testimonial
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Video URL *
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports YouTube, Vimeo, or direct video URLs
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Great experience with..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Customer Title/Role
                </label>
                <input
                  type="text"
                  value={formData.customerTitle}
                  onChange={(e) => setFormData({ ...formData, customerTitle: e.target.value })}
                  placeholder="CEO at Company"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://... (auto-generated for YouTube)"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  placeholder="120"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="isPublished" className="text-sm text-gray-300">
                  Publish immediately
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
                      {editingItem ? 'Update' : 'Add'} Testimonial
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
