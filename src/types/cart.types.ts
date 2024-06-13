export interface CartAttributes {
  id?: string;
  userId?: string;
  name?: string; 
  description?: string; 
  items?: {
    productId: string;
    quantity: number;
    name: string;
    price: number;
    image: string;
    description: string;
  }[];
  total?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface createCartAttributes extends Omit<CartAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  name: string; 
  description: string; 
}
