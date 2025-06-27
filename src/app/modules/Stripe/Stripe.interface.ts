// Stripe.interface: Module file for the Stripe.interface functionality.
export interface Order {
    paymentMethodId: string;
    userId: string;
    name:string;
    phoneNumber:string;
    apartment:string;
    emailAddress:string;
    totalAmount: number;
    zipCode: string;
    city: string;
    state: string;
    country: string;
    shippingAddress: string;
  }
  
  interface OrderItem {
    productId: string;
    quantity: number;
  }
  
  export interface OrderData {
    order: Order;
    orderItems: OrderItem[];
  }
  