'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Package, ExternalLink, ShoppingBag } from 'lucide-react';

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
  items: CatalogueItem[];
}

interface WhatsAppCatalogueSectionProps {
  branchId: string;
}

export default function WhatsAppCatalogueSection({ branchId }: WhatsAppCatalogueSectionProps) {
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCatalogue();
  }, [branchId]);

  const fetchCatalogue = async () => {
    try {
      const response = await fetch(`/api/whatsapp-catalogue?branchId=${branchId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.catalogue && data.catalogue.items?.length > 0) {
          setCatalogue(data.catalogue);
        }
      }
    } catch (err) {
      console.error('Failed to fetch WhatsApp catalogue:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateWhatsAppLink = (item: CatalogueItem) => {
    if (!catalogue) return '#';
    const phone = catalogue.phoneNumber.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hi! I'm interested in:\n\n` +
      `*${item.name}*\n` +
      `Price: ${item.currency === 'INR' ? '₹' : item.currency}${item.price.toLocaleString()}\n\n` +
      `Please share more details.`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency;
    return `${symbol}${price.toLocaleString()}`;
  };

  const getAvailabilityLabel = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return { text: 'In Stock', color: 'text-emerald-500 bg-emerald-500/10' };
      case 'out_of_stock':
        return { text: 'Out of Stock', color: 'text-red-500 bg-red-500/10' };
      case 'preorder':
        return { text: 'Pre-order', color: 'text-amber-500 bg-amber-500/10' };
      default:
        return { text: '', color: '' };
    }
  };

  if (loading || !catalogue || catalogue.items.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full mb-4">
            <MessageCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              Order via WhatsApp
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Our Products
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse our products and order directly via WhatsApp
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {catalogue.items.map((item) => {
            const availability = getAvailabilityLabel(item.availability);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="aspect-square bg-gray-100 dark:bg-gray-900 relative">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                  {availability.text && (
                    <span className={`absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full ${availability.color}`}>
                      {availability.text}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-green-600 dark:text-green-500">
                      {formatPrice(item.price, item.currency)}
                    </span>
                  </div>

                  {/* WhatsApp Button */}
                  <a
                    href={generateWhatsAppLink(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                      item.availability === 'out_of_stock'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                    onClick={(e) => item.availability === 'out_of_stock' && e.preventDefault()}
                  >
                    <MessageCircle className="w-5 h-5" />
                    {item.availability === 'out_of_stock' ? 'Out of Stock' : 'Order Now'}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click on any product to order directly via WhatsApp
          </p>
        </div>
      </div>
    </section>
  );
}
