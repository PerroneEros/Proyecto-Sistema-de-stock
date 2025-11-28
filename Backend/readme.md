# 🎯 Proyecto: Sistema de stock
## 1) Introducción
El presente proyecto tiene como objetivo desarrollar un **Sistema de Gestión de Stock** que permita registrar, controlar y administrar productos de manera eficiente, garantizando escalabilidad, mantenibilidad y extensibilidad mediante la aplicación de **patrones de diseño de software**.  

El sistema se centrará en resolver problemáticas comunes en la gestión de inventarios, tales como:  
- Control de productos disponibles.  
- Alertas automáticas por bajo stock.  
- Generación de reportes (PDF).  
- Registro histórico de pedidos y movimientos de stock.  
- Flexibilidad para agregar nuevos tipos de productos y funcionalidades.  

## 2) Objetivos
- Implementar un sistema modular y extensible.  
- Asegurar la consistencia en la conexión a la base de datos.  
- Automatizar alertas cuando los productos estén por debajo del stock mínimo.  
- Permitir agregar funcionalidades sin alterar el núcleo del sistema.  
- Mantener un registro de todas las operaciones realizadas sobre el stock.  
- Simplificar el uso del sistema para usuarios finales mediante interfaces claras.  

## 3) Alcance del sistema
El sistema permitirá:  
- Registrar productos.  
- Consultar stock actual y realizar búsquedas.  
- Realizar pedidos de productos, descontando automáticamente el stock.  
- Generar alertas/notificaciones cuando un producto alcance niveles críticos.  
- Exportar reportes en formato PDF.  
- Extender funcionalidades fácilmente (ej: productos con promociones, garantías, envíos especiales).  

## 4) Patrones de diseño a aplicar

1. **Singleton (``Base de datos``)**  
   - Garantiza una única instancia de conexión a la base de datos.  
   - Asegura eficiencia y consistencia en todas las operaciones.  

2. **Factory (``Creación de productos``)**  
   - Permite crear distintos tipos de productos sin modificar el código base.  
   - Facilita la extensibilidad cuando se agregan nuevas categorías.  

3. **Facade (``Interfaz simple``)**  
   - Expone una interfaz unificada para operaciones complejas del stock.  

4. **Decorator (Extensión de productos)**  
   - Permite añadir funcionalidades sin modificar la clase base.  

5. **Observer (``Alertas y notificaciones``)**  
   - Observa los cambios en el stock de productos.  
   - Cuando un producto baja del nivel mínimo, notifica automáticamente al usuario (ej: email, panel de alertas).  

6. **Adapter (``Exportación de datos a PDF``)**  
   - Adapta los objetos internos de productos y movimientos de stock para ser interpretados por una librería de generación de PDFs.  
   - Permite compatibilidad con otros sistemas externos en el futuro.  

7. **Builder (``Construcción de productos``)**  
   - Facilita la creación de productos con múltiples atributos opcionales.  

8. **Command (``Pedidos y registro histórico``)**  
   - Cada pedido se representa como un comando.  
   - Se ejecuta y queda registrado en un historial.  
   - Posibilidad de implementar *undo/redo* en operaciones de stock.  

## 5) Tecnologías sugeridas
- **Lenguaje:** Python.  
- **Base de datos:** MySQL.  
## 6) Conclusión
Este proyecto permitirá implementar un **sistema de gestión de stock sólido y extensible**, aplicando patrones de diseño que garantizan buenas prácticas de programación, flexibilidad ante cambios y capacidad de crecimiento futuro.  

# Integrantes :
```ruby
- Bruno Fernandez
- Eros Perrone
- Franco Devaux
- Ivo Depari
```