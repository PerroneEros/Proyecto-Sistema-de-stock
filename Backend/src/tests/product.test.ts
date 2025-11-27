import { ProductService } from "../services/ProductService";
import { ProductFactory } from "./../patterns/ProductFactory";
import { Validators } from "../utils/validators";

/*Suite de pruebas unitarias generales.
Verifica la integridad de los Singletons y la lógica de validación.*/
describe("Product Service", () => {
  let productService: ProductService;

  beforeAll(() => {
    productService = ProductService.getInstance();
  });

  test("debería crear una instancia de servicio de producto", () => {
    expect(productService).toBeInstanceOf(ProductService);
  });
  // Verificación estricta del patrón Singleton (misma referencia en memoria)
  test("deberia ser singleton", () => {
    const anotherInstance = ProductService.getInstance();
    expect(anotherInstance).toBe(productService);
  });
});

describe("Product Factory", () => {
  let productFactory: ProductFactory;

  beforeAll(() => {
    productFactory = ProductFactory.getInstance();
  });
  // Test del Happy Path de creación
  test("debería crear un producto básico", () => {
    const productData = {
      name: "Test Product",
      description: "Descrición de prueba",
      price: 100,
      currentStock: 50,
      minStock: 5,
      category: "Test Category",
      type: "basico" as const,
    };

    const product = productFactory.createProduct(productData);

    expect(product).toHaveProperty("id");
    expect(product.name).toBe("Test Product");
    expect(product.type).toBe("basico");
  });

  test("debería crear un producto perecedero", () => {
    const productData = {
      name: "Perishable Product",
      description: "Test Description",
      price: 100,
      currentStock: 50,
      minStock: 5,
      category: "Food",
      type: "perecedero" as const,
    };

    const product = productFactory.createProduct(productData);
    expect(product.type).toBe("perecedero");
  });
});
// Pruebas de funciones puras (Unit Testing)
describe("Validators", () => {
  test("debe validar el correo electrónico correctamente", () => {
    expect(Validators.isEmail("test@example.com")).toBe(true);
    expect(Validators.isEmail("invalid-email")).toBe(false);
  });

  test("debe validar números positivos", () => {
    expect(Validators.isPositiveNumber(10)).toBe(true);
    expect(Validators.isPositiveNumber(-5)).toBe(false);
    expect(Validators.isPositiveNumber("10")).toBe(false);
  });

  test("debe validar los datos del producto", () => {
    const validData = {
      name: "Test Product",
      price: 100,
      currentStock: 50,
      minStock: 5,
      category: "Test",
      type: "basico",
    };

    const invalidData = {
      name: "",
      price: -100,
      currentStock: -50,
      minStock: -5,
      category: "",
      type: "invalid",
    };

    const validResult = Validators.validateProductData(validData);
    const invalidResult = Validators.validateProductData(invalidData);

    expect(validResult.isValid).toBe(true);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors.length).toBeGreaterThan(0);
  });
});

console.log("Todos los tests pasaron correctamente");
