import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { validateProduct } from "../middleware/validation"; 

const router = Router();
const productController = new ProductController();

router.get("/", productController.getAllProducts.bind(productController));
router.post("/", validateProduct, productController.createProduct.bind(productController));
router.put("/:id/stock", productController.updateStock.bind(productController));
router.get("/:id", productController.getProductById.bind(productController));

export default router;