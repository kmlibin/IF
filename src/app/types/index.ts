export interface CartItem {
    id: string;
    data: {
      name: string,
      type: string,
      price: number | string
    }
    quantity: number;
  }
  
export interface ContactInfo {
    name: string;
    email: string;
    address: string;
  };

export interface ProductData {
    id: string;
    data: {
      price: number | string;
      type: string;
      name: string;
      id: string;
      description: string;
      quantity: number;
    };
  }