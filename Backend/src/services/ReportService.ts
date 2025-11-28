import { DatabaseConfig } from "../config/database";
import { ProductService } from "./ProductService";
import { OrderService } from "./OrderService";
import { PDFAdapter, ReportGenerator } from "../patterns/PDFAdapter";

export class ReportService {
  private static instance: ReportService;
  private db: DatabaseConfig;
  private productService: ProductService;
  private orderService: OrderService;
  private pdfAdapter: ReportGenerator;

  private constructor() {
    this.db = DatabaseConfig.getInstance();
    this.productService = ProductService.getInstance();
    this.orderService = OrderService.getInstance();
    // Inicializamos el Adapter concreto
    this.pdfAdapter = new PDFAdapter();
  }

  // Implementación del patrón Singleton
  public static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }
    return ReportService.instance;
  }

/*Genera reporte de stock total.
Delega la creación del archivo al PDFAdapter.*/
  async generateStockReport(): Promise<Buffer> {
    const products = await this.productService.getAllProducts();
    
    if (!products || products.length === 0) {
        throw new Error("No hay productos para generar el reporte");
    }

    return await this.pdfAdapter.generateStockReport(products);
  }

/*Filtra productos críticos y genera su reporte.*/
  async generateLowStockReport(): Promise<Buffer> {
    const products = await this.productService.getAllProducts();
    const lowStockProducts = products.filter(
      (p) => p.currentStock <= p.minStock
    );

    if (lowStockProducts.length === 0) {
        throw new Error("No hay productos con bajo stock");
    }

    return await this.pdfAdapter.generateLowStockReport(lowStockProducts);
  }

/*Genera reporte de ventas filtrando por rango de fechas.
Se fuerza el horario UTC para cubrir el día completo y evitar errores de zona horaria.*/
  async generateSalesReport(
    startDate?: string,
    endDate?: string
  ): Promise<Buffer> {
    let orders = await this.orderService.getAllOrders();

    if (startDate && endDate) {
      const start = new Date(`${startDate}T00:00:00.000Z`);
      const end = new Date(`${endDate}T23:59:59.999Z`);

      console.log("Generando reporte desde:", start.toISOString(), "hasta:", end.toISOString());

      orders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
      });
    }
    
    if (orders.length === 0) {
        throw new Error("No se encontraron ventas en el rango de fechas seleccionado");
    }

    return await this.pdfAdapter.generateSalesReport(
      orders,
      startDate,
      endDate
    );
  }

  // Helper para consultas SQL directas de movimientos
  async getStockMovements(productId?: string): Promise<any[]> {
    let sql = `
      SELECT sm.*, p.name as product_name 
      FROM stock_movements sm 
      LEFT JOIN products p ON sm.product_id = p.id
    `;

    const params: any[] = [];

    if (productId) {
      sql += " WHERE sm.product_id = ?";
      params.push(productId);
    }

    sql += " ORDER BY sm.created_at DESC";

    return await this.db.query(sql, params);
  }
}