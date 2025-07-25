# Integración de Códigos de Descuento - Guía de Implementación

## Funcionalidad Implementada

Se ha implementado un sistema completo de códigos de descuento que incluye:

### 1. **Tipos y Interfaces** (`src/types/discountCode.ts`)
- Definición de tipos para códigos de descuento
- Interfaces para validación y gestión
- Tipos para respuestas de API

### 2. **Servicios de API** (`src/services/discountCode.ts`)
- Validación pública de códigos
- Gestión administrativa completa (CRUD)
- Utilidades para cálculos de descuentos

### 3. **Componentes de Usuario**
- `DiscountCodeInput.tsx`: Input para aplicar códigos
- `OrderSummary.tsx`: Resumen actualizado con descuentos
- `CartWithDiscount.tsx`: Integración completa

### 4. **Componentes de Admin**
- `DiscountCodesAdmin.tsx`: Panel principal de gestión
- `CreateDiscountCodeModal.tsx`: Modal para crear códigos
- `EditDiscountCodeModal.tsx`: Modal para editar códigos

### 5. **Context Actualizado**
- CartContext actualizado para manejar descuentos
- Persistencia en localStorage
- Recálculo automático de totales

## Cómo Integrar en las Páginas

### En el Checkout/Carrito:

```tsx
import { CartWithDiscount } from '@/components/tickets/CartWithDiscount';

// En lugar de usar OrderSummary directamente, usar:
<CartWithDiscount
  ticketPrice={price}
  quantity={quantity}
  includeMemories={withMemories}
  memoriesAlreadyIncluded={isMemoriesIncluded}
/>
```

### En el Panel Admin:

```tsx
import DiscountCodesAdmin from '@/components/admin/discountCodes/DiscountCodesAdmin';

// Agregar nueva ruta en el sidebar/navbar admin
<DiscountCodesAdmin />
```

### Usando el Context:

```tsx
import { useCart } from '@/context/CartContext';

function MyComponent() {
  const { state, applyDiscount, removeDiscount } = useCart();
  
  // Acceder al descuento aplicado
  const appliedDiscount = state.appliedDiscount;
  
  // El total ya incluye el descuento automáticamente
  const total = state.total;
}
```

## API Endpoints Esperados

El frontend espera estos endpoints en el backend:

### Públicos:
- `POST /discount-codes/validate` - Validar código

### Admin (requieren autenticación):
- `GET /admin/discount-codes` - Listar códigos
- `POST /admin/discount-codes` - Crear código
- `GET /admin/discount-codes/:id` - Obtener código
- `PATCH /admin/discount-codes/:id` - Actualizar código
- `DELETE /admin/discount-codes/:id` - Eliminar código
- `POST /admin/discount-codes/validate` - Validar código (admin)

## Funcionalidades Incluidas

### Para Usuarios:
✅ Input para ingresar códigos de descuento
✅ Validación en tiempo real
✅ Aplicación automática de descuentos
✅ Visualización clara del descuento aplicado
✅ Cálculo correcto de totales
✅ Persistencia del descuento en el carrito

### Para Administradores:
✅ Panel completo de gestión
✅ Crear, editar y eliminar códigos
✅ Activar/desactivar códigos
✅ Visualizar estadísticas de uso
✅ Control de límites y expiración
✅ Validación de formularios

### Características del Sistema:
✅ Cálculos precisos de descuentos
✅ Validación de códigos expirados
✅ Control de límites de uso
✅ Estados visuales claros
✅ Manejo de errores
✅ Persistencia en localStorage
✅ Integración con el carrito existente

## Próximos Pasos

1. **Integrar en las páginas existentes** reemplazando `OrderSummary` por `CartWithDiscount`
2. **Agregar la ruta admin** en el sidebar/navbar
3. **Incluir códigos de descuento en el proceso de pago** (agregar al payload de Wompi)
4. **Agregar nuevos tipos de tickets** (allied, journalist) desde el panel admin cuando sea necesario

## Tipos de Tickets Nuevos

Los tipos `allied` y `journalist` están preparados para ser agregados solo desde el panel administrativo según tus especificaciones. El enum no se modificó para mantener la restricción de creación solo por admin.