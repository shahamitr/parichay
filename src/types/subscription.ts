/**
 * Subscription and payment related types
 */

export interface SubscriptionPlanFeatures {
  maxBranches: number;
  customDomain: boolean;
  analytics: boolean;
  qrCodes: boolean;
  leadCapture: boolean;
  prioritySupport?: boolean;
}

export interface SubscriptionPlanData {
  id: string;
  name: string;
  price: number;
  duration: 'MONTHLY' | 'YEARLY';
  features: SubscriptionPlanFeatures;
  isActive: boolean;
}

export interface CreateSubscriptionPlanInput {
  name: string;
  price: number;
  duration: 'MONTHLY' | 'YEARLY';
  features: SubscriptionPlanFeatures;
}

export interface SubscriptionData {
  id: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'CANCELLED';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  licenseKey: string;
  paymentGateway: 'STRIPE' | 'RAZORPAY';
  plan: SubscriptionPlanData;
}

export interface PaymentIntentData {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface RazorpayOrderData {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface WebhookEvent {
  type: string;
  data: any;
  signature?: string;
}
