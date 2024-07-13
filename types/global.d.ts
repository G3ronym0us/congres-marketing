interface BoldCheckoutOptions {
    orderId: string;
    currency: string;
    amount: number;
    apiKey: string;
    redirectionUrl: string;
    integritySignature: string;
    description: string;
    tax: string;
  }
  
  interface BoldCheckoutInstance {
    open: (callback: (result: { transaction: { id: string } }) => void) => void;
  }
  
  interface BoldCheckoutConstructor {
    new (options: BoldCheckoutOptions): BoldCheckoutInstance;
  }
  
  declare global {
    interface Window {
      BoldCheckout: BoldCheckoutConstructor;
    }
  }