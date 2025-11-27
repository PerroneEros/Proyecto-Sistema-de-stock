import { ProductBuilder } from "./../patterns/ProductBuilder";
import { CreateProductDTO } from "../models/Product";

/*Suite de pruebas unitarias para el Patrón Builder.
Verifica la correcta construcción de objetos complejos y la autogeneración de datos.*/
describe("ProductBuilder", () => {
  test("Debería crear un producto válido a partir del DTO.", () => {
    // Arrange: Preparamos los datos de entrada (DTO)
    const dto: CreateProductDTO = {
      name: "Builder Product",
      description: "Construido mediante el Builder",
      price: 123.45,
      currentStock: 10,
      minStock: 2,
      category: "Tools",
      type: "basico",
    };
    // Act: Ejecutamos la construcción
    const builder = new ProductBuilder();
    // Probamos el método fluido fromDTO que configura todo de una
    const product = builder.fromDTO(dto).build();
    // Assert: Verificamos que el objeto resultante tenga lo esperado
    expect(product).toHaveProperty("id"); // El Builder debe generar un ID único
    expect(product.name).toBe(dto.name);  // Los datos deben coincidir
    expect(product.price).toBe(dto.price);
    expect(product.createdAt).toBeInstanceOf(Date); // El Builder debe asignar fecha actual
  });
});
