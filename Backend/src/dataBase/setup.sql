-- Ejecutar este script en MySQL para crear la base de datos y tablas

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS faststoc_db;
USE faststoc_db;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  current_stock INT NOT NULL DEFAULT 0,
  min_stock INT NOT NULL DEFAULT 5,
  category VARCHAR(100) NOT NULL,
  type ENUM('basico', 'perecedero', 'electronico') NOT NULL DEFAULT 'basico',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_category (category),
  INDEX idx_stock (current_stock),
  INDEX idx_min_stock (min_stock),
  INDEX idx_type (type)
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  status ENUM('pendiente', 'completado', 'cancelado') NOT NULL DEFAULT 'pendiente',
  user_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Tabla de movimientos de stock
CREATE TABLE IF NOT EXISTS stock_movements (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36) NOT NULL,
  old_stock INT NOT NULL,
  new_stock INT NOT NULL,
  movement_type ENUM('entrada', 'salida', 'ajuste') NOT NULL,
  reason VARCHAR(255),
  order_id VARCHAR(36),
  user_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  INDEX idx_product_id (product_id),
  INDEX idx_created_at (created_at),
  INDEX idx_movement_type (movement_type)
);

-- DATOS DE EJEMPLO PARA PROBAR EL SISTEMA

-- Productos de ejemplo
INSERT INTO products (id, name, description, price, current_stock, min_stock, category, type) VALUES
('prod_1', 'Laptop HP', 'Laptop empresarial i5 8GB RAM', 899.99, 15, 5, 'Tecnología', 'electronico'),
('prod_2', 'Mouse Inalámbrico', 'Mouse ergonómico inalámbrico', 25.50, 8, 10, 'Accesorios', 'basico'),
('prod_3', 'Leche Entera', 'Leche entera 1L', 2.99, 3, 15, 'Lácteos', 'perecedero'),
('prod_4', 'Teclado Mecánico', 'Teclado mecánico RGB', 89.99, 20, 8, 'Accesorios', 'electronico'),
('prod_5', 'Yogurt Natural', 'Yogurt natural 500g', 1.99, 2, 20, 'Lácteos', 'perecedero'),
('prod_6', 'Monitor 24"', 'Monitor LED 24 pulgadas Full HD', 199.99, 12, 6, 'Tecnología', 'electronico');

-- Pedidos de ejemplo
INSERT INTO orders (id, product_id, quantity, status, user_id) VALUES
('order_1', 'prod_1', 2, 'completado', 'user_123'),
('order_2', 'prod_2', 5, 'completado', 'user_456'),
('order_3', 'prod_3', 10, 'pendiente', 'user_789'),
('order_4', 'prod_4', 3, 'completado', 'user_101'),
('order_5', 'prod_6', 1, 'completado', 'user_202');

-- Movimientos de stock de ejemplo
INSERT INTO stock_movements (id, product_id, old_stock, new_stock, movement_type, reason, order_id, user_id) VALUES
('mov_1', 'prod_1', 17, 15, 'salida', 'Venta realizada', 'order_1', 'user_123'),
('mov_2', 'prod_2', 13, 8, 'salida', 'Venta realizada', 'order_2', 'user_456'),
('mov_3', 'prod_3', 13, 3, 'salida', 'Venta realizada', 'order_3', 'user_789'),
('mov_4', 'prod_4', 23, 20, 'salida', 'Venta realizada', 'order_4', 'user_101'),
('mov_5', 'prod_6', 13, 12, 'salida', 'Venta realizada', 'order_5', 'user_202'),
('mov_6', 'prod_1', 15, 20, 'entrada', 'Reabastecimiento', NULL, 'admin_001');

-- CONSULTAS PARA VERIFICAR QUE TODO FUNCIONE:

-- Ver productos con stock bajo
SELECT name, current_stock, min_stock FROM products WHERE current_stock <= min_stock;

-- Ver todos los productos
SELECT * FROM products;

-- Ver pedidos completados
SELECT * FROM orders WHERE status = 'completado';

-- Ver movimientos de stock recientes
SELECT * FROM stock_movements ORDER BY created_at DESC LIMIT 5;
