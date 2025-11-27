import { ProductoConPromocion } from "./../patterns/ProductDecorator";
import { Product } from "../models/Product";

/*Suite de pruebas para el Patrón Decorator.
Verifica que los decoradores extiendan la funcionalidad del objeto base dinámicamente.*/
describe("ProductDecorator", () => {
  test("Deberá aplicar el descuento promocional al precio del producto y actualizar la descripción.", () => {
    // 1. Arrange: Creamos el Producto Base (Componente Concreto)
    const baseProduct: Product = {
      id: "p1",
      name: "Promo Product",
      description: "Original desc",
      price: 100,
      currentStock: 20,
      minStock: 5,
      category: "Promo",
      type: "basico",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // 2. Act: Envolvemos el producto con el Decorador de Promoción (25% off)
    const decorated = new ProductoConPromocion(baseProduct, 25);
    // 3. Assert: Verificamos el comportamiento extendido
    expect(decorated.price).toBe(75);
    expect(decorated.description).toContain("Promo: -25%");
    // Verificamos la delegación: Las propiedades no modificadas deben ser las mismas
    expect(decorated.id).toBe(baseProduct.id);
  });
});
