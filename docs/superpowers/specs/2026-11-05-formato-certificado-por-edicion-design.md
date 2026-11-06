# Formato de certificado por edición, editable desde el panel

Fecha: 2026-11-05 · Repos: `congres-marketing` (front) y `congress-marketing-be` (back)

## Intención

El CNMP 2026 (4 y 5 de septiembre de 2026, Bogotá) terminó hace más de un mes y los
asistentes piden su certificado. El formato definitivo lleva el logo de un partner que
todavía no aprueba su uso. Mientras tanto se entrega un **certificado provisional**
(`CERTIFICADO CNMP 2026 - fromato.pdf`, A4 horizontal, 842×595 pt). Cuando llegue la
aprobación se sube el **formato definitivo** y todos deben poder obtenerlo **con el mismo
QR** que ya tienen: ni QR nuevo ni enlace nuevo.

Hoy el formato del certificado está fijo en el código (`images/certificate-template-2025.jpg`,
coordenadas fijas en `PdfService.generateCertificate`). Cambiarlo exige tocar código y
desplegar. Lo que se quiere es que el equipo lo cambie desde el panel.

## Lo que ya existe y en qué se apoya

- **El QR ya es estable.** Codifica `<frontend>/ticket/<uuid>`, se genera una sola vez y vive
  en S3 como `qr-codes/<uuid>.png`. El certificado incrusta esa imagen. Regenerar el
  certificado **no** debe regenerar el QR.
- **Caché del certificado.** `tickets.certificate_url` apunta a `certificates/<uuid>.pdf` en S3.
  `GET /tickets/certificate/:uuid` y los envíos de Broadcasts sirven esa copia si existe y solo
  regeneran si falta (o si el envío fuerza la regeneración).
- **Boletos como precedente.** `TicketTemplateEditor` (front) + `localidad.ticketTemplate`
  (jsonb, tipo `TicketTemplate`: fondo + posiciones de `qrCode`, `name` y `document`) + subir el fondo
  (`POST /localidad-types/upload-ticket-bg`) + vista previa (`POST /localidad-types/preview-ticket`) +
  regeneración en cola. El certificado debe seguir ese mismo patrón.
- **Liberar o bloquear** certificados por edición ya existe en `/admin/certificates`
  (`edition.certificatesEnabled`).
- **Broadcasts** ya admite `target_edition`, `include_certificate` y `force_regenerate_certificate`.

## Objetivos

1. En `/admin/certificates`, cada edición tiene **"Formato del certificado"**, que abre un editor
   donde se puede:
   - subir el formato (PDF, JPG o PNG);
   - ubicar el **nombre**, el **documento** (C.C) y el **QR** sobre la hoja horizontal;
   - descargar un **certificado de prueba** con datos ficticios antes de guardar.
2. El certificado de una edición con formato propio se genera con ese formato y esas posiciones.
3. Al **guardar un formato nuevo**, los certificados ya generados de esa edición dejan de ser
   válidos. La próxima descarga, escaneo o envío los regenera con el formato nuevo. **El QR
   queda idéntico** (misma imagen de S3, byte a byte).
4. Después de guardar, el panel **pregunta** "¿Reenviar el certificado por correo a los
   asistentes de esta edición?". Si la respuesta es sí, crea un envío de Broadcasts para esa
   edición con el certificado adjunto.
5. **Prueba en local** de punta a punta (ver "Prueba").

## No objetivos

- No se rediseña el certificado ni se agregan campos nuevos (fecha, horas, tipo de entrada). Solo nombre, documento y QR, igual que hoy.
- No se cambia el QR ni la lógica de "liberar o bloquear". De la página `/ticket/<uuid>` solo
  cambia cuándo se muestra el botón del certificado (ver "Disponibilidad").
- No hay historial ni versiones de formatos. El formato guardado reemplaza al anterior.
- No se tocan los boletos.

## Anti-objetivos (sería un fracaso aunque "funcione")

- Que regenerar el certificado genere un QR nuevo o cambie `qr-codes/<uuid>.png`.
- Que alguien que ya descargó el provisional siga recibiendo el provisional después de subir el
  definitivo.
- Que las ediciones sin formato propio (2025) cambien su certificado.
- Que el reenvío salga sin que el administrador lo confirme.

## Decisiones tomadas con el usuario

- El formato se cambia **desde el panel**, no a mano.
- Al subir un formato nuevo, el panel **pregunta** si reenviar. No reenvía solo.
- Hoy solo existe el provisional. El definitivo llegará después.
- **Destinatarios:** los mismos que hoy, boletos PAID y RESERVED de todos los tipos de entrada.
  No hay filtros nuevos: el conteo del modal y el envío usan exactamente el criterio actual de
  Broadcasts.
- **Prueba local totalmente aislada:** Postgres local con boletos inventados (UUIDs nuevos,
  que no pueden pisar `certificates/` ni `qr-codes/` reales), y archivos S3 de prueba bajo
  un prefijo `dev/` que se borra al final. El correo se redirige a **una sola dirección del
  usuario**.

## Decisiones mías (revisables)

- **Dónde se guarda:** columna nueva `editions.certificate_template` (jsonb, nullable) con la
  misma forma que `TicketTemplate`: `{ background, elements: { qrCode, name, document } }`,
  más `backgroundType: 'pdf' | 'image'`. Requiere una migración TypeORM.
  `null` = usar el diseño fijo actual (compatibilidad con 2025).
- **Se acepta PDF tal cual.** El back lo incrusta como página vectorial con
  `pdfDoc.embedPdf()` y `page.drawPage()` (pdf-lib, que ya está), escalado a 842×595. Si es imagen,
  usa `embedJpg` o `embedPng` como hoy. Solo se usa la primera página del PDF.
- **Subida:** `POST /admin/editions/:uuid/certificate-template/background` (multipart, máximo 10 MB,
  pdf/jpg/png) → S3 en `certificate-templates/<editionUuid>/<timestamp>-<nombre>`. Devuelve
  `{ key, url, backgroundType }`. El formato no se aplica hasta que se guarda.
- **Guardar:** `PUT /admin/editions/:uuid/certificate-template` con el template completo.
  Incrementa `editions.certificate_template_version` (int, default 0). Responde con
  `{ edition, outdated: n, recipients: m }`, donde `n` son los boletos con un certificado
  generado con otra versión y `m` es el número de destinatarios que tendría el reenvío.
- **Caché por versión (no se borra `certificate_url`):** columna nueva
  `tickets.certificate_template_version` (int, nullable), que se graba al generar. Un
  certificado en caché solo es válido si su versión coincide con la de la edición. Si no
  coincide, o es `null` en una edición con formato propio, se regenera. Aplica a
  `GET /tickets/certificate/:uuid` y a `obtenerPdfDeCertificado` de los Broadcasts. Se
  descartó poner `certificate_url = NULL` porque hoy la página `/ticket/<uuid>` solo muestra
  el botón si existe `certificateUrl`: anularlo escondería el certificado a quien escanee
  el QR.
- **Disponibilidad en `/ticket/<uuid>` (corrige un hueco actual):** hoy el botón "Descargar
  certificado" solo aparece si el certificado ya se generó alguna vez, y nada lo genera salvo
  un Broadcast. Así que un asistente 2026 que escanea su QR ve "pendiente" aunque la edición
  esté liberada. El back expone `certificateAvailable: boolean`, verdadero cuando la edición
  lo liberó, haya o no PDF en caché. El front muestra el botón según ese campo, y el botón
  sigue llamando a `GET /tickets/certificate/:uuid`, que genera si hace falta. Es el único
  cambio en la página del boleto.
- **Vista previa:** `POST /admin/editions/:uuid/certificate-template/preview` con el template
  sin guardar. Devuelve un PDF con nombre y documento de ejemplo y un QR de prueba, igual que el
  boleto de prueba.
- **Generación:** `PdfService.generateCertificate(ticket)` busca la edición del boleto. Si tiene
  `certificate_template`, usa ese fondo y esas posiciones. Si no, usa el código actual sin
  cambios. El QR sale siempre de `qr-codes/<uuid>.png`. Si esa imagen no existe en S3
  (boletos antiguos), se genera **una vez** con la misma URL `<frontend>/ticket/<uuid>`, se sube
  a esa key y se reutiliza. Así queda igual que el flujo de `resend`.
- **Texto:** misma fuente (`fonts/Garet-Heavy.ttf`), nombre en mayúsculas y ajuste de tamaño
  con `calculateFontSize`. El color, el tamaño inicial, la alineación y el ancho máximo
  salen del template.
- **Posiciones iniciales del 2026:** el editor arranca con valores que caen en el formato
  provisional: el QR dentro del recuadro blanco de la izquierda, el nombre centrado sobre la
  línea, y el documento a la derecha de "C.C". El builder los mide sobre el PDF.
- **Editor:** se generaliza `TicketTemplateEditor` para recibir el tamaño de la hoja
  (portrait 1080×1350 para boletos, landscape 842×595 para certificados) y las funciones de
  subir y previsualizar, sin duplicarlo. Para ver un fondo PDF en el editor se renderiza la
  primera página en un `<canvas>` con `pdfjs-dist` (dependencia nueva del front).
- **Reenvío:** el modal posterior muestra "Se reenviará a N asistentes", con asunto y mensaje
  prellenados y editables. Al confirmar crea el broadcast con `type: ALL_USERS`,
  `target_edition`, `include_certificate: true` y `force_regenerate_certificate: false`. Con
  `false` basta, porque guardar ya anuló la caché, y el envío no regenera dos veces. El
  remitente se deriva de la edición, como ya hacen los Broadcasts.
- **Permisos:** todos los endpoints nuevos van bajo el guard de admin actual.

## Restricciones

- Postgres y migraciones TypeORM (`yarn typeorm migration:...` en el back).
- El back no tiene `.env`, y `.env.example` apunta al bucket de producción
  (`congress-marketing`) y a SES real. **No hay modo de prueba de correo.** Para probar hace
  falta:
  - un `.env` local (sin commitear) con Postgres local;
  - un **prefijo S3 configurable** (p. ej. `S3_KEY_PREFIX=dev/`, vacío en producción) aplicado
    en `S3Service` a todas las keys, para que nada de la prueba caiga en las rutas reales;
  - un **redireccionador de correo** (p. ej. `MAIL_REDIRECT_TO`, vacío en producción): si está
    definido, todo correo se envía solo a esa dirección, con el destinatario original en el
    asunto. El usuario da la dirección al momento de probar.

  Ambos son cambios pequeños, opt-in, y no alteran producción si las variables no se definen.

## Prueba (en local)

1. Levantar el back (Postgres local + Redis para Bull) y el front.
2. Edición 2026 con 3 boletos PAID. Uno ya tiene certificado generado con el diseño 2025
   (simula a quien ya descargó).
3. Guardar en S3 las 3 imágenes `qr-codes/<uuid>.png` y su hash.
4. En el panel: subir el PDF provisional, ajustar posiciones, descargar el certificado de prueba y
   guardar. Comprobar `outdated = 1` (el que ya tenía certificado 2025). Abrir `/ticket/<uuid>`
   de un boleto sin certificado previo: el botón debe aparecer.
5. Descargar los 3 certificados (`GET /tickets/certificate/:uuid`). Deben salir con el formato
   provisional, y el QR incrustado debe ser idéntico al guardado. Se compara el hash de
   `qr-codes/<uuid>.png` antes y después, y el QR se decodifica para comprobar que sigue
   llevando a `/ticket/<uuid>`.
6. Subir un "definitivo" de prueba (el provisional con un logo agregado) y guardar. En el
   modal, decir "No". Descargar de nuevo: debe salir el definitivo con el mismo QR.
7. Repetir el paso 6 y decir "Sí". Comprobar que se crea el broadcast con el certificado,
   apuntando solo a la edición 2026, y que los correos llegan únicamente a la dirección de
   `MAIL_REDIRECT_TO` con el certificado definitivo adjunto.
9. Al final, borrar las keys `dev/` de S3.
8. Comprobar que el certificado de un boleto de 2025 sigue saliendo igual que antes.

Pruebas automatizadas en el back: `generateCertificate` con y sin template (fondo PDF y fondo
imagen), el guardado que anula `certificate_url` solo de esa edición, y que el QR no se
regenera cuando ya existe.

## Lo que queda a criterio del builder

- Textos exactos del panel, del modal y del correo prellenado.
- Si `pdfjs-dist` se carga de forma diferida en el editor.
- Nombres de DTO y de métodos, y la estructura interna del servicio.
- Cómo se generaliza el editor (props, subcomponentes), mientras no se duplique.

## Checklist de despliegue

- Correr la migración `EditionCertificateTemplate1767200000000` antes de desplegar el backend.
- En el `.env` de producción dejar vacíos `S3_KEY_PREFIX`, `AWS_S3_ENDPOINT` y `MAIL_REDIRECT_TO` (solo desarrollo).
- Bucket S3: regla CORS que permita `GET` desde el origen del panel sobre `certificate-templates/*`; sin ella, al reabrir un formato guardado el editor no muestra el PDF de fondo (aviso y sigue funcionando; "Probar" muestra el resultado real). Confirmar lectura pública de ese prefijo.
- IAM: confirmar `s3:ListBucket`. Con ese permiso un 403 nunca significa "falta el QR"; sin él, un 403 se trata como QR faltante y se genera (bytes deterministas desde `FRONTEND_URL`).
- Fusionar `fix/remove-zone-identifier` antes de la rama del frontend.
- Prueba local aislada: `yarn e2e:cert:seed`, `yarn e2e:cert:check --stage <n> <uuid...>`, `yarn e2e:cert:check --cleanup` (abortan fuera de un entorno local con `S3_KEY_PREFIX=dev/...`, `MAIL_REDIRECT_TO` y `DB_HOST` local).
