/**
 * Client-side dynamic script loader for Razorpay Payment Gateway
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // If the script is already loaded, resolve immediately
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}
