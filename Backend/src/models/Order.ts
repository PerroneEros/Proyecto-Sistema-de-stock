export interface Order {
  id: string;
  productId: string;
  quantity: number;
  status: 'pendiente' | 'completado' | 'cancelado';
  userId: string;
  createdAt: Date;
}

export interface CreateOrderDTO {
  productId: string;
  quantity: number;
  userId: string;
}
