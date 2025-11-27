import { Product } from "./../models/Product";

// Interface del patrón Observer Define el contrato para recibir alertas
export interface StockObserver {
  onLowStock(product: Product): void;
}

//Gestiona la lista de observadores y notifica eventos (Singleton)
export class AlertService {
  private static instance: AlertService;
  private observers: StockObserver[] = [];

  private constructor() {}

// Garantiza una única instancia del servicio de alertas
  public static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

// Suscribe un nuevo observador
  public attach(observer: StockObserver): void {
    this.observers.push(observer);
    console.log('Observador agregado al sistema de alertas');
  }

// Verifica condiciones de negocio y notifica a todos los suscriptores  
  public notifyLowStock(product: Product): void {
    if (product.currentStock <= product.minStock) {
      console.log(`ALERTA! Stock bajo para ${product.name} - Stock actual: ${product.currentStock}`);
      this.observers.forEach(observer => observer.onLowStock(product));
    }
  }
}

//Simula el envío de un correo
export class EmailNotifier implements StockObserver {
  onLowStock(product: Product): void {
    console.log(`Enviando email: Stock crítico para ${product.name}`);
  }
}

//Alerta simple en consola
export class ConsoleNotifier implements StockObserver {
  onLowStock(product: Product): void {
    console.log(`ALERTA EN LA CONSOLA! ${product.name} tiene un stock bajo (${product.currentStock})`);
  }
}