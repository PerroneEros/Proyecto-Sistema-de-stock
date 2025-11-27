import { Request, Response, NextFunction } from "express";

/*Valida datos de Producto Rechaza precios/stock negativos y tipos inválidos.*/
export const validateProduct = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, price, currentStock, minStock, category, type } = req.body;

  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push("El nombre del producto es requerido");
  }

  if (typeof price !== "number" || price < 0) {
    errors.push("El precio debe ser un número positivo");
  }

  if (typeof currentStock !== "number" || currentStock < 0) {
    errors.push("El stock actual debe ser un número positivo");
  }

  if (typeof minStock !== "number" || minStock < 0) {
    errors.push("El stock mínimo debe ser un número positivo");
  }

  if (!category || category.trim().length === 0) {
    errors.push("La categoría es requerida");
  }

  if (!["basico", "perecedero", "electronico"].includes(type)) {
    errors.push("Tipo de producto inválido");
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};

/*Valida datos de Pedido Asegura cantidad > 0 y presencia de IDs.*/
export const validateOrder = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { productId, quantity, userId } = req.body;

  const errors: string[] = [];

  if (!productId || productId.trim().length === 0) {
    errors.push("El ID del producto es requerido");
  }

  if (typeof quantity !== "number" || quantity <= 0) {
    errors.push("La cantidad debe ser un número positivo mayor a cero");
  }

  if (!userId || userId.trim().length === 0) {
    errors.push("El ID de usuario es requerido");
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};

/*Valida rangos de fechas Bloquea fechas futuras y rangos invertidos.*/
export const validateDateRange = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { startDate, endDate } = req.query;

  if (startDate && endDate) {
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    const today = new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ error: "Formato de fecha inválido. Usar YYYY-MM-DD" });
      return;
    }
    // Lógica temporal Inicio no puede ser mayor a Fin
    if (start > end) {
      res.status(400).json({ error: "La fecha de inicio no puede ser mayor a la fecha de fin" });
      return;
    }
    // Regla de negocio No permitir fechas futuras
    if (start > today || end > today) {
      res.status(400).json({ error: "No se pueden generar reportes con fechas futuras" });
      return;
    }
  }

  next();
};