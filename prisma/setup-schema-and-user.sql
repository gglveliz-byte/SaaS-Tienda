-- ============================================================
-- Tienda SaaS: esquema y usuario dedicado
-- ============================================================
-- Ejecutar como superusuario o como el usuario "admin" actual.
-- Este script:
--   1. Crea el esquema tienda_saas (solo este proyecto lo usa)
--   2. Crea un usuario PostgreSQL solo para esta app
--   3. Le da permisos SOLO sobre tienda_saas (no toca otros esquemas)
--
-- Los otros proyectos (tccss shop fusion, in house) usan otros
-- esquemas y no se ven afectados.
-- ============================================================

-- 1. Crear el esquema si no existe (solo para este proyecto)
CREATE SCHEMA IF NOT EXISTS tienda_saas;

-- 2. Crear usuario para la aplicación Tienda SaaS
--    Cambia 'TU_PASSWORD_SEGURA' por una contraseña fuerte
CREATE USER tienda_saas_app WITH PASSWORD 'TU_PASSWORD_SEGURA';

-- 3. Permisos solo sobre el esquema tienda_saas
GRANT USAGE ON SCHEMA tienda_saas TO tienda_saas_app;
GRANT CREATE ON SCHEMA tienda_saas TO tienda_saas_app;

-- 4. Sobre tablas/secuencias que ya existan en tienda_saas
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA tienda_saas TO tienda_saas_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA tienda_saas TO tienda_saas_app;

-- 5. Para que futuras tablas creadas por "admin" (o quien ejecute migraciones) también sean accesibles por tienda_saas_app:
--    Si las migraciones las corre el usuario "admin", ejecuta esto (como admin):
ALTER DEFAULT PRIVILEGES IN SCHEMA tienda_saas GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO tienda_saas_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA tienda_saas GRANT USAGE, SELECT ON SEQUENCES TO tienda_saas_app;

-- Listo. En .env usa:
-- DATABASE_URL="postgresql://tienda_saas_app:TU_PASSWORD_SEGURA@HOST:PUERTO/tcss_programming?schema=tienda_saas"
