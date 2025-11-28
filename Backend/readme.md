# 📦 Sistema de Gestión de Stock — Backend

Backend del proyecto — API REST en Node.js + TypeScript + MySQL + Patrones de Diseño

## Descripción General

Este proyecto implementa el backend de un Sistema de Gestión de Stock, desarrollado con Node.js, TypeScript, Express, MySQL y una arquitectura modular basada en patrones de diseño de software.

El sistema permite administrar productos, registrar órdenes, manejar movimientos de stock, generar reportes PDF y activar alertas personalizadas.

Incluye:

```plaintext
✅ API REST documentada con Swagger
✅ Base de datos
✅ Pruebas unitarias y de integracion con Jest
✅ Uso de Docker
✅ Implementación de patrones como:

   - Factory

   - Builder

   - Decorator

   - Adapter

   - Observer
```

### Tecnologías Utilizadas

- Node.js 18+

- TypeScript

- Express

- MySQL

- Jest (tests)

- Docker & Docker Compose

- Swagger (documentación de API)

- PDFKit (vía adaptador)

- Patrones de diseño de software

### 🗂️ Estructura del Proyecto

```plaintext
Backend/
│   .dockerignore
│   .env
│   .gitignore
│   app.ts
│   docker-compose.yml
│   dockerfile
│   index.ts
│   jest.config.cjs
│   package-lock.json
│   package.json
│   readme.md
│   swagger.ts
│   tsconfig.json
│
├── setup.sql
└── src
    ├── config
    │       database.ts
    │
    ├── controllers
    │       OrderController.ts
    │       ProductController.ts
    │       ReportController.ts
    │
    ├── dataBase
    │       setup.sql
    │
    ├── middleware
    │       validation.ts
    │
    ├── models
    │       Order.ts
    │       Product.ts
    │       StockMovement.ts
    │
    ├── patterns
    │       AlertService.ts
    │       PDFAdapter.ts
    │       ProductBuilder.ts
    │       ProductDecorator.ts
    │       ProductFactory.ts
    │
    ├── routes
    │       index.ts
    │       orderRoutes.ts
    │       productRoutes.ts
    │       reportRoutes.ts
    │
    ├── scripts
    │       init-db.ts
    │
    ├── services
    │       OrderService.ts
    │       ProductService.ts
    │       ReportService.ts
    │
    ├── tests
    │       alert.test.ts
    │       product.builder.test.ts
    │       product.decorator.test.ts
    │       product.integration.test.ts
    │       product.test.ts
    │
    └── utils
            validators.ts
```

### 🚀 Instalación y Ejecución

```ruby
1️⃣ Clonar el repositorio
git clone https://github.com/PerroneEros/Proyecto-Sistema-de-stock.git
cd Proyecto-Sistema-de-stock/Backend

2️⃣ Instalar dependencias
npm install

3️⃣ Configurar variables de entorno

Crear .env en la raíz:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=admin12345.
DB_NAME=faststoc_db
PORT=3000

4️⃣ Inicializar base de datos
Opción A — Script SQL
mysql -u root -p < setup.sql

Opción B — Script TypeScript
npm run db:init

5️⃣ Ejecutar el servidor
Modo producción
npm start

Modo desarrollo
npm run dev
```

### 🐳 Ejecución con Docker

```ruby
1. Construir e iniciar
docker-compose up --build -d

2. Detener contenedores
docker-compose down
```

### 📚 Documentación de la API (Swagger)

Una vez iniciado el proyecto:

- 📌 http://localhost:3000/api-docs

La documentación se genera desde el archivo:

swagger.ts

## 📌 Endpoints principales

#### 📦 Productos

```plaintext
GET	/products	Listar productos
GET	/products/:id	Obtener producto
POST	/products	Crear producto (Factory + Builder)
PUT	/products/:id	Actualizar producto
DELETE	/products/:id	Eliminar producto
```

🛒 Pedidos

```plaintext
GET	/orders	Listar órdenes
POST	/orders	Crear orden
GET	/orders/:id	Ver orden
```

📊 Reportes

```plaintext
GET	/reports/pdf	Generar reporte PDF (Adapter)
GET	/reports/alerts	Ver alertas (Observer)
```

### Patrones de Diseño Implementados

✔️ Singleton — Conexión a la Base de Datos

Archivo: src/config/database.ts

- Garantiza que exista una única instancia de conexión a la base de datos.

- Evita reconexiones innecesarias y mejora el rendimiento.

- Asegura consistencia en todas las operaciones que requieren acceso al almacenamiento.

- Permite un manejo centralizado de errores y reconexión.

✔️ Factory — Creación de Productos

Archivo: src/patterns/ProductFactory.ts

- Permite crear distintos tipos de productos según su categoría o tipo.

- Evita lógica repetida en los controladores o servicios.

- Facilita la extensibilidad del sistema cuando se agreguen nuevos tipos de productos.

- Separa la lógica de creación de la lógica de negocio.

✔️ Builder — Construcción de Productos Complejos

Archivo: src/patterns/ProductBuilder.ts

- Facilita la creación de productos con múltiples atributos opcionales.

- Implementa un flujo de construcción más legible y flexible.

- Permite transformar un DTO en un objeto de dominio de forma ordenada.

- Útil para productos con propiedades variables o configurables.

✔️ Decorator — Extensión Dinámica de Funcionalidades

Archivo: src/patterns/ProductDecorator.ts

- Permite añadir funcionalidades sin modificar la clase base del producto.

- Útil para aplicar recargos, descuentos, etiquetas o precios finales.

- Define comportamientos adicionales de manera flexible y desacoplada.

- Facilita la combinación de múltiples decoradores si fuera necesario.

✔️ Adapter — Exportación de Datos a PDF

Archivo: src/patterns/PDFAdapter.ts

- Adapta los datos internos de productos y movimientos para ser consumidos por la librería PDFKit.

- Permite cambiar la librería de generación de PDFs sin afectar el resto del sistema.

- Reduce el acoplamiento entre lógica del sistema y librerías externas.

✔️ Observer — Sistema de Alertas

Archivo: src/patterns/AlertService.ts

- Observa cambios en el stock de productos.

- Notifica automáticamente cuando un producto baja su nivel mínimo.

- Permite implementar alertas.

✔️ Facade — Interfaz Simplificada del Sistema

Implementación distribuida en: controladores + servicios

- Unifica operaciones complejas del sistema bajo interfaces simples.

- El usuario final interactúa con métodos que encapsulan múltiples operaciones internas.

- Reduce la complejidad para el cliente externo.

✔️ Command — Pedidos y Registro Histórico

Relación con: Order.ts, OrderService.ts

- Cada pedido puede interpretarse como un comando ejecutado en el sistema.

- Permite registrar cambios en el stock de forma histórica.

- Sienta las bases para implementar undo/redo en operaciones de stock.

- Separa la acción (pedido) del ejecutor (servicio), lo que mejora el desacoplamiento.

| Patrón    | Archivo(s)                     | Propósito                                      |
| --------- | ------------------------------ | ---------------------------------------------- |
| Singleton | `database.ts`                  | Una única instancia de base de datos           |
| Factory   | `ProductFactory.ts`            | Creación de productos según su tipo            |
| Builder   | `ProductBuilder.ts`            | Construcción de objetos complejos              |
| Decorator | `ProductDecorator.ts`          | Añadir funciones sin modificar la clase base   |
| Adapter   | `PDFAdapter.ts`                | Exportar reportes a PDF sin acoplar el sistema |
| Observer  | `AlertService.ts`              | Sistema de alertas de stock                    |
| Facade    | Servicios + Controladores      | Interfaz simplificada del sistema              |
| Command   | Ordenes y movimientos de stock | Ejecutar acciones con registro histórico       |

### 🧪 Testing

La carpeta src/tests contiene:

```plaintext
✔️ Tests unitarios de patrones

✔️ Tests de servicios

✔️ Tests de integración producto–stock

✔️ Mocking de base de datos
```

- Ejecutar tests:

```ruby
   npm test
```

- Validaciones

Se utilizan middlewares y funciones de validación:

validation.ts

utils/validators.ts

Incluye validaciones de:

```plaintext
✔️ Nombre
✔️ Precio
✔️ Stock
✔️ Tipos de movimiento
✔️ Cuerpo de request
✔️ IDs
```

### 📊 Base de Datos

Esquema definido en:

setup.sql
src/dataBase/setup.sql

Incluye tablas:

products

orders

stock_movements

👥 Integrantes:
Eros Perrone - Franco Devaux - Bruno Fernandez - Ivo Depari
