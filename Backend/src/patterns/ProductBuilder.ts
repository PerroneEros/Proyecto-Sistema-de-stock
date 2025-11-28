import { Product, CreateProductDTO } from "./../models/Product";

/*Implementación del patrón Builder.*/
export class ProductBuilder {
  private product: Partial<Product> = {};

//Métodos Fluent Interface (retornan 'this' para encadenamiento)
  setId(id: string): this {
    this.product.id = id;
    return this;
  }
  setName(name: string): this {
    this.product.name = name;
    return this;
  }
  setDescription(description: string): this {
    this.product.description = description;
    return this;
  }
  setPrice(price: number): this {
    this.product.price = price;
    return this;
  }
  setCurrentStock(currentStock: number): this {
    this.product.currentStock = currentStock;
    return this;
  }
  setMinStock(minStock: number): this {
    this.product.minStock = minStock;
    return this;
  }
  setCategory(category: string): this {
    this.product.category = category;
    return this;
  }
  setType(type: Product["type"]): this {
    this.product.type = type;
    return this;
  }
  setCreatedAt(date: Date): this {
    this.product.createdAt = date;
    return this;
  }
  setUpdatedAt(date: Date): this {
    this.product.updatedAt = date;
    return this;
  }

/**Inicializa el builder desde un DTO, autogenerando ID y Fechas.Util para crear productos nuevos desde cero.*/  
  fromDTO(dto: CreateProductDTO): this {
    const now = new Date();
    this.product = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      currentStock: dto.currentStock,
      minStock: dto.minStock,
      category: dto.category,
      type: dto.type,
      createdAt: now,
      updatedAt: now,
    };
    return this;
  }

/*Finaliza la construcción y valida que el objeto sea consistente.*/
  build(): Product {
    if (!this.product.id || !this.product.name) {
      throw new Error("ProductBuilder: id y name son requeridos");
    }

    return this.product as Product;
  }
}

export default ProductBuilder;
