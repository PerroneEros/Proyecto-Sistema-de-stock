import { Router } from "express";
import { ReportController } from "../controllers/ReportController";
import { validateDateRange } from "../middleware/validation";

const router = Router();
const reportController = new ReportController();

router.get(
  "/stock",
  reportController.generateStockReport.bind(reportController)
);
router.get(
  "/low-stock",
  reportController.generateLowStockReport.bind(reportController)
);
router.get(
  "/sales",
  validateDateRange, 
  reportController.generateSalesReport.bind(reportController)
);

export default router;