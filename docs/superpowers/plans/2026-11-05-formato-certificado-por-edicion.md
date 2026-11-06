# Formato de certificado por edición — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** El equipo sube desde `/admin/certificates` el formato del certificado de cada edición (PDF/JPG/PNG), ubica nombre, documento y QR, y al cambiarlo todos obtienen el certificado nuevo con el mismo QR. El panel ofrece reenviarlo por correo.

**Architecture:** El template vive en `editions.certificate_template` (jsonb) con un contador `certificate_template_version`. Cada boleto recuerda con qué versión se generó su certificado (`tickets.certificate_template_version`). Un único método de caché regenera el PDF si la versión no coincide. El QR siempre se lee de `qr-codes/<uuid>.png` y nunca se regenera si existe. El front reutiliza el editor de boletos, parametrizado por geometría de hoja.

**Tech Stack:** NestJS 10 + TypeORM + Postgres + Bull (back, Jest), pdf-lib + fontkit + qrcode, S3 (AWS SDK v3), nodemailer. Next.js 13 App Router + TypeScript (front, sin runner de tests: se verifica con `yarn build` y prueba manual), `pdfjs-dist` (nuevo).

**Spec:** `docs/superpowers/specs/2026-11-05-formato-certificado-por-edicion-design.md` (en el repo del front).

**Repos y ramas:**
- Back: `C:\Projects\congress-marketing-be`. Crear la rama `feat/certificate-template` desde `main`. El índice ya está sano. El commit actual tiene 64 rutas `*:Zone.Identifier` que Windows no admite y que el sparse checkout excluye. No hay que tocarlas.
- Front: `C:\Projects\congres-marketing`. Crear la rama `feat/certificate-template` desde `main`, no desde `fix/remove-zone-identifier`. Llevar a esa rama el spec y este plan.

## Global Constraints

- Hoja del certificado: A4 horizontal, **842×595 pt**. El fondo se escala para ocupar la hoja completa.
- Fondos aceptados: `application/pdf`, `image/jpeg` y `image/png`, máximo **10 MB**. Del PDF se usa solo la primera página.
- Fuente `fonts/Garet-Heavy.ttf`. El nombre va en MAYÚSCULAS, `NOMBRE APELLIDO`. El tamaño se ajusta con `calculateFontSize` al `maxWidth` del elemento.
- El QR se lee siempre de la key S3 `qr-codes/<uuid>.png`. Si no existe, se genera **una vez** con la URL `${configService.frontend.url}ticket/${uuid}` y se sube a esa key. **Nunca** se sobrescribe un QR existente.
- Ediciones con `certificate_template = NULL` generan exactamente igual que hoy (código 2025 sin cambios).
- Destinatarios del reenvío: los mismos de hoy, tickets `PAID` y `RESERVED` con email, de todos los tipos, filtrados por `target_edition`. Se cuenta con `COUNT(DISTINCT email)`.
- Nada se reenvía sin que el administrador confirme en el modal.
- Variables solo para desarrollo, que **no hacen nada si están vacías**: `S3_KEY_PREFIX` (p. ej. `dev/`) y `MAIL_REDIRECT_TO`.
- Todos los endpoints nuevos de admin van bajo `@UseGuards(JwtAuthGuard)`, como `AdminEditionsController`.
- Commits en español con conventional commits, igual que el historial (`feat(certificados): …`).

## Review Focus

1. **Boleto de una edición con template, pero sin `qr-codes/<uuid>.png` en S3** (boletos antiguos o reservados). Debe generarse el QR una vez y reutilizarse, sin error 500. → Test en Task 3.
2. **Template guardado sin cambios de posición, guardado dos veces seguidas.** Cada guardado sube la versión. Los certificados se regeneran una vez por guardado, no en cada descarga. → Test en Task 4.
3. **Nombre muy largo o con tildes y ñ en el certificado horizontal.** Debe caber en `maxWidth`, sin salirse ni romper la fuente. → Test en Task 3.
4. **PDF de fondo con varias páginas o en vertical.** Se usa la página 1, escalada a 842×595 (puede deformarse, y es aceptable). No debe fallar. → Test en Task 3.
5. **Edición liberada sin ningún certificado generado todavía.** `/ticket/<uuid>` debe mostrar el botón, y la descarga debe generarlo. → Test en Task 4 (`certificateAvailable`) y paso manual en Task 9.

---

### Task 1: Seguridad para pruebas locales (prefijo S3 y redirección de correo)

**Files:**
- Modify: `src/config/*.ts` del back, en el objeto que expone `aws` y `mail` (líneas ~11-21 y ~120-125)
- Modify: `src/aws/s3.service.ts` (todos los `Key:` y `Prefix`, y `getPublicUrl`)
- Modify: `src/email/mail.processor.ts` (los 2 `this.transporter.sendMail(` en ~589 y ~829)
- Modify: `.env.example` (documentar las 2 variables, vacías)
- Test: `src/aws/s3.service.spec.ts` (nuevo), `src/email/mail.processor.spec.ts`

**Interfaces:**
- Produces: `configService.aws.keyPrefix: string` (default `''`) y `configService.mail.redirectTo: string | undefined`.
- Produces: `S3Service` sigue recibiendo y devolviendo keys **sin** prefijo. El prefijo se aplica solo al hablar con S3, así que la base de datos guarda la misma key en dev y en prod.

- [ ] **Step 1: Write failing tests**
  - `s3.service.spec.ts` › `aplica S3_KEY_PREFIX a Put/Get/Delete y a getPublicUrl, y devuelve la key sin prefijo`: con `keyPrefix='dev/'`, `uploadFile(buf,'certificates','a.pdf')` envía `PutObjectCommand` con `Key:'dev/certificates/a.pdf'` y devuelve `{ key:'certificates/a.pdf', url:'…/dev/certificates/a.pdf' }`; `getFile('qr-codes/x.png')` envía `Key:'dev/qr-codes/x.png'`.
  - `s3.service.spec.ts` › `sin prefijo no cambia nada`: `keyPrefix=''` → `Key:'certificates/a.pdf'`.
  - `mail.processor.spec.ts` › `MAIL_REDIRECT_TO redirige todo envío`: con `redirectTo='yo@x.com'`, `sendMail` se llama con `to:'yo@x.com'` y `subject` que empieza con `[→ original@x.com] `.
  - `mail.processor.spec.ts` › `sin MAIL_REDIRECT_TO el destinatario no cambia`.
- [ ] **Step 2: Run** `yarn test src/aws src/email/mail.processor.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement**
  - Config: `keyPrefix: process.env.S3_KEY_PREFIX || ''` y `redirectTo: process.env.MAIL_REDIRECT_TO || undefined`.
  - `S3Service`: método privado `private s3Key(key: string): string`, que devuelve `this.keyPrefix + key`. Se usa en Put/Get/Delete/SignedUrl/List/DeleteFolder y en `getPublicUrl`. `listFiles` quita el prefijo de las keys que devuelve.
  - `MailProcessor`: método privado `private sendMailSafe(options: nodemailer.SendMailOptions)`, que aplica la redirección y llama a `this.transporter.sendMail`. Reemplaza las 2 llamadas directas.
- [ ] **Step 4: Run** `yarn test`. Expected: PASS (suite completa, sin regresiones).
- [ ] **Step 5: Commit** `feat(dev): prefijo S3 y redirección de correo opcionales para pruebas locales`

### Task 2: Esquema — template y versión en edición y boleto

**Files:**
- Create: `src/database/migrations/1767200000000-edition-certificate-template.ts`
- Modify: `src/editions/entities/edition.entity.ts` (después de `certificatesEnabled`, línea ~63)
- Modify: `src/users/entities/tickets.entity.ts` (junto a `certificateUrl`, línea ~86)
- Modify: `src/utils/constants.ts` (después de `TicketTemplate`, línea ~27)

**Interfaces:**
- Produces (en `src/utils/constants.ts`):
  ```ts
  export interface CertificateTemplate {
    background: string;          // key S3 (sin prefijo), p. ej. certificate-templates/<editionUuid>/<ts>-<nombre>
    backgroundUrl: string;       // URL pública, solo para que el editor la muestre
    backgroundType: 'pdf' | 'image';
    elements: { qrCode: TicketTemplateImageEl; name: TicketTemplateTextEl; document: TicketTemplateTextEl };
  }
  ```
- Produces: `Edition.certificateTemplate: CertificateTemplate | null` (columna `certificate_template` jsonb, nullable), `Edition.certificateTemplateVersion: number` (columna `certificate_template_version` int, default 0) y `Ticket.certificateTemplateVersion: number | null` (columna `certificate_template_version` int, nullable).

- [ ] **Step 1: Write the migration**, con el mismo estilo que `1767100000000-broadcast-ticket-type-filter.ts`. `up` agrega las 3 columnas con `ADD COLUMN`. `down` las quita.
- [ ] **Step 2: Add the entity columns and the `CertificateTemplate` type** as above.
- [ ] **Step 3: Run** `yarn migrations:run` contra el Postgres local, y después `yarn migrations:show`. Expected: `[X] EditionCertificateTemplate1767200000000`. Correr `yarn migrations:revert` y otra vez `migrations:run`, y comprobar que el down funciona.
- [ ] **Step 4: Run** `yarn build && yarn test`. Expected: compila y pasa.
- [ ] **Step 5: Commit** `feat(certificados): columnas de formato y versión del certificado`

### Task 3: Generación del certificado con template (PdfService)

**Files:**
- Modify: `src/pdf/services/pdf.service.ts` (`generateCertificate` en ~452, más métodos nuevos)
- Modify: el módulo del PDF (`src/pdf/pdf.module.ts`), para registrar `Edition` en `TypeOrmModule.forFeature` si hace falta
- Test: `src/pdf/services/pdf.service.spec.ts` (nuevo)
- Fixtures: `test/fixtures/cert-bg.pdf` (copia del provisional), `test/fixtures/cert-bg-2pages-portrait.pdf` (2 páginas, vertical) y `test/fixtures/cert-bg.png`

**Interfaces:**
- Consumes: `CertificateTemplate`, `Edition.certificateTemplate` (Task 2).
- Produces:
  - `generateCertificate(ticket: Ticket): Promise<Buffer>`. Misma firma de hoy. Busca la edición de `ticket.edition`: si tiene `certificateTemplate`, usa `renderCertificateFromTemplate`, y si no, usa el código actual sin tocarlo.
  - `generateCertificatePreview(template: CertificateTemplate, sample: { name: string; lastname: string; document: string }): Promise<Buffer>`, con un QR al vuelo de `${frontend.url}ticket/preview`.
  - `getOrCreateQrPng(uuid: string): Promise<Buffer>`. Lee `qr-codes/<uuid>.png`. Si S3 responde NoSuchKey, genera con `${frontend.url}ticket/${uuid}`, sube a esa key (`image/png`) y devuelve el buffer.
  - privado `renderCertificateFromTemplate(template: CertificateTemplate, data: { name: string; lastname: string; document: string }, qrPng: Buffer): Promise<Buffer>`. Página `[842, 595]`, fondo desde `s3Service.getFile(template.background)`. Si `backgroundType==='pdf'`, usa `embedPdf(bytes,[0])` y `drawPage(…,{x:0,y:0,width:842,height:595})`. Si es imagen, usa `embedJpg` o `embedPng` según los magic bytes, no la extensión. Luego dibuja el QR en `elements.qrCode`, el nombre y el documento según `x, y, size, align ('left'|'center'|'right'), color, maxWidth` (con `align` relativo a `x`, igual que `renderTicketPdf`).
  - Usar un `PDFDocument` **local** en estos métodos, no `this.pdfDoc`, que es estado compartido entre requests concurrentes.

- [ ] **Step 1: Write failing tests** (mockear `S3Service`, `Repository<Edition>` y `ConfigService`; leer los PDFs de salida con `PDFDocument.load`):
  - `edición sin template usa el diseño 2025`: `getFile` se pide con `qr-codes/<uuid>.png` y el fondo se lee de `images/certificate-template-2025.jpg`. La página mide 842×595.
  - `template con fondo PDF genera 1 página 842x595 y no llama a getFile del template 2025`.
  - `fondo PDF de 2 páginas vertical usa la página 1 sin fallar` (Review Focus 4).
  - `fondo PNG detectado por magic bytes aunque la key termine en .jpg`.
  - `usa el QR existente y no lo sube de nuevo`: con `getFile('qr-codes/u1.png')` OK, `uploadFile` nunca se llama con `qr-codes/`.
  - `si falta el QR lo genera una vez con <frontend>/ticket/<uuid>` (Review Focus 1): `getFile` lanza `{ name:'NoSuchKey' }`, `uploadFile` se llama una vez con `('qr-codes', 'u1.png', 'image/png')`, y el PNG generado, decodificado con `jsqr` (devDependency) o comparado contra `QRCode.toBuffer(url)`, codifica `https://front/ticket/u1`.
  - `nombre largo con tildes cabe en maxWidth` (Review Focus 3): `JUAN JOSÉ MARÍA DE LA SANTÍSIMA TRINIDAD PEÑARANDA` con `maxWidth: 560` no lanza error, y `calculateFontSize` devuelve un tamaño ≤ el inicial (spy).
  - `generateCertificatePreview no consulta S3 por QR`.
- [ ] **Step 2: Run** `yarn test src/pdf`. Expected: FAIL.
- [ ] **Step 3: Implement** los métodos de arriba. `generateCertificate` reemplaza su lectura directa de `qr-codes/` por `getOrCreateQrPng`. El resto del camino 2025 queda igual.
- [ ] **Step 4: Run** `yarn test src/pdf`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(certificados): generar el certificado con el formato de la edición`

### Task 4: Caché por versión y disponibilidad en el boleto

**Files:**
- Create: `src/users/services/certificate-cache.service.ts`
- Modify: `src/users/services/tickets.service.ts` (`generateCertificate` en ~429, `transformTicketUrls` en ~730-768)
- Modify: `src/email/mail.processor.ts` (`obtenerPdfDeCertificado` en ~297-325)
- Modify: el módulo de users y el de email, para proveer o importar `CertificateCacheService`
- Test: `src/users/services/certificate-cache.service.spec.ts` (nuevo), `src/email/mail.processor.spec.ts`

**Interfaces:**
- Consumes: `PdfService.generateCertificate` (Task 3), las columnas de Task 2.
- Produces: `CertificateCacheService.getCertificatePdf(ticket: Ticket, opts?: { force?: boolean }): Promise<Buffer>`. Devuelve el PDF de S3 si `ticket.certificateUrl` existe, `!force`, y `ticket.certificateTemplateVersion === edition.certificateTemplateVersion` (con la regla: si la edición no tiene template y la versión es 0, un `null` en el boleto también vale, así 2025 no regenera). En otro caso genera, sube a `certificates/<uuid>.pdf` (`application/pdf`), y actualiza `certificate_url` y `certificate_template_version` del boleto.
- Produces: `TicketsService.transformTicketUrls` agrega `certificateAvailable: boolean` (= `areCertificatesAvailable(edition)`) y mantiene `certificateUrl` como hoy.

- [ ] **Step 1: Write failing tests** (`certificate-cache.service.spec.ts`):
  - `sirve el PDF en caché si la versión coincide` (no llama a `generateCertificate`).
  - `regenera si la versión del boleto es menor a la de la edición, y graba la nueva versión`.
  - `regenera si no hay certificateUrl`.
  - `edición sin template (v0) y boleto con versión null: sirve caché` (2025 no cambia).
  - `force regenera aunque la versión coincida`.
  - `dos guardados seguidos (v1→v2): un boleto en v1 se regenera una vez y la siguiente descarga ya sale de caché` (Review Focus 2).
  - `tickets.service.spec` o un test en el mismo archivo: `transformTicketUrls expone certificateAvailable=true con edición liberada aunque certificateUrl sea null` (Review Focus 5).
  - `mail.processor.spec.ts`: `obtenerPdfDeCertificado delega en CertificateCacheService con force=forceRegenerate`.
- [ ] **Step 2: Run** `yarn test src/users src/email`. Expected: FAIL.
- [ ] **Step 3: Implement**. `TicketsService.generateCertificate(uuid)` mantiene su chequeo de liberación (`ForbiddenException`) y devuelve `certificateCache.getCertificatePdf(ticket)`. `MailProcessor.obtenerPdfDeCertificado` delega en el mismo método (DRY: se borra su lógica propia de subir y actualizar).
- [ ] **Step 4: Run** `yarn test`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(certificados): regenerar al cambiar el formato y exponer disponibilidad`

### Task 5: Endpoints de admin del formato del certificado

**Files:**
- Modify: `src/editions/controllers/editions.controller.ts` (`AdminEditionsController`, junto a `hotel-brochure` en ~52)
- Modify: `src/editions/services/editions.service.ts`
- Create: `src/editions/dtos/certificate-template.dto.ts`
- Modify: `src/email/services/email-broadcast.service.ts` (extraer el conteo de ~153-166)
- Modify: `src/editions/dtos/edition.dto.ts` / `clone` (`editions.service.ts` ~143): **al clonar no se copia** `certificateTemplate` y la versión arranca en 0
- Test: `src/editions/services/editions.service.spec.ts` (nuevo o existente), `src/email/services/email-broadcast.service.spec.ts`

**Interfaces:**
- Consumes: `PdfService.generateCertificatePreview` (Task 3), `CertificateTemplate` (Task 2).
- Produces (HTTP, prefijo `admin/editions/:uuid`):
  - `POST certificate-template/background`: multipart `file`, `ParseFilePipe` con 10 MB y `fileType: /^(application\/pdf|image\/(jpeg|jpg|png))$/`. Responde `{ key: string; url: string; backgroundType: 'pdf' | 'image' }`. Sube a la carpeta `certificate-templates/<editionUuid>` con nombre `${Date.now()}-${originalname}`.
  - `POST certificate-template/preview`: body `CertificateTemplateDto`. Responde `application/pdf` con `Content-Disposition: attachment; filename="certificado-prueba.pdf"`. Datos de ejemplo: `JUAN CARLOS` / `PÉREZ GONZÁLEZ` / `1234567890`.
  - `PUT certificate-template`: body `CertificateTemplateDto`. Responde `{ edition: Edition; outdated: number; recipients: number }`.
- Produces: `EditionsService.saveCertificateTemplate(uuid: string, dto: CertificateTemplateDto): Promise<{ edition: Edition; outdated: number; recipients: number }>`. En una transacción guarda el template y hace `version = version + 1`. `outdated` = boletos de la edición con `certificate_url IS NOT NULL` y versión ≠ la nueva.
- Produces: `EmailBroadcastService.countRecipients(filters: { target_edition?: number | null; target_ticket_types?: string[] | null }): Promise<number>`, el mismo query que usa hoy `createBroadcast`, que pasa a llamar a este método.
- `CertificateTemplateDto`: `class-validator` con `background` (string, no vacío), `backgroundUrl` (string), `backgroundType` (`IsIn(['pdf','image'])`) y `elements` (`ValidateNested`, números ≥ 0, `align` en `left|center|right`, `color` de 3 números entre 0 y 1).

- [ ] **Step 1: Write failing tests**
  - `saveCertificateTemplate sube la versión y devuelve outdated y recipients`: edición v0 con 3 boletos (1 con certificado) → v1, `outdated: 1`, `recipients` = `countRecipients({ target_edition: edition.id })`.
  - `saveCertificateTemplate rechaza una edición inexistente con NotFoundException`.
  - `clone no copia certificateTemplate`.
  - `countRecipients cuenta emails distintos PAID+RESERVED de la edición` (y `createBroadcast` sigue pasando su test actual).
- [ ] **Step 2: Run** `yarn test src/editions src/email`. Expected: FAIL.
- [ ] **Step 3: Implement** el DTO, el servicio y los 3 endpoints. Inyectar `PdfService`, `S3Service` y `EmailBroadcastService` donde haga falta, o importar sus módulos y vigilar las dependencias circulares con `forwardRef` solo si aparecen.
- [ ] **Step 4: Run** `yarn test && yarn build`. Expected: PASS. Prueba rápida con curl: `PUT` sin token → 401.
- [ ] **Step 5: Commit** `feat(certificados): endpoints de admin para subir, probar y guardar el formato`

### Task 6: Front — tipos, servicios y botón del certificado en el boleto

**Files:**
- Modify: `src/types/localidadTypes.ts` (exporta los tipos de elemento) o `src/types/edition.ts`: agregar `CertificateTemplate` (misma forma que en el back), y `Edition.certificateTemplate?: CertificateTemplate | null`, `Edition.certificateTemplateVersion?: number`
- Modify: `src/types/tickets.tsx` (`Ticket`, ~176): `certificateAvailable?: boolean`
- Modify: `src/services/editions.ts`
- Modify: `src/app/ticket/[document]/page.tsx` (~188 y ~225)

**Interfaces:**
- Produces, en `adminEditionService`:
  - `uploadCertificateBackground(editionUuid: string, file: File): Promise<{ key: string; url: string; backgroundType: 'pdf' | 'image' }>`. Sin `Content-Type` manual, igual que `uploadTicketBackground`.
  - `downloadCertificatePreview(editionUuid: string, template: CertificateTemplate): Promise<void>`. Descarga el blob como `certificado-prueba.pdf`.
  - `saveCertificateTemplate(editionUuid: string, template: CertificateTemplate): Promise<{ edition: Edition; outdated: number; recipients: number }>`.

- [ ] **Step 1: Implement** los tipos y servicios de arriba.
- [ ] **Step 2: Change the ticket page**. El botón y el texto `certAvailable` usan `ticket.certificateAvailable ?? !!ticket.certificateUrl`, para seguir funcionando contra un back viejo. El click sigue llamando a `downloadCertificate(ticket.uuid)`.
- [ ] **Step 3: Run** `yarn build`. Expected: compila. (`yarn lint` está roto desde antes por `@typescript-eslint`; no es parte de esta tarea.)
- [ ] **Step 4: Commit** `feat(certificados): servicios del formato y botón según disponibilidad`

### Task 7: Front — editor de plantilla parametrizable (boletos y certificados)

**Files:**
- Modify: `src/components/admin/TicketTemplateEditor.tsx`
- Modify: `package.json` / `yarn.lock` (`pdfjs-dist`, la versión estable actual que funcione con Next 13; worker vía `pdfjs-dist/build/pdf.worker.min.mjs` o la ruta equivalente de esa versión)

**Interfaces:**
- Produces: `TicketTemplateEditor` acepta props opcionales, y sin ellas se comporta **exactamente igual que hoy** para boletos:
  ```ts
  page?: { width: number; height: number; label: string };     // boleto: 612×765 "1080×1350"; certificado: 842×595 "A4 horizontal"
  accept?: string;                                              // boleto: 'image/jpeg,image/png'; certificado: 'application/pdf,image/jpeg,image/png'
  defaultTemplate?: TemplateLike;
  upload?: (file: File) => Promise<{ url: string; key?: string; backgroundType?: 'pdf' | 'image' }>;
  preview?: (t: TemplateLike, sample: { name: string; lastname: string; document: string }) => Promise<void>;
  ```
  `TemplateLike` = `TicketTemplate & Partial<Pick<CertificateTemplate,'backgroundUrl'|'backgroundType'>>`. El editor muestra `backgroundUrl ?? background`.
- Valores por defecto del certificado (los exporta este archivo como `CERTIFICATE_DEFAULT_TEMPLATE`), medidos sobre el provisional 842×595 con el origen de pdf-lib abajo a la izquierda: `qrCode {x:22,y:105,width:95,height:95}`, `name {x:421,y:340,size:26,align:'center',color:[0.07,0.15,0.13],maxWidth:560}`, `document {x:205,y:316,size:14,align:'left',color:[0.07,0.15,0.13],maxWidth:200}`. Son un punto de partida: ajustarlos con el certificado de prueba hasta que caigan en el recuadro blanco del QR, sobre la línea y a la derecha de "C.C".

- [ ] **Step 1: Parametrize the geometry**: `IMG_W/IMG_H/SCALE/PREVIEW_H` salen de `page`. En certificado, `PREVIEW_W` pasa a 560 para que la hoja horizontal se lea.
- [ ] **Step 2: Render PDF backgrounds**: si `backgroundType==='pdf'`, rasterizar la página 1 en un `<canvas>` con `pdfjs-dist`, cargado con `import()` dinámico solo en ese caso, y usar ese canvas en lugar del `<img>`.
- [ ] **Step 3: Route upload and preview** a través de las props, con fallback a `uploadTicketBackground` y `downloadTicketPreview` cuando no vienen.
- [ ] **Step 4: Run** `yarn build`. Expected: compila. Abrir una localidad en `/admin/.../localidades` y comprobar que el editor de boletos se ve y funciona igual que antes (subir, mover, boleto de prueba).
- [ ] **Step 5: Commit** `feat(admin): editor de plantilla reutilizable para certificados`

### Task 8: Front — "Formato del certificado" y modal de reenvío

**Files:**
- Create: `src/components/admin/certificates/CertificateTemplateModal.tsx`
- Create: `src/components/admin/certificates/ResendCertificatesModal.tsx`
- Modify: `src/components/admin/certificates/CertificatesAdmin.tsx` (botón por edición, junto a "Liberar ahora / Bloquear", ~130-138)

**Interfaces:**
- Consumes: Task 6 (servicios) y Task 7 (editor con props).
- `CertificateTemplateModal({ edition, onClose, onSaved }: { edition: Edition; onClose: () => void; onSaved: (r: { outdated: number; recipients: number }) => void })`. Usa el editor con `page` horizontal, `accept` con PDF, `defaultTemplate` en `CERTIFICATE_DEFAULT_TEMPLATE`, `value` en `edition.certificateTemplate`, y upload y preview vía `adminEditionService`. "Guardar" llama a `saveCertificateTemplate`, y queda deshabilitado mientras no haya fondo.
- `ResendCertificatesModal({ edition, recipients, onClose })`. Muestra "Se reenviará a {recipients} asistentes de {edition.name}" y los campos asunto (`Tu certificado del ${edition.name}`) y mensaje (texto breve que diga que adjuntamos el certificado actualizado), ambos editables. "Enviar" llama a `emailBroadcastService.create({ title, content, sender_name, type:'ALL_USERS', target_edition: edition.id, include_certificate: true, force_regenerate_certificate: false })`. `sender_name` se deriva de la edición igual que en el formulario actual de Broadcasts (reutilizar ese helper; no quemar el año). Si `recipients === 0`, el botón queda deshabilitado con ese mensaje.
- Flujo: guardar → cerrar el editor → abrir `ResendCertificatesModal` con el `recipients` de la respuesta. "No reenviar" solo cierra. Después de guardar, recargar la lista de ediciones.

- [ ] **Step 1: Implement** los dos modales y el botón "Formato del certificado". El botón muestra "(formato propio)" si `edition.certificateTemplate` existe.
- [ ] **Step 2: Run** `yarn build`. Expected: compila.
- [ ] **Step 3: Commit** `feat(admin): subir el formato del certificado y preguntar si reenviar`

### Task 9: Prueba local de punta a punta (sin tocar producción)

**Files:**
- Create (back): `src/scripts/seed-certificate-e2e.script.ts`. Crea, en la edición 2026 de la base local, 3 boletos PAID con UUIDs nuevos y emails `cert-e2e-1..3@example.test`, sube sus QR con `getOrCreateQrPng`, y a uno le genera un certificado con el diseño 2025 (`certificate_template_version = NULL`). Imprime los UUIDs y el SHA-256 de cada `qr-codes/<uuid>.png`.
- Create (back): `src/scripts/check-certificate-e2e.script.ts <uuid...>`. Por cada boleto descarga `GET /tickets/certificate/:uuid`, extrae la imagen del QR del PDF y compara su SHA-256 con el del seed (o decodifica y comprueba que es `${FRONTEND_URL}ticket/<uuid>`). También vuelve a calcular el hash de `qr-codes/<uuid>.png` en S3. Imprime `OK`/`FAIL` por boleto.

**Precondiciones:** `.env` local (sin commitear) con Postgres local, `S3_KEY_PREFIX=dev/cert-e2e/`, `MAIL_REDIRECT_TO=<dirección que dé el usuario>`, `FRONTEND_URL=http://localhost:3001/` (o el puerto del front), Redis corriendo para Bull, y `yarn migrations:run` aplicado. **Pedir al usuario la dirección de `MAIL_REDIRECT_TO` y confirmar las credenciales antes del paso 6.**

- [ ] **Step 1:** Correr el seed. Expected: 3 UUIDs con sus hashes.
- [ ] **Step 2:** En el panel, liberar los certificados de 2026 si no están liberados. Abrir `/ticket/<uuid>` de un boleto sin certificado: el botón "Descargar certificado" aparece.
- [ ] **Step 3:** En "Formato del certificado" de 2026: subir `CERTIFICADO CNMP 2026 - fromato.pdf`, ajustar posiciones con el certificado de prueba y guardar. Expected: el modal de reenvío dice 3 destinatarios, y la respuesta trae `outdated: 1`. Elegir "No reenviar".
- [ ] **Step 4:** `check-certificate-e2e` con los 3 UUIDs. Expected: 3 × OK, y el PDF descargado muestra el formato provisional (abrir uno y verlo).
- [ ] **Step 5:** Crear un "definitivo" de prueba: el provisional con un logo agregado en la esquina superior derecha (con pdf-lib en un script desechable del scratchpad). Subirlo y guardar. Elegir "No reenviar". Repetir el check. Expected: 3 × OK, y el PDF muestra el logo.
- [ ] **Step 6:** Volver a guardar y elegir "Sí", reenviar. Expected: se crea un broadcast con `target_edition` = 2026 e `include_certificate`, llegan 3 correos **solo** a `MAIL_REDIRECT_TO` con el asunto `[→ cert-e2e-N@example.test] …`, y cada uno trae el certificado con logo.
- [ ] **Step 7:** Descargar el certificado de un boleto 2025 local. Expected: diseño 2025 sin cambios.
- [ ] **Step 8:** Limpieza. El script de check acepta `--cleanup`, que **aborta si `S3_KEY_PREFIX` está vacío o no empieza con `dev/`**. Con el prefijo válido borra todo lo que esté bajo él y elimina los 3 boletos del seed. Expected: el prefijo queda vacío y la base local no tiene emails `@example.test`.
- [ ] **Step 9: Commit** (back) `test(certificados): scripts de prueba local del formato y del QR`
