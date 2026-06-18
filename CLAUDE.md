@AGENTS.md

# Cash Your Watch (CYW) — Brief del proyecto

> Documento de referencia del proyecto. Construir por fases, en el orden de la sección 14.
> No intentar todo en un solo paso. Idioma de la interfaz: **español (México)**.

## 1. Contexto
Cash Your Watch (CYW) es una plataforma web de financiamiento respaldado por relojería y
activos de lujo. El usuario inicia digitalmente una solicitud: crea cuenta, captura sus datos,
los del reloj, sube fotos y documentación; el equipo de CYW evalúa. **El cierre del trato es
personal/offline** — la plataforma gestiona el intake y el seguimiento, **no procesa pagos**.

**Qué NO es:** no es casa de empeño. Es una plataforma moderna, financiera y discreta, inspirada
en fintech privadas, asset management y private banking. "Capital inteligente respaldado por
activos de lujo." Volumen esperado bajo (~5 solicitudes/mes, mercado selecto local/regional).

**Diferenciador clave:** landing con animación 3D premium al scroll (sección 8). Sello de marca.

## 2. Stack técnico
- Next.js (App Router) + TypeScript — **Next.js 16** (ver AGENTS.md: cambios importantes)
- Tailwind CSS v4 (mobile-first)
- Supabase: Postgres + Auth (email/contraseña) + Storage (bucket privado)
- 3D / animación (solo landing): `three`, `@react-three/fiber`, `@react-three/drei`,
  `@react-three/postprocessing`, `gsap` (+ ScrollTrigger), `lenis`, `framer-motion`
- Correos: Resend o webhook a n8n (integración desacoplada)
- Deploy: Vercel (repo GitHub privado)

**Supabase:** cliente servidor con la secret key SOLO en el servidor; en el navegador solo la
publishable/anon. **Nunca** exponer la secret/service_role al cliente.

### Notas de implementación (Next.js 16)
- `middleware.ts` se renombró a `proxy.ts` (función `proxy`, runtime nodejs). Ya implementado en
  `src/proxy.ts` para refrescar la sesión de Supabase.
- APIs dinámicas asíncronas: `cookies()`, `headers()`, `params`, `searchParams` se usan con `await`.
- Turbopack es el default en `next dev` y `next build`. `next lint` se eliminó (usar `eslint`).

## 3. Identidad de marca
Paleta: Blanco `#FFFFFF` (claridad) · Gris `#3C3C3B` (estructura) · Negro `#0B0F14` (fondo principal).
Estética: oscura, sobria, minimalista, premium. Mucho espacio negativo; secciones que alternan
negro/blanco; animaciones suaves al scroll.

Tipografía: Display **Qlassy** (serif sofisticada) · Cuerpo **Montserrat** · Acento **Houstiq**.
Qlassy y Houstiq son comerciales (aún no entregadas). Mientras tanto: Montserrat para cuerpo y
**Cormorant Garamond** como serif de display. La carga de fuentes vive en `layout.tsx` para
sustituirlas fácil cuando lleguen los archivos.

Tono: claro, directo, elegante, seguro, profesional, discreto. Arquetipos: El Gobernante + El Sabio.
Evitar: exageraciones, lenguaje agresivo, comunicación vulgar, exceso de lujo aspiracional.

## 4. Módulos
- **A. Landing premium** — hero institucional con 3D al scroll, cómo funciona, beneficios,
  seguridad, FAQ, contacto, CTAs y animaciones suaves.
- **B. Auth** — registro, login, recuperación, perfil, roles (`user` / `admin`).
- **C. Onboarding por pasos** — flujo de 5 etapas con subida de archivos.
- **D. Panel del usuario** — solicitudes, estado en tiempo real, resumen del reloj, fechas.
- **E. Panel admin a la medida** — NO el panel de Supabase. Listado + filtros, detalle con fotos
  y documentos, cambio de estado, notas internas.
- **F. Notificaciones por correo** — automáticas en momentos clave.
- **G. Responsive** — mobile-first.
- **H. Legal y seguridad básica** — privacidad y términos (placeholders), subida controlada a
  storage privado, roles, protección de formularios.

## 5. Modelo de datos (Postgres / Supabase) — RLS en todas
- `profiles` — `id` (ref `auth.users`), `nombre`, `telefono`, `role` (`'user'`|`'admin'`, default `'user'`), `created_at`.
- `applications` — `id`, `folio` (legible, ej. `CYW0428`), `user_id`, `marca`, `modelo`,
  `estado_reloj` (`excelente`/`bueno`/`regular`), `valor_estimado`, `monto_deseado`,
  `status` (enum), `notas_internas` (solo admin), `created_at`, `updated_at`.
- `application_files` — `id`, `application_id`, `tipo` (`foto_frontal`, `foto_trasera`,
  `foto_lateral`, `foto_cierre`, `foto_serie`, `doc_factura`, `doc_certificado`, `doc_garantia`,
  `doc_propiedad`), `storage_path`, `created_at`.
- `application_status_history` — `id`, `application_id`, `status`, `nota`, `created_at`.
- `heartbeat` — `id` (siempre 1), `last_ping` (timestamp). Aislada para el keep-alive.

Enum status: `recibida` → `en_revision` → `preaprobada` → `cita_agendada` → `formalizada` / `rechazada`.

RLS clave:
- `profiles`: cada usuario lee/edita el suyo; admin lee todos.
- `applications`: usuario lee/inserta las suyas (no editar tras enviar); admin lee/actualiza todas.
- `application_files`: acceso ligado a la propiedad de la solicitud; admin todas. Bucket privado;
  se sirven con signed URLs generadas en el servidor tras verificar permiso.
- `application_status_history`: usuario lee la de sus solicitudes; admin escribe.
- `heartbeat`: solo el servidor (service_role) escribe.

## 6. Seguridad (no negociable)
- Bucket de Storage privado; nada de URLs públicas para documentos.
- Acceso a archivos solo vía signed URLs de expiración corta, generadas en el servidor tras
  verificar rol/propiedad.
- RLS activado en todas las tablas con datos de usuarios.
- secret/service_role solo en el servidor.
- Comprimir imágenes en cliente antes de subir (~200–400 KB por foto).
- Nunca secretos en URLs/query strings. Validar tamaño y tipo de archivo en la subida.

## 7. Copy del sitio
Ver el brief original (en la conversación de arranque). Eyebrow: "CASH YOUR WATCH — ELITE ASSETS.
IMMEDIATE ACCESS." H1: "Convierte exclusividad en oportunidad." Las respuestas de FAQ con
implicación legal son provisionales y deben validarse con el cliente/abogado.

## 8. Experiencia 3D / animación premium (landing)
Reloj 3D que reacciona al scroll (gira/flota/se acerca) y, en un momento clave, transformación
cinematográfica (reloj → capital). Dos enfoques combinables: (A) 3D en vivo con R3F en el hero;
(B) secuencia pre-renderizada (técnica Apple) para el morph. Assets los provee el cliente (modelo
GLB optimizado Draco+KTX2, HDRI CC0). Rendimiento crítico: lazy-load, fallback ligero, comprimir
todo. **El sitio NUNCA debe depender del 3D para funcionar.** Se implementa al final (Fase 11).

## 9. Onboarding (5 etapas, barra "Paso X de 5", mobile-first)
1. Solicitante — contacto e identificación. 2. El reloj — marca, modelo, estado, valor, monto
deseado. 3. Fotografías — frontal, trasera, lateral, cierre, serie (comprimir en cliente).
4. Documentos — certificados, factura, garantía, propiedad. 5. Confirmación — resumen, avisos,
envío. Al enviar: crea `application`, sube archivos al bucket privado, dispara correos.

## 10. Estados (timeline del usuario, con fecha por paso)
`Solicitud recibida` → `En revisión` → `Preaprobada` → `Cita de validación física` →
`Formalizada` (o `Rechazada`). Mostrar resumen del reloj, folio (`#CYW…`) y monto.

## 11. Panel admin (ruta solo `role = 'admin'`)
Listado con filtros (estado, fecha, búsqueda por folio/marca); detalle con datos, fotos y docs
(signed URLs) e historial; cambiar estado (avanza enum + registra en historial + dispara correo);
notas internas (ocultas al usuario); botón "Mantener activa la base" + indicador de última actividad.

## 12. Correos (tono profesional de marca) — disparar en:
registro; solicitud recibida (usuario) + aviso al admin (`ADMIN_NOTIFICATION_EMAIL`); cambio a
"En revisión"; cambio a "Preaprobada". Vía Resend o webhook n8n; lógica de envío desacoplada.

## 13. Keep-alive (heartbeat)
Endpoint aislado `/api/heartbeat` que hace `upsert` de `last_ping` en la tabla `heartbeat`. Solo
devuelve `{ ok: true }`. Dispara con header `Authorization: Bearer ${HEARTBEAT_SECRET}` (cron n8n)
o con sesión de admin (botón en panel). El secreto va en variable de entorno, nunca en código/URL.

## 14. Orden de construcción (fases)
1. **Setup** — Next.js + TS + Tailwind + cliente Supabase + estructura + `.env.local`/`.env.example`. ✅
2. **Esquema + RLS** — migraciones SQL (sección 5) y políticas. ✅ (aplicado en Supabase cloud; notas_internas movidas a tabla `application_notes`)
3. **Auth** — registro, login, recuperación, perfil, roles. ✅ (server actions, proxy protege /perfil /panel /admin, callback PKCE en /auth/callback)
4. **Landing** — copy sección 7 + identidad; hero con estructura lista para la capa 3D (placeholder funcional). ✅ (framer-motion para reveals; placeholders de imagen CYW pendientes de fotos reales)
5. **Onboarding** — 5 pasos + subida a storage privado con compresión en cliente. ✅ (/solicitud, browser-image-compression, ruta {uid}/{appId}/{tipo})
6. **Panel de usuario** — lista + timeline. ✅ (/panel + /panel/[id], StatusTimeline, signed URLs propias, header con nav)
7. **Panel admin** — lista/filtro, detalle con signed URLs, cambio de estado, notas. ✅ (/admin, requireAdmin, lecturas con service_role, mutaciones revalidan rol; fix de prevent_role_escalation)
8. **Correos** — eventos de la sección 12. ✅ (capa desacoplada src/lib/email: Resend o webhook n8n; eventos: bienvenida, solicitud recibida usuario+admin, en_revision, preaprobada. No-op sin transporte configurado)
9. **Heartbeat** — endpoint + tabla + botón en admin. ✅ (/api/heartbeat POST/GET, auth por Bearer HEARTBEAT_SECRET o sesión admin, control en panel)
10. **Legal + pulido** — privacidad/términos (placeholder), responsive final, pruebas. ✅ (3 páginas legales concisas con alcance correcto, 404 + error boundary on-brand, disclaimer de alcance en footer)
11. **Experiencia 3D** — animación premium al scroll, lazy-load y fallback. ✅ (reloj GLB de Meshy optimizado con gltf-transform 41MB→1.7MB; R3F+drei, Environment studio, gira/flota/reacciona a scroll+cursor; solo desktop, anillos como fallback en móvil; raw en /design-source gitignored)

## 15. Variables de entorno
Ver `.env.example`. Valores reales los llena Javier a mano (local) y en Vercel (producción).
Ninguna en el repo.
