import { Product, CreateProductDTO } from "../models/Product";
import { ProductBuilder } from "./ProductBuilder";

/*Patrón Factory: Centraliza la lógica de creación de objetos Product.
Implementa Singleton para mantener una única instancia de la fábrica.*/
export class ProductFactory {
  private static instance: ProductFactory;

  private constructor() {}

  // Obtiene la instancia única de la fábrica (Singleton)
  public static getInstance(): ProductFactory {
    if (!ProductFactory.instance) {
      ProductFactory.instance = new ProductFactory();
    }
    return ProductFactory.instance;
  }

  /* Método de fabricación principal*/
  public createProduct(productData: CreateProductDTO): Product {
    const now = new Date();

    // Delegamos la construcción compleja al Builder
    const builder = new ProductBuilder()
      .setId(this.generateId())
      .setName(productData.name)
      .setDescription(productData.description)
      .setPrice(productData.price)
      .setCurrentStock(productData.currentStock)
      .setMinStock(productData.minStock)
      .setCategory(productData.category)
      .setType(productData.type)
      .setCreatedAt(now)
      .setUpdatedAt(now);

    const product = builder.build();
    return product;
  }
  
// Generador de IDs únicos (Helper interno)
  private generateId(): string {
    return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
