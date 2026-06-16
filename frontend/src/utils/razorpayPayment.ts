import { getApiUrl } from './apiConfig';

export type MembershipPlanId = 'yearly' | 'guest';

type RazorpayCheckoutResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOrderResponse = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  plan: {
    id: MembershipPlanId;
    name: string;
    description: string;
  };
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayCheckoutResponse) => void;
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

const loadRazorpayScript = () =>
  new Promise<void>((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_SCRIPT_URL}"]`);

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Unable to load Razorpay checkout.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'));
    document.body.appendChild(script);
  });

const parseResponse = async (response: Response) => {
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || 'Unable to start Razorpay payment right now.');
  }

  return result;
};

export const startRazorpayPayment = async (planId: MembershipPlanId) => {
  await loadRazorpayScript();

  const orderResponse = await fetch(getApiUrl('/api/payments/razorpay-order'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ planId })
  });

  const order = (await parseResponse(orderResponse)) as RazorpayOrderResponse;

  return new Promise<void>((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error('Razorpay checkout did not load.'));
      return;
    }

    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Jat People Samelan',
      description: order.plan.description,
      image: '/haryana-jat-logo.svg',
      order_id: order.orderId,
      handler: async (paymentResponse) => {
        try {
          const verifyResponse = await fetch(getApiUrl('/api/payments/razorpay-verify'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              planId: order.plan.id,
              ...paymentResponse
            })
          });

          await parseResponse(verifyResponse);
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      modal: {
        ondismiss: () => reject(new Error('Payment was cancelled.'))
      },
      theme: {
        color: '#bf7a24'
      }
    });

    checkout.open();
  });
};
