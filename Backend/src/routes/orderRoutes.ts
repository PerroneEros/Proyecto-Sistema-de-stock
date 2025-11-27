import { Router } from "express";
import { OrderController } from "../controllers/OrderController";
import { validateOrder } from "../middleware/validation";

const router = Router();
const orderController = new OrderController();

router.get("/", orderController.getAllOrders.bind(orderController));
router.post("/", validateOrder, orderController.createOrder.bind(orderController));

router.get(
  "/product/:productId",
  orderController.getOrdersByProduct.bind(orderController)
);
router.put(
  "/:id/status",
  orderController.updateOrderStatus.bind(orderController)
);

export default router;
