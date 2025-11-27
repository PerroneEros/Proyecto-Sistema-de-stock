import { Request, Response } from 'express';
import { ReportService } from '../services/ReportService';

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = ReportService.getInstance();
  }

// Genera y descarga el PDF de stock total
  async generateStockReport(req: Request, res: Response): Promise<void> {
    try {
      const pdfBuffer = await this.reportService.generateStockReport();
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte-stock.pdf');
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error('Error obteniendo stock reporte:', error);
      
      if (error.message === "No hay productos para generar el reporte") {
         res.status(404).json({ error: error.message });
      } else {
         res.status(500).json({ error: 'Error al generar reporte de stock' });
      }
    }
  }

// Genera reporte filtrando solo productos con stock crítico
  async generateLowStockReport(req: Request, res: Response): Promise<void> {
    try {
      const pdfBuffer = await this.reportService.generateLowStockReport();
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte-stock-bajo.pdf');
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error('Error al generar el informe de stock bajo:', error);
      
      if (error.message === "No hay productos con bajo stock") {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al generar reporte de stock bajo' });
      }
    }
  }
  
// Reporte de ventas con filtro de fechas opcional
  async generateSalesReport(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const pdfBuffer = await this.reportService.generateSalesReport(
        startDate as string, 
        endDate as string
      );
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-ventas-${startDate}-${endDate}.pdf`);
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error('Error al generar el informe de ventas:', error);
      
      if (error.message.includes("No se encontraron ventas")) {
         res.status(404).json({ error: error.message });
      } else {
         res.status(500).json({ error: 'Error al generar reporte de ventas' });
      }
    }
  }
}