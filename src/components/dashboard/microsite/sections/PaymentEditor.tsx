'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { PaymentSection } from '@/types/microsite';

interface PaymentEditorProps {
  config?: PaymentSection;
  onChange: (data: PaymentSection) => void;
}

export default function PaymentEditor({ config = { enabled: true }, onChange }: PaymentEditorProps) {
  const [uploading, setUploading] = useState(false);

  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const handleBankDetailsChange = (field: string, value: string) => {
    onChange({
      ...config,
      bankDetails: {
        ...config.bankDetails,
        [field]: value,
      },
    });
  };

  const togglePaymentMethod = (method: string) => {
    const currentMethods = config.acceptedMethods || [];
    const newMethods = currentMethods.includes(method)
      ? currentMethods.filter(m => m !== method)
      : [...currentMethods, method];
    handleChange('acceptedMethods', newMethods);
  };

  const handleQRUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'document');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      handleChange('qrCode', data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload QR code');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Payment Section</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Add payment methods and bank details for easy transactions
        </p>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Payment Section</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Show or hide this section on your microsite
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => handleChange('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>

      {config.enabled && (
        <>
          {/* UPI Details */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">UPI Payment</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  UPI ID
                </label>
                <input
                  type="text"
                  value={config.upiId || ''}
                  onChange={(e) => handleChange('upiId', e.target.value)}
                  placeholder="yourname@upi"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  UPI QR Code
                </label>
                {config.qrCode && (
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 mb-2">
                    <img
                      src={config.qrCode}
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleQRUpload(e.target.files[0])}
                  className="hidden"
                  id="qr-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="qr-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload QR Code'}
                </label>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bank Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={config.bankDetails?.accountName || ''}
                  onChange={(e) => handleBankDetailsChange('accountName', e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={config.bankDetails?.accountNumber || ''}
                    onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                    placeholder="1234567890"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={config.bankDetails?.ifscCode || ''}
                    onChange={(e) => handleBankDetailsChange('ifscCode', e.target.value)}
                    placeholder="BANK0001234"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={config.bankDetails?.bankName || ''}
                    onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
                    placeholder="State Bank of India"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={config.bankDetails?.branch || ''}
                    onChange={(e) => handleBankDetailsChange('branch', e.target.value)}
                    placeholder="Main Branch"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Accepted Payment Methods */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Accepted Payment Methods</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['UPI', 'Card', 'Net Banking', 'Cash', 'Cheque', 'Wallet'].map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={config.acceptedMethods?.includes(method) ?? false}
                    onChange={() => togglePaymentMethod(method)}
                    className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Payment Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Always verify bank details before publishing</li>
              <li>Keep your UPI QR code up to date</li>
              <li>Offer multiple payment options for convenience</li>
              <li>Never share sensitive banking passwords</li>
              <li>Consider using payment gateways for online transactions</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
