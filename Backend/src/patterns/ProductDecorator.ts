import { Product } from "./../models/Product";

/*Base del patrón Decorator.
Envuelve un objeto Product y delega todas las llamadas a la instancia original.
Permite que las subclases modifiquen comportamientos específicos.*/
export class ProductDecorator implements Product {
  constructor(protected product: Product) {}

  get id(): string {
    return this.product.id;
  }
  get name(): string {
    return this.product.name;
  }
  get description(): string {
    return this.product.description;
  }
  get price(): number {
    return this.product.price;
  }
  get currentStock(): number {
    return this.product.currentStock;
  }
  get minStock(): number {
    return this.product.minStock;
  }
  get category(): string {
    return this.product.category;
  }
  get type(): Product["type"] {
    return this.product.type;
  }
  get createdAt(): Date {
    return this.product.createdAt;
  }
  get updatedAt(): Date {
    return this.product.updatedAt;
  }
}

/*Aplica lógica de descuento al precio.*/
export class ProductoConPromocion extends ProductDecorator {
  constructor(product: Product, private discountPercent: number) {
    super(product);
  }

  get price(): number {
    const discounted =
      this.product.price * (1 - (this.discountPercent || 0) / 100);
    return Math.round((discounted + Number.EPSILON) * 100) / 100;
  }

  get description(): string {
    return `${this.product.description} (Promo: -${this.discountPercent}%)`;
  }
}
/*Agrega información de garantía.*/
export class ProductoConGarantiaExtendida extends ProductDecorator {
  constructor(product: Product, private mesesGarantia: number) {
    super(product);
  }

  get description(): string {
    return `${this.product.description} (Garantía +${this.mesesGarantia} meses)`;
  }
}

export default ProductDecorator;
