'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Copy, Check, CreditCard, Building2 } from 'lucide-react';

interface PaymentSectionProps {
  config: {
    enabled: boolean;
    upiId?: string;
    qrCode?: string;
    bankDetails?: {
      accountName?: string;
      accountNumber?: string;
      ifscCode?: string;
      bankName?: string;
      branch?: string;
    };
    acceptedMethods?: string[];
  };
  brand?: any;
}

export default function PaymentSection({ config, brand }: PaymentSectionProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const hasPaymentMethods = config?.upiId || config?.bankDetails || (config?.acceptedMethods && config.acceptedMethods.length > 0);

  // Show blank state if no payment methods configured
  if (!hasPaymentMethods) {
    return (
      <section className="relative min-h-full bg-white overflow-hidden flex items-center border-b border-gray-200">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative z-10 w-full">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4 shadow-lg">
            <CreditCard className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-h2 font-bold text-gray-900 mb-3">
            Payment Options
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-8"></div>
          <p className="text-body text-gray-600 leading-relaxed">
            Payment options will be available soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-full bg-white overflow-hidden border-b border-gray-200">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-100 rounded-full opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4 shadow-lg">
            <CreditCard className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-h2 font-bold text-gray-900 mb-3">
            Payment Options
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* UPI Payment */}
          {config.upiId && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-h3 font-bold text-gray-900">UPI Payment</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-small text-gray-600 mb-1 block leading-normal">UPI ID</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={config.upiId}
                      readOnly
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(config.upiId!, 'upi')}
                      className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      {copiedField === 'upi' ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {config.qrCode && (
                  <div className="text-center">
                    <p className="text-small text-gray-600 mb-3 leading-normal">Scan QR Code to Pay</p>
                    <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                      <Image
                        src={config.qrCode}
                        alt="Payment QR Code"
                        width={200}
                        height={200}
                        className="mx-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bank Details */}
          {config.bankDetails && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-h3 font-bold text-gray-900">Bank Transfer</h3>
              </div>

              <div className="space-y-3">
                {config.bankDetails.accountName && (
                  <div>
                    <label className="text-small text-gray-600 block mb-1 leading-normal">Account Name</label>
                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                      {config.bankDetails.accountName}
                    </div>
                  </div>
                )}

                {config.bankDetails.accountNumber && (
                  <div>
                    <label className="text-small text-gray-600 block mb-1 leading-normal">Account Number</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={config.bankDetails.accountNumber}
                        readOnly
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(config.bankDetails!.accountNumber!, 'account')}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {copiedField === 'account' ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {config.bankDetails.ifscCode && (
                  <div>
                    <label className="text-small text-gray-600 block mb-1 leading-normal">IFSC Code</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={config.bankDetails.ifscCode}
                        readOnly
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(config.bankDetails!.ifscCode!, 'ifsc')}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {copiedField === 'ifsc' ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {config.bankDetails.bankName && (
                  <div>
                    <label className="text-small text-gray-600 block mb-1 leading-normal">Bank Name</label>
                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                      {config.bankDetails.bankName}
                    </div>
                  </div>
                )}

                {config.bankDetails.branch && (
                  <div>
                    <label className="text-small text-gray-600 block mb-1 leading-normal">Branch</label>
                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                      {config.bankDetails.branch}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Accepted Methods */}
        {config.acceptedMethods && config.acceptedMethods.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8 text-center">
            <p className="text-small text-gray-600 mb-3 leading-normal">We Accept</p>
            <div className="flex flex-wrap justify-center gap-3">
              {config.acceptedMethods.map((method, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-small font-medium text-gray-700 shadow-sm border border-gray-200 leading-normal"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Note */}
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 rounded-xl">
          <p className="text-small text-yellow-800 text-center leading-relaxed">
            <strong>Note:</strong> Please share payment confirmation screenshot via WhatsApp after payment.
          </p>
        </div>
      </div>
    </section>
  );
}
