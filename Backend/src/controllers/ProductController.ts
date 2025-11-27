import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = ProductService.getInstance();
  }

  // Recupera el catálogo completo de productos
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error obtener productos:", error);
      res.status(500).json({ error: "Error al obtener productos" });
    }
  }

// Busca un producto por ID
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      
      if (!product) {
        res.status(404).json({ error: "Producto no encontrado" });
        return;
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error al obtener producto:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

// Crea un nuevo producto
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData = req.body;
      const product = await this.productService.createProduct(productData);
      res.status(201).json(product);
    } catch (error: any) {
      console.error("Error crear producto:", error);
      
      res.status(400).json({ error: error.message || "Error al crear producto" });
    }
  }

  // Actualiza el stock.
  async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { stock } = req.body;
      
      if (typeof stock !== 'number' || stock < 0) {
        res.status(400).json({ error: "El stock debe ser un número positivo" });
        return;
      }

      const updatedProduct = await this.productService.updateStock(id, stock);
      
      res.json({ 
        message: "Stock actualizado correctamente",
        product: updatedProduct 
      })

    } catch (error: any) {
      console.error("Error actualizar stock:", error);
      
      if (error.message === "Producto no encontrado") {
        res.status(404).json({ error: "Producto no encontrado" });
      } else {
        res.status(400).json({ error: "Error al actualizar stock" });
      }
    }
  }
}