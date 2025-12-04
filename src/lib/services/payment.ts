import { loadStripe, type Stripe } from '@stripe/stripe-js';

// Payment configuration
export interface PaymentConfig {
  stripePublishableKey: string;
  paypalClientId?: string;
  environment: 'sandbox' | 'production';
  currency: string;
  fees: {
    processing: number; // percentage
    fixed: number; // fixed amount in cents
  };
}

// Payment method types
export type PaymentMethod = 'stripe' | 'paypal' | 'bank_transfer' | 'check';

// Payment status types
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';

// Payment interfaces
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: PaymentMethod;
  customer_email: string;
  metadata?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface PaymentResult {
  success: boolean;
  payment_intent_id?: string;
  error?: string;
  redirect_url?: string;
}

export interface RefundRequest {
  payment_intent_id: string;
  amount?: number; // partial refund if specified
  reason?: string;
}

export interface RefundResult {
  success: boolean;
  refund_id?: string;
  amount_refunded?: number;
  error?: string;
}

// Payment service class
export class PaymentService {
  private stripe: Stripe | null = null;
  private config: PaymentConfig;
  
  constructor(config: PaymentConfig) {
    this.config = config;
  }

  // Initialize Stripe
  async initializeStripe(): Promise<boolean> {
    try {
      this.stripe = await loadStripe(this.config.stripePublishableKey);
      return this.stripe !== null;
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
      return false;
    }
  }

  // Calculate fees
  calculateFees(amount: number): { processingFee: number; total: number } {
    const processingFee = Math.round(
      (amount * this.config.fees.processing / 100) + this.config.fees.fixed
    );
    const total = amount + processingFee;
    
    return { processingFee, total };
  }

  // Create payment intent (Stripe)
  async createPaymentIntent(
    amount: number,
    customerEmail: string,
    metadata: Record<string, string> = {}
  ): Promise<PaymentResult> {
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: this.config.currency,
          customer_email: customerEmail,
          metadata,
          payment_method: 'stripe'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          payment_intent_id: result.payment_intent_id
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to create payment intent'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error while creating payment intent'
      };
    }
  }

  // Process Stripe payment
  async processStripePayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<PaymentResult> {
    if (!this.stripe) {
      return {
        success: false,
        error: 'Stripe not initialized'
      };
    }

    try {
      const { error } = await this.stripe.confirmPayment({
        elements: null as any, // This would be the Stripe Elements in a real implementation
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`
        }
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        payment_intent_id: paymentIntentId
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to process payment'
      };
    }
  }

  // Create PayPal order
  async createPayPalOrder(
    amount: number,
    customerEmail: string,
    metadata: Record<string, string> = {}
  ): Promise<PaymentResult> {
    try {
      const response = await fetch('/api/payments/create-paypal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: this.config.currency,
          customer_email: customerEmail,
          metadata
        })
      });

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          payment_intent_id: result.order_id,
          redirect_url: result.approval_url
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to create PayPal order'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error while creating PayPal order'
      };
    }
  }

  // Process bank transfer
  async processBankTransfer(
    amount: number,
    customerEmail: string,
    meta Record<string, string> = {}
  ): Promise<PaymentResult> {
    try {
      const response = await fetch('/api/payments/bank-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: this.config.currency,
          customer_email: customerEmail,
          metadata,
          payment_method: 'bank_transfer'
        })
      });

      const result = await response.json();
      
      return {
        success: result.success,
        payment_intent_id: result.payment_intent_id,
        error: result.error
      };
    } catch (error) {
      return {
        success: false,
        error: 'Network error while processing bank transfer'
      };
    }
  }

  // Get payment status
  async getPaymentStatus(paymentIntentId: string): Promise<PaymentIntent | null> {
    try {
      const response = await fetch(`/api/payments/status/${paymentIntentId}`);
      const result = await response.json();
      
      if (result.success) {
        return result.payment_intent;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get payment status:', error);
      return null;
    }
  }

  // Process refund
  async processRefund(refundRequest: RefundRequest): Promise<RefundResult> {
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(refundRequest)
      });

      const result = await response.json();
      
      return {
        success: result.success,
        refund_id: result.refund_id,
        amount_refunded: result.amount_refunded,
        error: result.error
      };
    } catch (error) {
      return {
        success: false,
        error: 'Network error while processing refund'
      };
    }
  }

  // Get payment methods available for amount
  getAvailablePaymentMethods(amount: number): PaymentMethod[] {
    const methods: PaymentMethod[] = [];
    
    // Always available
    methods.push('stripe');
    
    // PayPal available if configured
    if (this.config.paypalClientId) {
      methods.push('paypal');
    }
    
    // Bank transfer for larger amounts
    if (amount >= 50000) { // $500+
      methods.push('bank_transfer');
    }
    
    // Check payments always available
    methods.push('check');
    
    return methods;
  }

  // Format currency amount
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.config.currency.toUpperCase()
    }).format(amount / 100);
  }

  // Validate payment amount
  validateAmount(amount: number): { valid: boolean; error?: string } {
    if (amount <= 0) {
      return { valid: false, error: 'Amount must be greater than zero' };
    }
    
    if (amount < 50) { // Minimum $0.50
      return { valid: false, error: 'Amount must be at least $0.50' };
    }
    
    if (amount > 100000000) { // Maximum $1M
      return { valid: false, error: 'Amount exceeds maximum limit' };
    }
    
    return { valid: true };
  }
}

// Default configuration
export const defaultPaymentConfig: PaymentConfig = {
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_default',
  environment: 'sandbox',
  currency: 'usd',
  fees: {
    processing: 2.9, // 2.9%
    fixed: 30 // 30 cents
  }
};

// Create default payment service instance
export const paymentService = new PaymentService(defaultPaymentConfig);

// Payment utilities
export const PaymentUtils = {
  // Get payment method display name
  getPaymentMethodName(method: PaymentMethod): string {
    const names: Record<PaymentMethod, string> = {
      stripe: 'Credit/Debit Card',
      paypal: 'PayPal',
      bank_transfer: 'Bank Transfer',
      check: 'Check Payment'
    };
    return names[method];
  },

  // Get payment status display name and color
  getPaymentStatusDisplay(status: PaymentStatus): { name: string; color: string } {
    const displays: Record<PaymentStatus, { name: string; color: string }> = {
      pending: { name: 'Pending', color: '#ffc107' },
      processing: { name: 'Processing', color: '#17a2b8' },
      completed: { name: 'Completed', color: '#28a745' },
      failed: { name: 'Failed', color: '#dc3545' },
      refunded: { name: 'Refunded', color: '#6c757d' },
      cancelled: { name: 'Cancelled', color: '#6c757d' }
    };
    return displays[status];
  },

  // Format payment method for display
  formatPaymentMethodDisplay(method: PaymentMethod, lastFour?: string): string {
    const baseName = PaymentUtils.getPaymentMethodName(method);
    if (method === 'stripe' && lastFour) {
      return `${baseName} ending in ${lastFour}`;
    }
    return baseName;
  }
};