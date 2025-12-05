'use client';

import { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Check, QrCode, Copy, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: string;
    name: string;
    price: number;
    duration: string;
  };
  brandId: string;
  onSuccess?: () => void;
}

type PaymentStep = 'select' | 'processing' | 'upi-pending' | 'success' | 'error';

export default function PaymentModal({ isOpen, onClose, plan, brandId, onSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi'>('razorpay');
  const [upiId, setUpiId] = useState('');
  const [step, setStep] = useState<PaymentStep>('select');
  const [error, setError] = useState<string | null>(null);
  const [upiData, setUpiData] = useState<{
    transactionId: string;
    upiLink: string;
    qrData: string;
  } | null>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setStep('select');
      setError(null);
      setUpiData(null);
      setUtrNumber('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRazorpayPayment = async () => {
    try {
      setStep('processing');
      setError(null);

      const token = localStorage.getItem('token');

      // Create Razorpay order
      const response = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId: plan.id,
          brandId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Load Razorpay script if not loaded
      if (!(window as any).Razorpay) {
        await loadRazorpayScript();
      }

      // Initialize Razorpay
      const options = {
        key: data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount * 100,
        currency: data.currency || 'INR',
        name: 'Parichay',
        description: `${plan.name} Subscription`,
        order_id: data.orderId,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch('/api/payments/razorpay/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });

          if (verifyResponse.ok) {
            setStep('success');
            setTimeout(() => {
              if (onSuccess) onSuccess();
              onClose();
            }, 2000);
          } else {
            setError('Payment verification failed');
            setStep('error');
          }
        },
        modal: {
          ondismiss: function() {
            setStep('select');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
      setStep('select');
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
      setStep('error');
    }
  };

  const handleUPIPayment = async () => {
    if (!upiId || !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g., name@upi)');
      return;
    }

    try {
      setStep('processing');
      setError(null);

      const token = localStorage.getItem('token');

      const response = await fetch('/api/payments/upi/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId: plan.id,
          brandId,
          upiId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create UPI payment');
      }

      setUpiData({
        transactionId: data.transactionId,
        upiLink: data.upiLink,
        qrData: data.qrData,
      });
      setStep('upi-pending');
    } catch (error: any) {
      console.error('UPI payment error:', error);
      setError(error.message || 'Failed to initiate UPI payment');
      setStep('error');
    }
  };

  const handleVerifyUPI = async () => {
    if (!utrNumber.trim()) {
      setError('Please enter the UTR/Transaction ID from your UPI app');
      return;
    }

    try {
      setStep('processing');
      setError(null);

      const token = localStorage.getItem('token');

      const response = await fetch('/api/payments/upi/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          transactionId: upiData?.transactionId,
          upiTransactionId: utrNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      if (data.status === 'COMPLETED') {
        setStep('success');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 2000);
      } else {
        setError('Payment is still pending. Please wait or try again.');
        setStep('upi-pending');
      }
    } catch (error: any) {
      console.error('UPI verification error:', error);
      setError(error.message || 'Verification failed');
      setStep('error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {step === 'success' ? 'Payment Successful!' :
               step === 'upi-pending' ? 'Complete UPI Payment' :
               'Complete Payment'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {plan.name} - ₹{plan.price.toLocaleString('en-IN')}/{plan.duration === 'MONTHLY' ? 'month' : 'year'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => { setError(null); setStep('select'); }}
                  className="text-sm text-red-600 underline mt-1"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Processing State */}
          {step === 'processing' && (
            <div className="py-12 text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Processing your payment...</p>
            </div>
          )}

          {/* Success State */}
          {step === 'success' && (
            <div className="py-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">
                Your {plan.name} subscription is now active.
              </p>
              <p className="text-sm text-gray-500">Redirecting...</p>
            </div>
          )}

          {/* Payment Method Selection */}
          {step === 'select' && (
            <div className="space-y-6">
              {/* Payment Methods */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Payment Method
                </label>
                <div className="space-y-3">
                  {/* Razorpay */}
                  <button
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`w-full p-4 border-2 rounded-xl flex items-center justify-between transition-all ${
                      paymentMethod === 'razorpay'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Card / UPI / Netbanking</div>
                        <div className="text-xs text-gray-500">All payment methods via Razorpay</div>
                      </div>
                    </div>
                    {paymentMethod === 'razorpay' && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </button>

                  {/* Direct UPI */}
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`w-full p-4 border-2 rounded-xl flex items-center justify-between transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Direct UPI</div>
                        <div className="text-xs text-gray-500">PhonePe, GPay, PayTM, BHIM</div>
                      </div>
                    </div>
                    {paymentMethod === 'upi' && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* UPI ID Input */}
              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Your UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Example: name@paytm, name@ybl, name@okaxis
                  </p>
                </div>
              )}

              {/* Payment Summary */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium text-gray-900">{plan.name}</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium text-gray-900">
                    {plan.duration === 'MONTHLY' ? '1 Month' : '1 Year'}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{plan.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={paymentMethod === 'razorpay' ? handleRazorpayPayment : handleUPIPayment}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25"
              >
                Pay ₹{plan.price.toLocaleString('en-IN')}
              </button>

              {/* Security Note */}
              <p className="text-xs text-center text-gray-500">
                🔒 Secure payment. Your data is encrypted and protected.
              </p>
            </div>
          )}

          {/* UPI Pending State */}
          {step === 'upi-pending' && upiData && (
            <div className="space-y-6">
              {/* QR Code */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Scan this QR code with any UPI app
                </p>
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-2xl">
                  <QRCodeSVG
                    value={upiData.qrData}
                    size={200}
                    level="H"
                    includeMargin
                  />
                </div>
              </div>

              {/* Or Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* UPI Link */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Open in UPI app:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={upiData.upiLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 truncate"
                  />
                  <button
                    onClick={() => copyToClipboard(upiData.upiLink)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
                  </button>
                </div>
                <a
                  href={upiData.upiLink}
                  className="block mt-3 text-center py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  Open UPI App
                </a>
              </div>

              {/* Verification */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  After payment, enter UTR/Transaction ID:
                </p>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="Enter UTR number from UPI app"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                />
                <button
                  onClick={handleVerifyUPI}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Verify Payment
                </button>
              </div>

              {/* Transaction ID */}
              <div className="text-center text-xs text-gray-500">
                Transaction ID: {upiData.transactionId}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
