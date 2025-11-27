import { Request, Response } from "express";
import { OrderService } from "../services/OrderService";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    // Inyección del servicio usando Singleton
    this.orderService = OrderService.getInstance();
  }

  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error obtener pedidos:", error);
      res.status(500).json({ error: "Error al obtener pedidos" });
    }
  }

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderData = req.body;
      const order = await this.orderService.createOrder(orderData);
      res.status(201).json(order);
    } catch (error: any) {
      console.error("Error crear orden:", error);
      const status = error.message === "Producto no encontrado" ? 404 : 400;
      res.status(status).json({ error: error.message || "Error al crear pedido" });
    }
  }

  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      await this.orderService.updateOrderStatus(id, status);
      
      res.json({ message: "Estado del pedido actualizado correctamente" });
    } catch (error: any) {
      console.error("Error al actualizar el estado del pedido:", error);
      
      if (error.message === "Pedido no encontrado") {
        res.status(404).json({ error: "Pedido no encontrado" });
      } else {
        res.status(400).json({ error: error.message || "Error al actualizar estado" });
      }
    }
  }
  
// Obtiene historial de pedidos de un producto específico
  async getOrdersByProduct(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const orders = await this.orderService.getOrdersByProduct(productId);
      res.json(orders);
    } catch (error: any) {
      console.error("Error al obtener pedidos de productos:", error);
      
      if (error.message === "Producto no encontrado") {
         res.status(404).json({ error: "El producto no existe" });
      } else {
         res.status(500).json({ error: "Error interno" });
      }
    }
  }
}