// @ts-nocheck

'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Check } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

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
    const { success, error, info, warning } = useToastHelpers();

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
            colorScheme: { primary: '#000000', secondary: '#333333', accent: '#666666' },
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

    if (loading) return <div>Loading categories...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Industry Categories</h2>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            <div className="grid gap-4">
                {editingId === 'new' && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-blue-200 dark:border-blue-900">
                        <h3 className="text-lg font-medium mb-4">New Category</h3>
                        <CategoryForm form={editForm} setForm={setEditForm} onSave={handleSave} onCancel={() => setEditingId(null)} />
                    </div>
                )}

                {categories.map((category) => (
                    <div key={category.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                        {editingId === category.id ? (
                            <CategoryForm form={editForm} setForm={setEditForm} onSave={handleSave} onCancel={() => setEditingId(null)} />
                        ) : (
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{category.name}</h3>
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${category.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {category.enabled ? 'Active' : 'Disabled'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{category.description}</p>
                                    <div className="flex gap-2 mt-2">
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.colorScheme.primary }} title="Primary" />
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.colorScheme.secondary }} title="Secondary" />
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.colorScheme.accent }} title="Accent" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(category)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(category.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function CategoryForm({ form, setForm, onSave, onCancel }: { form: any, setForm: any, onSave: any, onCancel: any }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input
                        type="text"
                        value={form.name || ''}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug</label>
                    <input
                        type="text"
                        value={form.slug || ''}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                    value={form.description || ''}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Primary Color</label>
                    <input
                        type="color"
                        value={form.colorScheme?.primary || '#000000'}
                        onChange={(e) => setForm({ ...form, colorScheme: { ...form.colorScheme, primary: e.target.value } })}
                        className="mt-1 block w-full h-10 rounded-md border-gray-300"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Secondary Color</label>
                    <input
                        type="color"
                        value={form.colorScheme?.secondary || '#333333'}
                        onChange={(e) => setForm({ ...form, colorScheme: { ...form.colorScheme, secondary: e.target.value } })}
                        className="mt-1 block w-full h-10 rounded-md border-gray-300"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Accent Color</label>
                    <input
                        type="color"
                        value={form.colorScheme?.accent || '#666666'}
                        onChange={(e) => setForm({ ...form, colorScheme: { ...form.colorScheme, accent: e.target.value } })}
                        className="mt-1 block w-full h-10 rounded-md border-gray-300"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="enabled"
                    checked={form.enabled ?? true}
                    onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enabled" className="text-sm font-medium text-gray-700 dark:text-gray-300">Enabled</label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button
                    onClick={onCancel}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                    Cancel
                </button>
                <button
                    onClick={onSave}
                    className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}
