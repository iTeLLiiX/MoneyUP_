// Payment Service for MoneyUP App
// Handles one-time payment of 4.99€ after onboarding

export interface PaymentRequest {
  amount: number; // 4.99
  currency: string; // 'EUR'
  description: string;
  customerEmail: string;
  customerName: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
  paymentMethod?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
}

class PaymentService {
  private static instance: PaymentService;
  private isInitialized = false;

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      // Initialize Stripe or other payment provider
      console.log('💳 Initializing Payment Service...');
      
      // In production, you would initialize Stripe here:
      // Stripe.setPublishableKey('pk_live_...');
      
      this.isInitialized = true;
      console.log('✅ Payment Service initialized');
    } catch (error) {
      console.error('❌ Payment Service initialization failed:', error);
      throw error;
    }
  }

  public async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    if (!this.isInitialized) {
      throw new Error('Payment Service not initialized');
    }

    try {
      console.log('💳 Processing payment:', paymentData);

      // Simulate payment processing
      // In production, this would call Stripe API:
      /*
      const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: Math.round(paymentData.amount * 100), // Convert to cents
          currency: paymentData.currency.toLowerCase(),
          description: paymentData.description,
          metadata: JSON.stringify({
            customer_email: paymentData.customerEmail,
            customer_name: paymentData.customerName,
          }),
        }),
      });
      */

      // Mock successful payment for development
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResponse: PaymentResponse = {
        success: true,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentMethod: 'card',
      };

      console.log('✅ Payment processed successfully:', mockResponse);
      return mockResponse;

    } catch (error) {
      console.error('❌ Payment processing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed',
      };
    }
  }

  public async createPaymentIntent(amount: number, currency: string = 'EUR'): Promise<string> {
    try {
      // Create payment intent with Stripe
      // This would return a client_secret for frontend confirmation
      
      const mockClientSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;
      return mockClientSecret;
    } catch (error) {
      console.error('❌ Failed to create payment intent:', error);
      throw error;
    }
  }

  public async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentResponse> {
    try {
      // Confirm payment with Stripe
      console.log('💳 Confirming payment:', { paymentIntentId, paymentMethodId });

      // Mock confirmation for development
      await new Promise(resolve => setTimeout(resolve, 1500));

      return {
        success: true,
        transactionId: paymentIntentId,
        paymentMethod: 'card',
      };
    } catch (error) {
      console.error('❌ Payment confirmation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment confirmation failed',
      };
    }
  }

  public async getPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    try {
      // Retrieve saved payment methods for customer
      // This would call Stripe API to get customer's payment methods
      
      return [
        {
          id: 'pm_1234567890',
          type: 'card',
          last4: '4242',
          brand: 'visa',
        },
      ];
    } catch (error) {
      console.error('❌ Failed to retrieve payment methods:', error);
      return [];
    }
  }

  public async savePaymentMethod(customerId: string, paymentMethodId: string): Promise<boolean> {
    try {
      // Save payment method to customer in Stripe
      console.log('💳 Saving payment method:', { customerId, paymentMethodId });
      
      // Mock save for development
      return true;
    } catch (error) {
      console.error('❌ Failed to save payment method:', error);
      return false;
    }
  }

  public async refundPayment(transactionId: string, amount?: number): Promise<boolean> {
    try {
      // Process refund through Stripe
      console.log('💳 Processing refund:', { transactionId, amount });
      
      // Mock refund for development
      return true;
    } catch (error) {
      console.error('❌ Refund failed:', error);
      return false;
    }
  }

  public validatePaymentData(paymentData: PaymentRequest): boolean {
    // Validate payment data before processing
    if (!paymentData.amount || paymentData.amount <= 0) {
      return false;
    }
    
    if (!paymentData.currency || paymentData.currency.length !== 3) {
      return false;
    }
    
    if (!paymentData.customerEmail || !this.isValidEmail(paymentData.customerEmail)) {
      return false;
    }
    
    if (!paymentData.customerName || paymentData.customerName.trim().length < 2) {
      return false;
    }
    
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public getSupportedPaymentMethods(): PaymentMethod[] {
    return [
      { id: 'card', type: 'card' },
      { id: 'paypal', type: 'paypal' },
      { id: 'apple_pay', type: 'apple_pay' },
      { id: 'google_pay', type: 'google_pay' },
    ];
  }

  public formatAmount(amount: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }
}

export default PaymentService;
