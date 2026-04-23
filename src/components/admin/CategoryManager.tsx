'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, FolderOpen, Search } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  enabled: boolean;
  features: string[];
  benefits: string[];
  useCases: string[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Category>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditForm(category);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingId('new');
    setEditForm({
      name: '',
      slug: '',
      description: '',
      icon: 'briefcase',
      enabled: true,
      features: [],
      benefits: [],
      useCases: [],
      colorScheme: { primary: '#f59e0b', secondary: '#ea580c', accent: '#10b981' },
    });
    setIsCreating(true);
  };

  const handleSave = async () => {
    try {
      const url = isCreating ? '/api/categories' : `/api/categories/${editingId}`;
      const method = isCreating ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(isCreating ? 'Category created' : 'Category updated');
        setEditingId(null);
        fetchCategories();
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Category deleted');
        fetchCategories();
      } else {
        toast.error(data.error || 'Delete failed');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-800/50 rounded-xl p-4 animate-pulse">
            <div className="h-5 bg-gray-700 rounded w-1/4 mb-2" />
            <div className="h-4 bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Industry Categories</h3>
          <p className="text-sm text-gray-400">Manage categories for brands and microsites</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-black font-medium rounded-xl hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
        />
      </div>

      {/* New Category Form */}
      <AnimatePresence>
        {editingId === 'new' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <h4 className="font-medium text-amber-400 mb-4">New Category</h4>
              <CategoryForm form={editForm} setForm={setEditForm} onSave={handleSave} onCancel={() => setEditingId(null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredCategories.length === 0 && !loading && (
        <div className="text-center py-12">
          <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white mb-2">
            {searchQuery ? 'No categories found' : 'No categories yet'}
          </h4>
          <p className="text-gray-400 text-sm">
            {searchQuery ? 'Try adjusting your search' : 'Create your first category to get started'}
          </p>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gray-800/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
            >
              {editingId === category.id ? (
                <CategoryForm form={editForm} setForm={setEditForm} onSave={handleSave} onCancel={() => setEditingId(null)} />
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-white truncate">{category.name}</h4>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          category.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        {category.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{category.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex gap-1.5">
                        <div
                          className="w-5 h-5 rounded-md border border-gray-700"
                          style={{ backgroundColor: category.colorScheme.primary }}
                          title="Primary"
                        />
                        <div
                          className="w-5 h-5 rounded-md border border-gray-700"
                          style={{ backgroundColor: category.colorScheme.secondary }}
                          title="Secondary"
                        />
                        <div
                          className="w-5 h-5 rounded-md border border-gray-700"
                          style={{ backgroundColor: category.colorScheme.accent }}
                          title="Accent"
                        />
                      </div>
                      <span className="text-xs text-gray-500">/{category.slug}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CategoryForm({
  form,
  setForm,
  onSave,
  onCancel,
}: {
  form: Partial<Category>;
  setForm: (form: Partial<Category>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
          <input
            type="text"
            value={form.name || ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            placeholder="Category name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Slug</label>
          <input
            type="text"
            value={form.slug || ''}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            placeholder="category-slug"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
        <textarea
          value={form.description || ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none"
          placeholder="Brief description of the category"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Primary</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.colorScheme?.primary || '#f59e0b'}
              onChange={(e) => setForm({ ...form, colorScheme: { ...form.colorScheme!, primary: e.target.value } })}
              className="w-10 h-10 rounded-lg border border-gray-700 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={form.colorScheme?.primary || '#f59e0b'}
              onChange={(e) => setForm({ ...form, colorScheme: { ...form.colorScheme!, primary: e.target.value } })}
              className="flex-1 bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Secondary</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.colorScheme?.secondary || '#ea580c'}
              onChange={(e) => setForm({ ...form, colorScheme: { ...form.colorScheme!, secondary: e.target.value } })}
              className="w-10 h-10 rounded-lg border border-gray-700 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={form.colorScheme?.secondary || '#ea580c'}
              onChange={(e) => setForm({ ...form, colorScheme: { ...form.colorScheme!, secondary: e.target.value } })}
              className="flex-1 bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Accent</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.colorScheme?.accent || '#10b981'}
              onChange={(e) => setForm({ ...form, colorScheme: { ...form.colorScheme!, accent: e.target.value } })}
              className="w-10 h-10 rounded-lg border border-gray-700 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={form.colorScheme?.accent || '#10b981'}
              onChange={(e) => setForm({ ...form, colorScheme: { ...form.colorScheme!, accent: e.target.value } })}
              className="flex-1 bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setForm({ ...form, enabled: !form.enabled })}
          className={`relative w-12 h-6 rounded-full transition-colors ${form.enabled ? 'bg-amber-500' : 'bg-gray-700'}`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              form.enabled ? 'left-7' : 'left-1'
            }`}
          />
        </button>
        <span className="text-sm text-gray-400">{form.enabled ? 'Enabled' : 'Disabled'}</span>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm font-medium text-black bg-amber-500 rounded-xl hover:bg-amber-400 transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
