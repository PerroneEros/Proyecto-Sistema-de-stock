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
C:.
|   .dockerignore
|   .env
|   .eslintrc.json
|   .gitignore
|   .prettierrc
|   dockerfile
|   LICENCE
|   package-lock.json
|   package.json
|   tsconfig.json
|
+---src
|   |   .sequelizerc
|   |   app.ts
|   |   server.ts
|   |
|   +---config
|   |       config.js
|   |
|   +---controllers
|   |       order.Controller.ts
|   |       orderDetail.Controller.ts
|   |       product.Controller.ts
|   |       report.Controller.ts
|   |       user.Controller.ts
|   |
|   +---database
|   |       db.ts
|   |       init.ts
|   |
|   +---middlewares
|   |       auth.Middleware.ts
|   |
|   +---mock
|   |       orderDetailMock.json
|   |       orderMock.json
|   |       productMock.json
|   |       reportMock.json
|   |       userMock.json
|   |
|   +---models
|   |   |   associations.ts
|   |   |   order.ts
|   |   |   orderDetail.ts
|   |   |   product.ts
|   |   |   report.ts
|   |   |   user.ts
|   |   |   
|   |   \---Interface
|   |           orderAttributes.ts
|   |           orderDetailAttributes.ts
|   |           productAttributes.ts
|   |           reportAttributes.ts
|   |           userAttributes.ts
|   |
|   +---public
|   |   \---product_icons
|   |           1.jpeg
|   |           10.jpeg
|   |           11.jpeg
|   |           12.jpeg
|   |           13.jpeg
|   |           14.jpeg
|   |           15.jpeg
|   |           2.jpeg
|   |           3.jpeg
|   |           4.jpeg
|   |           5.jpeg
|   |           6.jpeg
|   |           7.jpeg
|   |           8.jpeg
|   |           9.jpeg
|   |
|   +---routes
|   |       order.Routes.ts
|   |       orderDetail.Routes.ts
|   |       product.Routes.ts
|   |       report.Routes.ts
|   |       user.Routes.ts
|   |
|   +---seeders
|   |       seeder.ts
|   |
|   +---services
|   |       order.Service.ts
|   |       orderDetail.Service.ts
|   |       product.Service.ts
|   |       report.Service.ts
|   |       user.Service.ts
|   |
|   \---utils
|           cloudinary.ts
|
+---test
|   |   root.test.ts
|   |
|   +---prueba de integracion mock
|   |       detallePedido.integration.test.ts
|   |       pedido.integration.test.ts
|   |       product.integration.test.ts
|   |       reporte.integration.test.ts
|   |       user.integration.test.ts
|   |
|   +---routes
|   |   +---pedido
|   |   |       pedido.routes.test.ts
|   |   |
|   |   +---product
|   |   |       product.routes.test.ts
|   |   |       
|   |   +---reportes
|   |   |       reportes.routes.test.ts
|   |   |
|   |   \---user
|   |           user.routes.test.ts
|   |
|   +---services
|   |       detallePedido.service.test.ts
|   |       pedido.service.test.ts
|   |       product.service.test.ts
|   |       reporte.service.test.ts
|   |       user.service.test.ts
|   |
|   \---utils
|           request.ts
|
\---uploads
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
Se utiliza para garantizar una única instancia de conexión a la base de datos durante toda la ejecución del backend.
Multiples instancias generarían conexiones duplicadas, inestabilidad e inconsistencias.

✔ Cómo se aplica

La clase mantiene un método getInstance() que devuelve siempre la misma conexión.

✔ Problema que resuelve

- Evita reconexiones innecesarias y mejora el rendimiento.
- Asegura consistencia en todas las operaciones que requieren acceso al almacenamiento.
- Permite un manejo centralizado de errores y reconexión.
- Reduce consumo de recursos
- Mantiene integridad y sincronización entre operaciones de stock y órdenes

✔️ Factory — Creación de Productos

Archivo: src/patterns/ProductFactory.ts
Permite crear productos de distintos tipos sin llenar el código de condicionales (if, switch).
Es ideal para un sistema que puede crecer en variedad de productos.

✔ Cómo se aplica

La factory recibe un DTO y devuelve la instancia correcta del modelo de producto.

✔ Problema que resuelve

- Evita lógica repetida en los controladores o servicios.

- Facilita la extensibilidad del sistema cuando se agreguen nuevos tipos de productos.

- Separa la lógica de creación de la lógica de negocio.

✔️ Builder — Construcción de Productos Complejos

Archivo: src/patterns/ProductBuilder.ts

Los productos tienen múltiples atributos obligatorios y opcionales.
El patrón permite construirlos paso a paso y con validaciones.

✔ Cómo se aplica

Cada método del builder establece una propiedad hasta ejecutar build().

✔ Problema que resuelve

- Implementa un flujo de construcción más legible y flexible.

- Permite transformar un DTO en un objeto de dominio de forma ordenada.

- Útil para productos con propiedades variables o configurables.
- Permite validaciones centralizadas
- Simplifica extensiones futuras

✔️ Decorator — Extensión Dinámica de Funcionalidades

Archivo: src/patterns/ProductDecorator.ts

Permite agregar funcionalidades adicionales a un producto (precio final, descuentos, etiquetas, etc.) sin modificar su clase base.

✔ Cómo se aplica

Un producto puede envolverse con un decorador que agrega comportamiento dinámico.

✔ Problema que resuelve

- Evita crear múltiples subclases

- Permite añadir lógica extra sin romper el modelo original

- Facilita personalización dinámica

- Define comportamientos adicionales de manera flexible y desacoplada.

- Facilita la combinación de múltiples decoradores si fuera necesario.

✔️ Adapter — Exportación de Datos a PDF

Archivo: src/patterns/PDFAdapter.ts
La generación de PDF depende de librerías externas (PDFKit).
El adapter permite desacoplar el sistema de dicha librería.

✔ Cómo se aplica

Convierte productos, órdenes y movimientos en el formato apto para PDFKit.

✔ Problema que resuelve

- Permite cambiar de proveedor de PDFs fácilmente

- Centraliza la conversión
- Reduce el acoplamiento entre lógica del sistema y librerías externas.

✔️ Observer — Sistema de Alertas

Archivo: src/patterns/AlertService.ts
El sistema necesita disparar alertas cuando un producto está por debajo del stock mínimo.

✔ Cómo se aplica

El AlertService actúa como sujeto, notificando a observadores registrados cuando cambia el stock.

✔ Problema que resuelve

- Desacopla la lógica de alertas del resto del sistema

- Facilita añadir nuevos tipos de alertas sin modificar código existente

- Permite futuras integraciones (emails, paneles, bots, etc.)

✔️ Facade — Interfaz Simplificada del Sistema

Implementación distribuida en: controladores + servicios

Los controladores y servicios actúan como un Fachada porque unifican procesos internos que combinan:
Validación

- Acceso a la base de datos

- Construcción del producto vía Builder

- Creación vía Factory

- Extensión vía Decorator

- Notificaciones vía Observer

- Exportación vía Adapter

✔ ¿Qué operaciones unifica concretamente?
▶ POST /products

Unifica:

- Validaciones

- Construcción (Builder)

- Creación (Factory)

- Persistencia

- Verificación de stock

- Envío de alertas

▶ POST /orders

Unifica:

- Validación

- Descuento de stock

- Registro del movimiento

- Notificaciones si hay bajo stock

▶ GET /reports/pdf

Unifica:

- Acceso a datos

- Preparación del reporte

- Adaptación a PDF

- Generación del archivo final

✔ Problema que resuelve

- Simplifica la API

- Evita exponer procesos internos complejos

- Permite reorganizar la arquitectura sin afectar las rutas

- El usuario final interactúa con métodos que encapsulan múltiples operaciones internas.

- Reduce la complejidad para el cliente externo.

✔️ Command — Pedidos y Registro Histórico

Relación con: Order.ts, OrderService.ts
Cada operación de stock puede interpretarse como un comando:

- Descontar stock

- Registrar movimientos

- Crear órdenes

- Guardar histórico

Esto permitiría en el futuro implementar funcionalidades como undo/redo.

✔ Problema que resuelve

- Mejora trazabilidad

- Organiza cambios de estado

- Deja registro histórico ordenado

- Separa la acción (pedido) del ejecutor (servicio), lo que mejora el desacoplamiento.

## Conclusion final

Cada patrón cumple un rol clave en la arquitectura:

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
