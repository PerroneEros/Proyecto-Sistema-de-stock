import { Product, CreateProductDTO } from "../models/Product";
import { DatabaseConfig } from "../config/database";
import { ProductFactory } from "./../patterns/ProductFactory";
import { AlertService } from "./../patterns/AlertService";
import { ProductoConPromocion } from "./../patterns/ProductDecorator";

/*Servicio de Productos.*/
export class ProductService {
  private static instance: ProductService;
  private db: DatabaseConfig;
  private productFactory: ProductFactory;
  private alertService: AlertService;

  private constructor() {
    this.db = DatabaseConfig.getInstance();
    this.productFactory = ProductFactory.getInstance();
    this.alertService = AlertService.getInstance();
  }
  // Implementación del patrón Singleton
  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }
  // Obtiene productos mapeando los nombres de columnas
  async getAllProducts(): Promise<Product[]> {
    const sql = `
      SELECT 
        id, name, description, price, 
        current_stock as currentStock, 
        min_stock as minStock, 
        category, type, 
        created_at as createdAt, 
        updated_at as updatedAt 
      FROM products 
      ORDER BY created_at DESC
    `;
    const rows = await this.db.query(sql);
    return rows as Product[];
  }

  /*Crea un producto coordinando: Factory (creación), Decorator (promociones) y Observer (alertas).*/
  async createProduct(productData: CreateProductDTO): Promise<Product> {
    // 1.creación conFactory
    const product = this.productFactory.createProduct(productData);
    // 2. decorador si hay promoción
    let finalProduct: Product = product;
    if (productData.promotion && productData.promotion.discountPercent) {
      finalProduct = new ProductoConPromocion(
        product,
        productData.promotion.discountPercent
      );
    }
    // 3. Persistencia en BD
    const sql = `
      INSERT INTO products (id, name, description, price, current_stock, min_stock, category, type, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        await this.db.query(sql, [
          finalProduct.id,
          finalProduct.name,
          finalProduct.description,
          finalProduct.price,
          finalProduct.currentStock,
          finalProduct.minStock,
          finalProduct.category,
          finalProduct.type,
          finalProduct.createdAt,
          finalProduct.updatedAt,
        ]);
    } catch (error) {
        throw new Error("Error en base de datos al crear producto");
    }
    // 4. Notificar al Observer (AlertService) si corresponde
    this.alertService.notifyLowStock(finalProduct);

    return product;
  }

// Actualiza stock y verifica alertas de stock bajo
  async updateStock(productId: string, newStock: number): Promise<Product> {
    const sql =
      "UPDATE products SET current_stock = ?, updated_at = ? WHERE id = ?";
    
    const result: any = await this.db.query(sql, [newStock, new Date(), productId]);

    if (result && result.affectedRows === 0) {
        throw new Error("Producto no encontrado");
    }

    const product = await this.getProductById(productId);
    
    if (!product) {
       throw new Error("Error recuperando producto actualizado");
    }
    // Verificación de stock crítico post-actualización
    this.alertService.notifyLowStock(product);
    
    return product;
  }
  async getProductById(id: string): Promise<Product | null> {
    const sql = `
      SELECT 
        id, name, description, price, 
        current_stock as currentStock, 
        min_stock as minStock, 
        category, type, 
        created_at as createdAt, 
        updated_at as updatedAt 
      FROM products 
      WHERE id = ?
    `;
    const rows: any[] = await this.db.query(sql, [id]);
    return rows.length > 0 ? (rows[0] as Product) : null;
  }
}