import { Optional } from 'sequelize';

export interface CartAttributes {
  id?: string;
  name: string;
  description: string;
  userId: string;
  items: CartItemAttributes[];
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCartAttributes extends Optional<CartAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface CartItemAttributes {
  id?: string;
  cartId: string;
  productId: string;
  productName?: string;
  price?: number;
  image?: string[];
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCartItemAttributes extends Optional<CartItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

