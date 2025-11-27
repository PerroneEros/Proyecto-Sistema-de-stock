import express from "express";
import cors from "cors";
import routes from "./routes";
import { DatabaseConfig } from "./config/database";
import {
  AlertService,
  EmailNotifier,
  ConsoleNotifier,
} from "./patterns/AlertService";
import {
  validateProduct,
  validateOrder,
  validateDateRange,
} from "./middleware/validation";
import swaggerUi from "swagger-ui-express";
import specs from "./swagger";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.database();
    this.setupObservers();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private routes(): void {
    this.app.use("/api", routes);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

    this.app.get("/health", (req, res) => {
      res.json({
        status: "OK",
        message: "Stock API funcionando",
        timestamp: new Date().toISOString(),
      });
    });
  }

  private database(): void {
    DatabaseConfig.getInstance();
  }

  private setupObservers(): void {
    const alertService = AlertService.getInstance();
    alertService.attach(new EmailNotifier());
    alertService.attach(new ConsoleNotifier());
    console.log("Observadores de alertas configurados");
  }
}

export default new App().app;
