export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currentStock: number;
  minStock: number;
  category: string;
  type: "basico" | "perecedero" | "electronico";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  currentStock: number;
  minStock: number;
  category: string;
  type: "basico" | "perecedero" | "electronico";
  promotion?: {
    discountPercent?: number;
  };
}
