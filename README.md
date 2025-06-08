# Gema Backend

Este es un proyecto backend en Node.js usando TypeScript, Express, Drizzle ORM y PostgreSQL.

## Comenzando

1. Instala las dependencias:
   ```sh
   npm install
   ```
2. Para iniciar el servidor en modo desarrollo:
   ```sh
   npm run dev
   ```
3. Para actualizar el esquema de la base de datos con Drizzle:
   ```sh
   npm run pushdb
   ```

## Estructura del Proyecto

- `src/` - Código fuente
- `tsconfig.json` - Configuración de TypeScript
- `.github/copilot-instructions.md` - Instrucciones personalizadas para Copilot

## Base de Datos

- Usa PostgreSQL con Drizzle ORM.
- El nombre de la base de datos por defecto es `gemadb` (ver `src/db.ts`).
- La cadena de conexión se carga desde el archivo `.env` usando la variable `DATABASE_URL`.
- Ejemplo de `.env`:
  ```env
  DATABASE_URL=postgres://postgres:postgres@localhost:5432/gemadb
  ```
- Para actualizar el esquema de la base de datos:
  ```sh
  npm run pushdb
  ```
- Al iniciar el servidor, la app verifica la conexión a la base de datos antes de escuchar peticiones.

## Inicialización de la base de datos

Antes de usar la API, ejecuta el comando `initdb` para crear el usuario master en la base de datos. Este paso es necesario si quieres agregar el usuario master desde el principio.

```sh
npm run initdb
```


