export interface StockMovement {
  id: string;
  productId: string;
  oldStock: number;
  newStock: number;
  movementType: 'entrada' | 'salida' | 'ajuste';
  reason: string;
  orderId?: string;
  userId: string;
  createdAt: Date;
}

export interface CreateStockMovementDTO {
  productId: string;
  oldStock: number;
  newStock: number;
  movementType: 'entrada' | 'salida' | 'ajuste';
  reason: string;
  orderId?: string;
  userId: string;
}