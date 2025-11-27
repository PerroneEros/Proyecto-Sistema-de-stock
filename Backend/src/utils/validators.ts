export class Validators {
// Valida formato de email mediante Regex estándar
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
// Verifica que sea un número y no sea negativo
  static isPositiveNumber(value: any): boolean {
    return typeof value === 'number' && value >= 0;
  }
// Verifica que sea string y no esté vacío (ni solo espacios)
  static isString(value: any): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }
// Valida formato UUID (v4) para IDs
  static isUUID(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }
// Verifica si una cadena puede convertirse en una fecha válida
  static isDateString(value: string): boolean {
    return !isNaN(Date.parse(value));
  }

/*Valida un objeto de producto completo.
Retorna un objeto con el estado de validez y la lista de errores encontrados.*/
  static validateProductData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.isString(data.name)) {
      errors.push('Nombre inválido');
    }

    if (!this.isPositiveNumber(data.price)) {
      errors.push('Precio inválido');
    }

    if (!this.isPositiveNumber(data.currentStock)) {
      errors.push('Stock actual inválido');
    }

    if (!this.isPositiveNumber(data.minStock)) {
      errors.push('Stock mínimo inválido');
    }

    if (!this.isString(data.category)) {
      errors.push('Categoría inválida');
    }

    if (!['basico', 'perecedero', 'electronico'].includes(data.type)) {
      errors.push('Tipo de producto es inválido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}