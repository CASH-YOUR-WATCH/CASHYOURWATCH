# Cash Your Watch

Plataforma web de financiamiento respaldado por relojería y activos de lujo. Intake digital de
solicitudes + seguimiento; el cierre del trato es offline. Mercado: México. Idioma: español.

> El brief completo del proyecto está en [`CLAUDE.md`](./CLAUDE.md).

## Stack
- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**
- **Supabase** (Postgres + Auth + Storage)
- Deploy en **Vercel**

## Empezar (local)

1. Instala dependencias:
   ```bash
   pnpm install
   ```
2. Copia las variables de entorno y llénalas:
   ```bash
   cp .env.example .env.local
   ```
   (En Windows PowerShell: `Copy-Item .env.example .env.local`)
3. Arranca el servidor de desarrollo:
   ```bash
   pnpm dev
   ```
4. Abre http://localhost:3030 (CYW corre en el puerto **3030**, fijo, para no chocar con otros proyectos)

## Estructura
```
src/
  app/            # Rutas (App Router) y estilos globales
  components/
    brand/        # Logo y elementos de identidad
  lib/
    supabase/     # Clientes: client (navegador), server, admin (service_role), proxy
  proxy.ts        # Refresca la sesión de Supabase en cada request (antes "middleware")
```

## Variables de entorno
Ver `.env.example`. Las llaves secretas (`SUPABASE_SERVICE_ROLE_KEY`, `HEARTBEAT_SECRET`,
`RESEND_API_KEY`) **solo viven en el servidor** y nunca se suben al repo.

## Scripts
| Comando        | Qué hace                          |
| -------------- | --------------------------------- |
| `pnpm dev`     | Servidor de desarrollo            |
| `pnpm build`   | Build de producción               |
| `pnpm start`   | Sirve el build de producción      |
| `pnpm lint`    | Linter (ESLint)                   |
