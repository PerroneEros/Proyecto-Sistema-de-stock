import { ProductService } from "../services/ProductService";
import { DatabaseConfig } from "../config/database"; 
import { CreateProductDTO } from "../models/Product";

/**Suite de Pruebas de Integración.
A diferencia de los unitarios, estos tests verifican la comunicación real
entre el Servicio y la Base de Datos (MySQL).*/

describe("ProductService - Integración con BD Real", () => {
  let productService: ProductService;
  let db: DatabaseConfig;
  // Setup: Preparamos el entorno antes de todas las pruebas
  beforeAll(async () => {
    // Verificamos conexión (útil para debug en CI/CD)
    console.log("DB_HOST es:", process.env.DB_HOST);
  
    productService = ProductService.getInstance();
    db = DatabaseConfig.getInstance();
    // Limpiamos la tabla para arrancar con un estado conocido (Clean Slate)
    await db.query("DELETE FROM products");
  });
  // Teardown: Limpiamos y cerramos conexiones al terminar
  afterAll(async () => {
    await db.query("DELETE FROM products");
    await db.close();
  });

  it("debería CREAR un producto en la Base De Datos real y encontrarlo", async () => {
    // 1. Arrange: Preparamos los datos del producto
    const productDTO: CreateProductDTO = {
      name: "Producto de Integración",
      description: "Probando la BD real",
      price: 1500,
      currentStock: 20,
      minStock: 5,
      category: "integracion",
      type: "basico",
    };
    // 2. Act: Ejecutamos la lógica de negocio
    const createdProduct = await productService.createProduct(productDTO);
    // 3. Assert: Verificamos directamente en la BD 
    // Esto confirma que los datos realmente se persistieron
    const rows = await db.query("SELECT * FROM products WHERE id = ?", [
      createdProduct.id,
    ]);
    const productInDb = rows[0];
    expect(productInDb).toBeDefined();
    expect(productInDb.name).toBe("Producto de Integración");
    expect(productInDb.price).toBe("1500.00");
  });
});
