'use client';

import { useState, useEffect } from 'react';
import {
  MessageCircle,
  Plus,
  Trash2,
  Edit2,
  X,
  Save,
  Loader2,
  Copy,
  ExternalLink,
  Package,
  Phone,
  Check,
  Image as ImageIcon,
} from 'lucide-react';

interface CatalogueItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  availability: 'in_stock' | 'out_of_stock' | 'preorder';
}

interface Catalogue {
  id: string;
  phoneNumber: string;
  businessName: string;
  itemCount: number;
  items: CatalogueItem[];
}

interface WhatsAppCatalogueEditorProps {
  branchId: string;
}

export default function WhatsAppCatalogueEditor({ branchId }: WhatsAppCatalogueEditorProps) {
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogueItem | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const [setupData, setSetupData] = useState({
    phoneNumber: '',
    businessName: '',
  });

  const [itemFormData, setItemFormData] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'INR',
    imageUrl: '',
    availability: 'in_stock' as const,
  });

  useEffect(() => {
    fetchCatalogue();
  }, [branchId]);

  const fetchCatalogue = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/whatsapp-catalogue?branchId=${branchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch catalogue');

      const data = await response.json();
      if (data.catalogue) {
        setCatalogue(data.catalogue);
      } else {
        setIsSetupMode(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/whatsapp-catalogue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...setupData,
          branchId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create catalogue');
      }

      const data = await response.json();
      setCatalogue(data.catalogue);
      setIsSetupMode(false);
      setSuccess('WhatsApp Catalogue created successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catalogue) return;

    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const url = editingItem
        ? `/api/whatsapp-catalogue/items/${editingItem.id}`
        : `/api/whatsapp-catalogue/${catalogue.id}/items`;
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(itemFormData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save item');
      }

      await fetchCatalogue();
      closeItemModal();
      setSuccess(editingItem ? 'Item updated' : 'Item added');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/whatsapp-catalogue/items/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete item');

      await fetchCatalogue();
      setSuccess('Item deleted');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteCatalogue = async () => {
    if (!catalogue) return;
    if (!confirm('Are you sure you want to delete the entire catalogue? All items will be removed.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/whatsapp-catalogue/${catalogue.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete catalogue');

      setCatalogue(null);
      setIsSetupMode(true);
      setSetupData({ phoneNumber: '', businessName: '' });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openItemModal = (item?: CatalogueItem) => {
    if (item) {
      setEditingItem(item);
      setItemFormData({
        name: item.name,
        description: item.description || '',
        price: item.price,
        currency: item.currency,
        imageUrl: item.imageUrl || '',
        availability: item.availability,
      });
    } else {
      setEditingItem(null);
      setItemFormData({
        name: '',
        description: '',
        price: 0,
        currency: 'INR',
        imageUrl: '',
        availability: 'in_stock',
      });
    }
    setIsItemModalOpen(true);
  };

  const closeItemModal = () => {
    setIsItemModalOpen(false);
    setEditingItem(null);
    setError(null);
  };

  const generateWhatsAppLink = (item: CatalogueItem) => {
    if (!catalogue) return '';
    const phone = catalogue.phoneNumber.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hi! I'm interested in:\n\n` +
      `*${item.name}*\n` +
      `Price: ${item.currency === 'INR' ? '₹' : item.currency}${item.price.toLocaleString()}\n\n` +
      `Please share more details.`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  const copyLink = async (item: CatalogueItem) => {
    const link = generateWhatsAppLink(item);
    await navigator.clipboard.writeText(link);
    setCopiedLink(item.id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">In Stock</span>;
      case 'out_of_stock':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Out of Stock</span>;
      case 'preorder':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Pre-order</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        <span className="ml-2 text-gray-400">Loading catalogue...</span>
      </div>
    );
  }

  // Setup Mode
  if (isSetupMode && !catalogue) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-500" />
            WhatsApp Product Catalogue
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Create a product catalogue that customers can browse and order via WhatsApp
          </p>
        </div>

        <form onSubmit={handleSetup} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              WhatsApp Business Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="tel"
                value={setupData.phoneNumber}
                onChange={(e) => setSetupData({ ...setupData, phoneNumber: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Include country code (e.g., +91 for India)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              value={setupData.businessName}
              onChange={(e) => setSetupData({ ...setupData, businessName: e.target.value })}
              placeholder="Your Business Name"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5" />
                Create WhatsApp Catalogue
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-500" />
            WhatsApp Product Catalogue
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {catalogue?.businessName} • {catalogue?.phoneNumber}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openItemModal()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
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

      {/* Products Grid */}
      {catalogue?.items && catalogue.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {catalogue.items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-colors"
            >
              {/* Image */}
              <div className="h-40 bg-gray-900 flex items-center justify-center">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-12 h-12 text-gray-700" />
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-white">{item.name}</h4>
                  {getAvailabilityBadge(item.availability)}
                </div>
                {item.description && (
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <p className="text-lg font-semibold text-amber-500">
                  {item.currency === 'INR' ? '₹' : item.currency}
                  {item.price.toLocaleString()}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => copyLink(item)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      copiedLink === item.id
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {copiedLink === item.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                  <a
                    href={generateWhatsAppLink(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    title="Open in WhatsApp"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => openItemModal(item)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
          <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No products in catalogue</p>
          <p className="text-sm text-gray-500 mt-1">
            Add products that customers can order via WhatsApp
          </p>
        </div>
      )}

      {/* Delete Catalogue Option */}
      {catalogue && (
        <div className="pt-4 border-t border-gray-800">
          <button
            onClick={handleDeleteCatalogue}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Delete entire catalogue
          </button>
        </div>
      )}

      {/* Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">
                {editingItem ? 'Edit' : 'Add'} Product
              </h3>
              <button
                onClick={closeItemModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={itemFormData.name}
                  onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                  placeholder="Product name"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price *
                </label>
                <div className="flex gap-2">
                  <select
                    value={itemFormData.currency}
                    onChange={(e) => setItemFormData({ ...itemFormData, currency: e.target.value })}
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                    <option value="GBP">£ GBP</option>
                  </select>
                  <input
                    type="number"
                    value={itemFormData.price || ''}
                    onChange={(e) => setItemFormData({ ...itemFormData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Availability
                </label>
                <select
                  value={itemFormData.availability}
                  onChange={(e) => setItemFormData({ ...itemFormData, availability: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="preorder">Pre-order</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={itemFormData.imageUrl}
                  onChange={(e) => setItemFormData({ ...itemFormData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={itemFormData.description}
                  onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                  placeholder="Product description..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeItemModal}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingItem ? 'Update' : 'Add'} Product
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
