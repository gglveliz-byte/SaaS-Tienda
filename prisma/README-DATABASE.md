# Base de datos – Tienda SaaS

## Cómo funciona

### Una base de datos, varios esquemas

En PostgreSQL tienes:

- **Una base de datos**: `tcss_programming` (en tu caso en Render).
- **Varios esquemas** dentro de esa misma base:
  - `tienda_saas` → **solo este proyecto** (Tienda SaaS).
  - Otros esquemas → tccss shop fusion, in house, etc. **No se tocan**.

La app **solo usa el esquema `tienda_saas`**. Todo lo que crea Prisma (tablas, enums) va ahí. Los demás esquemas y proyectos no se modifican.

### Qué hace Prisma

En `schema.prisma`:

- `schemas = ["tienda_saas"]` → Prisma trabaja solo con ese esquema.
- Cada modelo tiene `@@schema("tienda_saas")` → todas las tablas se crean en `tienda_saas`.

Ejemplo de estructura en PostgreSQL:

```
Base de datos: tcss_programming
├── Esquema: public (u otros)     ← otros proyectos (no los tocamos)
├── Esquema: tienda_saas         ← solo este proyecto
│   ├── admins
│   ├── planes
│   ├── tiendas
│   ├── vendedores
│   ├── categorias_producto
│   ├── productos
│   ├── archivos
│   ├── pedidos
│   └── items_pedido
```

### Usuario de la app (recomendado)

Ahora mismo la app se conecta con el usuario **`admin`** de PostgreSQL (el que está en `DATABASE_URL`). Ese usuario suele ser “dueño” de todo.

Lo ideal es:

- **Un usuario solo para esta app**, por ejemplo `tienda_saas_app`, con permisos **solo sobre el esquema `tienda_saas`**.
- Así:
  - No usas el “admin” total de la base.
  - Este proyecto no puede tocar otros esquemas (shop fusion, in house).

### Cómo usar el usuario dedicado

1. En PostgreSQL (como superusuario o como el usuario `admin` actual), ejecuta el script:
   ```bash
   psql "postgresql://admin:...@HOST/tcss_programming" -f prisma/setup-schema-and-user.sql
   ```
   Antes, edita el script y cambia `TU_PASSWORD_SEGURA` por la contraseña del nuevo usuario.

2. En tu `.env`, cambia `DATABASE_URL` para usar el nuevo usuario:
   ```env
   DATABASE_URL="postgresql://tienda_saas_app:TU_PASSWORD_SEGURA@dpg-d5ak78vgi27c7393uio0-a.oregon-postgres.render.com/tcss_programming?schema=tienda_saas"
   ```
   (Mismo host, misma base, mismo `?schema=tienda_saas`; solo cambian usuario y contraseña.)

3. Si las tablas de `tienda_saas` aún no existen, genera el cliente y aplica migraciones:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```
   Si ya existen (creadas antes con el usuario `admin`), con solo cambiar el `.env` la app empezará a usar `tienda_saas_app`.

### Resumen

| Concepto | Significado |
|----------|-------------|
| **Base de datos** | `tcss_programming` (compartida con otros proyectos). |
| **Esquema** | `tienda_saas` → solo este proyecto; el resto de esquemas no se toca. |
| **Usuario en .env** | Mejor usar `tienda_saas_app` (o similar) en lugar del usuario `admin` total. |
| **ADMIN_EMAIL / ADMIN_PASSWORD** | Son del **panel de la app** (login admin en la web), no del usuario de PostgreSQL. |

Así la app entra como administrador “administrador” de la app usando `ADMIN_EMAIL` y `ADMIN_PASSWORD`, y se conecta a la base con un usuario PostgreSQL dedicado solo al esquema `tienda_saas`.

### Si usas Render (PostgreSQL gestionado)

En Render a veces no se pueden crear usuarios nuevos (solo el usuario que te dan). En ese caso:

- Sigue usando en `.env` el usuario que te da Render (ej. `admin`) en `DATABASE_URL`.
- La app solo usa el esquema `tienda_saas`; los otros esquemas (shop fusion, in house) no se tocan.
- Si mas adelante tienes un PostgreSQL propio (VPS, otro proveedor), ahi si puedes crear el usuario `tienda_saas_app` y usar el script `setup-schema-and-user.sql`.
