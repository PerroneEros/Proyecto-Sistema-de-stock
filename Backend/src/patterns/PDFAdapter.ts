import PDFDocument from "pdfkit";
import { Product } from "./../models/Product";
import { Order } from "./../models/Order";

// Interface para desacoplar la generación de reportes (Inversión de Dependencias)
export interface ReportGenerator {
  generateStockReport(products: Product[]): Promise<Buffer>;
  generateLowStockReport(products: Product[]): Promise<Buffer>;
  generateSalesReport(
    orders: Order[],
    startDate?: string,
    endDate?: string
  ): Promise<Buffer>;
}

// Implementación del patrón Adapter: Adapta datos de dominio a formato PDF
export class PDFAdapter implements ReportGenerator {
  // Genera reporte de inventario completo
  async generateStockReport(products: Product[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];

        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Encabezado
        doc
          .fontSize(20)
          .text("Reporte de Stock - FastStoc", { align: "center" });
        doc.moveDown();
        doc
          .fontSize(12)
          .text(`Generado el: ${new Date().toLocaleDateString()}`, {
            align: "center",
          });
        doc.moveDown();
        // Tabla de productos
        let yPosition = doc.y + 30;
        // Encabezados de tabla
        doc.fontSize(10);
        doc.text("Producto", 50, yPosition);
        doc.text("Stock", 250, yPosition);
        doc.text("Mínimo", 320, yPosition);
        doc.text("Estado", 390, yPosition);

        yPosition += 20;
        doc.moveTo(50, yPosition).lineTo(500, yPosition).stroke();
        yPosition += 10;

        // Filas de productos
        products.forEach((product, index) => {
          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
          }

          const status =
            product.currentStock <= product.minStock ? "CRÍTICO" : "NORMAL";
          const statusColor = status === "CRÍTICO" ? "#ff4444" : "#00c851";

          doc.text(product.name.substring(0, 30), 50, yPosition);
          doc.text(product.currentStock.toString(), 250, yPosition);
          doc.text(product.minStock.toString(), 320, yPosition);
          doc
            .fillColor(statusColor)
            .text(status, 390, yPosition)
            .fillColor("#000000");

          yPosition += 20;

          if (index < products.length - 1) {
            doc.moveTo(50, yPosition).lineTo(500, yPosition).stroke();
            yPosition += 10;
          }
        });

        // Resumen
        yPosition += 20;
        const criticalProducts = products.filter(
          (p) => p.currentStock <= p.minStock
        ).length;
        doc.text(`Total de productos: ${products.length}`, 50, yPosition);
        doc.text(
          `Productos con stock crítico: ${criticalProducts}`,
          50,
          yPosition + 15
        );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Reutiliza la lógica de stock filtrando solo los críticos
  async generateLowStockReport(products: Product[]): Promise<Buffer> {
    const lowStockProducts = products.filter(
      (p) => p.currentStock <= p.minStock
    );
    return this.generateStockReport(lowStockProducts);
  }

  // Genera reporte de ventas
  async generateSalesReport(
    orders: Order[],
    startDate?: string,
    endDate?: string
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];

        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Encabezado
        doc
          .fontSize(20)
          .text("Reporte de Ventas - FastStoc", { align: "center" });
        doc.moveDown();

        const periodText =
          startDate && endDate
            ? `Período: ${startDate} a ${endDate}`
            : "Período: Todos los registros";

        doc.fontSize(12).text(periodText, { align: "center" });
        doc.text(`Generado el: ${new Date().toLocaleDateString()}`, {
          align: "center",
        });
        doc.moveDown();

        // Estadísticas
        const totalOrders = orders.length;
        const completadoOrders = orders.filter(
          (o) => o.status === "completado"
        ).length;
        const totalQuantity = orders.reduce(
          (sum, order) => sum + order.quantity,
          0
        );

        doc.fontSize(14).text("Resumen de Ventas:");
        doc.moveDown(0.5);
        doc.fontSize(12);
        doc.text(`Total de pedidos: ${totalOrders}`);
        doc.text(`Pedidos completados: ${completadoOrders}`);
        doc.text(`Cantidad total vendida: ${totalQuantity} unidades`);
        doc.moveDown();

        let yPosition = doc.y + 30;

        // Encabezados de tabla
        doc.fontSize(10);
        doc.text("ID Pedido", 50, yPosition);
        doc.text("Producto", 150, yPosition);
        doc.text("Cantidad", 300, yPosition);
        doc.text("Estado", 370, yPosition);
        doc.text("Fecha", 430, yPosition);

        yPosition += 20;
        doc.moveTo(50, yPosition).lineTo(500, yPosition).stroke();
        yPosition += 10;

        // Filas de pedidos
        orders.forEach((order, index) => {
          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
          }

          const orderId = order.id ? order.id.toString() : "N/A";
          const prodName = (order as any).productName || "Desconocido";

          doc.text(orderId.substring(0, 8), 50, yPosition);
          doc.text(prodName.substring(0, 25), 150, yPosition);
          doc.text(order.quantity.toString(), 300, yPosition);

          const statusColor =
            order.status === "completado"
              ? "#00c851"
              : order.status === "pendiente"
              ? "#ffbb33"
              : "#ff4444";
          doc
            .fillColor(statusColor)
            .text(order.status, 370, yPosition)
            .fillColor("#000000");

          doc.text(
            new Date(order.createdAt).toLocaleDateString(),
            430,
            yPosition
          );

          yPosition += 20;

          if (index < orders.length - 1) {
            doc.moveTo(50, yPosition).lineTo(500, yPosition).stroke();
            yPosition += 10;
          }
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
