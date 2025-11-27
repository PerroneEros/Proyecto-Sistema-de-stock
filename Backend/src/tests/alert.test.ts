import { AlertService } from "./../patterns/AlertService";
import { Product } from "../models/Product";
import { StockObserver } from "./../patterns/AlertService"; 

// Mock del Observador: Simulamos un objeto que espere la notificación
const mockObserver: StockObserver = {
  onLowStock: jest.fn() 
};

// Datos de prueba (Fixtures)
const lowStockProduct: Product = {
  id: 'p1', name: 'Test', description: '', price: 100,
  currentStock: 3, 
  minStock: 5,     
  category: 'test', type: 'basico', createdAt: new Date(), updatedAt: new Date()
};

const normalStockProduct: Product = {
  id: 'p2', name: 'Test 2', description: '', price: 100,
  currentStock: 10, 
  minStock: 5,      
  category: 'test', type: 'basico', createdAt: new Date(), updatedAt: new Date()
};


describe('Pattern Observer - AlertService', () => {

  let alertService: AlertService;

  beforeEach(() => {
    // 1. Limpiamos el mock para que empiece de cero
    (mockObserver.onLowStock as jest.Mock).mockClear(); 
    //Reseteamos la caché de módulos de Jest(para los singeltons).
    // Esto obliga a que se cree una instancia NUEVA de AlertService para cada test.
    jest.resetModules();
    // Importamos dinámicamente después del reset
    const { AlertService: FreshAlertService } = require('../patterns/AlertService');
    alertService = FreshAlertService.getInstance();
    alertService.attach(mockObserver);
  });

  test('El Sujeto (AlertService) debe notificar al Observador si el stock es bajo', () => {
    //Act
    alertService.notifyLowStock(lowStockProduct);
    //Assert
    expect(mockObserver.onLowStock).toHaveBeenCalledTimes(1);
    expect(mockObserver.onLowStock).toHaveBeenCalledWith(lowStockProduct);
  });

  test('El Sujeto (AlertService) NO debe notificar si el stock es normal', () => {
    //Act
    alertService.notifyLowStock(normalStockProduct);
    //Assert
    expect(mockObserver.onLowStock).not.toHaveBeenCalled();
  });
});