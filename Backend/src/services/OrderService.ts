import { Order, CreateOrderDTO } from "../models/Order";
import { DatabaseConfig } from "../config/database";
import { ProductService } from "./ProductService";
import { AlertService } from "./../patterns/AlertService";

// Interface del patrón Command para encapsular operaciones
interface Command {
  execute(): Promise<void>;
  undo(): Promise<void>;
}

//Encapsula la lógica de crear un pedido
export class OrderCommand implements Command {
  private executed: boolean = false;

  constructor(
    private orderData: CreateOrderDTO,
    private orderService: OrderService
  ) {}

  async execute(): Promise<void> {
    await this.orderService.processOrder(this.orderData);
    this.executed = true;
  }

  async undo(): Promise<void> {
    if (this.executed) {
      await this.orderService.undoLastOrder(this.orderData.productId);
    }
  }
}

//Solicita la ejecución de comandos (y permite deshacerlos)
export class OrderInvoker {
  private commands: Command[] = [];
  private currentIndex: number = -1;

  async executeCommand(command: Command): Promise<void> {
    this.commands = this.commands.slice(0, this.currentIndex + 1);
    await command.execute();
    this.commands.push(command);
    this.currentIndex++;
  }

  async undo(): Promise<void> {
    if (this.currentIndex >= 0) {
      await this.commands[this.currentIndex].undo();
      this.currentIndex--;
    }
  }

  async redo(): Promise<void> {
    if (this.currentIndex < this.commands.length - 1) {
      this.currentIndex++;
      await this.commands[this.currentIndex].execute();
    }
  }
}

//lógica de pedidos
export class OrderService {
  private static instance: OrderService;
  private db: DatabaseConfig;
  private productService: ProductService;
  private alertService: AlertService;
  private invoker: OrderInvoker;

  private constructor() {
    this.db = DatabaseConfig.getInstance();
    this.productService = ProductService.getInstance();
    this.alertService = AlertService.getInstance();
    this.invoker = new OrderInvoker();
  }

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

// Obtiene todos los pedidos con join a productos
  async getAllOrders(): Promise<Order[]> {
    const rows = await this.db.query(`
      SELECT 
        o.id, 
        o.product_id as productId, 
        o.quantity, 
        o.status, 
        o.user_id as userId, 
        o.created_at as createdAt,
        p.name as productName 
      FROM orders o 
      LEFT JOIN products p ON o.product_id = p.id 
      ORDER BY o.created_at DESC
    `);
    return rows as Order[];
  }

  // Punto de entrada para crear pedidos usando Command
  async createOrder(orderData: CreateOrderDTO): Promise<Order> {
    const command = new OrderCommand(orderData, this);
    await this.invoker.executeCommand(command);
    // Recuperamos la orden recién creada para devolverla
    const rows = await this.db.query(`
        SELECT 
            id, product_id as productId, quantity, status, user_id as userId, created_at as createdAt 
        FROM orders 
        ORDER BY created_at DESC LIMIT 1
    `);
    return rows[0] as Order;
  }

  // Lógica transaccional compleja (ACID)
  async processOrder(orderData: CreateOrderDTO): Promise<void> {
    const connection = await this.db.getConnection().getConnection();

    try {
      await connection.beginTransaction();
      
      // 1. Validaciones de negocio (Existencia y Stock)
      const product = await this.productService.getProductById(orderData.productId);
      
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      if (product.currentStock < orderData.quantity) {
        throw new Error(`Stock insuficiente. Disponible: ${product.currentStock}`);
      }

      // 2. Persistencia del Pedido
      const orderId = this.generateId();
      const orderSql = `
        INSERT INTO orders (id, product_id, quantity, status, user_id, created_at)
        VALUES (?, ?, ?, 'pendiente', ?, ?)
      `;
      
      await connection.execute(orderSql, [
        orderId,
        orderData.productId,
        orderData.quantity,
        orderData.userId,
        new Date(),
      ]);

      // 3. Actualización de Stock (Atomicidad)
      const newStock = product.currentStock - orderData.quantity;
      await connection.execute(
        "UPDATE products SET current_stock = ?, updated_at = ? WHERE id = ?",
        [newStock, new Date(), orderData.productId]
      );

      const movementId = this.generateId();
      const movementSql = `
        INSERT INTO stock_movements (id, product_id, old_stock, new_stock, movement_type, reason, order_id, user_id, created_at)
        VALUES (?, ?, ?, ?, 'salida', 'Venta/Pedido', ?, ?, ?)
      `;
      // 4. Registro de Movimiento (Auditoría)
      await connection.execute(movementSql, [
        movementId,
        orderData.productId,
        product.currentStock,
        newStock,
        orderId,
        orderData.userId,
        new Date(),
      ]);

      await connection.commit();

      // 5. Notificación asíncrona (Observer)
      const updatedProduct = { ...product, currentStock: newStock };
      this.alertService.notifyLowStock(updatedProduct);

      console.log(`Pedido ${orderId} procesado exitosamente`);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const validStatuses = ['pendiente', 'completado', 'cancelado'];
    if (!validStatuses.includes(status)) {
        throw new Error("Estado inválido");
    }

    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    const result: any = await this.db.query(sql, [status, orderId]);

    if (result && result.affectedRows === 0) {
        throw new Error("Pedido no encontrado");
    }
  }

  async getOrdersByProduct(productId: string): Promise<Order[]> {
    const product = await this.productService.getProductById(productId);
    
    if (!product) {
        throw new Error("Producto no encontrado");
    }

    const rows = await this.db.query(`
      SELECT 
        id, product_id as productId, quantity, status, user_id as userId, created_at as createdAt 
      FROM orders 
      WHERE product_id = ? 
      ORDER BY created_at DESC
      `,
      [productId]
    );
    return rows as Order[];
  }
  
  // Mecanismo de reversión (Rollback lógico)
  async undoLastOrder(productId: string): Promise<void> {
    const lastOrder = await this.db.query(
      "SELECT * FROM orders WHERE product_id = ? ORDER BY created_at DESC LIMIT 1",
      [productId]
    );

    if (lastOrder.length > 0) {
      const order = lastOrder[0];
      const product = await this.productService.getProductById(productId);
      if (product) {
        const newStock = product.currentStock + order.quantity;
        await this.productService.updateStock(productId, newStock);
        await this.updateOrderStatus(order.id, "cancelado");
        console.log(`Pedido ${order.id} revertido`);
      }
    }
  }

  private generateId(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
