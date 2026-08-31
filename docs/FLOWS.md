# Flujos del sistema — CNMP (Congreso Nacional de Marketing Político)

> Documento de referencia para humanos y LLMs. Define todos los flujos funcionales del
> sistema, las rutas y endpoints involucrados, sus casos borde y cómo probarlos.
> Actualizado: 2026-06-11.

## Arquitectura

- **Frontend**: Next.js 13+ App Router (este repo). Deploy en Vercel.
- **Backend**: API REST separada (repo aparte, deploy en EC2 con GitHub Actions, Postgres).
  El front la consume vía `apiClient` (axios) con `baseURL = NEXT_PUBLIC_API_URL`.
- **Pagos**: la pasarela activa la decide el backend (`GET /payments/gateway`).
  **Efipay** (actual): `POST /payments` devuelve `checkoutUrl` y el front redirige al
  comprador; al terminar vuelve por el endpoint de confirmación del backend a
  `/carrito?reference=<ref>&status=<estado>`. **Wompi** (pausada): WidgetCheckout
  (script `https://checkout.wompi.co/widget.js`) con la firma de integridad que
  devuelve el mismo `POST /payments`; su script solo se carga si es la pasarela activa.
  La confirmación final llega por webhook al backend; el front además verifica por
  referencia (`payments/verify/:reference`).
- **Auth admin**: JWT en cookie (`js-cookie` + `AuthContext`), validado por
  `src/middleware.ts` para todo `/admin/*` (excepto `/admin/auth`).
- **Ediciones**: el sistema es multi-edición (2025, 2026, …). El backend mantiene una
  "edición activa" (`GET/POST /admin/edition`); tickets, conferencistas y métricas se
  filtran por edición.

### Variables de entorno relevantes

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base del backend (dev: `http://localhost:3000/`) |
| `NEXT_PUBLIC_URL` | Base del propio front (dev: `http://localhost:3001/`) |
| `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` | Llave pública del widget Wompi (solo si se reactiva Wompi) |
| `JWT_SECRET` | Verificación del token en `src/middleware.ts` |

### Mapa de rutas del front

| Ruta | Tipo | Descripción |
|---|---|---|
| `/` | pública | Landing (gira, speakers, agenda, entradas, testimonios, contacto) |
| `/lecturer/[alt]` | pública | Perfil de conferencista |
| `/organizacion` | pública | Página institucional |
| `/boleteria` | pública | Selección de localidad + cantidad + memorias |
| `/quantity-select` | redirect | Legacy → redirige a `/boleteria` |
| `/carrito` | pública | Datos de asistentes, descuento, pago (Efipay/Wompi), verificación |
| `/tickets/purchase/[reference]` | pública | Pantalla de éxito post-compra |
| `/ticket/[document]` | pública | Consulta de ticket y descarga de certificado (el param es el **uuid** del ticket) |
| `/admin/auth` | pública | Login del panel |
| `/admin/dashboard` | protegida | Panel admin (tabs vía `?tab=`) |
| `/buy`, `/tickets/buy`, `/tickets/map` | legacy | Sin uso en el flujo actual (candidatas a eliminar) |

---

## Flujos públicos (asistente)

### F1 — Navegación de la landing

**Ruta**: `/` · **Archivos**: `src/app/page.tsx`, `src/app/landing.css`

1. El visitante llega a la landing; se cargan conferencistas (`GET /lecturers/internationals`,
   `GET /lecturers/nationals`) y testimonios activos (`GET /testimonials/active`).
2. Navega por anclas (`/#tour`, `/#speakers`, `/#agenda`, `/#entradas`, `/#contacto`).
3. CTAs de entradas llevan a `/boleteria` (con `?localidad=slug` opcional).
4. Clic en un speaker lleva a `/lecturer/[alt]`.

**Casos borde**: backend caído → secciones de speakers/testimonios quedan vacías (los
servicios capturan el error y devuelven `[]`); la página no debe romperse.

**Prueba**: cargar `/`, verificar render de todas las secciones, links de anclas y CTAs.

### F2 — Perfil de conferencista

**Ruta**: `/lecturer/[alt]` · **Endpoint**: `GET /lecturers/alt/:alt`

1. Se resuelve el conferencista por su slug `alt`.
2. Se muestran biografía, formación académica, publicaciones, premios, redes.

**Casos borde**: `alt` inexistente → el servicio devuelve `[]`; la página debe manejar
"no encontrado" sin crash.

### F3 — Compra de boletas (flujo principal de negocio)

**Rutas**: `/boleteria` → `/carrito` · **Archivos**: `src/app/boleteria/page.tsx`,
`src/app/carrito/page.tsx`, `src/context/CartContext`, `src/hooks/useLocalidades`

**Paso A — Selección (`/boleteria`)**
1. Carga tipos de localidad activos (`GET /localidad-types`); la localidad puede venir
   preseleccionada por URL (`?localidad=slug`). Si el slug no existe, cae a la primera
   localidad `pushable`.
2. El usuario elige localidad, cantidad y si agrega "memorias" (las localidades
   `withMemories` las incluyen; el precio de memorias sale de la localidad `memorias`).
3. "Continuar" agrega al carrito (persistido en `localStorage`) y navega a `/carrito`.

**Paso B — Checkout (`/carrito`)**
1. Se diligencian los datos de cada asistente (nombre, apellido, email, documento, teléfono).
2. (Opcional) Código de descuento: `POST /discount-codes/validate` → si es válido se aplica
   el porcentaje al total.
3. "Pagar": se genera una referencia única, se guardan los tickets en estado pendiente
   (`POST /tickets/save` con `reference` y `discountCode`), y se pide la firma de
   integridad (`POST /tickets/generate-integrity-hash` con `amountInCents`).
4. Según la pasarela que devuelva `POST /payments`:
   - **Efipay**: se redirige a `checkoutUrl`. Al terminar, Efipay envía al comprador al
     endpoint de confirmación del backend, que verifica el estado y lo devuelve a
     `/carrito?reference=<reference>&status=<estado>`.
   - **Wompi**: se abre el **WidgetCheckout** (`currency: COP`, `publicKey`, `reference`,
     `signature.integrity`, `redirectUrl: /carrito?ref=<reference>`).
5. Al volver (por cualquiera de los dos caminos), el front verifica contra el backend:
   `GET payments/verify/:reference`. Si está aprobada → éxito (los tickets pasan a PAID y
   el backend envía los PDFs con QR por email). El `status` de la URL no se toma como
   verdad: siempre se confirma con el backend antes de mostrar la pantalla de éxito.

**Casos borde**:
- Pago rechazado/abandonado → tickets quedan pendientes, no se debe mostrar éxito.
- Código de descuento inválido/expirado/agotado → mensaje de error, total sin cambio.
- Carrito vacío → `/carrito` redirige a `/boleteria`.
- Doble verificación de la misma referencia → debe ser idempotente (responsabilidad backend).

**Prueba**: requiere backend + credenciales de prueba de la pasarela activa. Verificar: totales correctos con y sin
descuento y con/sin memorias, persistencia del carrito tras recargar, y que la verificación
solo confirme con transacción aprobada.

### F4 — Pantalla de éxito

**Ruta**: `/tickets/purchase/[reference]`

Muestra confirmación con el número de referencia e indica que las boletas llegan por email.
Página estática (no consulta API). **Prueba**: cargar con cualquier referencia.

### F5 — Consulta de ticket y certificado

**Ruta**: `/ticket/[document]` (⚠️ el segmento se llama `document` pero recibe el **uuid**)
**Endpoints**: `GET /tickets/:uuid`, `GET /tickets/certificate/:uuid` (blob PDF)

1. Carga el ticket por uuid; muestra datos del asistente y asiento.
2. Si el ticket tiene certificado disponible (`certificateUrl` y la función de
   certificados está habilitada — ver F13), permite descargar el PDF.

**Casos borde**: uuid inexistente → estado "no encontrado"; certificados deshabilitados →
no debe ofrecer descarga.

---

## Flujos de administración

Todos requieren sesión: `src/middleware.ts` redirige a `/admin/auth` si no hay JWT válido
en cookies. El estado de sesión vive en `AuthContext` (`GET /auth/me` al recargar).

### F6 — Login admin

**Ruta**: `/admin/auth` · **Endpoint**: `POST /auth/login`

1. Usuario + contraseña (con toggle para ver la contraseña).
2. Éxito → guarda token (cookie), `AuthContext.login`, redirige a `/admin/dashboard`.
3. Error → mensaje específico según causa: credenciales (400/401/403), demasiados
   intentos (429), servidor caído (5xx), sin conexión (network error). El mensaje se
   limpia al volver a escribir.

**Prueba**: credenciales malas → mensaje correcto; backend apagado → mensaje de conexión;
login válido → dashboard; recarga en `/admin/dashboard` sin cookie → redirige a auth.

### F7 — Dashboard (métricas y ediciones)

**Ruta**: `/admin/dashboard` (tab `dashboard`) · **Endpoints**: `GET /tickets/metrics`,
`GET /admin/edition`, `POST /admin/edition`, `GET /tickets/report/download` (PDF)

1. KPIs: pagados, reservados, total, días al evento; distribución por localidad y estado.
2. Selector de edición: ver métricas de otra edición; "Activar edición X" (con
   `window.confirm`) cambia la edición activa global del sistema.
3. "Reporte PDF" descarga el informe de la edición seleccionada.

**Nota de navegación**: el tab activo se sincroniza con `?tab=` y la página de la tabla
con `?page=` — recargar y el botón atrás conservan el estado.

### F8 — Gestión de tickets

**Tab** `table` · **Componente**: `src/components/tickets/table.tsx`
**Endpoints**: `GET /admin/tickets` (status PAID+RESERVED, filtro `edition`),
`POST /admin/tickets/create`, `POST /admin/tickets/update`, `POST admin/tickets/delete`,
`GET /admin/ticket/email/resend/:uuid`, `GET /admin/ticket/download/:uuid`

Operaciones: búsqueda local (nombre/documento/email/teléfono), filtro por edición,
paginación (15/página, persistida en `?page=`), crear ticket manual (reserva admin),
editar datos del asistente, reenviar email con el boleto, descargar PDF, eliminar
(con confirmación). En móvil la tabla se vuelve tarjetas (`.tkt-cards`).

### F9 — Conferencistas

**Tab** `lecturers` · **Endpoints**: `GET /lecturers`, `POST /lecturers`,
`PATCH /lecturers/:id`, `DELETE /lecturers/:id`, `PATCH /lecturers/:id/toggle-show`,
`POST /lecturers/:id/upload-image`

CRUD completo con: filtros (búsqueda, tipo internacional/nacional, visibilidad, edición),
mostrar/ocultar en la landing, subir foto, y formularios largos (datos, redes, áreas de
experiencia, premios, metodologías, formación académica, publicaciones). El slug `alt` se
autogenera desde nombre+apellido al crear.

### F10 — Testimonios

**Tab** `testimonials` · **Endpoints**: `GET /testimonials`, `POST /testimonials`,
`PATCH /testimonials/:id`, `PATCH /testimonials/:id/toggle-active`,
`POST/DELETE /testimonials/:id/image`, `DELETE /testimonials/:id`

CRUD + activar/desactivar (solo los activos salen en la landing) + gestión de imagen.

### F11 — Email broadcasts

**Tab** `broadcasts` · **Endpoints**: `GET /email-broadcasts`, `POST /email-broadcasts`
(con o sin adjuntos), `GET /email-broadcasts/:id`, `POST /email-broadcasts/:id/resend`

1. Crear: destinatarios (todos los usuarios — opcionalmente de una edición — o un email
   específico), remitente, título, contenido, adjuntos manuales, y adjuntos automáticos
   (boleto y/o certificado del usuario, con opción de regenerar los PDFs).
2. Vista previa del email antes de enviar.
3. Estados del broadcast: `PENDING / SENDING / COMPLETED / FAILED`, con conteo
   enviados/total y fallidos.
4. Detalle por broadcast y reenvío de los completados.

**Casos borde**: email específico requerido si el tipo es `SPECIFIC_EMAIL`; reenvío pide
confirmación (va a todos los destinatarios originales).

### F12 — Códigos de descuento

**Tab** `discount-codes` · **Endpoints**: `GET/POST /admin/discount-codes`,
`PATCH/DELETE /admin/discount-codes/:id`, `POST /admin/discount-codes/validate`

Crear (código 3–20 chars, % de descuento, usos máximos, expiración, activo), editar,
activar/desactivar, eliminar. Estados derivados mostrados: Activo / Inactivo / Expirado /
Agotado. El público los consume en el checkout (F3) vía `POST /discount-codes/validate`.

### F13 — Certificados (toggle global)

**Tab** `certificates` · **Endpoints**: `GET /admin/certificates/status`,
toggle de habilitación (servicio `toggleCertificates`)

Interruptor global que habilita/deshabilita la descarga de certificados para los
asistentes (afecta F5). Se activa típicamente al finalizar el evento.

### F14 — Localidades (tipos de entrada)

**Tab** `localidades` · **Endpoints**: `GET /localidad-types`,
`POST /admin/localidad-types`, `PATCH/DELETE /admin/localidad-types/:id`

CRUD de los tipos de entrada que alimentan la boletería (F3): slug, nombre, ícono, precio,
orden, beneficios, flags `withMemories` (incluye memorias), `pushable` (comprable; si es
falso es cortesía), `active`. ⚠️ La localidad con slug `memorias` define el precio del
add-on de memorias en la boletería.

---

## Comportamientos transversales de UI (admin)

- **Modales**: en desktop tarjeta centrada; en móvil (≤700px) bottom-sheet con asa,
  animación de subida y **swipe-down para cerrar** (`src/components/admin/ModalShell.tsx`).
- **Confirmación de descarte**: todos los formularios de creación/edición (conferencistas,
  testimonios, broadcast, localidades, códigos de descuento) preguntan "¿Descartar
  cambios?" si hay cambios sin guardar, por cualquier vía de cierre (✕, Cancelar, fondo,
  swipe). Helper: `confirmDiscard()` en `ModalShell.tsx`.
- **Estado en URL**: tab activo (`?tab=`) y página de la tabla de tickets (`?page=`).
- **Responsive**: sidebar colapsable (<900px), tabla de tickets → tarjetas (<700px),
  filas-tarjeta de las demás secciones envuelven con `flexWrap`.

## Flujos de sistema (backend, referencia)

- **Webhook de pagos Wompi** → backend: confirma transacciones, marca tickets PAID,
  genera PDFs con QR y los envía por email. El front solo consulta
  `payments/verify/:reference`.
- **Generación de PDFs/QR y envío de emails**: responsabilidad del backend (boletos,
  certificados, broadcasts).

## Páginas legacy (no forman parte de ningún flujo)

- `/buy` (`src/app/buy/page.tsx`): checkout viejo. CTA apunta a `/#entradas`.
- `/tickets/buy`: stub con código comentado.
- `/tickets/map`: mapa de asientos standalone (el flujo actual no usa selección de asiento).
- `/quantity-select`: solo redirige a `/boleteria` (se conserva por enlaces antiguos).

Candidatas a eliminación en una limpieza futura.

---

## Matriz de pruebas

Leyenda de "Cómo": **smoke** = la página carga y renderiza sin backend ·
**local** = requiere backend local corriendo (`NEXT_PUBLIC_API_URL`) ·
**e2e** = requiere backend + servicios externos (Wompi sandbox, SMTP).

| # | Flujo | Cómo | Qué verificar |
|---|---|---|---|
| F1 | Landing | smoke + local | Render completo; sin crash con API caída; CTAs correctos |
| F2 | Perfil conferencista | local | Datos del speaker; alt inexistente no rompe |
| F3 | Compra | e2e | Totales (descuento/memorias), persistencia carrito, pago sandbox aprobado/rechazado, verificación idempotente |
| F4 | Éxito compra | smoke | Render con referencia |
| F5 | Ticket/certificado | local | Ticket por uuid; descarga solo con certificados habilitados |
| F6 | Login admin | local | Mensajes por tipo de error; redirect del middleware sin cookie |
| F7 | Dashboard | local | Métricas por edición; activar edición pide confirmación; PDF descarga |
| F8 | Tickets admin | local | CRUD, reenvío, descarga, búsqueda, paginación persistente |
| F9 | Conferencistas | local | CRUD, filtros, toggle visibilidad, imagen, confirmación de descarte |
| F10 | Testimonios | local | CRUD, toggle activo, imagen, confirmación de descarte |
| F11 | Broadcasts | e2e | Crear (ambos tipos), preview, adjuntos, estados, reenviar |
| F12 | Códigos descuento | local | CRUD, estados derivados, validación pública en checkout |
| F13 | Certificados | local | Toggle global afecta F5 |
| F14 | Localidades | local | CRUD; cambios se reflejan en `/boleteria`; slug `memorias` |
| — | Responsive/modales | smoke | Bottom-sheet, swipe, confirm de descarte, tablas→tarjetas (DevTools móvil) |

### Cómo correr las pruebas locales

```bash
# 1. Backend (repo aparte) en :3000 con Postgres local
# 2. Front:
yarn dev   # Next toma :3000 si está libre; con el backend corriendo cae a :3001
           # (NEXT_PUBLIC_URL asume :3001 — arrancar el backend primero)
# 3. Smoke rápido de rutas:
for r in / /boleteria /carrito /organizacion /admin/auth /tickets/purchase/TEST-123; do
  curl -s -o /dev/null -w "$r → %{http_code}\n" "http://localhost:3001$r"
done
# /admin/dashboard sin cookie debe responder 307 → /admin/auth
```

### Resultados de la última corrida

**2026-06-11 — smoke local sin backend** (`yarn dev`, API caída a propósito):

| Ruta | Resultado |
|---|---|
| `/` | ✅ 200 |
| `/boleteria` | ✅ 200 |
| `/carrito` | ✅ 200 |
| `/organizacion` | ✅ 200 |
| `/quantity-select` | ✅ 200 (redirige a boletería en cliente) |
| `/admin/auth` | ✅ 200 |
| `/admin/dashboard` sin cookie | ✅ 307 → `/admin/auth` (middleware OK) |
| `/tickets/purchase/TEST-123` | ✅ 200 |
| `/ticket/<uuid-falso>` | ✅ 200 (sin crash con API caída) |
| `/lecturer/<alt-inexistente>` | ✅ 200 (sin crash) |
| `/buy` (legacy) | ✅ 200 |

Ninguna ruta crashea con el backend caído.

**2026-06-11 — corrida local** (backend `congress-marketing-be` en :3000 con Postgres
Docker :5434, front en :3001; usuario admin temporal creado y eliminado al final):

| Flujo | Resultado |
|---|---|
| F1 Landing con datos | ✅ `/localidad-types`, `/lecturers/*`, `/testimonials/active` → 200 con datos |
| F2 Lecturer por alt | ✅ 200 con alt real |
| F5 Ticket por uuid | ✅ 200 con uuid PAID real |
| F6 Login | ✅ login OK → token; `/auth/me` OK; middleware: con cookie 200, sin cookie 307 |
| F7 Edición + métricas + reporte | ✅ `currentEdition: 2026`; métricas por tipo; reporte PDF válido |
| F8 Tickets admin | ✅ 315 tickets (PAID+RESERVED, edición 2025); descarga de boleto PDF válido |
| F9 Conferencistas | ✅ listado 200 |
| F10 Testimonios | ✅ listado 200 |
| F11 Broadcasts | ✅ listado 200 con históricos (envío real no probado — SMTP) |
| F12 Códigos descuento | ✅ ciclo completo: crear → validar público (`isValid: true`) → desactivar → eliminar |
| F13 Certificados | ✅ status `enabled: false` |
| F14 Localidades admin | ✅ listado 200 |
| Seguridad | ✅ endpoints `/admin/*` y `/email-broadcasts` → 401 sin token |

**Hallazgos de la corrida local**:
1. ✅ **Corregido** (backend `22058d7`, desplegado y verificado en prod 2026-06-11):
   `GET /tickets/metrics` respondía sin autenticación. Al revisar, el controller de
   tickets no tenía ningún guard — también estaban expuestos `/tickets/approved`
   (PII de todos los asistentes), `POST /tickets/send-massive-email` (cualquiera
   podía disparar correos masivos) y `/tickets/report/*`. Todos requieren JWT ahora;
   `/tickets/:uuid` y `/tickets/certificate/:uuid` siguen públicos por diseño.
2. ✅ **Corregido** (mismo deploy): `POST /auth/login` respondía 201 con
   `{status:'fail'}` y mensajes que revelaban si el usuario existía. Ahora responde
   **401 con mensaje único** "Credenciales inválidas". El front maneja ambos formatos.
3. La BD local restaurada de backup tenía las **secuencias de IDs desincronizadas**
   (INSERT → 500 por PK duplicada). Corregido localmente con `setval(...)` en las 14
   tablas. Si se restaura otro backup, repetir.
4. SMTP local falla por credenciales (esperado): los flujos que envían correo
   (boletos, broadcasts, reenvíos) solo son verificables en e2e/producción.
5. El filtro de tickets admin exige status en MAYÚSCULAS (`PAID`/`RESERVED`),
   consistente con el enum del front.

**2026-06-11 — corrida e2e F3 (pago Wompi sandbox)**: ejecutada a nivel de API contra
`sandbox.wompi.co` (el WidgetCheckout es solo una UI sobre esos mismos llamados; misma
firma de integridad, mismo `/payments/verify`). Flujo: `POST /payments` (crea tickets
PENDING + firma) → firma de integridad verificada contra
`SHA256(ref+amount+COP+secret)` ✓ → pago real en sandbox con tarjeta de prueba
`4242…` → **APPROVED** → `GET /payments/verify/:reference` → tickets a **PAID** ✓.
Camino negativo: firma manipulada → Wompi responde `INPUT_VALIDATION_ERROR / "La firma
es inválida"` ✓.

⚠️→✅ **Bug encontrado y corregido** (backend `ba14590`, desplegado): `verifyTransaction`
cargaba la transacción **sin la relación `tickets`**, así que `processTicketsForTransaction`
recibía `undefined` y fallaba en silencio — el fallback `/payments/verify` del front nunca
marcaba los tickets PAID (solo el webhook, que sí carga la relación, lo hacía). Si el
webhook no llega, los tickets quedaban PENDING pese al pago aprobado. Corregido cargando
`relations: { tickets: true }`.

**Pendiente**: envío real de correos (F11 broadcasts y emails de boleto en F3), que
requiere SMTP válido — no verificable en local. Una corrida e2e desde navegador real con
el WidgetCheckout validaría además la UI del widget, pero la integración (firma, estados,
verify) ya quedó cubierta a nivel de API.
