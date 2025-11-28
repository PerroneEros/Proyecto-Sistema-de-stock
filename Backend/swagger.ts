import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "🚀 FastStoc API - TP Final",
      version: "1.0.0",
      description: `
### Sistema de Gestión de Stock Inteligente

Esta API permite administrar el inventario, procesar pedidos y generar reportes en PDF.
El sistema implementa patrones de diseño clave como **Singleton**, **Factory**, **Command** y **Adapter**.

**Módulos del Sistema:**
* 📦 **Productos:** Gestión de inventario con validaciones estrictas y control de stock.
* 🛒 **Pedidos:** Procesamiento transaccional de compras con verificación de disponibilidad.
* 📊 **Reportes:** Generación de documentos PDF para control de stock y análisis de ventas.

---

### 📝 Guía para Pruebas
Para validar los distintos escenarios, utilice los **Ejemplos** pre-cargados en los menús desplegables de cada endpoint. Los títulos indican el código de respuesta esperado (ej: 404).
      `,
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor Local",
      },
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            id: { type: "string", description: "UUID generado" },
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            currentStock: { type: "integer" },
            minStock: { type: "integer" },
            category: { type: "string" },
            type: {
              type: "string",
              enum: ["basico", "perecedero", "electronico"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateProductDTO: {
          type: "object",
          required: [
            "name",
            "price",
            "currentStock",
            "minStock",
            "category",
            "type",
          ],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            currentStock: { type: "integer" },
            minStock: { type: "integer" },
            category: { type: "string" },
            type: {
              type: "string",
              enum: ["basico", "perecedero", "electronico"],
            },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "string" },
            productId: { type: "string" },
            quantity: { type: "integer" },
            status: {
              type: "string",
              enum: ["pendiente", "completado", "cancelado"],
            },
            userId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        CreateOrderDTO: {
          type: "object",
          required: ["productId", "quantity", "userId"],
          properties: {
            productId: { type: "string" },
            quantity: { type: "integer" },
            userId: { type: "string" },
          },
        },
      },
    },
    paths: {
      "/api/products": {
        get: {
          summary: "Obtener todos los productos",
          tags: ["Products"],
          responses: {
            "200": {
              description: "Lista de productos",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Crear un nuevo producto",
          tags: ["Products"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateProductDTO" },
                examples: {
                  CasoExito: {
                    summary: "✅ Caso Éxito: Producto Válido (201)",
                    value: {
                      name: "Auriculares HyperX",
                      description: "Sonido envolvente 7.1",
                      price: 85000,
                      currentStock: 20,
                      minStock: 5,
                      category: "Periféricos",
                      type: "electronico",
                    },
                  },
                  CasoErrorNegativo: {
                    summary: "❌ Caso Error: Precio Negativo (400)",
                    value: {
                      name: "Producto Trucho",
                      description: "Esto debe fallar",
                      price: -100,
                      currentStock: 10,
                      minStock: 2,
                      category: "Test",
                      type: "basico",
                    },
                  },
                  CasoErrorFaltanDatos: {
                    summary: "❌ Caso Error: Falta Nombre (400)",
                    value: {
                      description: "Sin nombre no paso",
                      price: 100,
                      currentStock: 10,
                      minStock: 2,
                      category: "Test",
                      type: "basico",
                    },
                  },
                  CasoErrorStockNegativo: {
                    summary: "❌ Caso Error: Stock Negativo (400)",
                    value: {
                      name: "Producto Sin Stock",
                      description: "Stock no puede ser negativo",
                      price: 100,
                      currentStock: -5,
                      minStock: 2,
                      category: "Test",
                      type: "basico",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Producto creado exitosamente" },
            "400": { description: "Error de validación (Bad Request)" },
          },
        },
      },
      "/api/products/{id}": {
        get: {
          summary: "Obtener un producto por ID",
          tags: ["Products"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "ID del producto",
              example: "prod_1",
            },
          ],
          responses: {
            "200": {
              description: "Datos del producto",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Product" },
                },
              },
            },
            "404": { description: "Producto no encontrado" },
          },
        },
      },
      "/api/products/{id}/stock": {
        put: {
          summary: "Actualizar stock de un producto",
          tags: ["Products"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              example: "prod_1",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { stock: { type: "integer" } },
                },
                examples: {
                  ActualizarBien: {
                    summary: "✅ Actualizar Stock (200)",
                    value: { stock: 100 },
                  },
                  ActualizarMal: {
                    summary: "❌ Stock Negativo (400)",
                    value: { stock: -50 },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Stock actualizado correctamente" },
            "400": { description: "Stock negativo o inválido" },
            "404": { description: "Producto no encontrado" },
          },
        },
      },
      "/api/orders": {
        get: {
          summary: "Obtener todos los pedidos",
          tags: ["Orders"],
          responses: {
            "200": {
              description: "Lista de pedidos",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Crear un nuevo pedido",
          tags: ["Orders"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateOrderDTO" },
                examples: {
                  CompraExitosa: {
                    summary: "✅ Compra Exitosa (201)",
                    value: {
                      productId: "prod_1",
                      quantity: 1,
                      userId: "cliente_feliz",
                    },
                  },
                  SinStock: {
                    summary: "❌ Error: Stock Insuficiente (400)",
                    value: {
                      productId: "prod_1",
                      quantity: 9999,
                      userId: "cliente_ambicioso",
                    },
                  },
                  ProductoFantasma: {
                    summary: "❌ Error: Producto No Existe (404)",
                    value: {
                      productId: "id_inventado_xyz",
                      quantity: 1,
                      userId: "cliente_confundido",
                    },
                  },
                  CantidadNegativa: {
                    summary: "❌ Error: Cantidad Negativa (400)",
                    value: {
                      productId: "prod_1",
                      quantity: -5,
                      userId: "hacker_triste",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Pedido creado exitosamente",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Order" },
                },
              },
            },
            "400": {
              description:
                "Error de validación (cantidad negativa, stock insuficiente)",
            },
            "404": { description: "Producto no encontrado" },
          },
        },
      },
      "/api/orders/{id}/status": {
        put: {
          summary: "Actualizar estado de un pedido",
          tags: ["Orders"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              example: "order_1",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      enum: ["pending", "completed", "cancelled"],
                    },
                  },
                },
                examples: {
                  Completar: {
                    summary: "✅ Marcar Completado (200)",
                    value: { status: "completado" },
                  },
                  Cancelar: {
                    summary: "✅ Cancelar Pedido (200)",
                    value: { status: "cancelado" },
                  },
                  EstadoInvalido: {
                    summary: "❌ Estado Inexistente (400)",
                    value: { status: "entregado_por_drone" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Estado actualizado correctamente" },
            "400": { description: "Estado inválido" },
            "404": { description: "Pedido no encontrado" },
          },
        },
      },
      "/api/orders/product/{productId}": {
        get: {
          summary: "Obtener pedidos por producto",
          tags: ["Orders"],
          parameters: [
            {
              name: "productId",
              in: "path",
              required: true,
              schema: { type: "string" },
              example: "prod_1",
            },
          ],
          responses: {
            "200": {
              description: "Pedidos del producto",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
            "404": { description: "El producto no existe" },
          },
        },
      },
      "/api/reports/stock": {
        get: {
          summary: "Generar reporte de stock",
          tags: ["Reports"],
          responses: {
            "200": {
              description: "PDF (base64) generado exitosamente",
              content: { "application/pdf": {} },
            },
            "404": { description: "No hay productos para generar el reporte" },
          },
        },
      },
      "/api/reports/low-stock": {
        get: {
          summary: "Reporte de productos con bajo stock",
          tags: ["Reports"],
          responses: {
            "200": {
              description: "PDF (base64) generado exitosamente",
              content: { "application/pdf": {} },
            },
            "404": { description: "No hay productos con bajo stock" },
          },
        },
      },
      "/api/reports/sales": {
        get: {
          summary: "Reporte de ventas",
          tags: ["Reports"],
          parameters: [
            {
              name: "startDate",
              in: "query",
              required: false,
              schema: { type: "string", format: "date" },
              description: "Fecha inicio (YYYY-MM-DD)",
              example: new Date().toISOString().split("T")[0],
            },
            {
              name: "endDate",
              in: "query",
              required: false,
              schema: { type: "string", format: "date" },
              description: "Fecha fin (YYYY-MM-DD)",
              example: new Date().toISOString().split("T")[0],
            },
          ],
          responses: {
            "200": {
              description: "PDF (base64) generado exitosamente",
              content: { "application/pdf": {} },
            },
            "400": {
              description: "Fechas inválidas, futuras o rango incorrecto",
            },
            "404": { description: "No se encontraron ventas en ese rango" },
          },
        },
      },
    },
  },
  apis: [],
};

const specs = swaggerJsdoc(options);

export default specs;
