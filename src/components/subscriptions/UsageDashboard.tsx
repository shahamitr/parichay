interface UsageData {
  branches: {
    current: number;
    max: number;
    percentage: number;
    remaining: number;
    canCreateMore: boolean;
  };
  features: {
    customDomain: { enabled: boolean; inUse: boolean };
    analytics: { enabled: boolean };
    qrCodes: { enabled: boolean };
    leadCapture: { enabled: boolean };
    prioritySupport: { enabled: boolean };
  };
  subscription: {
    status: string;
    startDate: string;
    endDate: string;
    daysRemaining: number;
    autoRenew: boolean;
  };
}